import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ArrowLeft } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { useDispatch } from "react-redux";
import { UpdateSidebarType } from "../../redux/slices/app";
import { useEffect } from "react";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "../../sections/Dashboard/Conversation";
import { useSelector } from "react-redux";
import {
    FetchGroupMessages,
    SetGroupCurrentConversation
  } from "../../redux/slices/conversation";
import { socket } from "../../socket";
const StarredMessages_Group = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const app = useSelector((state) => state.app);
  const user_id = app.user?._id;
  const isDesktop = useResponsive("up", "md");
  const { conversations, current_messages } = useSelector((state) => state.conversation.group_chat);
  console.log(conversations); 
  console.log(current_messages); 
  const { room_id } = useSelector((state) => state.app);
  const starredMessages = [];
  current_messages?.forEach((message) => {
    message.star?.forEach((star) => {
      if (star === user_id) {
        starredMessages.push(message);
      }
    });
  });
  // alert('hello brother'); 
  console.log("This is the starred message:"+starredMessages);
  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);
    socket.emit("get_group_messages", { conversation_id: current?.id }, (data) => {
      dispatch(FetchGroupMessages({ messages: data }));
      dispatch(SetGroupCurrentConversation({ current }));
    });

  }, []);
  return (
    <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            spacing={3}
          >
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2">Starred Messages</Typography> 
          </Stack>
        </Box>
        <Stack
          sx={{
            p: 2,
            height: "100vh",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
            "&::-webkit-scrollbar": { display: "none" },
            backgroundColor:
              theme.palette.mode === "light" ? "#F0F4FA" : "#212B36",
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
          spacing={3}
        >
          <Stack spacing={2}>
            {starredMessages.map((el, idx) => {
              switch (el.type) {
                case "divider":
                  return (
                    <Timeline el={el} />
                  );

                case "msg":
                  switch (el.subtype) {
                    case "img":
                      return (
                        // Media Message
                        <MediaMsg el={el} />
                      );

                    case "doc":
                      return (
                        // Doc Message
                        <DocMsg el={el} />
                      );
                    case "Link":
                      return (
                        //  Link Message
                        <LinkMsg el={el} />
                      );

                    case "reply":
                      return (
                        //  ReplyMessage
                        <ReplyMsg el={el} />
                      );

                    default:
                      return (
                        // Text Message
                        <TextMsg el={el} />
                      );
                  }

                default:
                  return <></>;
              }
            })}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export default StarredMessages_Group;