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
  account_type?: "talent" | "recruiter";
  name?: string | null;
  professional_title?: string | null;
  location?: string | null;
  country?: string | null;
  city?: string | null;
  primary_field?: string | null;
  years_experience?: number | null;
  availability?: "available_now" | "open_to_offers" | "not_looking" | string | null;
  available_from?: string | null;
  work_preferences?: string | null;
  visibility?: "discoverable" | "hidden" | string | null;
  evidence_visibility?: "public" | "hiring_teams_only" | "private" | string | null;
  bio?: string | null;
  avatar_url?: string | null;
  public_url?: string | null;
  is_public?: boolean;
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;

  // Hiring Team Fields
  company_name?: string | null;
  company_website?: string | null;
  company_logo?: string | null;
  hiring_role?: string | null;
  team_size?: string | null;
  verification_status?: string | null;

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
  evidence_status?: "self_declared" | "moderate" | "strong" | string;
  assessment_score?: number | null;
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
  country?: string | null;
  city?: string | null;
  primary_field?: string | null;
  availability?: string | null;
  available_from?: string | null;
  work_preferences?: string | null;
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
  confidence?: number;
  is_match?: boolean;
}

export interface JobMatchResponse {
  job_title: string;
  match_percentage: number;
  matching_skills: JobMatchSkill[];
  missing_skills: JobMatchSkill[];
  recommendations?: string;
}

export interface InterviewRequestItem {
  id: string;
  recruiter_id: string;
  talent_id: string;
  talent_name?: string | null;
  talent_title?: string | null;
  talent_avatar?: string | null;
  talent_location?: string | null;
  talent_slug?: string | null;
  talent_email?: string | null;
  recruiter_name?: string | null;
  recruiter_role?: string | null;
  company_name: string;
  company_website?: string | null;
  role_title: string;
  work_type?: string | null;
  compensation?: string | null;
  message: string;
  status: "pending" | "accepted" | "declined" | string;
  talent_response_note?: string | null;
  created_at: string;
}

export interface HiringRequestItem {
  id: string;
  role_title: string;
  company_name: string;
  location: string;
  employment_type: string;
  required_skills: string;
  nice_to_have_skills?: string | null;
  experience_years: number;
  status: string;
  created_at: string;
}

export interface HiringMatchResult {
  talent_id: string;
  talent_name: string;
  talent_title: string;
  talent_avatar?: string | null;
  talent_location: string;
  talent_slug: string;
  availability: string;
  match_score: number;
  evidence_coverage: string;
  matching_proven_skills: string[];
  matching_self_declared: string[];
  missing_skills: string[];
  gap_explanation: string;
  repos_audited: number;
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem("creda_token") ||
      localStorage.getItem("creda_auth_token") ||
      null
    );
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        const error = new Error(
          errorData.detail || errorData.message || "An API error occurred"
        ) as any;
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (err: any) {
      if (!err.status && err.message === "Failed to fetch") {
        console.warn(`[Creda API] Backend unreachable at ${url}`);
      }
      throw err;
    }
  }

  // Authentication Endpoints
  async signup(data: {
    email: string;
    password: string;
    name?: string;
    account_type?: "talent" | "recruiter";
    professional_title?: string;
    location?: string;
    country?: string;
    city?: string;
    primary_field?: string;
    years_experience?: number;
    availability?: string;
    work_preferences?: string;
    company_name?: string;
    company_website?: string;
    hiring_role?: string;
    team_size?: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(
    emailOrData: string | { email: string; password: string },
    maybePassword?: string
  ): Promise<AuthResponse> {
    let email: string;
    let password: string;
    if (typeof emailOrData === "object" && emailOrData !== null) {
      email = emailOrData.email;
      password = emailOrData.password;
    } else {
      email = emailOrData;
      password = maybePassword || "";
    }
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

  async addExternalEvidence(data: {
    type: string; // 'portfolio' | 'figma' | 'security_report' | 'dataset_project' | 'certification' | 'external_link'
    title: string;
    url: string;
    description?: string;
  }): Promise<any> {
    return this.request("/evidence/project", {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        live_url: data.url,
        description: data.description || `${data.type} evidence link`,
        technologies: [data.type],
      }),
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

  // ── Closed Loop: Interview Requests & Offers ────────────────
  async createInterviewRequest(data: {
    talent_id: string;
    company_name: string;
    role_title: string;
    work_type?: string;
    compensation?: string;
    message: string;
  }): Promise<{ message: string; request_id: string; status: string }> {
    return this.request("/recruiter/requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getRecruiterRequests(): Promise<InterviewRequestItem[]> {
    return this.request<InterviewRequestItem[]>("/recruiter/requests");
  }

  async getTalentRequests(): Promise<InterviewRequestItem[]> {
    return this.request<InterviewRequestItem[]>("/talent/requests");
  }

  async respondToInterviewRequest(
    requestId: string,
    action: "accept" | "decline",
    responseNote?: string
  ): Promise<{ message: string; request_id: string; status: string }> {
    return this.request(`/talent/requests/${requestId}/respond`, {
      method: "POST",
      body: JSON.stringify({ action, response_note: responseNote }),
    });
  }

  // ── Hiring Requests & Gap Matching ───────────────────────────
  async createHiringRequest(data: {
    role_title: string;
    company_name?: string;
    location?: string;
    employment_type?: string;
    required_skills: string;
    nice_to_have_skills?: string;
    experience_years?: number;
  }): Promise<any> {
    return this.request("/recruiter/hiring-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getHiringRequests(): Promise<HiringRequestItem[]> {
    return this.request<HiringRequestItem[]>("/recruiter/hiring-requests");
  }

  async matchHiringRequest(
    requestId: string
  ): Promise<{
    hiring_request_id: string;
    role_title: string;
    total_candidates_analyzed: number;
    matches: HiringMatchResult[];
  }> {
    return this.request(`/recruiter/hiring-requests/${requestId}/matches`, {
      method: "POST",
    });
  }
}

export const api = new ApiClient();
