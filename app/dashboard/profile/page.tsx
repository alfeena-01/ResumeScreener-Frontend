"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { BASE_URL, authFetch } from "@/lib/api";
import { User, MapPin, Briefcase, GitBranch, Link, Globe, Phone, Mail, Camera, Plus, Trash2, Edit } from "lucide-react";

interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface EducationEntry {
  institution: string;
  degree: string;
  year: string;
  details: string;
}

const countryCodeOptions = [
  { iso: "us", label: "+1", value: "+1" },
  { iso: "ca", label: "+1", value: "+1" },
  { iso: "gb", label: "+44", value: "+44" },
  { iso: "au", label: "+61", value: "+61" },
  { iso: "in", label: "+91", value: "+91" },
  { iso: "de", label: "+49", value: "+49" },
  { iso: "fr", label: "+33", value: "+33" },
  { iso: "br", label: "+55", value: "+55" },
  { iso: "mx", label: "+52", value: "+52" },
  { iso: "es", label: "+34", value: "+34" },
  { iso: "it", label: "+39", value: "+39" },
  { iso: "nl", label: "+31", value: "+31" },
  { iso: "se", label: "+46", value: "+46" },
  { iso: "ch", label: "+41", value: "+41" },
  { iso: "jp", label: "+81", value: "+81" },
  { iso: "kr", label: "+82", value: "+82" },
  { iso: "sg", label: "+65", value: "+65" },
  { iso: "nz", label: "+64", value: "+64" },
  { iso: "za", label: "+27", value: "+27" },
  { iso: "ng", label: "+234", value: "+234" },
  { iso: "ar", label: "+54", value: "+54" },
  { iso: "cl", label: "+56", value: "+56" },
  { iso: "co", label: "+57", value: "+57" },
  { iso: "pl", label: "+48", value: "+48" },
  { iso: "be", label: "+32", value: "+32" },
  { iso: "at", label: "+43", value: "+43" },
  { iso: "dk", label: "+45", value: "+45" },
  { iso: "fi", label: "+358", value: "+358" },
  { iso: "no", label: "+47", value: "+47" },
  { iso: "ie", label: "+353", value: "+353" },
  { iso: "pt", label: "+351", value: "+351" },
  { iso: "gr", label: "+30", value: "+30" },
  { iso: "il", label: "+972", value: "+972" },
  { iso: "sa", label: "+966", value: "+966" },
  { iso: "ae", label: "+971", value: "+971" },
  { iso: "eg", label: "+20", value: "+20" },
  { iso: "tr", label: "+90", value: "+90" },
  { iso: "my", label: "+60", value: "+60" },
  { iso: "th", label: "+66", value: "+66" },
  { iso: "ph", label: "+63", value: "+63" },
  { iso: "vn", label: "+84", value: "+84" },
  { iso: "id", label: "+62", value: "+62" },
  { iso: "pk", label: "+92", value: "+92" },
  { iso: "bd", label: "+880", value: "+880" },
  { iso: "lk", label: "+94", value: "+94" },
  { iso: "cz", label: "+420", value: "+420" },
  { iso: "hu", label: "+36", value: "+36" },
  { iso: "ro", label: "+40", value: "+40" },
  { iso: "sk", label: "+421", value: "+421" },
  { iso: "si", label: "+386", value: "+386" },
  { iso: "hr", label: "+385", value: "+385" },
  { iso: "bg", label: "+359", value: "+359" },
  { iso: "lt", label: "+370", value: "+370" },
  { iso: "lv", label: "+371", value: "+371" },
  { iso: "ee", label: "+372", value: "+372" },
  { iso: "ua", label: "+380", value: "+380" },
  { iso: "ru", label: "+7", value: "+7" },
  { iso: "kz", label: "+7", value: "+7" },
  { iso: "uy", label: "+598", value: "+598" },
  { iso: "py", label: "+595", value: "+595" },
  { iso: "bo", label: "+591", value: "+591" },
  { iso: "ec", label: "+593", value: "+593" },
  { iso: "cr", label: "+506", value: "+506" },
  { iso: "pa", label: "+507", value: "+507" },
  { iso: "pr", label: "+1787", value: "+1787" },
  { iso: "jm", label: "+1876", value: "+1876" },
  { iso: "bs", label: "+1242", value: "+1242" },
  { iso: "bb", label: "+1246", value: "+1246" },
  { iso: "tt", label: "+1868", value: "+1868" },
];

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    countryIso: "us",
    location: "",
    city: "",
    country: "",
    summary: "",
    linkedin: "",
    portfolio: "",
    github: "",
  });
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedProfilePicture, setSavedProfilePicture] = useState<string | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [experienceForm, setExperienceForm] = useState<ExperienceEntry>({
    company: "",
    role: "",
    duration: "",
    description: "",
  });
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);

  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [educationForm, setEducationForm] = useState<EducationEntry>({
    institution: "",
    degree: "",
    year: "",
    details: "",
  });
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedLocal = localStorage.getItem("jobSeekerProfile");
        const savedProfile = savedLocal ? JSON.parse(savedLocal) : null;

        const response = await authFetch(`${BASE_URL}/users/user-info/`, {
          method: "GET",
        });

        interface BackendProfile {
          profile_picture?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
        }

        let backendProfile: BackendProfile = {};
        if (response.ok) {
          backendProfile = await response.json();
          if (backendProfile.profile_picture) {
            setSavedProfilePicture(`${BASE_URL}${backendProfile.profile_picture}`);
          }
        }

        setFormData({
          firstName: backendProfile.first_name || savedProfile?.firstName || "",
          lastName: backendProfile.last_name || savedProfile?.lastName || "",
          email: backendProfile.email || savedProfile?.email || "",
          phone: savedProfile?.phone || "",
          countryCode: savedProfile?.countryCode || "+1",
          countryIso: savedProfile?.countryIso || "us",
          location: savedProfile?.location || "",
          city: savedProfile?.city || "",
          country: savedProfile?.country || "",
          summary: savedProfile?.summary || "",
          linkedin: savedProfile?.linkedin || "",
          portfolio: savedProfile?.portfolio || "",
          github: savedProfile?.github || "",
        });

        try {
          const storedSkills = localStorage.getItem("skills");
          if (storedSkills) setSkills(JSON.parse(storedSkills));
        } catch {
          // ignore
        }
        try {
          const storedExperiences = localStorage.getItem("experiences");
          if (storedExperiences) setExperiences(JSON.parse(storedExperiences));
        } catch {
          // ignore
        }
        try {
          const storedEducation = localStorage.getItem("education");
          if (storedEducation) setEducationList(JSON.parse(storedEducation));
        } catch {
          // ignore
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("jobSeekerProfile", JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("skills", JSON.stringify(skills));
    } catch {
      // ignore
    }
  }, [skills]);

  useEffect(() => {
    try {
      localStorage.setItem("experiences", JSON.stringify(experiences));
    } catch {
      // ignore
    }
  }, [experiences]);

  useEffect(() => {
    try {
      localStorage.setItem("education", JSON.stringify(educationList));
    } catch {
      // ignore
    }
  }, [educationList]);

  const selectedCountry = countryCodeOptions.find((option) => option.iso === formData.countryIso) ?? countryCodeOptions[0];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const addSkill = () => {
    const nextSkill = skillInput.trim();
    if (!nextSkill) return;
    if (skills.includes(nextSkill)) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, nextSkill]);
    setSkillInput("");
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExperienceFormChange = (key: keyof ExperienceEntry, value: string) => {
    setExperienceForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveExperience = () => {
    if (!experienceForm.company.trim() || !experienceForm.role.trim()) return;
    if (editingExperienceIndex !== null) {
      setExperiences((prev) =>
        prev.map((item, index) =>
          index === editingExperienceIndex ? { ...experienceForm } : item
        )
      );
      setEditingExperienceIndex(null);
    } else {
      setExperiences((prev) => [...prev, { ...experienceForm }]);
    }
    setExperienceForm({ company: "", role: "", duration: "", description: "" });
  };

  const editExperience = (index: number) => {
    setExperienceForm(experiences[index]);
    setEditingExperienceIndex(index);
  };

  const deleteExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
    if (editingExperienceIndex === index) {
      setExperienceForm({ company: "", role: "", duration: "", description: "" });
      setEditingExperienceIndex(null);
    }
  };

  const handleEducationFormChange = (key: keyof EducationEntry, value: string) => {
    setEducationForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveEducation = () => {
    if (!educationForm.institution.trim() || !educationForm.degree.trim()) return;
    if (editingEducationIndex !== null) {
      setEducationList((prev) =>
        prev.map((item, index) =>
          index === editingEducationIndex ? { ...educationForm } : item
        )
      );
      setEditingEducationIndex(null);
    } else {
      setEducationList((prev) => [...prev, { ...educationForm }]);
    }
    setEducationForm({ institution: "", degree: "", year: "", details: "" });
  };

  const editEducation = (index: number) => {
    setEducationForm(educationList[index]);
    setEditingEducationIndex(index);
  };

  const deleteEducation = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
    if (editingEducationIndex === index) {
      setEducationForm({ institution: "", degree: "", year: "", details: "" });
      setEditingEducationIndex(null);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        alert("Please enter both first and last name");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.firstName.trim());
      formDataToSend.append("last_name", formData.lastName.trim());
      if (photo) {
        formDataToSend.append("profile_picture", photo);
      }

      const response = await authFetch(`${BASE_URL}/users/user-info/`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("jobSeekerProfile", JSON.stringify(formData));
        localStorage.setItem("skills", JSON.stringify(skills));
        localStorage.setItem("experiences", JSON.stringify(experiences));
        localStorage.setItem("education", JSON.stringify(educationList));

        if (responseData.profile_picture) {
          setSavedProfilePicture(`${BASE_URL}${responseData.profile_picture}`);
        }
        setPhoto(null);
        window.dispatchEvent(new Event("profileUpdated"));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const contentType = response.headers.get("content-type");
        let errorMsg = response.statusText;
        if (contentType?.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorMsg = errorData?.detail || errorData?.message || JSON.stringify(errorData) || errorMsg;
          } catch (error) {
            console.error("Failed to parse error JSON:", error);
          }
        } else {
          const textResponse = await response.text();
          console.error("Backend error (non-JSON):", textResponse);
        }
        alert(`Error saving profile: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2]">
      <div className="bg-linear-to-r from-[#F5C77A] to-[#E39A2D] text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-28 h-28 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg">
                {photo ? (
                  <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                ) : savedProfilePicture ? (
                  <img src={savedProfilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Camera className="w-11 h-11 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition">
                <Camera className="w-5 h-5 text-gray-600" />
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-base text-orange-100 max-w-3xl mx-auto">Keep your information polished and professional in one place, including skills, experience, and education.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {saved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl mb-8 flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            Profile saved successfully!
          </div>
        )}

      <form onSubmit={handleSave} className="grid gap-10 xl:grid-cols-[2.2fr_1fr]">
          <div className="space-y-10">
            <section className="bg-white border border-[#FCE7C0] rounded-4xl shadow-[0_0_70px_rgba(227,154,45,0.12)] p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#1F2937]">Profile Details</h2>
                <p className="mt-3 text-gray-600">Update name, contact, summary, and links that help employers learn more about you.</p>
              </div>

              <div className="grid gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><User className="w-4 h-4 mr-2" /> First Name</span>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><User className="w-4 h-4 mr-2" /> Last Name</span>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><Mail className="w-4 h-4 mr-2" /> Email Address</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </label>
                  <div className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><Phone className="w-4 h-4 mr-2" /> Phone Number</span>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div ref={countryDropdownRef} className="relative w-full sm:w-24">
                        <button
                          type="button"
                          onClick={() => setCountryDropdownOpen((current) => !current)}
                          className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                        >
                          <span className="flex items-center gap-2">
                            <img
                              src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
                              alt={selectedCountry.iso}
                              className="h-4 w-6 rounded-sm object-cover"
                            />
                            {selectedCountry.label}
                          </span>
                          <span className="text-xs text-gray-500">▾</span>
                        </button>

                        {countryDropdownOpen ? (
                          <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-lg">
                            <div className="max-h-60 overflow-y-auto overscroll-contain">
                              {countryCodeOptions.map((option) => (
                                <button
                                  key={`${option.iso}-${option.value}`}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      countryCode: option.value,
                                      countryIso: option.iso,
                                    }));
                                    setCountryDropdownOpen(false);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <img
                                    src={`https://flagcdn.com/w20/${option.iso}.png`}
                                    alt={option.iso}
                                    className="h-4 w-6 rounded-sm object-cover"
                                  />
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="555 123 4567"
                        className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <label className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><MapPin className="w-4 h-4 mr-2" /> Address</span>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><MapPin className="w-4 h-4 mr-2" /> City</span>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><Globe className="w-4 h-4 mr-2" /> Country</span>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="United States"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                    />
                  </label>
                </div>

                <div className="space-y-4 p-6 rounded-3xl bg-[#FFFAF1] border border-[#F5E6D3]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Skills</p>
                      <p className="text-xs text-gray-500">Add up to 20 skills</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#E39A2D] px-4 py-3 text-white hover:bg-[#cc8424] transition"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {skills.length ? (
                      skills.map((skill, index) => (
                        <span key={index} className="flex items-center gap-2 rounded-full border border-[#F5C77A] bg-white px-4 py-2 text-sm text-[#1F2937]">
                          {skill}
                          <button type="button" onClick={() => removeSkill(index)} className="text-[#E39A2D] hover:text-[#c16d0c]">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills added yet.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-6 rounded-3xl bg-[#FFFAF1] border border-[#F5E6D3]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Experience</p>
                      <p className="text-xs text-gray-500">Add, edit, or remove roles</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <input
                      placeholder="Company"
                      value={experienceForm.company}
                      onChange={(e) => handleExperienceFormChange("company", e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
                    />
                    <input
                      placeholder="Role"
                      value={experienceForm.role}
                      onChange={(e) => handleExperienceFormChange("role", e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
                    />
                    <input
                      placeholder="Duration (e.g., 2022 - 2024)"
                      value={experienceForm.duration}
                      onChange={(e) => handleExperienceFormChange("duration", e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
                    />
                    <textarea
                      placeholder="Describe your responsibilities..."
                      value={experienceForm.description}
                      onChange={(e) => handleExperienceFormChange("description", e.target.value)}
                      rows={4}
                      className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-between gap-4">
                    {editingExperienceIndex !== null ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExperienceIndex(null);
                          setExperienceForm({ company: "", role: "", duration: "", description: "" });
                        }}
                        className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={saveExperience}
                      className="ml-auto rounded-xl bg-[#E39A2D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#cc8424] transition"
                    >
                      {editingExperienceIndex !== null ? "Update Experience" : "Add Experience"}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {experiences.length ? (
                      experiences.map((exp, index) => (
                        <div key={index} className="rounded-2xl border border-[#F5E6D3] bg-white p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-[#1F2937]">{exp.role}</p>
                              <p className="text-xs text-[#E39A2D]">{exp.company}</p>
                              <p className="text-xs text-gray-500 mt-1">{exp.duration}</p>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => editExperience(index)} className="rounded-lg border border-[#E39A2D] px-3 py-2 text-xs text-[#E39A2D] hover:bg-[#FEEBC8] transition">
                                <Edit className="w-4 h-4 inline" /> Edit
                              </button>
                              <button type="button" onClick={() => deleteExperience(index)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 hover:bg-red-100 transition">
                                <Trash2 className="w-4 h-4 inline" /> Remove
                              </button>
                            </div>
                          </div>
                          {exp.description ? <p className="mt-3 text-sm text-gray-600">{exp.description}</p> : null}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No experiences yet.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-6 rounded-3xl bg-[#FFFAF1] border border-[#F5E6D3]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Education</p>
                      <p className="text-xs text-gray-500">Add degrees, certifications, or programs</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <input
                      placeholder="Institution"
                      value={educationForm.institution}
                      onChange={(e) => handleEducationFormChange("institution", e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
                    />
                    <input
                      placeholder="Degree / Course"
                      value={educationForm.degree}
                      onChange={(e) => handleEducationFormChange("degree", e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
                    />
                    <input
                      placeholder="Year (e.g., 2019 - 2023)"
                      value={educationForm.year}
                      onChange={(e) => handleEducationFormChange("year", e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
                    />
                    <textarea
                      placeholder="Additional details..."
                      value={educationForm.details}
                      onChange={(e) => handleEducationFormChange("details", e.target.value)}
                      rows={4}
                      className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-between gap-4">
                    {editingEducationIndex !== null ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEducationIndex(null);
                          setEducationForm({ institution: "", degree: "", year: "", details: "" });
                        }}
                        className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={saveEducation}
                      className="ml-auto rounded-xl bg-[#E39A2D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#cc8424] transition"
                    >
                      {editingEducationIndex !== null ? "Update Education" : "Add Education"}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {educationList.length ? (
                      educationList.map((edu, index) => (
                        <div key={index} className="rounded-2xl border border-[#F5E6D3] bg-white p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-[#1F2937]">{edu.degree}</p>
                              <p className="text-xs text-[#E39A2D]">{edu.institution}</p>
                              <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => editEducation(index)} className="rounded-lg border border-[#E39A2D] px-3 py-2 text-xs text-[#E39A2D] hover:bg-[#FEEBC8] transition">
                                <Edit className="w-4 h-4 inline" /> Edit
                              </button>
                              <button type="button" onClick={() => deleteEducation(index)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 hover:bg-red-100 transition">
                                <Trash2 className="w-4 h-4 inline" /> Remove
                              </button>
                            </div>
                          </div>
                          {edu.details ? <p className="mt-3 text-sm text-gray-600">{edu.details}</p> : null}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No education entries yet.</p>
                    )}
                  </div>
                </div>

                <label className="space-y-2">
                  <span className="flex items-center text-sm font-semibold text-gray-700"><Briefcase className="w-4 h-4 mr-2" /> Professional Summary</span>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Tell us about your professional background..."
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition resize-none"
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <label className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><Link className="w-4 h-4 mr-2" /> LinkedIn</span>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/johndoe"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><GitBranch className="w-4 h-4 mr-2" /> GitHub</span>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/johndoe"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="flex items-center text-sm font-semibold text-gray-700"><Globe className="w-4 h-4 mr-2" /> Portfolio</span>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://johndoe.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E39A2D] focus:border-transparent outline-none transition"
                    />
                  </label>
                </div>
              </div>
            </section>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-linear-to-r from-[#F5C77A] to-[#E39A2D] px-10 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving profile
                  </div>
                ) : (
                  "Save Profile"
                )}
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="sticky top-28 rounded-4xl border border-[#FCE7C0] bg-white p-8 shadow-[0_0_40px_rgba(227,154,45,0.12)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[#E39A2D]">Live Overview</p>
              <h2 className="mt-4 text-2xl font-semibold text-[#1F2937]">Your Profile Summary</h2>
              <div className="mt-6 space-y-4 text-[#52525B]">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Name</p>
                  <p className="mt-1 text-sm">{formData.firstName || "First"} {formData.lastName || "Last"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Summary</p>
                  <p className="mt-1 text-sm text-gray-600">{formData.summary || "Write a short summary about your experience and goals."}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Skills</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.length ? (
                      skills.map((skill, index) => (
                        <span key={index} className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-medium text-[#92400E]">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No skills yet</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Links</p>
                  <div className="mt-3 space-y-2 text-sm">
                    {formData.linkedin ? (
                      <a href={formData.linkedin} target="_blank" rel="noreferrer" className="block text-[#1D4ED8] hover:underline">
                        LinkedIn
                      </a>
                    ) : (
                      <span className="text-gray-500">No LinkedIn added</span>
                    )}
                    {formData.github ? (
                      <a href={formData.github} target="_blank" rel="noreferrer" className="block text-[#1D4ED8] hover:underline">
                        GitHub
                      </a>
                    ) : (
                      <span className="text-gray-500">No GitHub added</span>
                    )}
                    {formData.portfolio ? (
                      <a href={formData.portfolio} target="_blank" rel="noreferrer" className="block text-[#1D4ED8] hover:underline">
                        Portfolio
                      </a>
                    ) : (
                      <span className="text-gray-500">No portfolio added</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Experience</p>
                  <div className="mt-3 space-y-3">
                    {experiences.length ? (
                      experiences.slice(0, 3).map((exp, index) => (
                        <div key={index} className="rounded-2xl bg-[#FFFBEB] p-3 text-sm text-[#4B4B4B]">
                          <p className="font-semibold">{exp.role || "Role"}</p>
                          <p>{exp.company || "Company"}</p>
                          <p className="text-xs text-gray-500">{exp.duration || "Duration"}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No experience added yet.</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Education</p>
                  <div className="mt-3 space-y-3">
                    {educationList.length ? (
                      educationList.slice(0, 3).map((edu, index) => (
                        <div key={index} className="rounded-2xl bg-[#EFF6FF] p-3 text-sm text-[#334155]">
                          <p className="font-semibold">{edu.degree || "Degree"}</p>
                          <p>{edu.institution || "Institution"}</p>
                          <p className="text-xs text-gray-500">{edu.year || "Year"}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No education added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
