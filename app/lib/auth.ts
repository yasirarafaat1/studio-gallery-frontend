export type AuthUser = {
  id: string;
  email: string;
  role: "admin" | "client";
  username?: string;
  approved?: boolean;
};

const CLIENT_TOKEN_KEY = "studio_client_token";
const CLIENT_USER_KEY = "studio_client_user";
const ADMIN_TOKEN_KEY = "studio_admin_token";
const ADMIN_USER_KEY = "studio_admin_user";
const LEGACY_TOKEN_KEY = "studio_token";
const LEGACY_USER_KEY = "studio_user";

const readStorage = (primary: string, legacy?: string) => {
  if (typeof window === "undefined") return null;
  const primaryValue = window.localStorage.getItem(primary);
  if (primaryValue) return primaryValue;
  return legacy ? window.localStorage.getItem(legacy) : null;
};

const parseUser = (raw: string | null) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

const clearClientStorage = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CLIENT_TOKEN_KEY);
  window.localStorage.removeItem(CLIENT_USER_KEY);
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_USER_KEY);
};

const clearAdminStorage = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_USER_KEY);
};

const readClientUser = () => {
  const raw = readStorage(CLIENT_USER_KEY, LEGACY_USER_KEY);
  const user = parseUser(raw);
  if (!user || user.role !== "client") {
    if (raw) clearClientStorage();
    return null;
  }
  return user;
};

const readAdminUser = () => {
  const raw = readStorage(ADMIN_USER_KEY);
  const user = parseUser(raw);
  if (!user || user.role !== "admin") {
    if (raw) clearAdminStorage();
    return null;
  }
  return user;
};

export const getClientToken = () => {
  const user = readClientUser();
  if (!user) return null;
  return readStorage(CLIENT_TOKEN_KEY, LEGACY_TOKEN_KEY);
};

export const getAdminToken = () => {
  const user = readAdminUser();
  if (!user) return null;
  return readStorage(ADMIN_TOKEN_KEY);
};

export const getClientUser = (): AuthUser | null => readClientUser();
export const getAdminUser = (): AuthUser | null => readAdminUser();

export const setClientAuth = (token: string, user: AuthUser) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLIENT_TOKEN_KEY, token);
  window.localStorage.setItem(CLIENT_USER_KEY, JSON.stringify(user));
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_USER_KEY);
};

export const setAdminAuth = (token: string, user: AuthUser) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
};

export const clearClientAuth = () => {
  clearClientStorage();
};

export const clearAdminAuth = () => {
  clearAdminStorage();
};

export const getToken = getClientToken;
export const getUser = getClientUser;
export const setAuth = setClientAuth;
export const clearAuth = clearClientAuth;
