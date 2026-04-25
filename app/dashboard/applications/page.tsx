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
  status: string;
  match_percentage: number | null;
  missing_skills: string | null;
  applied_date: string;
  updated_at: string;
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const userType = typeof window !== "undefined" ? localStorage.getItem("user_type") : null;

  useEffect(() => {
    if (!userType || userType !== "job_seeker") {
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

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

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

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "reviewing":
        return "text-yellow-600";
      case "interview":
        return "text-purple-600";
      default:
        return "text-blue-600";
    }
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

  const isRecentlyUpdated = (updatedAt: string) => {
    const updatedDate = new Date(updatedAt);
    const now = new Date();
    const diffInHours = (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24; // Consider updated within last 24 hours as recent
  };

  const getStatusUpdateMessage = (application: JobApplication) => {
    if (application.status === 'applied') return null;
    
    const appliedDate = new Date(application.applied_date);
    const updatedDate = new Date(application.updated_at);
    
    // If updated_at is different from applied_date, it means status was changed
    if (updatedDate.getTime() !== appliedDate.getTime()) {
      return `Status updated ${formatDate(application.updated_at)}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark mb-4">My Applications</h1>
        <p className="text-gray-600">
          Total applications: <span className="font-bold text-dark">{applications.length}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Recent Notifications */}
      {applications.some(app => isRecentlyUpdated(app.updated_at) && app.status !== 'applied') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <span className="mr-2">🔔</span>
            Recent Status Updates
          </h2>
          <div className="space-y-2">
            {applications
              .filter(app => isRecentlyUpdated(app.updated_at) && app.status !== 'applied')
              .map(app => (
                <div key={app.id} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div>
                    <span className="font-medium text-gray-800">{app.job_title}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      status changed to <span className={`font-semibold ${getStatusTextColor(app.status)}`}>{app.status}</span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(app.updated_at)}
                  </span>
                </div>
              ))}
          </div>
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
              ? "You haven't applied to any jobs yet. Go to Find Jobs and apply now!"
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
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
                    Match Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => {
                  const recentlyUpdated = isRecentlyUpdated(application.updated_at);
                  const statusMessage = getStatusUpdateMessage(application);
                  
                  return (
                    <tr 
                      key={application.id} 
                      className={`border-b hover:bg-gray-50 transition ${recentlyUpdated ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm text-dark font-medium">
                        {application.job_title}
                        {recentlyUpdated && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" title="Recently updated"></span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(application.applied_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(application.updated_at)}
                        {statusMessage && (
                          <div className="text-xs text-blue-600 mt-1">
                            {statusMessage}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        {recentlyUpdated && application.status !== 'applied' && (
                          <div className="text-xs text-blue-600 mt-1 font-medium">
                            Status changed!
                          </div>
                        )}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
