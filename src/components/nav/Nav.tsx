"use client";

import Link from "next/link";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import NavUserMenu from "./NavUserMenu";
import {
  navAppBarSx,
  navBrandIconSx,
  navBrandLinkSx,
  navBrandSubtitleSx,
  navBrandTitleSx,
  navSpacerSx,
  navToolbarSx,
} from "./NavStyles";

export default function Nav() {
  return (
    <AppBar position="sticky" elevation={0} sx={navAppBarSx}>
      <Toolbar sx={navToolbarSx}>
        <Box component={Link} href="/" sx={navBrandLinkSx}>
          <LocalHospitalOutlinedIcon sx={navBrandIconSx} />
          <Box>
            <Typography sx={navBrandTitleSx}>Hospital CORE</Typography>
            <Typography sx={navBrandSubtitleSx}>병원 운영 시스템</Typography>
          </Box>
        </Box>

        <Box sx={navSpacerSx} />

        <NavUserMenu />
      </Toolbar>
    </AppBar>
  );
}
