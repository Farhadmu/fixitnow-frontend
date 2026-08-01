import Cookies from "js-cookie";
import type { Role, User } from "@/types";

const TOKEN_KEY = "fixitnow_token";
const ROLE_KEY = "fixitnow_role";
const USER_KEY = "fixitnow_user";

const COOKIE_OPTS = { expires: 1, sameSite: "lax" as const, path: "/" };

export function setSession(token: string, user: User) {
  Cookies.set(TOKEN_KEY, token, COOKIE_OPTS);
  Cookies.set(ROLE_KEY, user.role, COOKIE_OPTS);
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  Cookies.remove(TOKEN_KEY, { path: "/" });
  Cookies.remove(ROLE_KEY, { path: "/" });
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function getRole(): Role | undefined {
  return Cookies.get(ROLE_KEY) as Role | undefined;
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function dashboardPathForRole(role: Role) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "TECHNICIAN") return "/dashboard/technician";
  return "/dashboard/customer";
}
