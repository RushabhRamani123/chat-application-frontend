import React from "react";
import { Box, Badge, Stack, Avatar, Typography } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { SelectConversation ,SwitchToChat,ToggleSidebar} from "../redux/slices/app";
import { socket } from "../socket";
import {FetchCurrentMessages,SetCurrentConversation} from "../redux/slices/conversation";
import { FetchFriends } from "../redux/slices/app"
import Checkbox from '@mui/material/Checkbox';
const truncateText = (string, n) => {
  const linkRegex = /<a href="(.*?)".*?>/;
  const match = linkRegex.exec(string);
  return match ? `${match[1]?.slice(0, n)}...` : string?.length > n ? `${string?.slice(0, n)}...` : string;
};

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ChatElement = ({ img, name, msg, time, unread, online, id }) => {
  const { conversations } = useSelector((state) => state.conversation.direct_chat);
  const forward = useSelector((state) => state.app.forward); 
  const open = useSelector((state) => state.app.sideBar.open);
  const dispatch = useDispatch();
  const { room_id } = useSelector((state) => state.app);
  const selectedChatId = room_id?.toString();

  let isSelected = (selectedChatId === id);

  if (!selectedChatId) {
    isSelected = false;
  }
  const windowWidth = window.innerWidth;
  const theme = useTheme();
  
  return (
    <>
    {forward ? <Checkbox/> : null } 
    <StyledChatBox
      onClick={() => {
        if (windowWidth < 900) {
          dispatch(SwitchToChat());
        }
        if (open)
        {
          dispatch(ToggleSidebar());
        }
        socket.emit("get_messages", { conversation_id: id }, (data) => {
          if (data === null)
          {
            dispatch(SelectConversation({ room_id: id }));
            const current = conversations.find((el) => el?.id === id);
            dispatch(SetCurrentConversation(current));
            dispatch(FetchCurrentMessages({ messages: ''}));
          }
          else {
            dispatch(SelectConversation({ room_id: id }));
            dispatch(FetchFriends());
            dispatch(FetchCurrentMessages({ messages: data }));
            const current = conversations.find((el) => el?.id === id);
            dispatch(SetCurrentConversation(current));
        }
        });
      }}
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: isSelected
          ? theme.palette.mode === "light"
            ? alpha(theme.palette.primary.main, 0.5)
            : theme.palette.primary.main
          : theme.palette.mode === "light"
          ? "#fff"
          : theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        
        justifyContent="space-between"

        alignItems="flex-start"
      >
        <Stack direction="row" spacing={2}>
          {" "}
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name}  src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{truncateText(msg, 20)}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={0.5} alignItems="flex-end">
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Typography sx={{ backgroundColor:theme.palette.primary.main , color:'white' , padding:'3px 5px' ,borderRadius:'50%',fontSize:'8px'}} variant="caption">
        {3} 
          </Typography>
          <Badge
            className="unread-count"
            color="primary"
            badgeContent={unread}
          />
        </Stack>
      </Stack>
    </StyledChatBox>

    </>        
  );
};

export default ChatElement;
