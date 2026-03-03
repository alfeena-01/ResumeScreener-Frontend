"use client";

import { useState, useEffect } from "react";

interface Education {
  institution: string;
  degree: string;
  year: string;
  details: string;
}

export default function EducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [form, setForm] = useState<Education>({
    institution: "",
    degree: "",
    year: "",
    details: "",
  });

  const handleAdd = () => {
    if (form.institution && form.degree) {
      setEducationList([...educationList, form]);
      setForm({ institution: "", degree: "", year: "", details: "" });
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("education");
      if (stored) setEducationList(JSON.parse(stored));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("education", JSON.stringify(educationList));
    } catch (e) {}
  }, [educationList]);

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-3xl font-semibold text-[#1F2937]">
          Education
        </h1>
        <p className="text-[#6B7280] mt-2">
          Present your academic excellence beautifully.
        </p>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-md border border-[#F5E6D3]">
        <h2 className="text-xl font-semibold text-[#E39A2D] mb-8">
          Add Education
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            placeholder="Institution Name"
            value={form.institution}
            onChange={(e) =>
              setForm({ ...form, institution: e.target.value })
            }
            className="border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          />

          <input
            placeholder="Degree / Course"
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
            className="border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          />

          <input
            placeholder="Year (e.g., 2019 - 2023)"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none md:col-span-2"
          />

          <textarea
            placeholder="Additional details..."
            value={form.details}
            onChange={(e) =>
              setForm({ ...form, details: e.target.value })
            }
            className="border border-[#E5D3BC] rounded-xl px-5 py-4 h-32 focus:ring-2 focus:ring-[#E39A2D] outline-none md:col-span-2"
          />
        </div>

        <button
          onClick={handleAdd}
          className="mt-8 bg-[#E39A2D] text-white px-8 py-3 rounded-xl hover:bg-[#cc8424] transition"
        >
          Save Education
        </button>
      </div>

  
      <div className="grid md:grid-cols-2 gap-8">
        {educationList.map((edu, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-sm border border-[#F5E6D3] hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-[#1F2937]">
              {edu.degree}
            </h3>
            <p className="text-[#E39A2D] font-medium mt-1">
              {edu.institution}
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              {edu.year}
            </p>
            <p className="mt-4 text-[#374151]">
              {edu.details}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

