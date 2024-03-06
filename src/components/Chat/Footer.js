import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import {motion} from "framer-motion";  
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import useResponsive from "../../hooks/useResponsive";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { socket } from "../../socket";
import { useSelector } from "react-redux";
import { DeleteReply } from "../../redux/slices/app";
import { useDispatch } from "react-redux";
const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <Sticker size={24} />,
    y: 172,
    title: "Stickers",
  },
  {
    color: "#0172e4",
    icon: <Camera size={24} />,
    y: 242,
    title: "Image",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 312,
    title: "Document",
  },
  {
    color: "#013f7f",
    icon: <User size={24} />,
    y: 382,
    title: "Contact",
  },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setValue,
  value,
  inputRef,
  handleKeyPress,
}) => {
  const [openActions, setOpenActions] = useState(false);

  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack
              sx={{
                position: "relative",
                display: openActions ? "inline-block" : "none",
              }}
            >
              {Actions?.map((el) => (
                <Tooltip placement="right" title={el.title}>
                  <Fab
                    onClick={() => {
                      // setOpenActions(!openActions);
                      <input type="file" accept= "image/*" />
                    
                    }}
                    sx={{
                      position: "absolute",
                      top: -el.y,
                      backgroundColor: el.color,
                    }}
                    aria-label="add"
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>

            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenActions(!openActions);
                }}
              >
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <Stack sx={{ position: "relative" }}>
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <Smiley />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
      }}
      onKeyDown={handleKeyPress}
    />
  );
};

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}

const Footer = () => {
  const dispatch = useDispatch();
  const [isReply, setIsReply] = useState(false);
  const reply = useSelector((state) => state.app.reply);
  const theme = useTheme();
  const message = useSelector((state) => state.app.reply);
  console.log(message);
  useEffect(() => {
    if (message) {
      setIsReply(true);
    }
  }, [message]);
  const type = useSelector((state) => state.app.chat_type);
  const { current_conversation } = useSelector((state) =>
    type === "group"
      ? state.conversation.group_chat
      : state.conversation.direct_chat
  );

  const user = window.localStorage.getItem("user");
  const user_id = JSON.parse(user);
  const isMobile = useResponsive("between", "md", "xs", "sm");

  const { sideBar, room_id } = useSelector((state) => state.app);

  const [openPicker, setOpenPicker] = useState(false);

  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (type !== "group" && reply === null) {
        // alert("Please enter a message");
        socket.emit("text_message", {
          message: linkify(value),
          conversation_id: room_id,
          from: user_id,
          to: current_conversation.user_id,
          type: containsUrl(value) ? "Link" : "Text",
        });
        setValue("");
      } else if (type === "group" && reply === null) {
        socket.emit("group_text_message", {
          message: linkify(value),
          conversation_id: room_id,
          from: user_id,
          to: current_conversation.participants,
          type: containsUrl(value) ? "Link" : "Text",
        });
        setValue("");
      } else {
        socket.emit("text_message", {
          message: reply,
          reply: linkify(value),
          conversation_id: room_id,
          from: user_id,
          to: current_conversation.user_id,
          type: "reply",
        });
        setValue("");
        setIsReply(false);
        dispatch(DeleteReply());
      }
    }
  }
  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
          emoji +
          value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
      }}
    >
      <Box
        p={isMobile ? 1 : 2}
        width={"100%"}
        // height={"100px"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
        display={"flex"}
        flexDirection={"column"}
        gap={2}
      >
        {isReply ? (
          <Stack
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "45px",
            }}
          >
            <motion.div
              
              animate={{
                y: 0,
                opacity: 1,
              }}
              initial={{
                y: 10,
                opacity: 0,
              }}
              exit={{
                y: 10,
                opacity: 0,
              }}
              transition={{ duration: 0.8 }}

              style={{
                backgroundColor:theme.palette.mode === "light" ? "#ECEFF5" : "#3C4752",
                borderRadius: "10px",
                justifyContent: "center",
                padding: "10px",
                height: "50px",
                width: "100%",
              }}
            >
              <motion.p
                 animate={{
                  
                  opacity: 1,
                }}
                initial={{ 
                  opacity: 0,
                }}
                // how to handle the animation when the component is removed
                exit={{
                  opacity: 0,
                }}
                transition={{ duration: 0.5 }}
              >{reply}</motion.p>
            </motion.div>
            <CloseIcon
              onClick={() => {
                setIsReply(false);
                dispatch(DeleteReply());
              }}
            />
          </Stack>
        ) : null}
        <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
          <Stack sx={{ width: "100%" }}>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: 81,
                right: isMobile ? 20 : sideBar.open ? 420 : 100,
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(emoji) => {
                  handleEmojiClick(emoji.native);
                }}
              />
            </Box>

            {/* Chat Input */}
            <Stack>
              <ChatInput
                inputRef={inputRef}
                value={value}
                setValue={setValue}
                openPicker={openPicker}
                setOpenPicker={setOpenPicker}
                handleKeyPress={handleKeyPress}
              />
            </Stack>
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%" }}
              alignItems={"center"}
              justifyContent="center"
            >
              <IconButton
                onClick={(e) => {
                  if (type !== "group" && reply === null) {
                    e.preventDefault();
                    socket.emit("text_message", {
                      message: linkify(value),
                      conversation_id: room_id,
                      from: user_id,
                      to: current_conversation.user_id,
                      type: containsUrl(value) ? "Link" : "Text",
                    });
                    setValue("");
                  } else if (type === "group" && reply === null) {
                    
                    e.preventDefault();
                    socket.emit("group_text_message", {
                      message: linkify(value),
                      conversation_id: room_id,
                      from: user_id,
                      to: current_conversation.participants,
                      type: containsUrl(value) ? "Link" : "Text",
                    });
                    setValue("");
                  }
                  else if (type === "group" && reply !== null) {
                    
                      e.preventDefault();
                      socket.emit("group_text_message", {
                        message: linkify(reply),
                        conversation_id: room_id,
                        from: user_id,
                        reply: linkify(value),
                        to: current_conversation.participants,
                        type: "reply",
                      });
                    setValue("");
                    setIsReply(false);
                    dispatch(DeleteReply());
                    }
                  else {
                    socket.emit("text_message", {
                      message: linkify(reply),
                      reply: linkify(value),
                      conversation_id: room_id,
                      from: user_id,
                      to: current_conversation.user_id,
                      type: "reply",
                    });
                    setValue("");
                    setIsReply(false);
                    dispatch(DeleteReply());
                  }
                }}
              >
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
