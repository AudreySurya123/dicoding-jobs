import type { EmploymentType, MinExperience } from "@/types/vacancy";

const employmentTypeLabels: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Kontrak",
  internship: "Magang",
};

const minExperienceLabels: Record<MinExperience, string> = {
  lt_1: "Kurang dari 1 tahun",
  "1_3": "1-3 tahun",
  "4_5": "4-5 tahun",
  "6_10": "6-10 tahun",
  gt_10: "Lebih dari 10 tahun",
};

export function getEmploymentTypeLabel(value: EmploymentType): string {
  return employmentTypeLabels[value];
}

export function getMinExperienceLabel(value: MinExperience): string {
  return minExperienceLabels[value];
}

export function formatIndonesianDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid date: ${value}`);
  }

  const isDateOnly = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(isDateOnly && { timeZone: "UTC" }),
  }).format(date);
}
