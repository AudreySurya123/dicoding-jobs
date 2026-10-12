"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { JobsNavbar } from "@/components/jobs/JobsNavbar";
import { ApiError, createVacancy, updateVacancy } from "@/lib/api";
import type { EmploymentType, MinExperience, Vacancy, VacancyInput } from "@/types/vacancy";

const positions = [
  "Android Native Developer",
  "Android Developer",
  "Backend Developer",
  "Code Reviewer",
  "Data Analyst",
  "DevOps Engineer",
  "Frontend Developer",
  "iOS Developer",
  "Machine Learning Engineer",
  "Mobile Developer",
  "Product Designer",
  "Product Engineer",
  "Product Manager",
  "QA Engineer",
  "Quality Assurance Engineer",
  "Learning Content Developer",
  "Software Engineer",
  "Software Engineer Intern",
  "Technical Writer",
  "Technical Reviewer",
];

const locations = [
  "Bandung",
  "Jakarta",
  "Surabaya",
  "Yogyakarta",
  "Tangerang",
  "Remote",
];

const employmentTypes: { value: EmploymentType; label: string }[] = [
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
  { value: "contract", label: "Kontrak" },
  { value: "internship", label: "Intern" },
];

const experiences: { value: MinExperience; label: string }[] = [
  { value: "lt_1", label: "Kurang dari 1 tahun" },
  { value: "1_3", label: "1-3 tahun" },
  { value: "4_5", label: "4-5 tahun" },
  { value: "6_10", label: "6-10 tahun" },
  { value: "gt_10", label: "Lebih dari 10 tahun" },
];

interface FormValues {
  title: string;
  position: string;
  employmentType: EmploymentType | "";
  candidatesNeeded: string;
  activeUntil: string;
  location: string;
  isRemote: boolean;
  description: string;
  salaryMin: string;
  salaryMax: string;
  showSalary: boolean;
  minExperience: MinExperience | "";
}

type FormField = keyof FormValues;

const initialValues: FormValues = {
  title: "",
  position: "",
  employmentType: "",
  candidatesNeeded: "",
  activeUntil: "",
  location: "",
  isRemote: false,
  description: "",
  salaryMin: "",
  salaryMax: "",
  showSalary: false,
  minExperience: "",
};

const baseInputClass =
  "mt-1.5 block h-10 w-full rounded border border-[#dfe2e6] bg-white px-3 text-sm text-[#343a40] outline-none transition focus:border-[#3979b8] focus:ring-2 focus:ring-[#3979b8]/15";
const errorInputClass = "border-[#dc3545] focus:border-[#dc3545] focus:ring-[#dc3545]/15";

const DescriptionEditor = dynamic(
  () => import("@/components/jobs/VacancyRichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-1.5 min-h-[230px] animate-pulse rounded border border-[#dfe2e6] bg-[#fafafa]" />
    ),
  },
);

function FieldError({ children }: { children?: ReactNode }) {
  if (!children) {
    return null;
  }

  return <p className="mt-1 text-xs text-[#c92a3a]">{children}</p>;
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-[#343a40]">
      {children} <span className="text-[#dc3545]">*</span>
    </label>
  );
}

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toVacancyInput(values: FormValues): VacancyInput {
  return {
    title: values.title.trim(),
    position: values.position,
    company_name: "Dicoding Indonesia",
    employment_type: values.employmentType as EmploymentType,
    candidates_needed: Number(values.candidatesNeeded),
    active_until: values.activeUntil,
    location: values.location,
    is_remote: values.isRemote,
    description: values.description,
    salary_min: values.salaryMin ? Number(values.salaryMin) : null,
    salary_max: values.salaryMax ? Number(values.salaryMax) : null,
    show_salary: values.showSalary,
    min_experience: values.minExperience as MinExperience,
  };
}

function getInitialValues(vacancy?: Vacancy): FormValues {
  if (!vacancy) {
    return initialValues;
  }

  return {
    title: vacancy.title,
    position: vacancy.position,
    employmentType: vacancy.employment_type,
    candidatesNeeded: String(vacancy.candidates_needed),
    activeUntil: vacancy.active_until.slice(0, 10),
    location: vacancy.location,
    isRemote: vacancy.is_remote,
    description: vacancy.description,
    salaryMin: vacancy.salary_min === null ? "" : String(vacancy.salary_min),
    salaryMax: vacancy.salary_max === null ? "" : String(vacancy.salary_max),
    showSalary: vacancy.show_salary,
    minExperience: vacancy.min_experience,
  };
}

