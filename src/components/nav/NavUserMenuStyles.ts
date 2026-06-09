import type { SxProps, Theme } from "@mui/material";

export const loginButtonSx: SxProps<Theme> = {
  borderColor: "var(--line)",
  color: "var(--brand-strong)",
};

export const userTriggerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1,
  py: 0.5,
  borderRadius: 2,
  cursor: "pointer",
  "&:hover": { bgcolor: "var(--brand-soft)" },
};

export const userAvatarSx: SxProps<Theme> = {
  width: 32,
  height: 32,
  bgcolor: "var(--brand)",
  fontSize: 14,
  fontWeight: 700,
};

export const userSummarySx: SxProps<Theme> = {
  display: { xs: "none", sm: "block" },
  minWidth: 0,
};

export const userNameSx: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: 13,
  lineHeight: 1.3,
};

export const userMetaSx: SxProps<Theme> = {
  fontSize: 11,
  color: "var(--muted)",
  lineHeight: 1.3,
};

export const userMenuIconButtonSx: SxProps<Theme> = {
  color: "var(--muted)",
};

export const userMenuPaperSx: SxProps<Theme> = {
  mt: 1,
  minWidth: 220,
  borderRadius: 2,
};

export const userMenuHeaderSx: SxProps<Theme> = {
  px: 2,
  py: 1.5,
};

export const userMenuNameSx: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: 14,
};

export const userMenuDetailSx: SxProps<Theme> = {
  fontSize: 12,
  color: "var(--muted)",
};

export const userMenuDetailWithGapSx: SxProps<Theme> = {
  ...userMenuDetailSx,
  mt: 0.25,
};

export const menuItemIconSx: SxProps<Theme> = {
  mr: 1.5,
};
