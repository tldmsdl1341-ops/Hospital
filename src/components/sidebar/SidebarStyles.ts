import type { SxProps, Theme } from "@mui/material";

export const sidebarRootSx = (width: number): SxProps<Theme> => ({
  display: "flex",
  flexDirection: "column",
  px: 1.5,
  py: 1.5,
  width,
  bgcolor: "rgba(255,255,255,0.96)",
  borderRight: "1px solid rgba(15, 32, 48, 0.08)",
  height: "100%",
  backdropFilter: "blur(10px)",
});

export const sidebarHeaderSx: SxProps<Theme> = {
  px: 1,
  pb: 1.5,
  minHeight: 40,
};

export const sidebarTitleSx: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: 15,
  color: "var(--brand-strong)",
};

export const sidebarListAreaSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  pr: 0.5,
};

export const sidebarLoadingSx: SxProps<Theme> = {
  p: 2,
  display: "flex",
  justifyContent: "center",
};

export const sidebarMessageSx: SxProps<Theme> = {
  px: 1,
  py: 1.5,
};

export const sidebarMessageTextSx: SxProps<Theme> = {
  fontSize: 12,
  color: "text.secondary",
};
