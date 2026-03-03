"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  job_type: string;
  company_name: string;
  salary_min: number | null;
  salary_max: number | null;
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
  const userType = typeof window !== "undefined" ? localStorage.getItem("user_type") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    if (!userType || userType !== "job_seeker") {
      router.push("/auth/login");
      return;
    }

    fetchJobs();
  }, [userType, router]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/users/jobs/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(Array.isArray(data) ? data : data.results || []);
      setError("");
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again later.");
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

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Salary not specified";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-2">
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
                  onClick={() => setSelectedJob(job)}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-lg border-l-4 ${
                    selectedJob?.id === job.id ? "border-accent" : "border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-dark mb-2">{job.title}</h3>
                      <p className="text-gray-700 font-semibold mb-2">{job.company_name}</p>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          {job.job_type}
                        </span>
                        <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                          📍 {job.location}
                        </span>
                      </div>
                      <p className="text-accent font-semibold text-lg">{formatSalary(job.salary_min, job.salary_max)}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-4">{formatDate(job.posted_date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="lg:col-span-1">
          {selectedJob ? (
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-dark mb-4">{selectedJob.title}</h2>
              <p className="text-gray-700 font-semibold mb-4">{selectedJob.company_name}</p>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Job Type</p>
                  <p className="font-semibold text-dark capitalize">{selectedJob.job_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-dark">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Salary</p>
                  <p className="font-semibold text-accent">{formatSalary(selectedJob.salary_min, selectedJob.salary_max)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posted</p>
                  <p className="font-semibold text-dark">{formatDate(selectedJob.posted_date)}</p>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <h3 className="font-bold text-dark mb-2">Description</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              <div className="border-t pt-4 mb-6">
                <h3 className="font-bold text-dark mb-2">Requirements</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedJob.requirements}</p>
              </div>

              <button className="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-orange-500 transition">
                Apply Now
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 sticky top-6 text-center">
              <p className="text-gray-600">Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
