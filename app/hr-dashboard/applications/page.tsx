"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/service/api";

interface JobApplication {
  id: number;
  job: number;
  job_title: string;
  applicant: number;
  applicant_name: string;
  applicant_email: string;
  resume_url?: string | null;
  status: string;
  match_percentage: number | null;
  missing_skills: string | null;
  applied_date: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const userType = typeof window !== "undefined" ? localStorage.getItem("user_type") : null;

  useEffect(() => {
    if (!userType || userType !== "hr") {
      router.push("/auth/login");
      return;
    }

    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const data = await apiRequest<JobApplication[]>(
        `users/applications/?t=${new Date().getTime()}`
      );

      setApplications(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      // Show confirmation alert for rejection
      if (newStatus === "rejected") {
        const application = applications.find(app => app.id === applicationId);
        const confirmReject = window.confirm(
          `Are you sure you want to reject ${application?.applicant_name}'s application for "${application?.job_title}"?\n\nAn email notification will be sent to the job seeker.`
        );
        if (!confirmReject) return;
      }

      await apiRequest(
        `users/applications/${applicationId}/`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      setApplications(
        applications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // Show success alert for rejection
      if (newStatus === "rejected") {
        const application = applications.find(app => app.id === applicationId);
        alert(`Application rejected successfully! An email notification has been sent to ${application?.applicant_name}.`);
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const sortedApplications = [...filteredApplications].sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "reviewing":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark mb-4">Job Applications</h1>
        <p className="text-gray-600">
          Total applications: <span className="font-bold text-dark">{applications.length}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filter by Status */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === "all"
              ? "bg-accent text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setFilterStatus("applied")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === "applied"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Applied ({applications.filter((a) => a.status === "applied").length})
        </button>
        <button
          onClick={() => setFilterStatus("reviewing")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === "reviewing"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Reviewing ({applications.filter((a) => a.status === "reviewing").length})
        </button>
        <button
          onClick={() => setFilterStatus("interview")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === "interview"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Interview ({applications.filter((a) => a.status === "interview").length})
        </button>
        <button
          onClick={() => setFilterStatus("accepted")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === "accepted"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Accepted ({applications.filter((a) => a.status === "accepted").length})
        </button>
        <button
          onClick={() => setFilterStatus("rejected")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterStatus === "rejected"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Rejected ({applications.filter((a) => a.status === "rejected").length})
        </button>
      </div>

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">
            {filterStatus === "all"
              ? "No applications yet."
              : `No ${filterStatus} applications.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Applicant Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Applied For Job
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Match Score
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedApplications.map((application) => (
                  <tr key={application.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-dark font-medium">
                      {application.applicant_name}
                      <div className="text-xs text-gray-500 mt-1">{application.applicant_email}</div>
                      {application.resume_url && (
                        <a
                          href={application.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-accent hover:underline"
                        >
                          View resume
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {application.job_title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(application.applied_date)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {application.match_percentage !== null ? (
                        <div>
                          <div className={`font-bold text-lg ${application.match_percentage >= 80 ? 'text-green-600' : application.match_percentage >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {application.match_percentage}%
                          </div>
                          {application.missing_skills && (
                            <div className="text-xs text-red-500 max-w-[150px] truncate" title={`Missing: ${application.missing_skills}`}>
                              Missing: {application.missing_skills}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-accent"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="interview">Interview</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
