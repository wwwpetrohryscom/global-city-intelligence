import { cities } from "@/lib/data/cities";
import { dataSources } from "@/lib/data/sources";
import type { MetricVerificationStatus } from "@/types";

export interface ValidationIssue {
  level: "error" | "warning";
  message: string;
}

export class ValidationReport {
  private readonly issues: ValidationIssue[] = [];

  addError(message: string): void {
    this.issues.push({ level: "error", message });
  }

  addWarning(message: string): void {
    this.issues.push({ level: "warning", message });
  }

  errors(): ValidationIssue[] {
    return this.issues.filter((issue) => issue.level === "error");
  }

  warnings(): ValidationIssue[] {
    return this.issues.filter((issue) => issue.level === "warning");
  }

  hasErrors(): boolean {
    return this.errors().length > 0;
  }

  throwIfErrors(prefix: string): void {
    if (!this.hasErrors()) {
      return;
    }
    const list = this.errors()
      .map((issue) => `  - ${issue.message}`)
      .join("\n");
    throw new Error(`${prefix}\n${list}`);
  }
}

export function assertCityExists(citySlug: string, report: ValidationReport): void {
  const city = cities.find((entry) => entry.slug === citySlug);
  if (!city) {
    report.addError(`Unknown citySlug "${citySlug}"`);
  }
}

export function assertCityCountryMatches(
  citySlug: string,
  countrySlug: string,
  report: ValidationReport,
): void {
  const city = cities.find((entry) => entry.slug === citySlug);
  if (city && city.countrySlug !== countrySlug) {
    report.addError(
      `City "${citySlug}" is in country "${city.countrySlug}" but record claims "${countrySlug}"`,
    );
  }
}

export function assertSourceIdsExist(
  sourceIds: string[],
  report: ValidationReport,
): void {
  const known = new Set(dataSources.map((source) => source.id));
  for (const id of sourceIds) {
    if (!known.has(id)) {
      report.addError(`Unknown sourceId "${id}"`);
    }
  }
}

export function assertFinitePositive(
  value: number | undefined,
  field: string,
  report: ValidationReport,
): void {
  if (value === undefined) {
    return;
  }
  if (!Number.isFinite(value) || value < 0) {
    report.addError(
      `Field "${field}" must be a finite, non-negative number; got ${String(value)}`,
    );
  }
}

const VALID_STATUSES: ReadonlySet<MetricVerificationStatus> = new Set([
  "verified",
  "partial",
  "unavailable",
]);

export function assertVerificationStatus(
  status: string,
  report: ValidationReport,
): void {
  if (!VALID_STATUSES.has(status as MetricVerificationStatus)) {
    report.addError(`Invalid verificationStatus "${status}"`);
  }
}

export function assertNonEmptyString(
  value: string | undefined,
  field: string,
  report: ValidationReport,
): void {
  if (!value || value.trim().length === 0) {
    report.addError(`Field "${field}" must be a non-empty string`);
  }
}
