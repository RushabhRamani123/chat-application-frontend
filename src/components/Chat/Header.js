import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CaretDown,Phone, VideoCamera } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import {SwitchToBar,SwitchToBarGroup ,SelectConversation} from "../../redux/slices/app"
import { StartAudioCall } from "../../redux/slices/audioCall";
import { StartVideoCall } from "../../redux/slices/videoCall";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
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

const Conversation_Menu = [
  {
    title: "Contact info",
  },
  {
    title: "Mute notifications",
  },
  {
    title: "Clear messages",
  },
  {
    title: "Delete chat",
  },
];

const ChatHeader = () => {
  const chat_type = useSelector((state) => state.app.chat_type);
  const dispatch = useDispatch();
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();
  const type = useSelector((state) => state.app.chat_type);
  const {current_conversation} = useSelector((state) => type === "group" ? state.conversation.group_chat : state.conversation.direct_chat);
  const [conversationMenuAnchorEl, setConversationMenuAnchorEl] = React.useState(null);
  const openConversationMenu = Boolean(conversationMenuAnchorEl);
  const handleClickConversationMenu = (event) => {
    setConversationMenuAnchorEl(event.currentTarget);
  };
  const handleCloseConversationMenu = () => {
    setConversationMenuAnchorEl(null);
  };

  return (
    <>
      <Box
        p={2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack
          alignItems={"center"}
          direction={"row"}
          sx={{ width: "100%", height: "100%" }}
          justifyContent="space-between"
        >
          <Stack
            onClick={() => {
              dispatch(ToggleSidebar());
            }}
            spacing={2}
            direction="row"
          >
            <Box>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant={current_conversation?.online && "dot"}
              >
                <Stack sx={{display: "flex",flexDirection: "row",alignItems: "center"}}>
                  {window.innerWidth < 900 ? <ArrowBackOutlinedIcon onClick={() => {
                    dispatch(ToggleSidebar());
                    if (chat_type !== "group")
                    {
                      dispatch(SelectConversation({ room_id: null }));
                      dispatch(SwitchToBar());
                    }
                    else
                      dispatch(SwitchToBarGroup())
                  }} /> : null}
                <Avatar
                  alt={current_conversation?.name}
                  src={current_conversation?.img}
                />
                </Stack>
              </StyledBadge>
            </Box>
            <Stack spacing={0.2}>
              <Typography variant="subtitle2">
                {current_conversation?.name}
              </Typography>
              <Typography variant="caption">{current_conversation?.online ?"Online" : "Offline" }</Typography>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            alignItems="center"
            spacing={isMobile ? 1 : 3}
          >
            <>
            <Tooltip title="Videocall" placement="bottom">
            <IconButton
              onClick={() => {
              dispatch(StartVideoCall(current_conversation?.user_id));
              }}
            >
              <VideoCamera />
            </IconButton>
          </Tooltip>
            </>
          
            <>
              <Tooltip title="Call" placement="bottom">
              <IconButton
              onClick={() => {
                dispatch(StartAudioCall(current_conversation?.user_id));
              }}
            >
              <Phone />
            </IconButton>
            </Tooltip>
            </>
            <Divider
              orientation="vertical" flexItem />
            <IconButton
              id="conversation-positioned-button"
              aria-controls={
                openConversationMenu
                  ? "conversation-positioned-menu"
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={openConversationMenu ? "true" : undefined}
              onClick={handleClickConversationMenu}
            >
              <CaretDown />
            </IconButton>
            <Menu
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              TransitionComponent={Fade}
              id="conversation-positioned-menu"
              aria-labelledby="conversation-positioned-button"
              anchorEl={conversationMenuAnchorEl}
              open={openConversationMenu}
              onClose={handleCloseConversationMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box p={1}>
                <Stack spacing={1}>
                  {Conversation_Menu?.map((el) => (
                    <MenuItem onClick={handleCloseConversationMenu}>
                      <Stack
                        sx={{ minWidth: 100 }}
                        direction="row"
                        alignItems={"center"}
                        justifyContent="space-between"
                        onClick={() => {
                          if (el.title === 'Contact info'){
                            dispatch(ToggleSidebar());
                          }
                        }}
                      ><span>{el.title}</span></Stack>{" "}
                    </MenuItem>
                  ))}
                </Stack>
              </Box>
            </Menu>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default ChatHeader;