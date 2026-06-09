"use client";

import * as React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { logout } from "@/features/nav/NavSlice";
import type { RootState } from "@/store/Store";
import {
  loginButtonSx,
  menuItemIconSx,
  userAvatarSx,
  userMenuDetailSx,
  userMenuDetailWithGapSx,
  userMenuHeaderSx,
  userMenuIconButtonSx,
  userMenuNameSx,
  userMenuPaperSx,
  userMetaSx,
  userNameSx,
  userSummarySx,
  userTriggerSx,
} from "./NavUserMenuStyles";

export default function NavUserMenu() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.nav.user);
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorElement);

  if (!user) {
    return (
      <Button
        component={Link}
        href="/login"
        variant="outlined"
        size="small"
        sx={loginButtonSx}
      >
        로그인
      </Button>
    );
  }

  const handleLogout = () => {
    setAnchorElement(null);
    dispatch(logout());
  };

  return (
    <>
      <Box
        onClick={(event) => setAnchorElement(event.currentTarget)}
        sx={userTriggerSx}
      >
        <Avatar sx={userAvatarSx}>{user.name.charAt(0)}</Avatar>
        <Box sx={userSummarySx}>
          <Typography noWrap sx={userNameSx}>
            {user.name}
          </Typography>
          <Typography noWrap sx={userMetaSx}>
            {user.department} · {user.loginId}
          </Typography>
        </Box>
        <IconButton size="small" sx={userMenuIconButtonSx}>
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorElement}
        open={menuOpen}
        onClose={() => setAnchorElement(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: userMenuPaperSx,
          },
        }}
      >
        <Box sx={userMenuHeaderSx}>
          <Typography sx={userMenuNameSx}>{user.name}</Typography>
          <Typography sx={userMenuDetailWithGapSx}>{user.department}</Typography>
          <Typography sx={userMenuDetailSx}>아이디: {user.loginId}</Typography>
          <Typography sx={userMenuDetailSx}>권한: {user.role}</Typography>
        </Box>
        <Divider />
        <MenuItem disabled>
          <PersonOutlinedIcon fontSize="small" sx={menuItemIconSx} />
          내 정보 (준비 중)
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutOutlinedIcon fontSize="small" sx={menuItemIconSx} />
          로그아웃
        </MenuItem>
      </Menu>
    </>
  );
}
