import { Stack, Box, Typography } from "@mui/material";
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
  FetchCurrentMessages,
  SetCurrentConversation,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";
import { useState } from "react";

import {FetchFriends} from '../../redux/slices/app'
const Conversation = ({ isMobile, menu, starred }) => {
  const details = useSelector((state) => state.conversation);
  const { current_conversation } = details.direct_chat;
  // const theme = useTheme();
  const [value, setValue] = useState(false);
  const isDesktop = useResponsive("up", "md");
  const data = useSelector((state) => state.app.friends);
  const user_id = useSelector((state) => state.app.user._id);
  
  // Create a new state variable to store the modified array
  // const [updatedArray, setUpdatedArray] = useState('');

  // Map through the array and update the element

  const dispatch = useDispatch();
  const theme = useTheme();
  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);

  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);

    socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
      // data => list of messages
      console.log(data, "List of messages");
      // const { messages } = data; 
      
      dispatch(FetchCurrentMessages({ messages: data }));
      dispatch(FetchFriends());
    });
    data?.map((el) => {
      if (el.id === current_conversation?.user_id) {
       
        setValue(el.isblock);
      }
      return el;
    });

    dispatch(SetCurrentConversation(current));
  },  []);

  return (
    <Box
      p={isMobile ? 1 : 3}
      sx={{ "&::-webkit-scrollbar": { display: "none" } }}
    >
      <Stack spacing={2}>
        {current_messages.map((el, idx) => {
          switch (el.type) {
            case "divider":
              return (
                // Timeline
                <Timeline el={el} />
              );

            case "msg":
              switch (el.subtype) {
                case "img":
                  return (
                    // Media Message
                    <MediaMsg el={el} menu={menu} />
                  );

                case "doc":
                  return (
                    // Doc Message
                    <DocMsg el={el} menu={menu} />
                  );
                case "Link":
                  return (
                    //  Link Message
                    <LinkMsg el={el} menu={menu} />
                  );

                case "reply":
                  return (
                    //  ReplyMessage
                    <ReplyMsg el={el} menu={menu} />
                  );
                default:
                  return (
                    // Text Message
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

const ChatComponent = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();

  const messageListRef = useRef(null);

  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);

  return (
    <Stack
      height={"100vh"}
      // maxHeight={"100vh"}
      width={isMobile ? "100vw" : "auto"}
    >
      {/*  */}
      <ChatHeader />
      <Box
        ref={messageListRef}
        width={"100%"}
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
        <Conversation menu={true} isMobile={isMobile} />
      </Box>

      {/*  */}
      <ChatFooter />
    </Stack>
  );
};

export default ChatComponent;

export { Conversation };
