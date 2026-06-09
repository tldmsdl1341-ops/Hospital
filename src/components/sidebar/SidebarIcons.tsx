import type { ReactNode } from "react";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ListIcon from "@mui/icons-material/List";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PolicyIcon from "@mui/icons-material/Policy";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export const sidebarIconMap: Record<string, ReactNode> = {
  Home: <HomeRoundedIcon fontSize="small" />,
  People: <PersonRoundedIcon fontSize="small" />,
  MedicalServices: <LocalHospitalOutlinedIcon fontSize="small" />,
  Description: <DescriptionOutlinedIcon fontSize="small" />,
  FactCheck: <AssignmentTurnedInOutlinedIcon fontSize="small" />,
  List: <ListIcon fontSize="small" />,
  PersonAdd: <PersonAddIcon fontSize="small" />,
  Policy: <PolicyIcon fontSize="small" />,
  TaskAlt: <TaskAltIcon fontSize="small" />,
};
