import type {
  ApiResource,
  PaginatedResponse,
  Vacancy,
  VacancyInput,
} from "@/types/vacancy";

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface RecruiterUser {
  id: number;
  name: string;
  email: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly validationErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL must be set to use the API client.");
  }

  return baseUrl.replace(/\/+$/, "");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  headers.set("Accept", "application/json");
  if (init?.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const method = (init?.method ?? "GET").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && typeof document !== "undefined") {
    await ensureCsrfCookie();
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (!xsrfToken) {
      throw new Error("Sanctum CSRF cookie is missing; check API cookie and CORS configuration.");
    }
    headers.set("X-XSRF-TOKEN", decodeURIComponent(xsrfToken));
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const responseText = await response.text();
    let errorBody: ApiErrorResponse = {};

    if (responseText) {
      try {
        errorBody = JSON.parse(responseText) as ApiErrorResponse;
      } catch {
        errorBody = { message: responseText };
      }
    }

    throw new ApiError(
      errorBody.message ?? response.statusText,
      response.status,
      errorBody.errors,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function getCookie(name: string): string | undefined {
  const prefix = `${name}=`;
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);
}

async function ensureCsrfCookie(): Promise<void> {
  if (getCookie("XSRF-TOKEN")) {
    return;
  }

  const response = await fetch(`${getApiBaseUrl()}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new ApiError("Could not initialize the Sanctum CSRF session.", response.status);
  }
}

export async function loginRecruiter(credentials: {
  email: string;
  password: string;
}): Promise<RecruiterUser> {
  const response = await request<ApiResource<RecruiterUser>>("/api/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  return response.data;
}

export async function getCurrentUser(): Promise<RecruiterUser> {
  const response = await request<ApiResource<RecruiterUser>>("/api/user");
  return response.data;
}

export async function getOptionalCurrentUser(): Promise<RecruiterUser | null> {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function logoutRecruiter(): Promise<void> {
  return request<void>("/api/logout", { method: "POST" });
}

export async function getVacancies(
  search?: string,
  page = 1,
): Promise<PaginatedResponse<Vacancy>> {
  const query = new URLSearchParams({ page: String(page) });
  if (search?.trim()) {
    query.set("search", search.trim());
  }

  return request<PaginatedResponse<Vacancy>>(`/api/vacancies?${query}`);
}

export async function getVacanciesPage(page = 1): Promise<PaginatedResponse<Vacancy>> {
  return getVacancies(undefined, page);
}

export async function getVacancy(id: number | string): Promise<Vacancy> {
  const response = await request<ApiResource<Vacancy>>(
    `/api/vacancies/${encodeURIComponent(id)}`,
  );

  return response.data;
}

export async function createVacancy(input: VacancyInput): Promise<Vacancy> {
  const response = await request<ApiResource<Vacancy>>("/api/vacancies", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}

export async function updateVacancy(
  id: number | string,
  input: Partial<VacancyInput>,
): Promise<Vacancy> {
  const response = await request<ApiResource<Vacancy>>(
    `/api/vacancies/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

  return response.data;
}

export async function deleteVacancy(id: number | string): Promise<void> {
  return request<void>(`/api/vacancies/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
