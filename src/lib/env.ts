export type BackendApiResponse<T> = {
  success: boolean;
  message: string | null;
  data: T;
  timestamp?: string;
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:9695";

export const STORAGE_PROFILE =
  process.env.NEXT_PUBLIC_STORAGE_PROFILE?.trim() || "team";

export const SEAWEEDFS_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_SEAWEEDFS_PUBLIC_BASE_URL?.trim() ||
  "http://192.168.1.128:8888";
