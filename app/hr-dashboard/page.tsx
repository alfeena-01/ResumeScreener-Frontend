"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HRDashboard() {
  interface HRProfile {
    name?: string;
    email?: string;
    designation?: string;
  }
  interface HRCompany {
    name?: string;
    location?: string;
    website?: string;
    description?: string;
  }
  const router = useRouter();
  const [profile, setProfile] = useState<HRProfile | null>(null);
  const [company, setCompany] = useState<HRCompany | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and has correct role
    const userType = localStorage.getItem("user_type");
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken || userType !== "hr") {
      router.push("/auth/login");
      return;
    }

    const savedProfile = localStorage.getItem("hrProfile");
    const savedCompany = localStorage.getItem("companyData");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedCompany) setCompany(JSON.parse(savedCompany));

    setLoading(false);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFF8E1] p-8">
      {loading && (
        <div className="flex justify-center items-center py-20">
          <p className="text-[#E39A2D] font-semibold">Loading your HR dashboard...</p>
        </div>
      )}

      {!loading && (
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-gray-800">
            HR Dashboard Overview
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* HR Profile Display */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#E1AD01]">
              <h2 className="text-2xl font-semibold text-[#E1AD01] mb-4">
                👤 HR Profile
              </h2>

              {profile ? (
                <div className="space-y-2 text-gray-700">
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Designation:</strong> {profile.designation}</p>
                </div>
              ) : (
                <p className="text-gray-500">No profile data available.</p>
              )}
            </div>

            {/* Company Display */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#E1AD01]">
              <h2 className="text-2xl font-semibold text-[#E1AD01] mb-4">
                🏢 Company Details
              </h2>

              {company ? (
                <div className="space-y-2 text-gray-700">
                  <p><strong>Name:</strong> {company.name}</p>
                  <p><strong>Location:</strong> {company.location}</p>
                  <p><strong>Website:</strong> {company.website}</p>
                  <p><strong>Description:</strong> {company.description}</p>
                </div>
              ) : (
                <p className="text-gray-500">No company data available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
