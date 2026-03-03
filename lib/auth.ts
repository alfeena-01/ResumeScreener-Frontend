// Authentication utility functions

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_type");
    window.location.href = "/auth/login";
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("access_token");
  return !!token;
};

export const getUserType = (): "job_seeker" | "hr" | null => {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem("user_type") as "job_seeker" | "hr") || null;
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

/**
 * Save tokens and a few user fields returned by the backend after login/signup.
 * Call this from page components when you receive a successful response.
 */
export const saveSession = (data: any) => {
  if (typeof window === "undefined" || !data) return;
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  localStorage.setItem("user_type", data.user?.user_type);
  localStorage.setItem("username", data.user?.username);
  localStorage.setItem("email", data.user?.email);
  localStorage.setItem("user_id", String(data.user?.id));
};

