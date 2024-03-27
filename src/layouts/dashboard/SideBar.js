import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import { Box, Divider, IconButton, Stack } from "@mui/material";
import AntSwitch from "../../components/AntSwitch";

import Logo from "../../assets/Images/logo.ico";

import useSettings from "../../hooks/useSettings";
import { Nav_Buttons, Nav_Setting } from "../../data";

import ProfileMenu from "./ProfileMenu";
import { useNavigate } from "react-router-dom";
import { SelectedIndex, ToggleSidebar } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
const getPath = (index) => {
  switch (index) {
    case 0:
      return "/app";

    case 1:
      return "/group";

    case 2:
      return "/call";

    case 3:
      return "/settings";

    default:
      break;
  }
};

const SideBar = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { onToggleMode } = useSettings();
  useEffect(() => {}, []);
  const { Selected_index } = useSelector((state) => state.app);
  const [selectedTab, setSelectedTab] = React.useState(Selected_index);
  const open = useSelector((state) => state.app.sideBar.open);
  const handleChangeTab = (index) => {
    setSelectedTab(index);
    dispatch(SelectedIndex({ index }));
    navigate(getPath(index));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: 100,

        backgroundColor:
          theme.palette.mode === "light"
            ? "#F0F4FA"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        py={3}
        alignItems={"center"}
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Stack alignItems={"center"} spacing={4}>
          <Box
            sx={{
              height: 64,
              width: 64,
              borderRadius: 1.5,
              // backgroundColor: theme.palette.primary.main,
            }}
            p={1}
          >
            <img src={Logo} alt="Tawk" />
          </Box>
          <Stack
            sx={{ width: "max-content" }}
            direction="column"
            alignItems={"center"}
            spacing={3}
          >
            {Nav_Buttons.map((el) => {
              return el.index === selectedTab ? (
                <>
                  <Tooltip title={el.name} placement="right">
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 1.5,
                      }}
                      p={1}
                    >
                      <IconButton
                        // ADD THE EVENT HERE
                        onClick={() => {
                          if (open) {
                            dispatch(ToggleSidebar());
                          }
                        }}
                        sx={{ width: "max-content", color: "#ffffff" }}
                      >
                        {el.icon}
                      </IconButton>
                    </Box>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title={el.name} placement="right">
                    <IconButton
                      onClick={() => {
                        if (open) {
                          dispatch(ToggleSidebar());
                        }
                        handleChangeTab(el.index);
                      }}
                      sx={{
                        width: "max-content",
                        color:
                          theme.palette.mode === "light"
                            ? "#080707"
                            : theme.palette.text.primary,
                      }}
                    >
                      {el.icon}
                    </IconButton>
                  </Tooltip>
                </>
              );
            })}
            <Divider sx={{ width: 48 }} />
            {Nav_Setting.map((el) => {
              return el.index === selectedTab ? (
                <>
                  <Tooltip title={"Settings"} placement="right">
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 1.5,
                      }}
                      p={1}
                    >
                      <IconButton
                        onClick={() => {
                          if (open) {
                            dispatch(ToggleSidebar());
                          }
                          // dispatch(UpdateTab(el.index));
                        }}
                        sx={{ width: "max-content", color: "#ffffff" }}
                      >
                        {el.icon}
                      </IconButton>
                    </Box>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Settings" placement="right">
                    <IconButton
                      onClick={() => {
                        handleChangeTab(el.index);
                        if (open) {
                          dispatch(ToggleSidebar());
                        }
                        // dispatch(UpdateTab(el.index));
                      }}
                      sx={{
                        width: "max-content",
                        color:
                          theme.palette.mode === "light"
                            ? "#080707"
                            : theme.palette.text.primary,
                      }}
                    >
                      {el.icon}
                    </IconButton>
                  </Tooltip>
                </>
              );
            })}
          </Stack>
        </Stack>
        <Stack spacing={4}>
          <AntSwitch
            defaultChecked={theme.palette.mode === "dark"}
            onChange={onToggleMode}
          />
          {/* Profile Menu */}
          <ProfileMenu />
        </Stack>
      </Stack>
    </Box>
  );
};

export default SideBar;
