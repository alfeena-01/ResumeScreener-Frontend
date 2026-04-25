"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const data = await login({ email, password });
      saveSession(data);

      // redirect based on type
      if (data.user.user_type === "hr") {
        router.push("/hr-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "Network error. Make sure backend is running at http://localhost:8000";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl border border-[#F5E6D3]">

      <h1 className="text-2xl font-semibold text-[#1F2937] mb-2">
        Welcome Back
      </h1>
      <p className="text-[#6B7280] mb-8">
        Sign in to continue your career journey.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E39A2D] text-white py-3 rounded-xl hover:bg-[#cc8424] transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-center text-[#6B7280] mt-6">
        Don’t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-[#E39A2D] font-medium hover:underline"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}

