import { Stack, Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "../../sections/Dashboard/Conversation";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchGroupMessages,
  SetGroupCurrentConversation,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";

const Group_conversation = ({ isMobile, menu }) => {
  const dispatch = useDispatch();
  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.group_chat
  );
  const {room_id} = useSelector((state) => state.app);
  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);
    socket.emit(
      "get_group_messages",
      { conversation_id: current?.id },
      (data) => {
        dispatch(FetchGroupMessages({ messages: data }));
      });
    dispatch(SetGroupCurrentConversation(current));
  }, []);
  return (
    <Box
      p={isMobile ? 1 : 3}
      sx={{ "&::-webkit-scrollbar": { display: "none" } }}
    >
      <Stack spacing={2}>
        {current_messages?.map((el, idx) => {
          switch (el.type) {
            case "divider":
              return (
                <Timeline el={el} />
              );
            case "msg":
              switch (el.subtype) {
                case "img":
                  return (
                    <MediaMsg el={el} menu={menu} />
                  );
                case "doc":
                  return (
                    <DocMsg el={el} menu={menu} />
                  );
                case "Link":
                  return (
                    <LinkMsg el={el} menu={menu} />
                  );
                case "reply":
                  return (
                    <ReplyMsg el={el} menu={menu} />
                  );
                default:
                  return (
                    <TextMsg el={el} menu={menu} />
                  );
              }
            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};
const Group_ChatComponent = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();
  const messageListRef = useRef(null);
  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  useEffect(() => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);
  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={isMobile ? "100vw" : "auto"}
    >
      <ChatHeader />
      <Box
        ref={messageListRef}
        width={"100%"}
        height={"100vh"}
        sx={{
          position: "relative",
          flexGrow: 1,
          overflow: "scroll",

          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Group_conversation menu={true} isMobile={isMobile} />
      </Box>
      <ChatFooter />
    </Stack>
  );
};
export default Group_ChatComponent;
export { Group_conversation };
