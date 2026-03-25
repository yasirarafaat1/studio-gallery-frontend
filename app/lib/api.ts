import { getAdminToken, getClientToken } from "./auth";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type AuthMode = "client" | "admin" | "none";
type ApiFetchOptions = RequestInit & { auth?: AuthMode };

const resolveToken = (mode: AuthMode) => {
  if (mode === "admin") return getAdminToken();
  if (mode === "client") return getClientToken();
  return null;
};


const fetchWithAuth = async (mode: AuthMode, path: string, options: ApiFetchOptions = {}) => {
  const { auth: _auth, ...requestOptions } = options;
  const token = resolveToken(mode);
  const headers = new Headers(requestOptions.headers || {});
  if (!headers.has("Content-Type") && !(requestOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

export const apiFetch = async (path: string, options: ApiFetchOptions = {}) => {
  const mode = options.auth || "client";
  return fetchWithAuth(mode, path, options);
};

export const apiFetchAdmin = async (path: string, options: ApiFetchOptions = {}) =>
  fetchWithAuth("admin", path, options);

export const apiFetchPublic = async (path: string, options: ApiFetchOptions = {}) =>
  fetchWithAuth("none", path, options);
