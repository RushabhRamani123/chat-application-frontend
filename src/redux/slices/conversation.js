import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";

const user = window.localStorage.getItem("user");

const user_id = JSON.parse(user);
function getDayOrTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  if (date < oneWeekAgo) {
    // return the day
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } else {
    // return the time
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
}

// example usage
const dateString = "2024-02-14T10:32:09.346Z";
console.log(getDayOrTime(dateString)); // output: "Thursday" or "10:32 AM"
const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {
    conversations: [],
    current_messages: [],
    current_conversation: null
  },
};
const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
/*------------------------------------------------- individual Chat----------------------------------------------- */
    fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        console.log("fdf" + JSON.stringify(el));
        // console.log("fdf" + );
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );
        return {
          id: el._id,
          user_id: user?._id,
          name: `${user?.firstName} ${user?.lastName}`,
          online: user?.status === "Online",
          img: faker.image.avatar(),
          msg: el.messages[el.messages.length - 1]?.text, 
          time:getDayOrTime(el.messages[el.messages.length - 1].created_at),
          unread: 0,
          pinned: false,
          about: user?.about,
        };
      });
      console.log((list));
      state.direct_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              id: this_conversation._id._id,
              user_id: user?._id,
              name: `${user?.firstName} ${user?.lastName}`,
              online: user?.status === "Online",
              img: faker.image.avatar(),
              msg: faker.music.songName(),
              time: "9:36",
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      state.direct_chat.conversations.push({
        id: this_conversation._id._id,
        user_id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status === "Online",
        img: faker.image.avatar(),
        msg: "",
        time: "9:36",
        unread: 0,
        pinned: false,
      });
    },
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
      }));
      state.direct_chat.current_messages = formatted_messages;
    },
    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },
/*------------------------------------------------- Group Chat----------------------------------------------- */
    fetchGroupData(state, action) {
      const list = action.payload.conversations.map((el) => {
        console.log("fdf" + JSON.stringify(el));
        // console.log("fdf" + );
        return {
          id: el._id,
          name: el.group_name,
          participants: el.participants,
          // img: faker.image.avatar(),
          // msg: el.messages[el.messages.length - 1]?.text, 
          // time:getDayOrTime(el.messages[el.messages.length - 1].created_at),
          // unread: 0,
          // pinned: false,
          // about: user?.about,
        };
      });
      console.log((list));
      state.group_chat.conversations = list;
    },
    fetchGroupMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: !(el.from === user_id),
        outgoing: el.from === user_id,
      }));
      state.group_chat.current_messages = formatted_messages;
    },
    setGroupCurrentConversation(state, action) {
      state.group_chat.current_conversation = action.payload.current;
    },
    addGroupDirectMessage(state, action) {
      state.group_chat.current_messages.push(action.payload.message);
    },
  },
});
export default slice.reducer;
/*------------------------------------------------- individual Chat----------------------------------------------- */
export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchDirectConversations({ conversations }));
  };
};
export const AddDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation({ conversation }));
  };
};
export const UpdateDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversation({ conversation }));
  };
};
export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch) => {
    dispatch(slice.actions.setCurrentConversation(current_conversation));
  };
};
export const FetchCurrentMessages = ({messages}) => {
  return async(dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({messages}));
  }
}
export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage({ message }));
  }
};
/*------------------------------------------------- Group Chat----------------------------------------------- */
export const FetchGroupMessages = ({ messages }) => {
  return async(dispatch) => {
    dispatch(slice.actions.fetchGroupMessages({messages}));
  }
}
export const FetchDirectGroupData = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchGroupData({ conversations}));
  };
};
export const SetGroupCurrentConversation = (current_conversation) => {
  return async (dispatch) => {
    dispatch(slice.actions.setGroupCurrentConversation(current_conversation));
  };
};
export const AddGroupDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addGroupDirectMessage({ message }));
  }
};