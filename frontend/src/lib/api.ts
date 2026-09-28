// ==============================================================================
// Creda Frontend API Client
// Standardized client connecting Next.js UI to FastAPI Backend
// ==============================================================================

const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const trimmed = envUrl.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = getApiBaseUrl();

export interface User {
  id: string;
  email: string;
  name?: string | null;
  professional_title?: string | null;
  location?: string | null;
  years_experience?: number | null;
  bio?: string | null;
  avatar_url?: string | null;
  public_url?: string | null;
  is_public?: boolean;
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileResponse extends User {
  completeness_percentage: number;
  total_skills: number;
  total_evidence: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface PublicSkillCitation {
  evidence_type: string;
  title?: string | null;
  confidence_score?: number | null;
}

export interface PublicSkillItem {
  id: string;
  name: string;
  level: string;
  confidence: number;
  evidence_count: number;
  citations: PublicSkillCitation[];
}

export interface PublicEvidenceItem {
  id: string;
  type: string;
  title?: string | null;
  description?: string | null;
  source_url?: string | null;
  created_at?: string;
}

export interface SkillPassportResponse {
  id: string;
  name?: string | null;
  professional_title?: string | null;
  location?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  years_experience?: number | null;
  public_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  verified_skills_count: number;
  average_confidence: number;
  is_creda_verified: boolean;
  skills: PublicSkillItem[];
  evidence: PublicEvidenceItem[];
}

export interface SkillsSummaryResponse {
  completeness_percentage: number;
  total_skills: number;
  skills_by_level: Record<string, number>;
  average_confidence: number;
  total_evidence: number;
  evidence_by_type: Record<string, number>;
}

export interface JobMatchSkill {
  name: string;
  category?: string;
  user_level?: string | null;
  required_level?: string | null;
  confidence?: number | null;
  status: "match" | "missing";
  importance: "required" | "preferred";
}

export interface JobMatchResponse {
  id: string;
  user_id: string;
  job_title: string;
  job_description: string;
  match_percentage: number;
  matching_skills: JobMatchSkill[];
  missing_skills: JobMatchSkill[];
  recommendations: string;
  created_at: string;
}

class ApiClient {
  private getHeaders(contentType: string | null = "application/json"): HeadersInit {
    const headers: Record<string, string> = {};
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("creda_token") ||
        localStorage.getItem("creda_auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${formattedEndpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(
          options.body instanceof FormData ? null : "application/json"
        ),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      const error: any = new Error(
        errorData.detail || errorData.message || "An unexpected error occurred"
      );
      error.status = response.status;
      error.detail = errorData.detail || errorData.message;
      throw error;
    }

    return response.json();
  }

  // Auth Endpoints
  async signup(data: {
    email: string;
    password: string;
    name?: string;
    professional_title?: string;
    location?: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("creda_token");
        localStorage.removeItem("creda_auth_token");
        sessionStorage.clear();
      }
    }
  }

  // Profile Endpoints
  async getUserProfile(): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>("/user/profile");
  }

  async updateUserProfile(
    data: Partial<User>
  ): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getSkillsSummary(): Promise<SkillsSummaryResponse> {
    return this.request<SkillsSummaryResponse>("/user/skills-summary");
  }

  // Public Passport Endpoint (no auth required)
  async getPublicPassport(identifier: string): Promise<SkillPassportResponse> {
    const formattedId = encodeURIComponent(identifier.trim());
    return this.request<SkillPassportResponse>(`/passport/${formattedId}`);
  }

  // Public Passport Directory Endpoint (for recruiter discovery)
  async getPublicPassportDirectory(limit: number = 50): Promise<any[]> {
    return this.request<any[]>(`/passport/directory?limit=${limit}`);
  }

  // Evidence Endpoints
  async uploadCV(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    return this.request("/evidence/upload-cv", {
      method: "POST",
      body: formData,
    });
  }

  async connectGitHub(username: string): Promise<any> {
    return this.request("/evidence/github", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  }

  async addProject(project: {
    title: string;
    description?: string;
    technologies?: string[];
    github_url?: string;
    live_url?: string;
  }): Promise<any> {
    return this.request("/evidence/project", {
      method: "POST",
      body: JSON.stringify(project),
    });
  }

  async getEvidence(type?: string): Promise<any> {
    const query = type ? `?type=${encodeURIComponent(type)}` : "";
    return this.request(`/evidence${query}`);
  }

  // Skills Endpoints
  async extractSkills(): Promise<any> {
    return this.request("/skills/extract", { method: "POST" });
  }

  async getSkills(): Promise<any> {
    return this.request("/skills");
  }

  // Job Matching Endpoints
  async matchJob(
    job_title: string,
    job_description: string
  ): Promise<JobMatchResponse> {
    return this.request<JobMatchResponse>("/jobs/match", {
      method: "POST",
      body: JSON.stringify({ job_title, job_description }),
    });
  }

  async getJobMatches(): Promise<any> {
    return this.request("/jobs/matches");
  }
}

export const api = new ApiClient();
