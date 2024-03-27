import React from "react";
import {
  Stack,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material";
import { useState,useEffect} from "react";
import { useTheme, alpha} from "@mui/material/styles";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import { Message_options} from "../../data";
import { YouTubeEmbed } from "react-social-media-embed";
import { useDispatch } from "react-redux";
import { GetReply } from "../../redux/slices/app";
import StarIcon from "@mui/icons-material/Star";
import {socket} from "../../socket";
import { useSelector } from "react-redux";
import { ForwardMessage } from "../../redux/slices/app";
const MessageOption = (Detail) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const type = useSelector((state) => state.app.chat_type);
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((el) => (
            <MenuItem
              onClick={(e) => {
                if (el.title === "Reply") {
                  console.log("The detail of the message",Detail);
                  dispatch(GetReply(Detail.message));
                }
                if (el.title === "Star message") {
                  if (type === "group")
                {
                    socket.emit("starmessage_Group",{Detail});
                }
                else 
                  socket.emit("starmessage", { Detail });
                }
                if (el.title === "Forward message") {
                  dispatch(ForwardMessage());
                }
                if (el.title === "Delete Message")
                {
                  socket.emit("deleteMessage",{Detail})
                }
              }}
            >
              {el.title}
            </MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};
const TextMsg = ({ el, menu }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.app);
  console.log("this is the user of the conversation::", user);
  const type = useSelector((state) => state.app.chat_type);
  const { current_conversation } = useSelector((state) => type === 'group' ? state.conversation.group_chat : state.conversation.direct_chat);
  return (
    <Stack
      direction="row"
      spacing={0.95}
      justifyContent={el.incoming ? "start" : "end"}
    >
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
        <Box
          direction="row"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "5px",
            left: 0,
            justifyContent: "flex-start",
          }}
        >
          <Avatar
            src={el.incoming?current_conversation?.img: user?.avatar}
            sx={{ height: 27 , width: 27 }}
          />
          <Typography
            sx={{ fontSize: "10px", fontWeight: "600" }}
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {!el.incoming
              ? user?.firstName + " " + user?.lastName
              : current_conversation?.name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            left: 0,
            justifyContent: "flex-start",
          }}
        >
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.message}
          </Typography>
        </Box>
        <Box
        direction="row"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
          left: 0,
          justifyContent: "flex-end",
        }}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            <Stack
              color={el.incoming ? theme.palette.text : "#fff"}
              sx={{ fontSize: "8px" }}
            >
              {el.time}
            </Stack>
            {/* <DoneAllIcon  sx={{ fontSize: "10px" ,color:el.incoming ? theme.palette.text : "#fff"}} /> */}
          </Stack>
        </Box>
      </Box>
      {menu && <MessageOption message={el} />}
      {/* {func && <Stack>hello this is rushaabh</Stack> } */}
    </Stack>
  );
};
const MediaMsg = ({ el, menu }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.app);
  console.log("this is the user of the conversation::", user);
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Box
          direction="row"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "5px",
            left: 0,
            justifyContent: "flex-start",
          }}
        >
          <Avatar
            src={el.incoming?current_conversation?.img: user?.avatar}
            sx={{ height: 27 , width: 27 }}
          />
          <Typography
            sx={{ fontSize: "10px", fontWeight: "600" }}
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {!el.incoming
              ? user?.firstName + " " + user?.lastName
              : current_conversation?.name}
          </Typography>
        </Box>
        <Box>
        <Stack spacing={1}>
          <img
            src={el.img}
            alt={el.message}
            style={{ maxHeight: 210, borderRadius: "10px" }}
          />
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.message}
          </Typography>
        </Stack>
        </Box>
        <Box
        direction="row"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
          left: 0,
          justifyContent: "flex-end",
        }}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            <Stack
              color={el.incoming ? theme.palette.text : "#fff"}
              sx={{ fontSize: "8px" }}
            >
              {el.time}
            </Stack>
            {/* <DoneAllIcon  sx={{ fontSize: "10px" ,color:el.incoming ? theme.palette.text : "#fff"}} /> */}
          </Stack>
        </Box>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};
