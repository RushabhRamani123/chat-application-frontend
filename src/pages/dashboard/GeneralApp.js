import { Box, Stack } from "@mui/material";
import React from "react";
import Conversation from "../../components/Conversation";
import Chats from "./Chats";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import Media from "../../components/SharedMessages";
const GeneralApp = () => {
  const theme = useTheme();
  const { sideBar } = useSelector((state) => state.app);
  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      <Chats />
      <Box
        sx={{
          height: "100%",
          width: sideBar.open
              ? `calc(100vw - 740px )`
              : "calc(100vw - 420px )",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#fff"
              : theme.palette.background.default,
        }}
      >
      <Conversation />
      </Box>
      {/* contacts */}
      {
          sideBar.open &&
            (() => {
              switch (sideBar.type) {
                case "CONTACT":
                  return <Contact />;
                case "SHARED":
                  return <Media />;
                default:
                  break;
              }
            })()
        }
    </Stack>
  );
};

export default GeneralApp;