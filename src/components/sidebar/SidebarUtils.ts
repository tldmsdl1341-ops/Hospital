import type { SidebarItem } from "@/features/sidebar/SidebarTypes";

export function isItemActive(
  pathname: string,
  path: string | null | undefined,
  hasChildren: boolean,
): boolean {
  if (!path) return false;
  if (pathname === path) return true;
  if (hasChildren && pathname.startsWith(`${path}/`)) return true;
  return false;
}

export function hasActiveChild(pathname: string, item: SidebarItem): boolean {
  if (!item.children?.length) return false;

  return item.children.some(
    (child) =>
      isItemActive(pathname, child.path, !!child.children?.length) ||
      hasActiveChild(pathname, child),
  );
}

export function getOpenIds(pathname: string, items: SidebarItem[]): number[] {
  const openIds: number[] = [];

  for (const item of items) {
    if (item.children?.length && hasActiveChild(pathname, item)) {
      openIds.push(item.id);
    }
    if (item.children?.length) {
      openIds.push(...getOpenIds(pathname, item.children));
    }
  }

  return openIds;
}