const DocMsg = ({ el, menu }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.app);
  console.log("this is the user of the conversation::", user);
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
          <Box
          direction="row"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "5px",
            left: 0,
            justifyContent: "flex-start",
          }}
        >
          <Avatar
            src={el.incoming?current_conversation?.img: user?.avatar}
            sx={{ height: 27 , width: 27 }}
          />
          <Typography
            sx={{ fontSize: "10px", fontWeight: "600" }}
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {!el.incoming
              ? user?.firstName + " " + user?.lastName
              : current_conversation?.name}
          </Typography>
        </Box>
        <Box>
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Image size={48} />
            <Typography variant="caption">Abstract.png</Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.message}
          </Typography>
          {false ? (
            <StarIcon sx={{ color: "#F7D800", fontSize: "15px" }} />
          ) : null}
        </Stack>
        </Box>
        <Box
        direction="row"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
          left: 0,
          justifyContent: "flex-end",
        }}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            <Stack
              color={el.incoming ? theme.palette.text : "#fff"}
              sx={{ fontSize: "8px" }}
            >
              {el.time}
            </Stack>
            {/* <DoneAllIcon  sx={{ fontSize: "10px" ,color:el.incoming ? theme.palette.text : "#fff"}} /> */}
          </Stack>
        </Box>
      </Box>

      {menu && <MessageOption />}
    </Stack>
  );
};
const LinkMsg = ({ el, menu }) => {
  const theme = useTheme();
  const [url, setUrl] = useState("");
  const htmlString = el.message;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const url_element = doc.querySelector("a").href;
  const { user } = useSelector((state) => state.app);
  console.log("this is the user of the conversation::", user);
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  useEffect(() => {
    setUrl(el.message);

    // alert(url);
  }, [el.message]);

  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={window.innerWidth < 600 ? 0 : 1.5}
        py={window.innerWidth < 600 ? 0 : 1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: window.innerWidth < 600 ? "300px" : "max-content",
        }}
      >
        {/* {
          !el.incoming
            ? user?.firstName + " " + user?.lastName
            : current_conversation?.name
        } */}
        <Box
          direction="row"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "5px",
            left: 0,
            justifyContent: "flex-start",
            // paddingBottom: '5px',
            padding:'5px'
          }}
        >
          <Avatar
            src={el.incoming?current_conversation?.img: user?.avatar}
            sx={{ height: 27 , width: 27 }}
          />
          <Typography
            sx={{ fontSize: "10px", fontWeight: "600" }}
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {!el.incoming
              ? user?.firstName + " " + user?.lastName
              : current_conversation?.name}
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Stack
            direction="column"
            // spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Stack direction={"column"}>
              {url && (
                <>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <YouTubeEmbed
                      url={url_element}
                      width={window.innerWidth < 600 ? "300px" : "375px"}
                      style={{
                        borderRadius: window.innerWidth > 600 ? "5px" : "10px",
                        outline: "none",
                      }}
                      height="200px"
                    />
                  </div>
                </>
              )}
            </Stack>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
            px={window.innerWidth < 600 ? 1.5 : 0}
            py={window.innerWidth < 600 ? 1.5 : 0}
          >
            <div dangerouslySetInnerHTML={{ __html: el.message }}></div>
          </Typography>
          {false ? (
            <StarIcon sx={{ color: "#F7D800", fontSize: "15px" }} />
          ) : null}
        </Stack>
        <Box
        direction="row"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
          left: 0,
          justifyContent: "flex-end",
          padding:'5px'
        }}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            <Stack
              color={el.incoming ? theme.palette.text : "#fff"}
              sx={{ fontSize: "8px" }}
            >
              {el.time}
            </Stack>
          </Stack>
        </Box>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};
const ReplyMsg = ({ el, menu }) => {
  const theme = useTheme();
  // how to remove the sidebar using the css
  // const user = window.localStorage.getItem("user");
  // const user_id = JSON.parse(user);
  const { user } = useSelector((state) => state.app);
  console.log("this is the user of the conversation::", user);
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
          ? alpha(theme.palette.background.default, 1)
          : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Box
          direction="row"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "5px",
            left: 0,
            justifyContent: "flex-start",
            paddingBottom: '5px',
            backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          }}
        >
          <Avatar
            src={el.incoming?current_conversation?.img: user?.avatar}
            sx={{ height: 27 , width: 27 }}
          />
          <Typography
            sx={{ fontSize: "10px", fontWeight: "600" }}
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {!el.incoming
              ? user?.firstName + " " + user?.lastName
              : current_conversation?.name}
          </Typography>
        </Box>  
        <Box>
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{
               
              backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : "#212B36",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {el.message}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.reply}
          </Typography>
        </Stack>
        </Box>
        <Box
        direction="row"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
          left: 0,
          justifyContent: "flex-end",
          padding:'5px'
        }}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: "2px",
            }}
          >
            <Stack
              color={el.incoming ? theme.palette.text : "#fff"}
              sx={{ fontSize: "8px" }}
            >
              {el.time}
            </Stack>
            {/* <DoneAllIcon  sx={{ fontSize: "10px" ,color:el.incoming ? theme.palette.text : "#fff"}} /> */}
          </Stack>
        </Box>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};
const Timeline = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems={"center"} justifyContent="space-between">
      <Divider width="46%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {el.message}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};
export {
  Timeline,
  MediaMsg,
  LinkMsg,
  DocMsg,
  TextMsg,
  ReplyMsg,
  MessageOption,
};