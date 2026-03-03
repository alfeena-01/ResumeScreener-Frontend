"use client";

import { useState } from "react";

export default function ResumePage() {
  const [resume, setResume] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setResume(file);
      try {
        localStorage.setItem("resumeName", file.name);
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-10">

       <h1 className="text-3xl font-semibold text-[#1F2937]">
        Resume
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="bg-white p-8 rounded-3xl shadow-md border border-[#F5E6D3]">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-6">
            Resume Upload
          </h2>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E39A2D] rounded-2xl p-8 cursor-pointer hover:bg-[#FFF6E8] transition">
            <span className="text-[#6B7280]">
              Upload PDF or DOC file
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {resume && (
            <p className="mt-5 text-[#E39A2D] font-medium">
              {resume.name}
            </p>
          )}
        </div>

  
        {/* <div className="bg-white p-8 rounded-3xl shadow-md border border-[#F5E6D3]">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-6">
            Profile Status
          </h2>

          <div className="space-y-4 text-[#6B7280]">
            <div className="flex justify-between border-b pb-3">
              <span>Profile Completion</span>
              <span className="text-[#E39A2D] font-medium">80%</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Resume Uploaded</span>
              <span className="text-green-600">
                {resume ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Experience Added</span>
              <span className="text-[#E39A2D]">Updated</span>
            </div>
          </div>
        </div> */}

      </section>
    </div>
  );
}
