"use client";

import { useState, useEffect, useRef } from "react";
import { Building, MapPin, Globe, FileText, Target, Calendar, Users, Briefcase, Mail, Phone } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

// Step 1: Define the Company type
interface Company {
  name: string;
  location: string;
  website: string;
  description: string;
  logo: string | null;   // <-- allow both string and null
  founded: string;
  employees: string;
  industry: string;
  linkedin: string;
  contact_email: string;
  contact_phone: string;
  tagline: string;
}

export default function CompanyPage() {
  const [company, setCompany] = useState<Company>({
    name: "",
    location: "",
    website: "",
    description: "",
    logo: null,
    founded: "",
    employees: "",
    industry: "",
    linkedin: "",
    contact_email: "",
    contact_phone: "",
    tagline: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("companyData");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompany(JSON.parse(saved));
    }
  }, []);

  const fileInputRef = useRef<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCompany((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setCompany((prev) => ({ ...prev, logo: null }));
  };

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

        <div className="flex items-center gap-6 mb-6">
          <div className="flex-shrink-0">
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              className="h-40 w-40 bg-gray-100 rounded-md border flex items-center justify-center overflow-hidden cursor-pointer relative"
            >
              {!company.logo ? (
                <span className="text-sm text-gray-500">Click to add logo</span>
              ) : (
                <img src={company.logo as string} alt="Company logo" className="h-full w-full object-cover" />
              )}

              {company.logo && (
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    removeLogo();
                  }}
                  className="absolute bottom-2 right-2 bg-white/80 text-xs text-red-600 px-2 py-1 rounded"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Building className="w-4 h-4 text-gray-600" />
                Company Name
              </label>
              <input
                type="text"
                name="name"
                value={company.name}
                placeholder="Company Name"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin className="w-4 h-4 text-gray-600" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={company.location}
                placeholder="Location"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Globe className="w-4 h-4 text-gray-600" />
                Website
              </label>
              <input
                type="text"
                name="website"
                value={company.website}
                placeholder="Website"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-gray-600" />
              Company Description
            </label>
            <textarea
              name="description"
              value={company.description}
              placeholder="Company Description"
              rows={4}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Target className="w-4 h-4 text-gray-600" />
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={company.tagline}
              placeholder="Tagline (e.g. 'Innovating HR tech')"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-gray-600" />
                Founded Year
              </label>
              <input
                type="text"
                name="founded"
                value={company.founded}
                placeholder="Founded (year)"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Users className="w-4 h-4 text-gray-600" />
                Employees
              </label>
              <input
                type="text"
                name="employees"
                value={company.employees}
                placeholder="Employees (e.g. 50-200)"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Briefcase className="w-4 h-4 text-gray-600" />
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={company.industry}
              placeholder="Industry (e.g. Software, Finance)"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Mail className="w-4 h-4 text-gray-600" />
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={company.contact_email}
                placeholder="Contact Email"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Phone className="w-4 h-4 text-gray-600" />
                Contact Phone
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={company.contact_phone}
                placeholder="Contact Phone"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1 pb-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="w-4 h-4 text-gray-600">
                <FaLinkedin size={16} />
              </span>



              LinkedIn URL
            </label>
            <input
              type="text"
              name="linkedin"
              value={company.linkedin}
              placeholder="LinkedIn URL"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:border-[#E1AD01] outline-none"
            />
          </div>
        </div>

        {/* duplicate logo input removed; top clickable logo box is used instead */}

        <button
          onClick={handleSave}
          className="bg-[#E1AD01] text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
        >
          Save Company
        </button>
      </div>
    </div>

  );
}
