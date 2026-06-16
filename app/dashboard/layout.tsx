"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, User, Search, Briefcase, Bell, FileText, LogOut, Menu, X } from "lucide-react";
import NotificationBadge from "./NotificationBadge";
import { BASE_URL, buildHeaders } from "@/lib/api";

interface DashboardUser {
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  user_type?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("User");
  const [userType, setUserType] = useState<string>("job_seeker");
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [profileUpdateTrigger, setProfileUpdateTrigger] = useState<number>(() => Date.now());

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/user-info/`, {
          method: 'GET',
          headers: buildHeaders(true),
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setUsername(
            [userData.first_name, userData.last_name].filter(Boolean).join(" ") || userData.username || "User"
          );
          setUserType(userData.user_type);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();

    const handleProfileUpdated = () => {
      loadUser();
      setProfileUpdateTrigger(Date.now());
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdated);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    setIsMobileNavOpen(false);
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDF8F2]">
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-[#1F2937] px-4 py-4 text-white md:hidden">
        <div className="text-lg font-semibold text-[#F5C77A]">JobSeeker</div>
        <button
          type="button"
          className="rounded-md border border-white/20 p-2 hover:bg-white/10"
          onClick={() => setIsMobileNavOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>
      {isMobileNavOpen ? (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      ) : null}
      <aside className={`fixed top-0 left-0 z-30 h-full w-72 overflow-y-auto bg-[#1F2937] text-white flex flex-col justify-between p-6 shadow-xl transition-transform duration-300 ease-in-out ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"} md:fixed md:top-0 md:left-0 md:h-screen md:translate-x-0 md:w-72 md:shadow-none`}>
        <div>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-wide text-[#F5C77A]">JobSeeker</h2>
              <p className="text-xs uppercase text-gray-400 mt-1">Career dashboard</p>
            </div>
          </div>
          <Link href="/dashboard/profile">
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 mb-6 hover:border-[#E39A2D] transition">
              <div className="bg-white w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                {user?.profile_picture ? (
                  <img
                    src={`${BASE_URL}${user.profile_picture}?t=${profileUpdateTrigger}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/020/911/731/small/profile-icon-avatar-icon-user-icon-person-icon-free-png.png"
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold">{username}</h3>
                <p className="text-sm text-gray-400">{userType === "hr" ? "HR/Recruiter" : "Job Seeker"}</p>
              </div>
            </div>
          </Link>
          <nav className="space-y-3 text-gray-300">
            <Link href="/dashboard" onClick={() => setIsMobileNavOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/dashboard/profile" onClick={() => setIsMobileNavOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <User className="w-4 h-4" />
              My Profile
            </Link>
            <Link href="/dashboard/find-jobs" onClick={() => setIsMobileNavOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <Search className="w-4 h-4" />
              Find Jobs
            </Link>
            <Link href="/dashboard/applications" onClick={() => setIsMobileNavOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <Briefcase className="w-4 h-4" />
              Applications
            </Link>
            <Link href="/dashboard/notifications" onClick={() => setIsMobileNavOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <Bell className="w-4 h-4" />
              Notifications
            </Link>
            <Link href="/dashboard/resume" onClick={() => setIsMobileNavOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <FileText className="w-4 h-4" />
              Resume
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-left text-red-300 hover:bg-red-500/10 hover:text-red-200 transition"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </nav>
        </div>

        <p className="text-xs text-gray-400">
          © 2026 Resume Screener
        </p>
      </aside>

      <main className="flex-1 min-h-screen overflow-x-hidden bg-[#FDF8F2] pt-20 md:pt-0 md:ml-72 md:px-8 lg:px-12">
        <div className="relative">
          <div className="absolute top-4 right-4 hidden md:block">
            <NotificationBadge />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
