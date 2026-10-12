export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship";

export type MinExperience = "lt_1" | "1_3" | "4_5" | "6_10" | "gt_10";

export interface Vacancy {
  id: number;
  title: string;
  position: string;
  company_name: string;
  employment_type: EmploymentType;
  candidates_needed: number;
  active_until: string;
  location: string;
  is_remote: boolean;
  description: string;
  salary_min: number | null;
  salary_max: number | null;
  show_salary: boolean;
  min_experience: MinExperience;
  created_at: string;
  updated_at: string;
}

export interface VacancyInput {
  title: string;
  position: string;
  company_name?: string;
  employment_type: EmploymentType;
  candidates_needed: number;
  active_until: string;
  location: string;
  is_remote: boolean;
  description: string;
  salary_min?: number | null;
  salary_max?: number | null;
  show_salary: boolean;
  min_experience: MinExperience;
}

export interface ApiResource<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}
