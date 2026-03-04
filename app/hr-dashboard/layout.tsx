"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("HR User");
  const [userType, setUserType] = useState<string>("hr");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserType = localStorage.getItem("user_type");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedUsername) setUsername(storedUsername);
    if (storedUserType) setUserType(storedUserType);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-[#FDF8F2]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1F2937] text-white p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#F5C77A] mb-5">
            HR Panel
          </h2>
          <div className="flex mb-5">
            <div className="bg-white w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/020/911/731/small/profile-icon-avatar-icon-user-icon-person-icon-free-png.png"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-bold">{username}</h2>
              <p className="text-sm text-gray-400">
                {userType === "hr" ? "HR/Recruiter" : "Job Seeker"}
              </p>
            </div>
          </div>

          <nav className="space-y-4 text-gray-300">
            <Link href="/hr-dashboard" className="block hover:text-[#E39A2D]">Overview</Link>
            <Link href="/hr-dashboard/profile" className="block hover:text-[#E39A2D]">HR Profile</Link>
            <Link href="/hr-dashboard/company" className="block hover:text-[#E39A2D]">Company</Link>
            <Link href="/hr-dashboard/post-job" className="block hover:text-[#E39A2D]">Post Job</Link>
            <Link href="/hr-dashboard/analytics" className="block hover:text-[#E39A2D]">Analytics</Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-300 hover:text-red-400 transition"
            >
              Log Out
            </button>
          </nav>
        </div>

        <p className="text-xs text-gray-400">
          © 2026 Imperial Careers
        </p>
      </aside>

      <main className="flex-1 p-12">
        {children}
      </main>
    </div>
  );
}
