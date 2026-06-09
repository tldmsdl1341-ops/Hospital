export type SidebarItem = {
  id: number;
  code: string;
  name: string;
  path: string | null;
  icon: string | null;
  children: SidebarItem[];
};
