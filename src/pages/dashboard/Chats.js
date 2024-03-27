import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users,
} from "phosphor-react";
import Tooltip from "@mui/material/Tooltip";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import BottomNav from "../../layouts/dashboard/BottomNav";
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import Friends from "../../sections/Dashboard/Friends";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { FetchDirectConversations } from "../../redux/slices/conversation";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { ForwardMessage } from "../../redux/slices/app"; 
const user = window.localStorage.getItem("user");
const user_id = JSON.parse(user);
const message = [{ title: "Pinned" }, { title: "Archived" }];
const Chats = () => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const dispatch = useDispatch();
  const { conversations } = useSelector((state) => state.conversation.direct_chat);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(conversations);
  const forward = useSelector((state)=>state.app.forward); 
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;

    const filteredData = conversations?.filter((el) =>
      el.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearch(searchValue);
    setFilteredData(filteredData);
  };
  useEffect(() => {
    socket.emit("get_direct_conversations", { user_id }, (data) => {
      dispatch(FetchDirectConversations({ conversations: data }));
    });
  }, []);
  
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: isDesktop ? 320 : "100vw",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        {!isDesktop && (
          <BottomNav />
        )}
        <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
          <Stack
            alignItems={"center"}
            justifyContent="space-between"
            direction="row"
          >
            <Typography variant="h5">{!forward ? "Chats" : <Stack sx={{ display: 'flex', flexDirection: 'row', gap: '2px', alignItems: 'center' }}>
              <KeyboardBackspaceIcon onClick={() => {
                dispatch(ForwardMessage());
              }} />
              <Stack>Forward to...</Stack></Stack>}</Typography>
            <Stack direction={"row"} alignItems="center" spacing={1}>
              <Tooltip title="Friends" placement="bottom">
                <IconButton
                  onClick={() => {
                    handleOpenDialog();
                  }}
                  sx={{ width: "max-content" }}
                >
                  <Users />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearchChange}
              />
            </Search>
          </Stack>
          <Stack spacing={1}>
          </Stack>
          <Stack
            sx={{
              flexGrow: 1,
              overflow: "scroll",
              " &::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Stack
              spacing={2.4}
              sx={{ "&::-webkit-scrollbar": { display: "none" } }}
            >
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                All Chats
              </Typography>
              {filteredData?.filter((el) => !el.pinned)
                .map((el, idx) => {
                  return (
                    <Stack key={idx} direction={"row"}>
                      <ChatElement {...el} />
                    </Stack>
                  );
                })}
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Chats;
