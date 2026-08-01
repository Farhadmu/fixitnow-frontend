import { getToken, clearSession } from "@/lib/auth";
import { ApiError } from "@/lib/apiError";
import type { ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface RequestOptions extends RequestInit {
  auth?: boolean; // attach Authorization header (default true)
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...rest, headers: finalHeaders });
  } catch (err) {
    throw new ApiError(0, "Could not reach the server. Please check your connection and try again.");
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON response (e.g. cold-start HTML page)
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearSession();
    }
    throw new ApiError(
      res.status,
      json?.message || `Request failed with status ${res.status}`,
      json?.errorDetails
    );
  }

  return json as ApiResponse<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiClient<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(path, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(path, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, options?: RequestOptions) => apiClient<T>(path, { ...options, method: "DELETE" }),
};
