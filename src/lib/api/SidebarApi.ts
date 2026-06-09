import { api } from "@/lib/Axios";
import type { SidebarItem } from "@/features/sidebar/SidebarTypes";
import type { ApiResponse } from "@/lib/api/ApiResponse";

export async function fetchSidebarApi(): Promise<SidebarItem[]> {
  const response = await api.get<ApiResponse<SidebarItem[]>>("/api/menus");
  return response.data.data ?? [];
}
