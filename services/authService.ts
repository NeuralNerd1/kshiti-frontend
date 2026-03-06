import { apiRequest } from "./apiClient";

const BASE_AUTH_URL = "/auth";

export type LoginPayload = {
  company_slug: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  status: "success";
  access: string;
  refresh?: string;
  user: {
    id: number;
    email: string;
  };
  company: {
    id: number;
    name: string;
    slug: string;
  };
};

export type SessionResponse =
  | {
    authenticated: true;
    user_id: number;
    email: string;
    company_id: number;
    company_slug: string;
    display_name: string;
    avatar_url: string | null;
  }
  | {
    authenticated: false;
  };

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(`${BASE_AUTH_URL}/login/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getSession(): Promise<SessionResponse> {
  return apiRequest<SessionResponse>(`${BASE_AUTH_URL}/session/`, {
    method: "GET",
  });
}

export async function logout(): Promise<{ status: string }> {
  return apiRequest<{ status: string }>(`${BASE_AUTH_URL}/logout/`, {
    method: "POST",
  });
}

export async function resetPassword(payload: {
  email: string;
  new_password: string;
}): Promise<{ status: string }> {
  return apiRequest<{ status: string }>(
    `${BASE_AUTH_URL}/reset-password/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
