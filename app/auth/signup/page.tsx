"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [userType, setUserType] = useState<"job_seeker" | "hr">("job_seeker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signup({
        username,
        email,
        password,
        user_type: userType,
      });
      saveSession(data);

      if (data.user.user_type === "hr") {
        router.push("/hr-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Network error. Make sure backend is running at http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl border border-[#F5E6D3]">
      
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-2">
        Create Account
      </h1>
      <p className="text-[#6B7280] mb-8">
        Begin your professional journey today.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="w-full border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          required
        />
        
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <div className="space-y-2">
               <label className="flex items-center">
               <input
                   type="radio"
                   name="role"
                   value="job_seeker"
                   checked={userType === "job_seeker"}
                   onChange={(e) => setUserType(e.target.value as "job_seeker" | "hr")}
                   className="w-4 h-4 text-blue-600"/>
                  <span className="ml-2 text-sm text-gray-700">
                   Job Seeker - Looking for a job
                 </span>
               </label>
               <label className="flex items-center">
                 <input
                   type="radio"
                   name="role"
                   value="hr"
                   checked={userType === "hr"}
                   onChange={(e) => setUserType(e.target.value as "job_seeker" | "hr")}
                   className="w-4 h-4 text-blue-600"
                 />
                 <span className="ml-2 text-sm text-gray-700">
                   HR/Recruiter - Posting jobs
                 </span>
               </label>
             </div>
          </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E39A2D] text-white py-3 rounded-xl hover:bg-[#cc8424] transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-center text-[#6B7280] mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-[#E39A2D] font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}


