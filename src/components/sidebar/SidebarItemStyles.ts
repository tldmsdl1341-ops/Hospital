import type { SxProps, Theme } from "@mui/material";

export const childDotIconSx: SxProps<Theme> = {
  fontSize: 8,
};

export function getItemIconSx(depth: number): SxProps<Theme> {
  return {
    minWidth: depth === 0 ? 36 : 26,
    mr: 1,
    justifyContent: "center",
    color: depth === 0 ? "var(--brand)" : "rgba(43,58,69,0.60)",
  };
}

export function getItemLabelSx(
  depth: number,
  isActive: boolean,
  isGroupActive: boolean,
): SxProps<Theme> {
  return {
    fontWeight: isActive || isGroupActive ? 800 : depth === 0 ? 700 : 600,
    fontSize: depth === 0 ? 14 : 13,
  };
}

export function getItemButtonSx(
  depth: number,
  isLeafNoPath: boolean,
): SxProps<Theme> {
  return {
    borderRadius: 2,
    pl: 1.5 + depth * 2,
    py: depth === 0 ? 1 : 0.75,
    mb: depth === 0 ? 0.75 : 0.5,
    px: 1.5,
    color: "#1f2a36",
    opacity: isLeafNoPath ? 0.6 : 1,
    minHeight: depth === 0 ? 44 : 36,
    "&:hover": { bgcolor: "rgba(11, 91, 143, 0.08)" },
    "& .MuiListItemIcon-root": { color: "var(--brand)", minWidth: 36 },
    "&.Mui-selected": {
      bgcolor: "rgba(11, 91, 143, 0.12)",
      borderLeft: "3px solid var(--brand)",
    },
  };
}
