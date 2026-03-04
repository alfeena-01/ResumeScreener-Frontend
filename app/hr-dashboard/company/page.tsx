"use client";

import { useState, useEffect } from "react";

export default function CompanyPage() {
  const [company, setCompany] = useState({
    name: "",
    location: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("companyData");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompany(JSON.parse(saved));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("companyData", JSON.stringify(company));
    alert("Company Details Saved!");
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#E1AD01]">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🏢 Company Details</h1>

        <div className="space-y-5">
          <input
            type="text"
            name="name"
            value={company.name}
            placeholder="Company Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
          />

          <input
            type="text"
            name="location"
            value={company.location}
            placeholder="Location"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
          />

          <input
            type="text"
            name="website"
            value={company.website}
            placeholder="Website"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
          />

          <textarea
            name="description"
            value={company.description}
            placeholder="Company Description"
            rows={4}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
          />

          <button
            onClick={handleSave}
            className="bg-[#E1AD01] text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
          >
            Save Company
          </button>
        </div>
      </div>
    </div>
  );
}
