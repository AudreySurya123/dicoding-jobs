"use client";

import Link from "next/link";
import { formatIndonesianDate, getEmploymentTypeLabel, getMinExperienceLabel } from "@/lib/vacancy-formatters";
import type { Vacancy } from "@/types/vacancy";

interface JobCardProps {
  vacancy: Vacancy;
  variant: "public" | "dashboard";
  onEdit?: (vacancy: Vacancy) => void;
  onDelete?: (vacancy: Vacancy) => void;
  actionsDisabled?: boolean;
}

function CompanyMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-label="Dicoding"
      className={`flex shrink-0 items-center justify-center rounded-sm bg-[#304153] font-semibold tracking-tight text-white ${
        compact ? "h-[52px] w-[52px] text-lg" : "h-20 w-20 text-[13px]"
      }`}
    >
      {compact ? (
        <span className="text-2xl leading-none">D</span>
      ) : (
        <>
          dicoding
          <span className="ml-0.5 flex h-3 w-3 items-center justify-center border border-white text-[9px] leading-none">
            9
          </span>
        </>
      )}
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0">
      <path d="M2.5 13.5h11M4 13.5V3.25h5.5V13.5M9.5 6h2.5v7.5M6 5.5h1.5M6 8h1.5M6 10.5h1.5M11 8h.5M11 10h.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0">
      <path d="M13 6.75c0 3.5-5 7.25-5 7.25S3 10.25 3 6.75a5 5 0 1 1 10 0Z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="6.75" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ExperienceIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0">
      <rect x="2.25" y="5" width="11.5" height="8.25" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.25 5V3.75c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1V5M2.5 8.25h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0">
      <rect x="2.25" y="3.5" width="11.5" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 2.5v2M11 2.5v2M2.5 6.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
      <path d="m9.5 3.25 3.25 3.25M2.5 13.5l3.1-.65 7.45-7.45a1.4 1.4 0 0 0-1.95-1.95L3.65 10.9 2.5 13.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
      <path d="M3.5 4.5h9M6 4.5V3h4v1.5m1.5 0-.5 8h-6l-.5-8M6.5 7v3.5M9.5 7v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function JobCard({
  vacancy,
  variant,
  onEdit,
  onDelete,
  actionsDisabled = false,
}: JobCardProps) {
  if (variant === "dashboard") {
    return (
      <article className="flex flex-col gap-3 rounded-md border border-[#dee0e3] bg-white p-3 sm:flex-row sm:items-start sm:gap-3">
        <CompanyMark compact />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#343a40]">{vacancy.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#60646c]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon />
              Dibuat: {formatIndonesianDate(vacancy.created_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon />
              Aktif hingga: {formatIndonesianDate(vacancy.active_until)}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(vacancy)}
              disabled={actionsDisabled}
              className="inline-flex items-center gap-1.5 border border-[#dee0e3] bg-[#fafafa] px-2.5 py-1.5 text-xs text-[#4a4e55] transition-colors hover:bg-[#f1f2f3] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <EditIcon />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(vacancy)}
              disabled={actionsDisabled}
              className="inline-flex items-center gap-1.5 rounded-sm bg-[#f8c6ce] px-2.5 py-1.5 text-xs text-[#c62c46] transition-colors hover:bg-[#f3b5bf] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <DeleteIcon />
              Hapus
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-4 rounded-md border border-[#dee0e3] bg-white p-3.5 sm:flex-row sm:items-center sm:gap-4">
      <CompanyMark />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-[#292d32]">
          <Link className="transition-colors hover:text-[#2563eb]" href={`/jobs/${vacancy.id}`}>
            {vacancy.title}
          </Link>
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#343a40]">
          <span className="inline-flex items-center gap-1.5">
            <BuildingIcon />
            {vacancy.company_name}
          </span>
          <span>{getEmploymentTypeLabel(vacancy.employment_type)}</span>
          <span className="inline-flex items-center gap-1.5">
            <LocationIcon />
            {vacancy.is_remote ? "Remote" : vacancy.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ExperienceIcon />
            {getMinExperienceLabel(vacancy.min_experience)}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-xs leading-6 text-[#60646c] sm:min-w-[190px] sm:text-right">
        <p>Dibuat pada {formatIndonesianDate(vacancy.created_at)}</p>
        <p>Lamar sebelum {formatIndonesianDate(vacancy.active_until)}</p>
      </div>
    </article>
  );
}
