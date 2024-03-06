import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography } from "@mui/material";

import { Link, useSearchParams } from "react-router-dom";
// import Group_ChatComponentfrom "./Conversation"; R 
import  Group_Chat  from "./Group_Chat";
import Group_ChatComponent from "./Group_conversation";
// import Contact from "../../sections/Dashboard/Contact";
import NoChat from "../../assets/Illustration/NoChat";
import { useSelector } from "react-redux";
// import StarredMessages from "../../sections/Dashboard/StarredMessages";
// import Media from "../../sections/Dashboard/SharedMessages";
const Group = () => {
  const [searchParams] = useSearchParams();
  const { Tab_Group } = useSelector((state) => state.app)
  const theme = useTheme();
  const windowWidth = window.innerWidth;
  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);

  return (
    <>
      <Stack direction="row"  sx={{ width: "100%" }}>
              <Stack>
              {windowWidth < 900 ?(Tab_Group!==true)? <Group_Chat />: null : <Group_Chat />}
      </Stack>
        <Box
          sx={{
            height: "100%",
            width: sideBar.open
              ? `calc(100vw - 740px )`
              : "calc(100vw - 420px )",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#FFF"
                : theme.palette.background.paper,
             "&::-webkit-scrollbar": { display: "none"}

              }}                
        >
         {windowWidth < 900 ? (Tab_Group===true&&!sideBar.open)?  <>
              {chat_type === "group" &&
              room_id !== null ?(
                <Group_ChatComponent/>
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
              {chat_type === "group" &&
              room_id !== null ?(
                <Group_ChatComponent/>
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
        {/* {sideBar.open &&
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
          })()} */}
      </Stack>
    </>
  );
};

export default Group;