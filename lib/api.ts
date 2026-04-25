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

function buildHeaders(requireAuth = false): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (requireAuth) {
    const token = getAccessToken();
    if (!token) {
      // if we expected to be authenticated but there's no token,
      // log the user out so that calling code can redirect to login.
      logout();
    } else {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
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
  }).then(handleResponse);
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
export { BASE_URL };