export function CreateVacancyForm({ vacancy }: { vacancy?: Vacancy }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(() => getInitialValues(vacancy));
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: (input: VacancyInput) =>
      vacancy ? updateVacancy(vacancy.id, input) : createVacancy(input),
    onSuccess: async (savedVacancy) => {
      await queryClient.invalidateQueries({ queryKey: ["vacancies", "list"] });
      router.push(vacancy ? "/dashboard" : `/jobs/${savedVacancy.id}`);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 422 && error.validationErrors) {
        const fieldErrors: Partial<Record<FormField, string>> = {};
        const fieldMap: Record<string, FormField> = {
          title: "title",
          position: "position",
          employment_type: "employmentType",
          candidates_needed: "candidatesNeeded",
          active_until: "activeUntil",
          location: "location",
          is_remote: "isRemote",
          description: "description",
          salary_min: "salaryMin",
          salary_max: "salaryMax",
          show_salary: "showSalary",
          min_experience: "minExperience",
        };

        for (const [apiField, messages] of Object.entries(error.validationErrors)) {
          const field = fieldMap[apiField];
          const message = messages[0];
          if (field && message) {
            fieldErrors[field] = message;
          }
        }

        setErrors(fieldErrors);
        setFormError(
          Object.keys(fieldErrors).length
            ? null
            : "Data lowongan ditolak oleh server. Periksa kembali isian formulir.",
        );
        return;
      }

      setFormError(
        error instanceof Error
          ? `Lowongan gagal disimpan: ${error.message}`
          : "Lowongan gagal disimpan. Silakan coba lagi.",
      );
    },
  });

  function setField<K extends FormField>(field: K, value: FormValues[K]): void {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<FormField, string>> = {};

    if (!values.title.trim()) nextErrors.title = "Judul lowongan wajib diisi.";
    else if (values.title.trim().length > 255) {
      nextErrors.title = "Judul lowongan maksimal 255 karakter.";
    }
    if (!values.position) nextErrors.position = "Posisi wajib dipilih.";
    if (!values.employmentType) nextErrors.employmentType = "Tipe pekerjaan wajib dipilih.";

    const candidatesNeeded = Number(values.candidatesNeeded);
    if (!values.candidatesNeeded || !Number.isInteger(candidatesNeeded) || candidatesNeeded < 1) {
      nextErrors.candidatesNeeded = "Masukkan jumlah kandidat minimal 1.";
    }

    if (!values.activeUntil) {
      nextErrors.activeUntil = "Tanggal aktif wajib diisi.";
    } else if (values.activeUntil < getTomorrowDate()) {
      nextErrors.activeUntil = "Tanggal aktif harus setelah hari ini.";
    }

    if (!values.location) nextErrors.location = "Lokasi wajib dipilih.";
    if (!values.description.replace(/<[^>]*>/g, "").trim()) {
      nextErrors.description = "Deskripsi pekerjaan wajib diisi.";
    }
    if (!values.salaryMin || !Number.isInteger(Number(values.salaryMin))) {
      nextErrors.salaryMin = "Masukkan gaji minimum.";
    } else if (Number(values.salaryMin) < 0) {
      nextErrors.salaryMin = "Gaji minimum tidak boleh negatif.";
    }
    if (values.salaryMax && !Number.isInteger(Number(values.salaryMax))) {
      nextErrors.salaryMax = "Gaji maksimum harus berupa angka bulat.";
    } else if (
      values.salaryMax &&
      values.salaryMin &&
      Number(values.salaryMax) < Number(values.salaryMin)
    ) {
      nextErrors.salaryMax = "Gaji maksimum harus sama atau lebih besar dari gaji minimum.";
    }
    if (!values.minExperience) nextErrors.minExperience = "Pengalaman kerja wajib dipilih.";

    setErrors(nextErrors);
    setFormError(null);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (validate()) {
      saveMutation.mutate(toVacancyInput(values));
    }
  }

  const inputClass = (field: FormField) =>
    `${baseInputClass} ${errors[field] ? errorInputClass : ""}`;

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#292d32]">
      <JobsNavbar />
      <div className="mx-auto max-w-[920px] px-5 pb-14 pt-8">
        <div className="mb-7">
          <p className="text-sm text-[#69717d]">Dashboard recruiter</p>
          <h1 className="mt-1 text-2xl font-semibold">
            {vacancy ? "Edit lowongan" : "Buat lowongan"}
          </h1>
          <p className="mt-1 text-sm text-[#69717d]">
            {vacancy
              ? "Perbarui informasi pekerjaan yang dipublikasikan."
              : "Isi informasi pekerjaan yang ingin kamu publikasikan."}
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="mx-auto max-w-[600px] rounded-md border border-[#e6e8eb] bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="space-y-5">
            <div>
              <FieldLabel htmlFor="title">Judul lowongan</FieldLabel>
              <input
                id="title"
                name="title"
                value={values.title}
                onChange={(event) => setField("title", event.target.value)}
                placeholder="Masukkan judul lowongan"
                maxLength={255}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : "title-help"}
                className={inputClass("title")}
              />
              {errors.title ? (
                <div id="title-error"><FieldError>{errors.title}</FieldError></div>
              ) : (
                <p id="title-help" className="mt-1 text-xs text-[#7a818b]">
                  Contoh: Android Native Developer
                </p>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="position">Posisi</FieldLabel>
              <select
                id="position"
                name="position"
                value={values.position}
                onChange={(event) => setField("position", event.target.value)}
                aria-invalid={Boolean(errors.position)}
                className={inputClass("position")}
              >
                <option value="">Pilih posisi yang dicari</option>
                {positions.map((position) => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
              <FieldError>{errors.position}</FieldError>
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-[#343a40]">
                Tipe pekerjaan <span className="text-[#dc3545]">*</span>
              </legend>
              <div className="mt-2 space-y-2">
                {employmentTypes.map((type) => (
                  <label key={type.value} className="flex w-fit items-center gap-2 text-sm text-[#535a64]">
                    <input
                      type="radio"
                      name="employmentType"
                      value={type.value}
                      checked={values.employmentType === type.value}
                      onChange={() => setField("employmentType", type.value)}
                      className="h-4 w-4 accent-[#304153]"
                    />
                    {type.label}
                  </label>
                ))}
              </div>
              <FieldError>{errors.employmentType}</FieldError>
            </fieldset>

            <div>
              <FieldLabel htmlFor="candidatesNeeded">Kandidat yang dibutuhkan</FieldLabel>
              <input
                id="candidatesNeeded"
                name="candidates_needed"
                type="number"
                min={1}
                step={1}
                value={values.candidatesNeeded}
                onChange={(event) => setField("candidatesNeeded", event.target.value)}
                placeholder="Masukkan jumlah kandidat yang dibutuhkan"
                aria-invalid={Boolean(errors.candidatesNeeded)}
                className={inputClass("candidatesNeeded")}
              />
              <FieldError>{errors.candidatesNeeded}</FieldError>
            </div>

            <div>
              <FieldLabel htmlFor="activeUntil">Aktif hingga</FieldLabel>
              <input
                id="activeUntil"
                name="active_until"
                type="date"
                value={values.activeUntil}
                onChange={(event) => setField("activeUntil", event.target.value)}
                aria-invalid={Boolean(errors.activeUntil)}
                className={inputClass("activeUntil")}
              />
              <FieldError>{errors.activeUntil}</FieldError>
            </div>

            <div>
              <FieldLabel htmlFor="location">Lokasi</FieldLabel>
              <select
                id="location"
                name="location"
                value={values.location}
                onChange={(event) => {
                  const isRemote = event.target.value === "Remote";
                  setValues((current) => ({
                    ...current,
                    location: event.target.value,
                    isRemote,
                  }));
                  setErrors((current) => ({ ...current, location: undefined }));
                  setFormError(null);
                }}
                aria-invalid={Boolean(errors.location)}
                className={inputClass("location")}
              >
                <option value="">Pilih lokasi</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <FieldError>{errors.location}</FieldError>
              <label className="mt-2 flex w-fit items-center gap-2 text-sm text-[#535a64]">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={values.isRemote}
                  onChange={(event) => setField("isRemote", event.target.checked)}
                  className="h-4 w-4 accent-[#304153]"
                />
                Bisa remote
              </label>
            </div>

            <div>
              <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
              <DescriptionEditor
                onChange={(html) => setField("description", html)}
                error={errors.description}
                initialContent={vacancy?.description}
              />
              <p className="mt-1 text-xs text-[#7a818b]">
                Kamu bisa mengubah format deskripsi sesuai kebutuhan.
              </p>
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-[#343a40]">
                Rentang gaji per bulan <span className="text-[#dc3545]">*</span>
              </legend>
              <div className="mt-1.5 grid grid-cols-[auto_1fr_auto_1fr] items-center gap-2">
                <span className="text-sm text-[#535a64]">Rp</span>
                <input
                  aria-label="Gaji minimum"
                  name="salary_min"
                  type="number"
                  min={0}
                  step={1}
                  value={values.salaryMin}
                  onChange={(event) => setField("salaryMin", event.target.value)}
                  placeholder="Minimum"
                  aria-invalid={Boolean(errors.salaryMin)}
                  className={`h-10 min-w-0 rounded border border-[#dfe2e6] px-3 text-sm outline-none focus:border-[#3979b8] ${errors.salaryMin ? errorInputClass : ""}`}
                />
                <span className="text-sm text-[#535a64]">Rp</span>
                <input
                  aria-label="Gaji maksimum (opsional)"
                  name="salary_max"
                  type="number"
                  min={0}
                  step={1}
                  value={values.salaryMax}
                  onChange={(event) => setField("salaryMax", event.target.value)}
                  placeholder="Maksimum (opsional)"
                  aria-invalid={Boolean(errors.salaryMax)}
                  className={`h-10 min-w-0 rounded border border-[#dfe2e6] px-3 text-sm outline-none focus:border-[#3979b8] ${errors.salaryMax ? errorInputClass : ""}`}
                />
              </div>
              <FieldError>{errors.salaryMin}</FieldError>
              <FieldError>{errors.salaryMax}</FieldError>
              <p className="mt-1 text-xs text-[#7a818b]">
                Kamu dapat mengosongkan kolom maksimum jika tidak ada batas gaji.
              </p>
              <label className="mt-3 flex w-fit items-center gap-2 text-sm text-[#535a64]">
                <input
                  type="checkbox"
                  name="show_salary"
                  checked={values.showSalary}
                  onChange={(event) => setField("showSalary", event.target.checked)}
                  className="h-4 w-4 accent-[#304153]"
                />
                Tampilkan gaji
              </label>
              <p className="mt-1 text-xs text-[#7a818b]">
                Gaji akan ditampilkan di lowongan pekerjaan dan dapat dilihat oleh kandidat.
              </p>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-medium text-[#343a40]">
                Minimum pengalaman bekerja <span className="text-[#dc3545]">*</span>
              </legend>
              <div className="mt-2 space-y-2">
                {experiences.map((experience) => (
                  <label key={experience.value} className="flex w-fit items-center gap-2 text-sm text-[#535a64]">
                    <input
                      type="radio"
                      name="min_experience"
                      value={experience.value}
                      checked={values.minExperience === experience.value}
                      onChange={() => setField("minExperience", experience.value)}
                      className="h-4 w-4 accent-[#304153]"
                    />
                    {experience.label}
                  </label>
                ))}
              </div>
              <FieldError>{errors.minExperience}</FieldError>
            </fieldset>

            {formError && (
              <p role="alert" className="rounded border border-[#f2c6cc] bg-[#fff7f8] px-3 py-2 text-sm text-[#842536]">
                {formError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-[#eceef0] pt-5">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="rounded-sm bg-[#304153] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#243343] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveMutation.isPending
                  ? "Menyimpan..."
                  : vacancy
                    ? "Simpan perubahan"
                    : "Buat lowongan"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-sm border border-[#dfe2e6] bg-white px-4 py-2.5 text-sm text-[#535a64] hover:bg-[#f6f7f8]"
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
