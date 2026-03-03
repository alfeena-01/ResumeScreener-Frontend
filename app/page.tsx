"use client";

import Link from "next/dist/client/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF8E1] flex items-center justify-center px-6">


      {/* Main Content */}
      <div className="relative z-10 max-w-4xl text-center space-y-8 ">

        {/* Logo / Brand */}
        <h1
          className="text-7xl md:text-8xl font-bold tracking-tight bg-clip-text  text-[#1F2937] drop-shadow-lg transition-all duration-500 hover:scale-105"
          style={{ fontFamily: "'Amarante', sans-serif" }}
        >
          Jobqo
        </h1>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-semibold text-[#1F2937] leading-tight">
          Smart Resume Screening & Intelligent Job Matching
        </h2>

        {/* Simple Service Description */}
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Upload your resume. Post your job.  
          We match the rest.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-8">

          <Link
            href="/auth/login"
            className="px-8 py-3 rounded-xl bg-[#1b2738] text-white font-semibold shadow-lg hover:bg-[#1F2937] transition-all duration-300 hover:scale-105"
          >
            Login
          </Link>

          <Link
            href="/auth/signup"
            className="px-8 py-3 rounded-xl border-2 border-[#1F2937] text-[#1F2937] font-semibold hover:bg-[#1F2937] hover:text-white transition-all duration-300 hover:scale-105"
          >
            Sign Up
          </Link>

        </div>

      </div>
    </div>
  );
}