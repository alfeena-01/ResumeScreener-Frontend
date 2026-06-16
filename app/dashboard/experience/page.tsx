"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExperiencePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/profile");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] p-6">
      <div className="max-w-xl rounded-3xl border border-[#F5E6D3] bg-white p-8 text-center shadow-lg">
        <p className="text-lg font-semibold text-[#1F2937]">Redirecting to your profile...</p>
        <p className="mt-2 text-gray-500">Experience is now managed from your profile page.</p>
      </div>
    </div>
  );
}

