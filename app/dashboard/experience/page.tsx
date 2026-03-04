"use client";

import { useState, useEffect } from "react";

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState<Experience>({
    company: "",
    role: "",
    duration: "",
    description: "",
  });

  const handleAdd = () => {
    if (form.company && form.role) {
      setExperiences([...experiences, form]);
      setForm({ company: "", role: "", duration: "", description: "" });
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("experiences");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setExperiences(JSON.parse(stored));
    } catch { }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("experiences", JSON.stringify(experiences));
    } catch { }
  }, [experiences]);

  return (
    <div className="space-y-10">


      <div>
        <h1 className="text-3xl font-semibold text-[#1F2937]">
          Professional Experience
        </h1>
        <p className="text-[#6B7280] mt-2">
          Showcase your career journey with elegance.
        </p>
      </div>


      <div className="bg-white p-10 rounded-3xl shadow-md border border-[#F5E6D3]">
        <h2 className="text-xl font-semibold text-[#E39A2D] mb-8">
          Add Experience
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            placeholder="Company Name"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          />

          <input
            placeholder="Job Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          />

          <input
            placeholder="Duration (e.g., 2022 - 2024)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none md:col-span-2"
          />

          <textarea
            placeholder="Describe your responsibilities..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border border-[#E5D3BC] rounded-xl px-5 py-4 h-32 focus:ring-2 focus:ring-[#E39A2D] outline-none md:col-span-2"
          />
        </div>

        <button
          onClick={handleAdd}
          className="mt-8 bg-[#E39A2D] text-white px-8 py-3 rounded-xl hover:bg-[#cc8424] transition"
        >
          Save Experience
        </button>
      </div>


      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-sm border-l-4 border-[#E39A2D]"
          >
            <h3 className="text-xl font-semibold text-[#1F2937]">
              {exp.role}
            </h3>
            <p className="text-[#E39A2D] font-medium">
              {exp.company}
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              {exp.duration}
            </p>
            <p className="mt-4 text-[#374151]">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

