import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Link,
  Divider,
} from "@mui/material";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import CreateGroup from "../../sections/Dashboard/CreateGroup";
import { useSelector } from "react-redux";
const Group = () => {
  const {conversations} = useSelector((state) => state.conversation.direct_chat);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const theme = useTheme();
  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        {/* Left */}

        <Box
          sx={{
            overflowY: "scroll",

            height: "100vh",
            width: 320,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,

            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            " &::-webkit-scrollbar": { display: "none"} 
          }}
        >
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" , }}>
            <Stack
              alignItems={"center"}
              justifyContent="space-between"
              direction="row"
            >
              <Typography variant="h5">Groups</Typography>
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>
            <Stack
              justifyContent={"space-between"}
              alignItems={"center"}
              direction={"row"}
            >
              <Typography variant="subtitle2" sx={{}} component={Link}>
                Create New Group
              </Typography>
              <IconButton onClick={handleOpenDialog}>
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              sx={{
                flexGrow: 1,
                overflow: "scroll",
                height: "100%",
                widht: "100%",
                " &::-webkit-scrollbar": { display: "none"}
              }}
            >
              <SimpleBar timeout={500} clickOnTrack={false}>
              <Stack spacing={2.4}>
               
              
              <Stack spacing={2.4 } sx={{"&::-webkit-scrollbar": { display: "none"}}}>
                <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                  Group Chats
                </Typography>
              
                {conversations?.filter((el) => !el.pinned).map((el, idx) => {
                  return <ChatElement {...el} />;
                })}
                </Stack>
                
              </Stack>
              </SimpleBar>
            </Stack>
          </Stack>
        </Box>

        {/* Right */}
      </Stack>
      {openDialog && (
        <CreateGroup open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Group;
