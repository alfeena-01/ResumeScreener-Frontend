"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educationList, setEducationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string>("User");

  useEffect(() => {
    // Check if user is authenticated and has correct role
    const userType = localStorage.getItem("user_type");
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken || userType !== "job_seeker") {
      router.push("/auth/login");
      return;
    }

    // Load profile data including profile name
    try {
      const profile = localStorage.getItem("jobSeekerProfile");
      if (profile) {
        const profileData = JSON.parse(profile);
        const fullName = `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim();
        if (fullName) {
          setProfileName(fullName);
        }
      }
    } catch (e) {}
    
    try {
      const s = localStorage.getItem("skills");
      if (s) setSkills(JSON.parse(s));
    } catch (e) {}
    try {
      const ex = localStorage.getItem("experiences");
      if (ex) setExperiences(JSON.parse(ex));
    } catch (e) {}
    try {
      const ed = localStorage.getItem("education");
      if (ed) setEducationList(JSON.parse(ed));
    } catch (e) {}
    try {
      const rn = localStorage.getItem("resumeName");
      if (rn) setResumeName(rn);
    } catch (e) {}

    setLoading(false);

    // Listen for profile updates from profile page
    const handleProfileUpdate = () => {
      try {
        const profile = localStorage.getItem("jobSeekerProfile");
        if (profile) {
          const profileData = JSON.parse(profile);
          const fullName = `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim();
          if (fullName) {
            setProfileName(fullName);
          }
        }
      } catch (e) {}
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, [router]);
  

  return (
    <div className="space-y-10">
      {loading && (
        <div className="flex justify-center items-center py-20">
          <p className="text-[#E39A2D] font-semibold">Loading your dashboard...</p>
        </div>
      )}

      {!loading && (
        <>
          <section className="bg-[#E39A2D] text-white p-10 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-semibold">Welcome Back</h1>
        <p className="mt-3 text-[#FFF3DF]">
          Manage your professional profile with elegance.
        </p>
      </section>

     
       <section className="grid grid-cols-1  gap-10">
           <div className="bg-white p-8 rounded-3xl shadow-md border border-[#F5E6D3]">

            <h1>PROFILE OVERVIEW</h1>
            <div>
              <p className="text-xl font-semibold">{profileName}</p>
              <p className="mt-3 font-medium text-sm">Skills:</p>
              <div className="flex flex-wrap gap-4 mt-2">
                {skills.length ? (
                  skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-[#FFF3DF] text-[#1F2937] px-5 py-2 rounded-full border border-[#F5C77A]"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#6B7280]">No skills added yet</span>
                )}
              </div>

              <div className="mt-6">
                <p className="font-medium text-sm">Experience:</p>
                <div className="space-y-3 mt-3">
                  {experiences.length ? (
                    experiences.map((exp, i) => (
                      <div key={i} className="text-sm text-[#374151]">
                        <div className="font-semibold">{exp.role || "-"}</div>
                        <div className="text-[#E39A2D]">{exp.company || "-"}</div>
                        <div className="text-xs text-[#6B7280]">{exp.duration}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-[#6B7280]">No experience added yet</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="font-medium text-sm">Education:</p>
                <div className="space-y-3 mt-3">
                  {educationList.length ? (
                    educationList.map((edu, i) => (
                      <div key={i} className="text-sm text-[#374151]">
                        <div className="font-semibold">{edu.degree || "-"}</div>
                        <div className="text-[#E39A2D]">{edu.institution || "-"}</div>
                        <div className="text-xs text-[#6B7280]">{edu.year}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-[#6B7280]">No education added yet</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="font-medium text-sm">Resume:</p>
                <p className="text-sm text-[#6B7280] mt-2">{resumeName ?? "No resume uploaded"}</p>
              </div>

            </div>
        </div>

</section>
 <section className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="bg-white p-8 rounded-3xl shadow-md border border-[#F5E6D3]">
          <h2 className="text-xl font-semibold text-[#1F2937] mb-6">Profile Status</h2>

          <div className="space-y-4 text-[#6B7280]">
            <div className="flex justify-between border-b pb-3">
              <span>Profile Completion</span>
              <span className="text-[#E39A2D] font-medium">80%</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Resume Uploaded</span>
              <span className="text-green-600">{resumeName ? "Yes" : "No"}</span>
            </div>

            <div className="flex justify-between">
              <span>Experience Added</span>
              <span className="text-[#E39A2D]">Updated</span>
            </div>
          </div>
        </div>

  
       

      </section>
        </>
      )}
    </div>
  );
}
