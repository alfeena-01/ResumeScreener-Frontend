"use client";

import { useState } from "react";

interface Job {
  title: string;
  location: string;
  type: string;
}

export default function PostJob() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Job>({
    title: "",
    location: "",
    type: "",
  });

  const handlePost = () => {
    if (form.title) {
      setJobs([...jobs, form]);
      setForm({ title: "", location: "", type: "" });
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-semibold text-[#1F2937]">
        Post Job Vacancy
      </h1>

      <div className="bg-white p-10 rounded-3xl shadow border border-[#F5E6D3] space-y-6">

        <input
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
        />

        <input
          placeholder="Job Type (Full-time / Remote)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
        />

        <button
          onClick={handlePost}
          className="bg-[#E39A2D] text-white px-8 py-3 rounded-xl hover:bg-[#cc8424] transition"
        >
          Publish Job
        </button>
      </div>

      {/* Job List */}
      <div className="grid md:grid-cols-2 gap-8">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl shadow border border-[#F5E6D3]">
            <h3 className="text-xl font-semibold text-[#1F2937]">{job.title}</h3>
            <p className="text-[#E39A2D] mt-1">{job.location}</p>
            <p className="text-sm text-[#6B7280] mt-2">{job.type}</p>
            <p className="mt-4 text-[#E39A2D] font-medium">
              Applicants: {Math.floor(Math.random() * 20) + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
