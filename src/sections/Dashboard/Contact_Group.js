import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import {
  Bell,
  CaretRight,
  Prohibit,
  Star,
  Trash,
  X,
} from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import AntSwitch from "../../components/AntSwitch";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriends, ToggleSidebar, UpdateSidebarType } from "../../redux/slices/app";
import { socket } from "../../socket"
import { useEffect } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose, handleBlocked, block }) => {
  const dispatch = useDispatch(); 
  const { user_id } = useSelector((state) => state.conversation.direct_chat.current_conversation);
  const { user_id_user} = useSelector((state)=>state.app.user._id)
  const handleBlock = (e) => {
    if (block === 'Block') {
      let id_array = []
      id_array.push(user_id); 
      id_array.push(user_id_user);  
      socket.emit("Account_Block", (id_array));
        dispatch(FetchFriends())
      handleBlocked("Unblock");
    }
    else {
      socket.emit("Account_Unblock", (user_id));
      dispatch(FetchFriends())
      handleBlocked("Block");
    }
    handleClose();
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{block} this contact</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {block === "Block"
            ? "Are you sure you want to block this Contact?"
            : "Do you want to Unblock this Contact?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleBlock();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const DeleteChatDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Delete this chat</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this chat?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};
const Contact_Group = () => {

  const dispatch = useDispatch();
  const details = useSelector((state) => state.conversation);
  const { current_conversation } = details.group_chat;
  const theme = useTheme();
  const [block, setBlock] = useState("Block");
  const isDesktop = useResponsive("up", "md");
  const data = useSelector((state) => state.app.friends);
  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  useEffect(() => {
    data.map((el) => {
      if (el.id === current_conversation?.user_id)
      {
        if (el.isblock)
        {
          setBlock("Unblock");
        }  
      }
      return el; 
    })
  }, [data])
  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleBlocked = (value) => {
    setBlock(value);
  };
  const data_user = current_conversation?.participants; 
  const userComponents = data_user?.map((el) => (
    <React.Fragment key={`${el.firstName}-${el.lastName}`}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar src={faker.image.imageUrl()} alt={faker.name.fullName()} />
        <Stack direction="column" spacing={0.5}>
          <Typography variant="subtitle2">{`${el.firstName} ${el.lastName}`}</Typography>
          <Typography variant="caption">{el?.about}</Typography>
        </Stack>
      </Stack>
    </React.Fragment>
  ));
  return (
    <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
            spacing={3}
          >
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton
              onClick={() => { dispatch(ToggleSidebar())}}
            >
              <X />
            </IconButton>
          </Stack>
        </Box>
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
            "&::-webkit-scrollbar": { display: "none" },
          }}
          p={3}
          spacing={3}
        >
          <Stack alignItems="center" direction="column" spacing={2}>
            <Avatar
              src={current_conversation?.img}
              alt={faker.name.firstName()}
              sx={{ height: 120, width: 120 }}
            />
            <Stack spacing={0.5}>
              <Typography variant="article" fontWeight={600}>
                {current_conversation?.name}
              </Typography>
            </Stack>
          </Stack>
         <Divider/>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Typography variant="subtitle2">Media, Links & Docs</Typography>
            <Button
              onClick={() => {
                dispatch(UpdateSidebarType("SHARED"));
              }}
              endIcon={<CaretRight />}
            >
              401
            </Button>
          </Stack>
          <Stack direction={"row"} alignItems="center" spacing={2}>
            {[1, 2, 3].map((el) => (
              <Box>
                <img src={faker.image.city()} alt={faker.internet.userName()} />
              </Box>
            ))}
          </Stack>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Star size={21} />
              <Typography variant="subtitle2">Starred Messages</Typography>
            </Stack>

            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("STARRED"));
              }}
            >
              <CaretRight />
            </IconButton>
          </Stack>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Bell size={21} />
              <Typography variant="subtitle2">Mute Notifications</Typography>
            </Stack>
            <AntSwitch />
          </Stack>
          <Divider />
          <Typography variant="body2">Group Members</Typography>
          {userComponents}
          <Divider />
          <Stack direction="row" alignItems={"center"} spacing={2}>
            <Button
              onClick={() => {
                setOpenBlock(true);
              }}
              fullWidth
              startIcon={<Prohibit />}
              variant="outlined"
              sx={{
                "&:hover": {
                  backgroundColor:
                    block === "Block"
                      ? theme.palette.mode === "light"
                        ? "#FFEFEF"
                        : "#281E25"
                      : null,
                  border: block === "Block" ? "1px solid red" : null,
                },

                color: block === "Unblock" ? "" : "red",
                border: block === "Unblock" ? "" : "1px solid red",
              }}
            >
              {block}
            </Button>
            <Button
              onClick={() => {
                setOpenDelete(true);}}
              fullWidth
              startIcon={<Trash />}
              variant="outlined"
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {openBlock && (
        <BlockDialog
          open={openBlock}
          handleClose={handleCloseBlock}
          handleBlocked={handleBlocked}
          block = {block}
        />
      )}
      {openDelete && (
        <DeleteChatDialog open={openDelete} handleClose={handleCloseDelete} />
      )}
    </Box>
  );
};
export default Contact_Group;