import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  users: Array<any>;
}

const initialState: UserState = {
  users: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      return {
        users: action.payload,
      };
    },
    setFriendRequestSent: (state, action) => {
      const currentUser = state.users.find(
        (e) => e.id === action.payload.receiver_id
      );
      const currentUserIndex = state.users.findIndex(
        (e) => e.id === action.payload.receiver_id
      );
      currentUser.friend_request_pending = true;
      state.users[currentUserIndex] = currentUser;
    },
    acceptFriendRequest: (state, action) => {
      const currentUser = state.users.find(
        (e) => e.id === action.payload.user_1
      );
      console.log(current(state.users));
      const currentUserIndex = state.users.findIndex(
        (e) => e.id === action.payload.user_1
      );
      currentUser.is_friend = true;
      state.users[currentUserIndex] = currentUser;
    },
    unfriendUserAction: (state, action) => {
      const currentUser = state.users.find(
        (e) => e.id === action.payload.other_user
      );
      const currentUserIndex = state.users.findIndex(
        (e) => e.id === action.payload.other_user
      );
      currentUser.is_friend = false;
      state.users[currentUserIndex] = currentUser;
    },
    rejectFriendRequest: (state, action) => {
      console.log("HELLO");
      const currentUser = state.users.find(
        (e) => e.id === action.payload.sender_id
      );
      const currentUserIndex = state.users.findIndex(
        (e) => e.id === action.payload.sender_id
      );
      currentUser.friend_request_pending = false;
      state.users[currentUserIndex] = currentUser;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAllUsers,
  setFriendRequestSent,
  acceptFriendRequest,
  unfriendUserAction,
  rejectFriendRequest,
} = userSlice.actions;

export default userSlice.reducer;
