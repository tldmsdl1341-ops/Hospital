"use client";

import Link from "next/link";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import type { SidebarItem as SidebarItemType } from "@/features/sidebar/SidebarTypes";
import { sidebarIconMap } from "./SidebarIcons";
import { hasActiveChild, isItemActive } from "./SidebarUtils";
import {
  childDotIconSx,
  getItemButtonSx,
  getItemIconSx,
  getItemLabelSx,
} from "./SidebarItemStyles";

type SidebarItemProps = {
  item: SidebarItemType;
  pathname: string;
  depth?: number;
  openIds: number[];
  onToggle: (id: number) => void;
};

export default function SidebarItem({
  item,
  pathname,
  depth = 0,
  openIds,
  onToggle,
}: SidebarItemProps) {
  const hasChildren = !!item.children?.length;
  const isOpen = openIds.includes(item.id);
  const isActive = isItemActive(pathname, item.path, hasChildren);
  const isGroupActive = hasChildren && hasActiveChild(pathname, item);
  const isLeafNoPath = !item.path && !hasChildren;

  const icon =
    depth === 0 && item.icon && sidebarIconMap[item.icon] ? (
      sidebarIconMap[item.icon]
    ) : depth > 0 ? (
      <FiberManualRecordIcon sx={childDotIconSx} />
    ) : null;

  const buttonContent = (
    <>
      <ListItemIcon sx={getItemIconSx(depth)}>{icon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography noWrap sx={getItemLabelSx(depth, isActive, isGroupActive)}>
            {item.name}
          </Typography>
        }
      />
      {hasChildren ? (
        isOpen ? (
          <ExpandLessIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )
      ) : null}
    </>
  );

  const buttonSx = getItemButtonSx(depth, isLeafNoPath);

  return (
    <>
      {item.path && !hasChildren ? (
        <ListItemButton
          component={Link}
          href={item.path}
          selected={isActive}
          sx={buttonSx}
        >
          {buttonContent}
        </ListItemButton>
      ) : (
        <ListItemButton
          onClick={() => hasChildren && onToggle(item.id)}
          disabled={isLeafNoPath}
          selected={isActive || isGroupActive}
          sx={buttonSx}
        >
          {buttonContent}
        </ListItemButton>
      )}

      {hasChildren ? (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                pathname={pathname}
                depth={depth + 1}
                openIds={openIds}
                onToggle={onToggle}
              />
            ))}
          </List>
        </Collapse>
      ) : null}
    </>
  );
}
