"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import NotificationBadge from "./NotificationBadge";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("User");
  const [userType, setUserType] = useState<string>("job_seeker");

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
      <aside className="fixed top-0 left-0 w-72 h-screen bg-[#1F2937] text-white flex flex-col justify-between p-8 z-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-wide text-[#F5C77A] mb-5">
            JobSeeker
          </h2>
          <Link href="/dashboard/profile">

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
          </Link>
          <nav className="space-y-5 text-gray-300">
            <Link href="/dashboard" className="block hover:text-[#E39A2D] transition">
              Dashboard
            </Link>
            <Link href="/dashboard/profile" className="block hover:text-[#E39A2D] transition">
              My Profile
            </Link>
            <Link href="/dashboard/find-jobs" className="block hover:text-[#E39A2D] transition">
              Find Jobs
            </Link>
            <Link href="/dashboard/applications" className="block hover:text-[#E39A2D] transition">
              My Applications
            </Link>
            <Link href="/dashboard/notifications" className="block hover:text-[#E39A2D] transition">
              Notifications
            </Link>
            <Link href="/dashboard/resume" className="block hover:text-[#E39A2D] transition">
              Resume
            </Link>
            <Link href="/dashboard/skills" className="block hover:text-[#E39A2D] transition">
              Skills
            </Link>
            <Link href="/dashboard/experience" className="block hover:text-[#E39A2D] transition">
              Experience
            </Link>
            <Link href="/dashboard/education" className="block hover:text-[#E39A2D] transition">
              Education
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-300 hover:text-red-400 transition"
            >
              Log Out
            </button>
          </nav>
        </div>

        <p className="text-xs text-gray-400">
          © 2026 Resume Screener
        </p>
      </aside>

      <main className="flex-1 p-12 ml-72 relative">
        <div className="absolute top-8 right-8">
          <NotificationBadge />
        </div>
        {children}
      </main>
    </div>
  );
}
