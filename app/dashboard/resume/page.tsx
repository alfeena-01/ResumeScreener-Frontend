"use client";

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/auth";

export default function ResumePage() {
  const [resume, setResume] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>("");
  const [resumeInfo, setResumeInfo] = useState<{ id: number; resume_file: string } | null>(null);


  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file.name.endsWith(".pdf")) {
        setError("Only PDF files are allowed");
        setResume(null);
        return;
      }
      setResume(file);
      setError("");
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!resume) {
      setError("Please select a file");
      return;
    }

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume_file", resume);

      const response = await fetch("http://localhost:8000/api/users/resume/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "User resume uploaded successfully.");
        setResume(null);
        setResumeInfo(data.resume || null);
        localStorage.setItem("resumeName", resume.name);
      } else {
        setError(data.error || "Failed to upload resume");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Make sure backend is running.");
    } finally {
      setLoading(false);
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

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E39A2D] rounded-2xl p-8 cursor-pointer hover:bg-[#FFF6E8] transition">
            <span className="text-[#6B7280]">
              Upload PDF file
            </span>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {resume && (
            <div className="mt-5">
              <p className="text-[#E39A2D] font-medium">
                {resume.name}
              </p>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-4 w-full bg-[#E39A2D] text-white py-3 rounded-xl hover:bg-[#cc8424] transition disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>
          )}

          {resumeInfo && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold">Resume saved in DB</h3>
              <p>ID: {resumeInfo.id}</p>
              <p>Path: {resumeInfo.resume_file}</p>
              <a
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
                href={`http://localhost:8000${resumeInfo.resume_file}`}
              >
                Open uploaded PDF
              </a>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
