type ApiError = {
  message: string;
  status: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
console.log("API BASE:", API_BASE_URL);

/* ============================
   TOKEN HELPERS
============================ */

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

/* ============================
   REFRESH ACCESS TOKEN
============================ */

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
}

/* ============================
   API REQUEST (SINGLE SOURCE)
============================ */

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let access = getAccessToken();

  const makeRequest = async (token: string | null) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

  let response = await makeRequest(access);

  // ✅ If token expired → try refresh
  if (response.status === 401) {
    const newAccess = await refreshAccessToken();

    if (!newAccess) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      const error: ApiError = {
        message: "Session expired",
        status: 401,
      };
      throw error;
    }

    response = await makeRequest(newAccess);
  }

  const contentType = response.headers.get("content-type");
  const data =
    contentType && contentType.includes("application/json")
      ? await response.json()
      : null;

  if (!response.ok) {
    const error: ApiError = {
      message:
        (data && data.error) ||
        (data && data.detail) ||
        "Request failed",
      status: response.status,
    };
    throw error;
  }

  return data as T;
}
