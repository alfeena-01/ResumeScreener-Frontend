"use client";

import { useState, useEffect } from "react";

export default function SkillsPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("skills");
      if (stored) setSkills(JSON.parse(stored));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("skills", JSON.stringify(skills));
    } catch (e) {}
  }, [skills]);

  const addSkill = () => {
    if (input.trim()) {
      setSkills([...skills, input]);
      setInput("");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-[#1F2937]">
        Skills
      </h1>

      <div className="bg-white p-10 rounded-3xl shadow-md border border-[#F5E6D3]">
        <div className="flex gap-4 mb-8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a skill"
            className="flex-1 border border-[#E5D3BC] rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#E39A2D] outline-none"
          />
          <button
            onClick={addSkill}
            className="bg-[#E39A2D] text-white px-6 rounded-xl hover:bg-[#cc8424] transition"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-[#FFF3DF] text-[#1F2937] px-5 py-2 rounded-full border border-[#F5C77A]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

