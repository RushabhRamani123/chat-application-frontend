import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
const user = window.localStorage.getItem("user");
const user_id = JSON.parse(user);
function time(date, divider) {
  const date_ = new Date(date);
  const value = date_.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return value;
}
function compare(dates, divider) {
  let d = [];
  divider.map((el) => {
    if (el.time > dates) {
      d.push();
    }
    return el;
  });
}
function checkerList(data) {
  const { messages } = data;
  const { divider } = data;
  let data_packet = [];

  messages.map((el) => {
    data_packet = compare(el.created_at, divider);
    return el;
  });
}
function getDayOrTime(dateString, a) {
  const str = dateString?.toString();
  const date = new Date(str);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  oneWeekAgo.setHours(12, 0, 0, 0);
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  oneDayAgo.setHours(12, 0, 0, 0);
  const today = new Date();
  // Set the time to 00:00:00 for today . 
  //what does it means When we use today.setHours(0, 0, 0, 0);,
  //  we are setting the hours, minutes, seconds, and milliseconds 
  // of the today date object to 0. This means that the time part of the today date object will be set to 00:00:00(midnight).
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  if (date > oneWeekAgo && oneDayAgo > date) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  } else if (oneDayAgo < date && date < today) {
    return "yesterday";
  } else if (date >= today && date < tomorrow) {
    // Check if the date is today
    if (a === 1) return "Today";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}
const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {
    conversations: [],
    current_messages: [],
    current_conversation: null,
  },
};
const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    /*------------------------------------------------- individual Chat----------------------------------------------- */
    fetchDirectConversations(state, action) {
      console.log(action.payload.conversations);
      console.log(action.payload.conversations);
      const list = action.payload.conversations.map((el) => {
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
          reply: el.messages[el.messages.length - 1]?.reply,
          time: getDayOrTime(el.messages[el.messages.length - 1]?.created_at),
          unread: 0,
          pinned: false,
          about: user?.about,
        };
      });
      console.log(list);
      state.direct_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.direct_chat.conversations = state.direct_chat.conversations?.map(
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
      state.direct_chat.conversations = state.direct_chat.conversations?.filter(
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
      const data = action.payload.messages;
      const { messages } = data;
      const { divider } = data;
      console.log(divider);
      checkerList(data);
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        to: el.to,
        from: el.from,
        type: el.type === "divider" ? "divider" : "msg",
        subtype: el.type,
        message:
          el.type === "divider" ? getDayOrTime(el.created_at, 1) : el.text,
        star: el.star,
        reply: el.reply,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
        about: el?.about,
        time: time(el.created_at),
      }));
      state.direct_chat.current_messages = formatted_messages;
    },
    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },
    /*------------------------------------------------- Group Chat----------------------------------------------- */
    fetchGroupData(state, action) {
      console.log("this is the group data : "); 
      console.log(action.payload.conversations);
      const list = action.payload.conversations.map((el) => {
        return {
          id: el._id,
          name: el.group_name,
          participants: el.participants,
          img: faker.image.avatar(),
          msg: el.messages[el.messages.length - 1]?.text,
          time:getDayOrTime(el.messages[el.messages.length - 1]?.created_at),
          unread: 0,
          pinned: false,
        };
      });
      console.log(list);
      state.group_chat.conversations = list;
    },
    fetchGroupMessages(state, action) {
      console.log("This is the group message : "); 
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        to: el.to,
        from: el.from,
        type: el.type === "divider" ? "divider" : "msg",
        subtype: el.type,
        message:
        el.type === "divider" ? getDayOrTime(el.created_at, 1) : el.text,
        star: el.star,
        reply: el.reply,
        incoming: !(el.from === user_id),
        outgoing: el.from === user_id,
        about: el?.about,
        time: time(el.created_at),
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
export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({ messages }));
  };
};
export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage({ message }));
  };
};
/*------------------------------------------------- Group Chat----------------------------------------------- */
export const FetchGroupMessages = ({ messages }) => {
  return async (dispatch) => {
    dispatch(slice.actions.fetchGroupMessages({ messages }));
  };
};
export const FetchDirectGroupData = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchGroupData({ conversations }));
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
  };
};
/*--------------------------------------------------Forward Message-------------------------------------------------------------- */
