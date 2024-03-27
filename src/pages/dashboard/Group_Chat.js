import React, { useEffect, useState } from "react";
import {Box,Stack,Typography,IconButton,
Link,
  Divider,
} from "@mui/material";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import useResponsive from "../../hooks/useResponsive";
import CreateGroup from "../../sections/Dashboard/CreateGroup";
import { useSelector } from "react-redux";
import { FetchDirectGroupData} from "../../redux/slices/conversation";
import { useDispatch } from "react-redux";
import GroupChatElement from "../../components/GroupChatElement";
import { socket } from "../../socket";
import BottomNav from "../../layouts/dashboard/BottomNav";
const Group_Chat = () => {
  // const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const dispatch = useDispatch();
  const {conversations} = useSelector((state) => state.conversation.group_chat);
  const [openDialog, setOpenDialog] = useState(false);
  const group = useSelector((state) => state.app.user.group);
  const groups = useSelector((state) => state.app.group);
  useEffect(() => {
    // replace with the actual user id
    socket.emit("get_group", (data) => {
      // console.log(data);
      // this data is the list of conversations
      // dispatch action
      dispatch(FetchDirectGroupData({ conversations: data }));
    });
    // dispatch(FetchGroupData(group));
  }, [group]);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  }; 
  const theme = useTheme();
  return (
    <>
     
        {/* Left */}

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
          // Bottom Nav
          <BottomNav />
        )}
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
                {conversations?.map((gp)=>(
                  <GroupChatElement {...gp} />
                ))}
                
                </Stack>
                
              </Stack>
              </SimpleBar>
            </Stack>
          </Stack>
        </Box>

        {/* Right */}
      
      {openDialog && (
        <CreateGroup open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Group_Chat;
