"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, User, Building2, PlusSquare, FileText, BarChart3, LogOut, Menu, X } from "lucide-react";
import { BASE_URL, buildHeaders } from "@/lib/api";

export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("HR User");
  const [userType, setUserType] = useState<string>("hr");
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileUpdateTrigger, setProfileUpdateTrigger] = useState(Date.now());

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
            [userData.first_name, userData.last_name].filter(Boolean).join(" ") || userData.username || "HR User"
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
    setIsSidebarOpen(false);
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDF8F2]">
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-[#1F2937] px-4 py-4 text-white md:hidden">
        <div className="text-lg font-semibold text-[#F5C77A]">HR Panel</div>
        <button
          type="button"
          className="rounded-md border border-white/20 p-2 hover:bg-white/10"
          onClick={() => setIsSidebarOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>
      {isSidebarOpen ? (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}
      <aside className={`fixed top-0 left-0 z-30 h-full w-72 overflow-y-auto bg-[#1F2937] text-white p-6 flex flex-col justify-between shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:fixed md:top-0 md:left-0 md:h-screen md:translate-x-0 md:w-72 md:shadow-none`}>
        <div>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-[#F5C77A]">HR Panel</h2>
              <p className="text-xs uppercase text-gray-400 mt-1">Company controls</p>
            </div>
          </div>
          <div className="flex mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
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
            <div className="ml-3">
              <h2 className="text-lg font-bold">{username}</h2>
              <p className="text-sm text-gray-400">{userType === "hr" ? "HR/Recruiter" : "Job Seeker"}</p>
            </div>
          </div>
          <nav className="space-y-3 text-gray-300">
            <Link href="/hr-dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <Home className="w-4 h-4" />
              Overview
            </Link>
            <Link href="/hr-dashboard/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <User className="w-4 h-4" />
              HR Profile
            </Link>
            <Link href="/hr-dashboard/company" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <Building2 className="w-4 h-4" />
              Company
            </Link>
            <Link href="/hr-dashboard/post-job" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <PlusSquare className="w-4 h-4" />
              Post Job
            </Link>
            <Link href="/hr-dashboard/applications" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <FileText className="w-4 h-4" />
              Applications
            </Link>
            <Link href="/hr-dashboard/analytics" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10 hover:text-[#E39A2D] transition">
              <BarChart3 className="w-4 h-4" />
              Analytics
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
          © 2026 Imperial Careers
        </p>
      </aside>

      <main className="flex-1 min-h-screen overflow-x-hidden bg-[#FDF8F2] pt-20 md:pt-0 md:ml-72 md:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}
