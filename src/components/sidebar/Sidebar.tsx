"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, List, Typography } from "@mui/material";
import { fetchSidebarRequest } from "@/features/sidebar/SidebarSlice";
import type { RootState } from "@/store/Store";
import { getOpenIds } from "./SidebarUtils";
import SidebarItem from "./SidebarItem";
import {
  sidebarHeaderSx,
  sidebarListAreaSx,
  sidebarLoadingSx,
  sidebarMessageSx,
  sidebarMessageTextSx,
  sidebarRootSx,
  sidebarTitleSx,
} from "./SidebarStyles";

type SidebarProps = {
  width?: number;
};

export default function Sidebar({ width = 240 }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.sidebar,
  );

  const [openIds, setOpenIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    dispatch(fetchSidebarRequest());
  }, [dispatch]);

  React.useEffect(() => {
    if (!items.length) return;
    const autoOpenIds = getOpenIds(pathname, items);
    setOpenIds((prev) => [...new Set([...prev, ...autoOpenIds])]);
  }, [pathname, items]);

  const toggleItem = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  return (
    <Box sx={sidebarRootSx(width)}>
      <Box sx={sidebarHeaderSx}>
        <Typography sx={sidebarTitleSx}>병원 운영 메뉴</Typography>
      </Box>

      <Box sx={sidebarListAreaSx}>
        {loading ? (
          <Box sx={sidebarLoadingSx}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Box sx={sidebarMessageSx}>
            <Typography sx={sidebarMessageTextSx}>{error}</Typography>
          </Box>
        ) : items.length === 0 ? (
          <Box sx={sidebarMessageSx}>
            <Typography sx={sidebarMessageTextSx}>표시할 메뉴가 없습니다.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                pathname={pathname}
                openIds={openIds}
                onToggle={toggleItem}
              />
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
