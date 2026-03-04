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
      user: {
        user_type: "job_seeker",
      },
    },
  });

  const onSubmit = async (data: SignupDTO) => {
    setError("");

    // ✅ Now using data.user
    if (data.user.password !== data.user.password_confirm) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Full UI Data:", data);
    console.log("User Object:", data.user);

    try {
      const response = await authService.signup(data);

      console.log("Backend Response:", response);
      console.log("Returned User:", response.user);

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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          {...register("user.username", { required: "Username is required" })}
          className="w-full border rounded-xl px-5 py-3"
        />
        {errors.user?.username && (
          <p className="text-red-500 text-sm">
            {errors.user.username.message}
          </p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          {...register("user.email", { required: "Email is required" })}
          className="w-full border rounded-xl px-5 py-3"
        />
        {errors.user?.email && (
          <p className="text-red-500 text-sm">
            {errors.user.email.message}
          </p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          {...register("user.password", { required: "Password is required" })}
          className="w-full border rounded-xl px-5 py-3"
        />
        {errors.user?.password && (
          <p className="text-red-500 text-sm">
            {errors.user.password.message}
          </p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("user.password_confirm", {
            required: "Please confirm your password",
          })}
          className="w-full border rounded-xl px-5 py-3"
        />
        {errors.user?.password_confirm && (
          <p className="text-red-500 text-sm">
            {errors.user.password_confirm.message}
          </p>
        )}

        {/* Account Type */}
        <div>
          <label className="flex items-center">
            <input
              type="radio"
              value="job_seeker"
              {...register("user.user_type")}
            />
            <span className="ml-2">Job Seeker</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              value="hr"
              {...register("user.user_type")}
            />
            <span className="ml-2">HR/Recruiter</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#E39A2D] text-white py-3 rounded-xl"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#E39A2D]">
          Login
        </Link>
      </p>
    </div>
  );
}