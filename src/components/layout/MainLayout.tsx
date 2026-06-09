"use client";

import { Box } from "@mui/material";
import Nav from "@/components/nav/Nav";
import Sidebar from "@/components/sidebar/Sidebar";
import {
  contentWrapSx,
  layoutRootSx,
  mainContentSx,
  SIDEBAR_WIDTH,
  sidebarWrapSx,
} from "./MainLayoutStyles";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={layoutRootSx}>
      <Box sx={sidebarWrapSx(SIDEBAR_WIDTH)}>
        <Sidebar width={SIDEBAR_WIDTH} />
      </Box>
      <Box sx={contentWrapSx(SIDEBAR_WIDTH)}>
        <Nav />
        <Box component="main" sx={mainContentSx}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
