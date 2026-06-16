// Basic API service helpers for communicating with the Django backend
// using fetch and the utilities from auth.ts to read the stored JWT.

import { getAccessToken, logout } from "./auth";

// make sure the base URL always points at the Django API root; strip any trailing
// slashes from the environment variable and default to the local backend when absent.
const BASE_URL =
  (() => {
    const raw = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";
    return raw.replace(/\/+$/g, "");
  })();

function buildHeaders(requireAuth = false, includeJsonContentType = true): HeadersInit {
  const headers: HeadersInit = {};

  if (includeJsonContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}/users/login/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.access) {
      localStorage.setItem("access_token", data.access);
      return data.access;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }

  return null;
}

async function authFetch(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  if (token) {
    const headers = new Headers(init.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    init.headers = headers;
  }

  const response = await fetch(input, init);
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const headers = new Headers(init.headers || {});
      headers.set("Authorization", `Bearer ${newToken}`);
      init.headers = headers;
      return fetch(input, init);
    }
    logout();
  }

  return response;
}

async function handleResponse(res: Response) {
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    console.log("Backend Error Response:", json); // 👈 ADD THIS
    const error = json?.error || json?.message || res.statusText;
    throw new Error(error);
  }
  return json;
}

// --- auth endpoints -------------------------------------------------------

export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  user_type: "job_seeker" | "hr";
}

export function signup(payload: SignUpPayload) {
  return fetch(`${BASE_URL}/users/signup/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  }).then(handleResponse);
}

export interface LoginPayload {
  email: string;
  password: string;
}

export function login(payload: LoginPayload) {
  return fetch(`${BASE_URL}/users/login/`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  })
    .then(handleResponse)
    .catch((err) => {
      console.error("Network or CORS error during login fetch:", err);
      throw new Error(
        `Network error. Ensure backend is running and reachable at ${BASE_URL} (CORS/mixed-content may block requests).`
      );
    });
}

// --- user info ------------------------------------------------------------

export function fetchUserInfo() {
  return fetch(`${BASE_URL}/users/user-info/`, {
    method: "GET",
    headers: buildHeaders(true),
  }).then(handleResponse);
}

// --- jobs -----------------------------------------------------------------

export interface JobData {
  title: string;
  description: string;
  location?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: 'INR' | 'USD' | 'AED';
  job_type?: string;
  company_name?: string;
  requirements?: string;
  is_active?: boolean;
  [key: string]: unknown;
}

export function listJobs() {
  return fetch(`${BASE_URL}/users/jobs/`, {
    method: "GET",
    headers: buildHeaders(),
  }).then(handleResponse);
}

export function getJob(id: number) {
  return fetch(`${BASE_URL}/users/jobs/${id}/`, {
    method: "GET",
    headers: buildHeaders(),
  }).then(handleResponse);
}

export function createJob(payload: JobData) {
  return fetch(`${BASE_URL}/users/jobs/`, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  }).then(handleResponse);
}

export function updateJob(id: number, payload: JobData) {
  return fetch(`${BASE_URL}/users/jobs/${id}/`, {
    method: "PUT",
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  }).then(handleResponse);
}

export function deleteJob(id: number) {
  return fetch(`${BASE_URL}/users/jobs/${id}/`, {
    method: "DELETE",
    headers: buildHeaders(true),
  }).then(handleResponse);
}

// export BASE_URL for debugging or other callers
export { BASE_URL, buildHeaders, authFetch };
