"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { apiRequest } from "@/service/api";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  job_type: string;
  company_name: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  requirements: string;
  hr_user: number;
  hr_user_name: string;
  posted_date: string;
  is_active: boolean;
}

export default function FindJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState("");
  const [applyError, setApplyError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobToApply, setJobToApply] = useState<number | null>(null);
  const [resumeInfo, setResumeInfo] = useState<{ id: number; resume_file: string } | null>(null);
  const [resumeUploadFile, setResumeUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const userType = typeof window !== "undefined" ? localStorage.getItem("user_type") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    if (!userType || userType !== "job_seeker") {
      router.push("/auth/login");
      return;
    }

    fetchJobs();
    fetchResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, router]);

  useEffect(() => {
    if (showJobModal || showConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showJobModal, showConfirmModal]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      console.log("Making request to jobs API...");
      const response = await fetch(`http://localhost:8000/api/users/jobs/?t=${new Date().getTime()}`, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);
      setJobs(Array.isArray(data) ? data : data.results || []);
      setError("");
    } catch (err) {
      console.error("Network/CORS Error:", err);
      setError(`Failed to load jobs: ${err instanceof Error ? err.message : 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchResume = async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8000/api/users/resume/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        setResumeInfo(null);
        return;
      }

      const data = await response.json();
      setResumeInfo(data);
    } catch (err) {
      console.error("Error fetching resume:", err);
    }
  };

  const handleResumeFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.name.endsWith(".pdf")) {
        setUploadError("Only PDF files are allowed.");
        setResumeUploadFile(null);
        return;
      }
      setResumeUploadFile(file);
      setUploadError("");
    }
  };

  const uploadResume = async () => {
    if (!resumeUploadFile || !token) return false;
    setUploadingResume(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("resume_file", resumeUploadFile);

      console.log("Uploading resume file:", resumeUploadFile.name, "Size:", resumeUploadFile.size);

      const response = await fetch("http://localhost:8000/api/users/resume/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Upload response status:", response.status);

      const data = await response.json();
      console.log("Upload response data:", data);

      if (!response.ok) {
        setUploadError(data.error || "Failed to upload resume.");
        return false;
      }

      setResumeInfo(data.resume || null);
      setResumeUploadFile(null);
      return true;
    } catch (err) {
      console.error("Upload error:", err);
      const message = err instanceof Error ? err.message : "Network error.";
      setUploadError(message);
      return false;
    } finally {
      setUploadingResume(false);
    }
  };

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "Salary not specified";

    const symbol = currency === 'INR' ? '₹' : currency === 'AED' ? 'د.إ' : '$';
    if (min && max) return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()} ${currency}`;
    if (min) return `From ${symbol}${min.toLocaleString()} ${currency}`;
    return `Up to ${symbol}${max?.toLocaleString()} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleApply = async (jobId: number) => {
    setApplying(true);
    setApplyError("");
    setApplySuccess("");

    try {
      // Check if user is authenticated
      if (!token) {
        throw new Error("You must be logged in to apply for jobs.");
      }

      console.log("Token present:", !!token);

      // Check user info to verify authentication and user type
      const userResponse = await fetch("http://localhost:8000/api/users/user-info/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        }
        throw new Error("Failed to verify user authentication.");
      }

      const userData = await userResponse.json();
      console.log("User data:", userData);

      if (userData.user_type !== 'job_seeker') {
        throw new Error("Only job seekers can apply for jobs.");
      }
      if (resumeUploadFile) {
        console.log("Attempting to upload resume...");
        const success = await uploadResume();
        if (!success) {
          console.error("Resume upload failed");
          throw new Error("Failed to upload resume. Please try again.");
        }
        console.log("Resume uploaded successfully");
      }

      console.log("Applying to job with ID:", jobId);
      await apiRequest("users/applications/apply/", {
        method: "POST",
        body: JSON.stringify({ job: jobId }),
      });

      setApplySuccess("Successfully applied to " + (selectedJob?.title || "this job") + "!");
      setShowConfirmModal(false);
      setJobToApply(null);
      setResumeUploadFile(null);
      setTimeout(() => setApplySuccess(""), 4000);
    } catch (err) {
      console.error("Error applying to job:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setApplyError(errorMessage);
      setTimeout(() => setApplyError(""), 4000);
    } finally {
      setApplying(false);
    }
  };

  const handleApplyClick = (jobId: number) => {
    setJobToApply(jobId);
    setShowConfirmModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark mb-4">Find Jobs</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Job List */}
        <div className="w-full">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">
                {searchTerm ? "No jobs found matching your search." : "No jobs available at the moment."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setShowJobModal(true);
                    setApplySuccess("");
                    setApplyError("");
                  }}
                  className={`bg-white rounded-lg shadow p-5 cursor-pointer transition-all hover:shadow-lg border-l-4 ${selectedJob?.id === job.id ? "border-accent" : "border-gray-300"
                    }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-dark mb-1">{job.title}</h3>
                      <p className="text-gray-700 font-semibold mb-2">{job.company_name}</p>
                      <div className="flex flex-wrap gap-2 items-center text-sm mb-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          {job.job_type}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                          📍 {job.location}
                        </span>
                      </div>
                      <p className="text-accent font-semibold text-base">{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500">{formatDate(job.posted_date)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                          setJobToApply(job.id);
                          setShowConfirmModal(true);
                        }}
                        className="px-4 py-2 bg-amber-400 text-black rounded-lg font-semibold shadow-md transition duration-300 ease-out hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.65)] hover:scale-[1.02] hover:animate-pulse"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[3px] flex items-center justify-center p-4 z-40 transition-all">
          <div className="bg-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.15)] border border-gray-200 w-full max-w-4xl p-8 relative max-h-[95vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
               onClick={() => setShowJobModal(false)}
               className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 text-3xl leading-none"
               title="Close"
            >
               &times;
            </button>
            <h2 className="text-3xl font-bold text-dark mb-2 pr-10">{selectedJob.title}</h2>
            <p className="text-gray-700 font-bold mb-6 text-xl">{selectedJob.company_name}</p>

            {applySuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 font-medium">
                {applySuccess}
              </div>
            )}
            {applyError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium">
                {applyError}
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Role Title</p>
                <p className="font-semibold text-dark">{selectedJob.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Job Type</p>
                <p className="font-semibold text-dark capitalize">{selectedJob.job_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-dark">{selectedJob.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Salary</p>
                <p className="font-semibold text-accent">{formatSalary(selectedJob.salary_min, selectedJob.salary_max, selectedJob.salary_currency)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Posted</p>
                <p className="font-semibold text-dark">{formatDate(selectedJob.posted_date)}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-dark mb-4 pb-2 border-b">Description</h3>
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-bold text-dark mb-4 pb-2 border-b">Requirements</h3>
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">{selectedJob.requirements}</p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-6 mt-6">
              <button
                onClick={() => setShowJobModal(false)}
                className="w-full sm:w-auto px-8 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Close Panel
              </button>
              <button
                onClick={() => {
                  setShowJobModal(false);
                  handleApplyClick(selectedJob.id);
                }}
                disabled={applying}
                className="w-full sm:w-auto px-10 py-3 bg-amber-400 text-black rounded-xl font-bold shadow-md transition hover:bg-amber-300 disabled:opacity-50"
              >
                {applying ? "Applying..." : "Apply For Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedJob && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[3px] flex items-center justify-center p-4 z-50 overflow-y-auto py-12 transition-all">
          <div className="bg-[#fff8ed] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.15)] border border-amber-200 max-w-2xl w-full p-6 my-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F2937]">Apply for {selectedJob.title}</h2>
                <p className="text-[#4B5563] mt-1">Submit your details and resume to the recruiter.</p>
              </div>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setJobToApply(null);
                  setResumeUploadFile(null);
                }}
                className="text-amber-700 hover:text-amber-900"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
                  <h3 className="font-semibold text-[#1F2937] mb-2">Your Details</h3>
                  <p className="text-sm text-[#6B7280]">Name</p>
                  <p className="font-medium text-[#111827]">{localStorage.getItem("username") || "Not set"}</p>
                  <p className="text-sm text-[#6B7280] mt-3">Email</p>
                  <p className="font-medium text-[#111827]">{localStorage.getItem("email") || "Not set"}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
                  <h3 className="font-semibold text-[#1F2937] mb-2">Resume</h3>
                  {resumeInfo ? (
                    <>
                      <p className="text-sm text-[#6B7280]">Currently uploaded resume:</p>
                      <a
                        href={`http://localhost:8000${resumeInfo.resume_file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-700 hover:text-amber-900 font-medium"
                      >
                        View uploaded resume
                      </a>
                    </>
                  ) : (
                    <p className="text-sm text-[#6B7280]">No resume uploaded yet.</p>
                  )}

                  <label className="mt-4 flex flex-col border border-dashed border-amber-200 rounded-2xl p-4 cursor-pointer hover:bg-amber-50">
                    <span className="text-sm text-[#6B7280]">Upload a PDF resume to share with HR</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleResumeFileChange}
                    />
                  </label>
                  {resumeUploadFile && (
                    <p className="mt-2 text-sm text-[#111827]">Selected file: {resumeUploadFile.name}</p>
                  )}
                  {uploadError && (
                    <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
                <h3 className="font-semibold text-[#1F2937] mb-2">Confirmation</h3>
                <p className="text-[#4B5563]">By applying, you agree to share your name, email, and resume with the hiring recruiter for this job.</p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setJobToApply(null);
                    setResumeUploadFile(null);
                  }}
                  className="w-full md:w-auto px-6 py-3 border border-amber-200 rounded-xl text-amber-900 bg-white hover:bg-amber-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => jobToApply && handleApply(jobToApply)}
                  disabled={applying || uploadingResume}
                  className="w-full md:w-auto px-6 py-3 bg-amber-400 text-black rounded-xl font-semibold shadow-md transition duration-300 ease-out hover:bg-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.65)] hover:scale-[1.02] disabled:opacity-50"
                >
                  {applying || uploadingResume ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
