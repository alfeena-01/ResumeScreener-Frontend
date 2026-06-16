"use client";

import { useState, useEffect } from "react";
import { BASE_URL, authFetch, buildHeaders } from "@/lib/api";
import { User, Building, Mail, Camera, MapPin, Phone, Globe, Link, ClipboardList, Briefcase } from "lucide-react";

interface HRProfile {
  name: string;
  email: string;
  designation: string;
  department: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  about: string;
}

export default function HRProfilePage() {
  const [profile, setProfile] = useState<HRProfile>({
    name: "",
    email: "",
    designation: "",
    department: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    about: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [savedProfilePicture, setSavedProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = localStorage.getItem("hrProfile");
        if (savedProfile) {
          setProfile((current) => ({
            ...current,
            ...JSON.parse(savedProfile),
          }));
        }

        const response = await authFetch(`${BASE_URL}/users/user-info/`, {
          method: 'GET',
        });
        if (response.ok) {
          const userData = await response.json();
          setProfile((current) => ({
            ...current,
            name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
            email: userData.email || current.email,
          }));
          if (userData.profile_picture) {
            setSavedProfilePicture(`${BASE_URL}${userData.profile_picture}`);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profile.name || !profile.name.trim()) {
        alert("Please enter your full name");
        return;
      }

      const formDataToSend = new FormData();
      const nameParts = profile.name.trim().split(" ");
      formDataToSend.append('first_name', nameParts[0]);
      formDataToSend.append('last_name', nameParts.slice(1).join(" ") || "");
      if (photo) {
        formDataToSend.append('profile_picture', photo);
      }

      const response = await authFetch(`${BASE_URL}/users/user-info/`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("hrProfile", JSON.stringify(profile));
        if (responseData.profile_picture) {
          setSavedProfilePicture(`${BASE_URL}${responseData.profile_picture}`);
        }
        setPhoto(null);
        window.dispatchEvent(new Event("profileUpdated"));
        alert("Profile Saved Successfully!");
      } else {
        const contentType = response.headers.get("content-type");
        let errorMsg = response.statusText;
        
        if (contentType?.includes("application/json")) {
          try {
            const errorData = await response.json();
            console.error("Backend error response:", errorData);
            errorMsg = errorData?.detail || errorData?.message || JSON.stringify(errorData) || errorMsg;
          } catch (e) {
            console.error("Failed to parse error JSON:", e);
          }
        } else {
          const textResponse = await response.text();
          console.error("Backend error (non-JSON):", textResponse);
        }
        
        console.error("Error saving profile - Status:", response.status, "Message:", errorMsg);
        alert(`Error saving profile: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE]">
      <div className="bg-linear-to-r from-[#F5C77A] via-[#E39A2D] to-[#EEAD68] text-white py-12 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                {photo ? (
                  <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                ) : savedProfilePicture ? (
                  <img src={savedProfilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition">
                <Camera className="w-5 h-5 text-gray-600" />
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
            <div>
              <p className="uppercase tracking-[0.3em] text-sm text-white/80">HR Profile</p>
              <h1 className="text-4xl font-bold drop-shadow-lg">Professional HR Dashboard</h1>
              <p className="mt-3 text-base text-white/90 max-w-2xl mx-auto">
                Keep your profile complete with polished HR details and contact information that looks great at a glance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="rounded-4xl border border-[#F4E0B2] bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#E39A2D]">Profile Settings</p>
                <h2 className="mt-3 text-3xl font-bold text-[#111827]">HR profile details</h2>
                <p className="mt-3 text-gray-600 max-w-2xl">
                  Fill out your HR profile with the fields below to keep your account polished and easy to review.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name ?? ""}
                    placeholder="Alex Morgan"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E39A2D] transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email ?? ""}
                    placeholder="alex@company.com"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E39A2D] transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Briefcase className="w-4 h-4" />
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={profile.designation ?? ""}
                    placeholder="Talent Acquisition Lead"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E39A2D] transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <ClipboardList className="w-4 h-4" />
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={profile.department ?? ""}
                    placeholder="People Operations"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E39A2D] transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone ?? ""}
                    placeholder="(123) 456-7890"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E39A2D] transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location ?? ""}
                    placeholder="New York, USA"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E39A2D] transition"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Globe className="w-4 h-4" />
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={profile.website ?? ""}
                    placeholder="https://www.imperialcareers.com"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E39A2D] transition"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Link className="w-4 h-4" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin ?? ""}
                    placeholder="https://linkedin.com/in/yourname"
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E39A2D] transition"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4" />
                    About Your Team
                  </label>
                  <textarea
                    name="about"
                    value={profile.about ?? ""}
                    placeholder="Describe your team, culture, and hiring focus in 2–3 sentences."
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E39A2D] transition resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-3xl bg-[#1F2937] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#E39A2D]/20 transition hover:bg-[#111827]"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-6 rounded-4xl border border-[#F3E1B0] bg-white p-8 shadow-[0_16px_50px_rgba(0,0,0,0.08)]">
            <div className="rounded-[1.75rem] bg-[#FEF3E2] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E39A2D]">Profile Preview</p>
              <h3 className="mt-4 text-2xl font-bold text-[#111827]">Your public presentation</h3>
              <p className="mt-3 text-gray-600">This summary helps your profile look polished when sharing your HR identity and professional details.</p>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#F5C77A]/20 flex items-center justify-center text-[#E39A2D] shadow-sm">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{profile.name || "Your Name"}</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl border border-gray-200 bg-[#FAF7F2] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Designation</p>
                  <p className="mt-2 font-semibold text-gray-900">{profile.designation || "HR Manager"}</p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Department</p>
                  <p className="mt-2 font-semibold text-gray-900">{profile.department || "Team"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone || "(123) 456-7890"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location || "City, Country"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email || "email@company.com"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>{profile.website || "www.company.com"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Link className="w-4 h-4" />
                  <span>{profile.linkedin || "linkedin.com/in/yourname"}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
