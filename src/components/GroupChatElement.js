import React from "react";
import { Box, Badge, Stack, Avatar, Typography } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { SelectGroup,SwitchToChatGroup } from "../redux/slices/app";
import { socket } from "../socket";
import {
  FetchGroupMessages,
  SetGroupCurrentConversation
} from "../redux/slices/conversation";
import { useEffect } from "react";
const truncateText = (string, n) => {
  return string?.length > n ? `${string?.slice(0, n)}...` : string;
};

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
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

const GroupChatElement  = ({ participants, name ,unread, id ,msg,img,time}) => {
  const { conversations } = useSelector(
    (state) => state.conversation.group_chat
  );
  // console.log(conversations, "conversations");
  const dispatch = useDispatch();
  const { room_id } = useSelector((state) => state.app);
  const selectedChatId = room_id?.toString();

  let isSelected = (selectedChatId === id);

  if (!selectedChatId) {
    isSelected = false;
  }

  const theme = useTheme();

  return (
    <StyledChatBox
      onClick={() => {if(window.innerWidth < 900){dispatch(SwitchToChatGroup());}
        const current = conversations.find((el) => el?.id === id);
          dispatch(SelectGroup({ room_id: id }));
          socket.emit("get_group_messages", { conversation_id: id }, (data) => {
          dispatch(FetchGroupMessages({ messages: data }));
          dispatch(SetGroupCurrentConversation({ current }));
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
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
            <Avatar alt={""} src={img} />
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
  );
};

export default GroupChatElement;
