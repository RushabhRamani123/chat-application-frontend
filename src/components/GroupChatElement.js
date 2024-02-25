import React from "react";
import { Box, Badge, Stack, Avatar, Typography } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { SelectGroup } from "../redux/slices/app";
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

const GroupChatElement  = ({ participants, name , id }) => {
  const { conversations } = useSelector(
    (state) => state.conversation.group_chat
  );
  console.log(conversations, "conversations");
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
      onClick={() => {
        const current = conversations.find((el) => el?.id === id);
        // alert(JSON.stringify(current));
        dispatch(SelectGroup({ room_id: id }));
        dispatch(SetGroupCurrentConversation({current}));
        socket.emit("get_group_messages", { conversation_id: id }, (data) => {
          console.log(data, "List of messages");
          dispatch(FetchGroupMessages({ messages: data }));
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
            <Avatar alt={""} src={""} />
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            {/* <Typography variant="caption">{""}</Typography> */}
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          {/* <Typography sx={{ fontWeight: 600 }} variant="caption">
            {""}
          </Typography> */}
          {/* <Badge
            className="unread-count"
            color="primary"
            badgeContent=""
          /> */}
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default GroupChatElement;
