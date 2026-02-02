import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDateISO(d);
}

export function daysUntil(date: string | Date): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.substring(0, len) + "...";
}

export function starRatingLabel(stars: number): string {
  if (stars >= 5) return "Luxury";
  if (stars >= 4) return "Premium";
  if (stars >= 3) return "Comfort";
  return "Budget";
}
