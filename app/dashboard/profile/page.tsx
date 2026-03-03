"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    city: "",
    country: "",
    summary: "",
    linkedin: "",
    portfolio: "",
    github: "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved profile data from localStorage
    const savedProfile = localStorage.getItem("jobSeekerProfile");
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    }
    
    // Load email from signup
    const email = localStorage.getItem("email");
    setFormData(prev => ({ ...prev, email: email || "" }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem("jobSeekerProfile", JSON.stringify(formData));
      
      // Dispatch a custom event to notify dashboard of profile update
      window.dispatchEvent(new Event("profileUpdated"));
      
      setSaved(true);
      
      // Reset saved message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-[#E39A2D] text-white p-10 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-semibold">My Profile</h1>
        <p className="mt-3 text-[#FFF3DF]">
          Update your personal information and professional details
        </p>
      </section>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Success Message */}
        {saved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl">
            ✓ Profile saved successfully!
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-[#F5E6D3]">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-6">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-[#F5E6D3]">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-6">Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Address</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="123 Main Street"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-[#F5E6D3]">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-6">Professional Summary</h2>
          
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">About You</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Write a brief summary of your professional background and career goals..."
              rows={5}
              className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">Share your professional experience and aspirations</p>
          </div>
        </div>

        {/* Social & Web Links */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-[#F5E6D3]">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-6">Social & Web Links</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/johndoe"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Portfolio Website</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://johndoe.com"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">GitHub Profile</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/johndoe"
                className="w-full border border-[#E5D3BC] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#E39A2D] text-white rounded-xl hover:bg-[#cc8424] transition disabled:opacity-50 font-semibold"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-8 py-3 border-2 border-[#E39A2D] text-[#E39A2D] rounded-xl hover:bg-[#FFF3DF] transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
