import axios from "axios";
import type { BackendApiResponse } from "@/lib/env";
import { API_BASE_URL } from "@/lib/env";

export type StaffListItem = {
  staffId: string;
  staffName: string;
  departmentName: string;
  staffRankCode: string;
  staffPhone: string;
  staffExtensionNo: string | null;
  staffStatus: string;
  photoKey: string | null;
  photoUrl: string | null;
};

export type DepartmentOption = {
  departmentId: string;
  departmentName: string;
};

export type StaffCreatePayload = {
  staffId: string;
  password: string;
  staffName: string;
  staffType: string;
  staffRoleCode: string;
  staffDepartmentId: string;
  staffRankCode: string;
  staffPositionCode?: string | null;
  staffPhone: string;
  staffExtensionNo?: string | null;
  staffEmail?: string | null;
  staffBirthDate: string;
  staffLicenseNo?: string | null;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export async function fetchStaffListApi(params?: {
  searchType?: string;
  keyword?: string;
}): Promise<StaffListItem[]> {
  const res = await api.get<BackendApiResponse<StaffListItem[]>>("/api/admin/staff", {
    params,
  });

  if (!res.data.success) {
    throw new Error(res.data.message || "직원 목록 조회에 실패했습니다.");
  }

  return res.data.data ?? [];
}

export async function fetchDepartmentsApi(): Promise<DepartmentOption[]> {
  const res = await api.get<BackendApiResponse<DepartmentOption[]>>(
    "/api/admin/staff/departments",
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "부서 목록 조회에 실패했습니다.");
  }

  return res.data.data ?? [];
}

export async function createStaffApi(
  payload: StaffCreatePayload,
  photoFile?: File | null,
): Promise<StaffListItem> {
  const formData = new FormData();
  formData.append("staff", JSON.stringify(payload));
  if (photoFile) {
    formData.append("file", photoFile);
  }

  const res = await api.post<BackendApiResponse<StaffListItem>>(
    "/api/admin/staff",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "직원 등록에 실패했습니다.");
  }

  return res.data.data;
}
