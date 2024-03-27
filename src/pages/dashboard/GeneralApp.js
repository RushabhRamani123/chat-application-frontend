import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import ChatComponent from "./Conversation";
import Chats from "./Chats";
import Contact from "../../sections/Dashboard/Contact";
import NoChat from "../../assets/Illustration/NoChat";
import { useSelector } from "react-redux";
import StarredMessages from "../../sections/Dashboard/StarredMessages";
import Media from "../../sections/Dashboard/SharedMessages";
import useResponsive from "../../hooks/useResponsive";
const GeneralApp = () => {
  const [searchParams] = useSearchParams();
  const isTablet = useResponsive("down", "sm");
  const theme = useTheme();
  const { Tab } = useSelector((state) => state.app);
  useEffect(() => {
  //  console.log(Tab) 
  })
  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);
  const windowWidth = window.innerWidth;
  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        {windowWidth < 900 ?(Tab!==true)? <Chats />: null : <Chats />}
        <Box
          sx={{
            height: "100%",
            width: sideBar.open
              ? `calc(100vw - 740px )`
              : `calc(100vw - ${windowWidth < 900 ?Tab===true? '0vw': '100vw': '420px'} )`,
            backgroundColor:
              theme.palette.mode === "light"
                ? "#FFF"
                : theme.palette.background.paper,
             "&::-webkit-scrollbar": { display: "none"}

              }}                
        >
             {windowWidth < 900 ? (Tab===true&&!sideBar.open)?  <>
              {chat_type === "individual" &&
              room_id !== null ?(
                <ChatComponent />
              ) : (
                <Stack
                  spacing={2}
                  sx={{ height: "100%", width: "100%" }}
                  alignItems="center"
                  justifyContent={"center"}
                >
                  <NoChat />
                  <Typography variant="subtitle2">
                    Select a conversation or start a{" "}
                    <Link
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                      }}
                      to="/"
                    >
                      new one
                    </Link>
                  </Typography>
                </Stack>
               )} 
              </>: null : <>
              {chat_type === "individual" &&
              room_id !== null ?(
                  <>
                                    <ChatComponent />
                  
                  </>
              ) : (
                <Stack
                  spacing={2}
                  sx={{ height: "100%", width: "100%" }}
                  alignItems="center"
                  justifyContent={"center"}
                >
                  <NoChat />
                  <Typography variant="subtitle2">
                    Select a conversation or start a{" "}
                    <Link
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                      }}
                      to="/"
                    >
                      new one
                    </Link>
                  </Typography>
                </Stack>
               )} 
              </>}
         
        </Box>
        <Stack>
        {sideBar.open &&
          (() => {
            switch (sideBar.type) {
              case "CONTACT":
                return <Contact />;

              case "STARRED":
                return <StarredMessages />;

              case "SHARED":
                return <Media />;

              default:
                break;
            }
          })()}
        </Stack>
      </Stack>
    </>
  );
};

export default GeneralApp;