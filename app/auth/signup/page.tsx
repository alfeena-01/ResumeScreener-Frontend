"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authService } from "@/service/auth.service";
import { saveSession } from "@/lib/auth";
import { SignupDTO } from "@/types/auth.types";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupDTO>({
    defaultValues: {
      user_type: "job_seeker",
    },
  });

  const onSubmit = async (data: SignupDTO) => {
    setError("");

    if (data.password !== data.password_confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await authService.signup(data);

      // ✅ CONSOLE USER DATA
      console.log("Full Response:", response);
      console.log("User Data:", response.user);

      saveSession(response);

      if (response.user.user_type === "hr") {
        router.push("/hr-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Network error. Make sure backend is running at http://localhost:8000";
      setError(errorMessage);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
            className={`w-full border rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none ${errors.username ? "border-red-500" : "border-[#E5D3BC]"
              }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className={`w-full border rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none ${errors.email ? "border-red-500" : "border-[#E5D3BC]"
              }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            })}
            className={`w-full border rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none ${errors.password ? "border-red-500" : "border-[#E5D3BC]"
              }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("password_confirm", {
              required: "Please confirm your password",
            })}
            className={`w-full border rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none ${errors.password_confirm ? "border-red-500" : "border-[#E5D3BC]"
              }`}
          />
          {errors.password_confirm && (
            <p className="text-red-500 text-sm mt-1">{errors.password_confirm.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="job_seeker"
                {...register("user_type")}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">
                Job Seeker - Looking for a job
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                value="hr"
                {...register("user_type")}
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
          disabled={isSubmitting}
          className="w-full bg-[#E39A2D] text-white py-3 rounded-xl hover:bg-[#cc8424] transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
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