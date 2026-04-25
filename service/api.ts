import API_BASE_URL from "@/config/env";

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/login/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      return data.access;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }

  return null;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const makeRequest = async (token?: string): Promise<T> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry with new token
        headers["Authorization"] = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
        if (retryResponse.ok) {
          return retryResponse.json();
        }
      }
      // If refresh failed, logout user
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_type");
        window.location.href = "/auth/login";
      }
      throw new Error("Authentication failed. Please log in again.");
    }

    if (!response.ok) {
      let error;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          error = await response.json();
        } else {
          const textError = await response.text();
          throw new Error(textError || `HTTP error ${response.status}`);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        throw new Error(`Server returned ${response.status}: ${msg}`);
      }

      let errorMessage = "Something went wrong";
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.detail) {
        errorMessage = error.detail;
      } else if (error && typeof error === "object") {
        const firstKey = Object.keys(error)[0];
        if (firstKey && Array.isArray(error[firstKey])) {
          errorMessage = `${firstKey}: ${error[firstKey][0]}`;
        } else if (firstKey && typeof error[firstKey] === "string") {
          errorMessage = error[firstKey];
        }
      }

      throw new Error(errorMessage);
    }

    return response.json();
  };

  // Get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return makeRequest(token || undefined);
}

// Notification API functions
export interface Notification {
  id: number;
  user: number;
  job_application: number | null;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  job_title: string | null;
  company_name: string | null;
  created_at: string;
}

export async function fetchNotifications(): Promise<Notification[]> {
  return apiRequest<Notification[]>("users/notifications/");
}

export async function markNotificationAsRead(
  notificationId: number
): Promise<Notification> {
  return apiRequest<Notification>(`users/notifications/${notificationId}/`, {
    method: "PATCH",
    body: JSON.stringify({ is_read: true }),
  });
}

export async function deleteNotification(notificationId: number): Promise<void> {
  return apiRequest<void>(`users/notifications/${notificationId}/`, {
    method: "DELETE",
  });
}