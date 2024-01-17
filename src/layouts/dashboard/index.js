import { Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import useResponsive from "../../hooks/useResponsive";
const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");
  return (
    <Stack direction={"row"}>
        {isDesktop && (
          // SideBar
          <SideBar />
        )}
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;