import type { SxProps, Theme } from "@mui/material";

export const navAppBarSx: SxProps<Theme> = {
  bgcolor: "rgba(255,255,255,0.96)",
  borderBottom: "1px solid rgba(15, 32, 48, 0.08)",
  backdropFilter: "blur(10px)",
  color: "var(--ink)",
};

export const navToolbarSx: SxProps<Theme> = {
  minHeight: 56,
  px: { xs: 2, md: 3 },
  gap: 2,
};

export const navBrandLinkSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  textDecoration: "none",
  color: "inherit",
  minWidth: 0,
};

export const navBrandIconSx: SxProps<Theme> = {
  color: "var(--brand)",
  fontSize: 28,
};

export const navBrandTitleSx: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: 15,
  lineHeight: 1.2,
  color: "var(--brand-strong)",
};

export const navBrandSubtitleSx: SxProps<Theme> = {
  display: { xs: "none", sm: "block" },
  fontSize: 11,
  lineHeight: 1.2,
  color: "var(--muted)",
};

export const navSpacerSx: SxProps<Theme> = {
  flex: 1,
};
