"use client";

import { useEffect, useState } from "react";

interface Job {
  id?: number;
  title: string;
  description: string;
  location: string;
  job_type: string;
  company_name: string;
  salary_min: string | number;
  salary_max: string | number;
  salary_currency: string;
  requirements: string;
  applicants?: number;
}

export default function PostJob() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingJobId, setEditingJobId] = useState<number | null>(null);

  // AI JD Generator State
  const [aiTitle, setAiTitle] = useState("");
  const [aiLevel, setAiLevel] = useState("");
  const [aiSkills, setAiSkills] = useState("");
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);

  const initialFormState: Job = {
    title: "",
    description: "",
    location: "",
    job_type: "full-time",
    company_name: "",
    salary_min: "",
    salary_max: "",
    salary_currency: "INR",
    requirements: "",
  };

  const [form, setForm] = useState<Job>(initialFormState);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    fetchJobs();

    // Auto-fill company name if available
    const companyData = localStorage.getItem("companyData");
    if (companyData) {
      try {
        const parsed = JSON.parse(companyData);
        if (parsed.name) {
          setForm((prev) => ({ ...prev, company_name: parsed.name }));
        }
      } catch (e) {
        console.error("Failed to load company data");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    try {
      if (!token) return;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token && token !== "null" && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8000/api/users/jobs/?own=true&t=${new Date().getTime()}`, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        const results = Array.isArray(data) ? data : data.results || [];
        setJobs(results);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handlePost = async () => {
    if (!form.title || !form.location || !form.job_type || !form.company_name || !form.description || !form.requirements) {
      setError("Please fill out all required fields (Title, Company, Location, Type, Description, Requirements).");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        description: Array.isArray(form.description) ? form.description.join("\n") : (typeof form.description === "string" ? form.description : JSON.stringify(form.description || "")),
        requirements: Array.isArray(form.requirements) ? form.requirements.join("\n") : (typeof form.requirements === "string" ? form.requirements : JSON.stringify(form.requirements || "")),
        salary_min: form.salary_min ? parseInt(form.salary_min as string) : null,
        salary_max: form.salary_max ? parseInt(form.salary_max as string) : null,
        salary_currency: form.salary_currency || "INR",
      };

      const url = editingJobId
        ? `http://localhost:8000/api/users/jobs/${editingJobId}/`
        : `http://localhost:8000/api/users/jobs/`;
      const method = editingJobId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to post job";
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          try {
            const errData = await response.json();
            errorMessage = errData.error ||
              (typeof errData === 'object' ? Object.values(errData).flat().join(" ") : errorMessage);
          } catch {
            errorMessage = `Server error: ${response.status}`;
          }
        } else {
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      setSuccess(editingJobId ? "Job updated successfully!" : "Job posted successfully!");

      setForm({
        title: "",
        description: "",
        location: "",
        job_type: "full-time",
        company_name: form.company_name, // keep company name for convenience
        salary_min: "",
        salary_max: "",
        salary_currency: "INR",
        requirements: "",
      });
      setEditingJobId(null);
      fetchJobs();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error posting job:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to post job. Please try again later.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateJD = async () => {
    setIsGeneratingJD(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/users/jobs/generate-description/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: aiTitle,
          level: aiLevel,
          skills: aiSkills,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate JD");
      }

      const data = await response.json();
      
      let descText = data.description || "";
      if (Array.isArray(descText)) descText = descText.join("\n");
      else if (typeof descText !== "string") descText = JSON.stringify(descText);
      
      let reqsText = data.requirements || "";
      if (Array.isArray(reqsText)) reqsText = reqsText.join("\n");
      else if (typeof reqsText !== "string") reqsText = JSON.stringify(reqsText);

      setForm((prev) => ({
        ...prev,
        description: descText || "API returned an unexpected format.",
        requirements: reqsText || "API returned an unexpected format.",
      }));
    } catch (err) {
      console.error("AI Generation Error:", err);
      setError("AI Generation failed. Ensure you have the GEMINI_API_KEY configured on the backend.");
    } finally {
      setIsGeneratingJD(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJobId(job.id || null);
    setForm({
      title: job.title,
      description: job.description,
      location: job.location,
      job_type: job.job_type,
      company_name: job.company_name,
      salary_min: job.salary_min || "",
      salary_max: job.salary_max || "",
      salary_currency: job.salary_currency || "INR",
      requirements: job.requirements,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (jobId: number | undefined) => {
    if (!jobId) {
      setError("Unable to delete job: invalid job ID.");
      return;
    }

    if (!confirm("Are you sure you want to delete this job? This cannot be undone.")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/jobs/${jobId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = (await response.json().catch(() => null)) as Record<string, unknown> | null;
        const message = typeof errData?.error === 'string'
          ? errData.error
          : typeof errData?.detail === 'string'
          ? errData.detail
          : "Failed to delete job.";
        throw new Error(message);
      }

      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      if (editingJobId === jobId) {
        setEditingJobId(null);
        setForm(initialFormState);
      }
      setSuccess("Job deleted successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting job:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete job.";
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-semibold text-[#1F2937]">
        {editingJobId ? "Edit Job Vacancy" : "Post Job Vacancy"}
      </h1>

      <div className="bg-white p-10 rounded-3xl shadow border border-[#F5E6D3] space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            placeholder="Job Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          />
          <input
            placeholder="Company Name *"
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          />
          <input
            placeholder="Location *"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          />
          <select
            value={form.job_type}
            onChange={(e) => setForm({ ...form, job_type: e.target.value })}
            className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none bg-white"
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </select>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Minimum Salary (Optional)"
              value={form.salary_min}
              onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
              className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
            />
            <input
              type="number"
              placeholder="Maximum Salary (Optional)"
              value={form.salary_max}
              onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
              className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
            />
            <select
              value={form.salary_currency}
              onChange={(e) => setForm({ ...form, salary_currency: e.target.value })}
              className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none bg-white"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="AED">AED</option>
            </select>
          </div>
        </div>

        {/* AI Job Description Generator */}
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
          <h3 className="text-xl font-semibold mb-4 text-amber-900 flex items-center">
            <span className="mr-2">✨</span> AI Job Description Generator
          </h3>
          <p className="text-amber-800 text-sm mb-4">Save time! Let AI write a professional JD for you. Just enter a few details below.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <input
              placeholder="Role Title (e.g. Senior Frontend Developer)"
              value={aiTitle}
              onChange={(e) => setAiTitle(e.target.value)}
              className="w-full border border-amber-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
            <input
              placeholder="Level (e.g. Mid, Senior, Lead)"
              value={aiLevel}
              onChange={(e) => setAiLevel(e.target.value)}
              className="w-full border border-amber-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>
          <div className="mb-4">
             <input
              placeholder="Key Skills (e.g. React, TypeScript, Node.js)"
              value={aiSkills}
              onChange={(e) => setAiSkills(e.target.value)}
              className="w-full border border-amber-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>
          <button
             onClick={handleGenerateJD}
             disabled={isGeneratingJD || !aiTitle || !aiSkills}
             className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50 transition"
          >
             {isGeneratingJD ? "Generating..." : "Generate Description & Requirements"}
          </button>
        </div>

        <textarea
          placeholder="Job Description *"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none min-h-30"
        />

        <textarea
          placeholder="Requirements *"
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none min-h-30"
        />

        <div className="flex gap-4">
          <button
            onClick={handlePost}
            disabled={loading}
            className="bg-[#E39A2D] text-white px-8 py-3 rounded-xl hover:bg-[#cc8424] transition disabled:opacity-70"
          >
            {loading ? (editingJobId ? "Updating..." : "Publishing...") : (editingJobId ? "Update Job" : "Publish Job")}
          </button>

          {editingJobId && (
            <button
              onClick={() => {
                setEditingJobId(null);
                setForm({ ...form, title: "", location: "", description: "", requirements: "" });
              }}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Posted Jobs History List */}
      <div>
        <h2 className="text-2xl font-semibold text-[#1F2937] border-t border-[#F5E6D3] pt-6 mb-6 mt-4">Recently Posted Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {jobs.map((job, index) => (
              <div key={job.id || index} className="bg-white p-6 rounded-3xl shadow border border-[#F5E6D3] flex flex-col justify-between relative">
                <div className="absolute top-6 right-6 flex gap-3">
                  <button
                    onClick={() => handleEdit(job)}
                    className="p-1.5 text-gray-400 bg-gray-50 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition"
                    title="Edit Job"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-1.5 text-gray-400 bg-gray-50 rounded-lg hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete Job"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1F2937] pr-20">{job.title}</h3>
                  <p className="text-gray-700 font-medium mt-1">{job.company_name}</p>
                  <p className="text-[#E39A2D] mt-1">{job.location}</p>
                  <div className="flex gap-2 mt-2 mb-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">{job.job_type.replace("-", " ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
