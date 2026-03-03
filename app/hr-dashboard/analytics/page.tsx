"use client";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-[#1F2937]">
        Recruitment Analytics
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {["Applications Today", "Shortlisted", "Rejected"].map((item, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow border border-[#F5E6D3]"
          >
            <h2 className="text-[#6B7280]">{item}</h2>
            <p className="text-3xl font-bold text-[#E39A2D] mt-3">
              {Math.floor(Math.random() * 50) + 5}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
