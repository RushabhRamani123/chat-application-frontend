import React, { useEffect } from "react";
import * as Yup from "yup";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import { socket } from "../../socket";
import { useSelector } from "react-redux";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
// const [value, setValue] = useState([]);
const TAGS_OPTION = [];

const CreateGroupForm = ({ handleClose }) => {
  const {conversations} = useSelector((state) => state.conversation.direct_chat);
  useEffect(() => {
    const uniqueConversations = new Set();
    const options = [];

    conversations.forEach((conversation) => {
      if (!uniqueConversations.has(conversation.name)) {
        uniqueConversations.add(conversation.name);
        options.push({ name: conversation.name, id: conversation.user_id });
      }
    });

    TAGS_OPTION.splice(0, TAGS_OPTION.length, ...options);
  }, [conversations]);

  const NewGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),

    members: Yup.array().min(2, "Must have at least 2 members"),
  });

  const defaultValues = {
    title: "",

    tags: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data) => {
    try {
      //  API Call
      console.log("DATA", data);
    } catch (error) {
      console.error(error);
    }
  };
  const { title, members } = watch();
  const handleMemberChange = (event, newValue) => {
    setValue("members", newValue.map((member) => member.id));
  };
  console.log(title, members);
  return (
<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="title" label="Title" />
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={TAGS_OPTION}
          getOptionLabel={(option) => option.name}
          ChipProps={{ size: "medium" }}
          onChange={handleMemberChange}
        />
        <Stack
          spacing={2}
          direction={"row"}
          alignItems="center"
          justifyContent={"end"}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              socket.emit("createGroup", { title, members });
            }}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </FormProvider>  );
};

const CreateGroup = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      <DialogTitle>{"Create New Group"}</DialogTitle>
      <DialogContent sx={{ mt: 4 }}>
        <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
