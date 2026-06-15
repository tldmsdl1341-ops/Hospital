import { SEAWEEDFS_PUBLIC_BASE_URL } from "@/lib/env";

const LOCALHOST_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;

export function resolveStorageUrl(url?: string | null): string {
  if (!url) {
    return "";
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (LOCALHOST_PATTERN.test(trimmed)) {
      const pathStart = trimmed.indexOf("/", trimmed.indexOf("//") + 2);
      if (pathStart >= 0) {
        return `${normalizeBase(SEAWEEDFS_PUBLIC_BASE_URL)}${trimmed.substring(pathStart)}`;
      }
    }
    return trimmed;
  }

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${normalizeBase(SEAWEEDFS_PUBLIC_BASE_URL)}${path}`;
}

function normalizeBase(base: string): string {
  return base.endsWith("/") ? base.slice(0, -1) : base;
}
