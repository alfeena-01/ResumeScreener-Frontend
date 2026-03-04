"use client";

import { useState, useEffect } from "react";

export default function HRProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    designation: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("hrProfile");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("hrProfile", JSON.stringify(profile));
    alert("Profile Saved Successfully!");
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#E1AD01]">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">👤 HR Profile</h1>

        <div className="space-y-5">
          <input
            type="text"
            name="name"
            value={profile.name}
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
          />

          <input
            type="email"
            name="email"
            value={profile.email}
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
          />

          <input
            type="text"
            name="designation"
            value={profile.designation}
            placeholder="Designation"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
          />

          <button
            onClick={handleSave}
            className="bg-[#E1AD01] text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
