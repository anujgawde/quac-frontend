import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PostState {
  posts: Array<any>;
}

const initialState: PostState = {
  posts: [
    // Commented this to prevent from loading the array initially which causes temporary ui render for a few seconds
    // {
    //   comments: [],
    // },
  ],
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setAllPosts: (state, action) => {
      console.log(action.payload);
      return {
        posts: action.payload,
      };
    },
    toggleLike: (state, action) => {
      const currentPost = state.posts.findIndex((e) => e.id == action.payload);
      state.posts[currentPost] = {
        ...state.posts[currentPost],
        like_count: state.posts[currentPost].is_liked
          ? parseInt(state.posts[currentPost].like_count) - 1
          : parseInt(state.posts[currentPost].like_count) + 1,
        is_liked: !state.posts[currentPost].is_liked,
      };
    },
    addPost: (state, action) => {
      return {
        posts: [...state.posts, action.payload],
      };
    },
    loadComments: (state, action) => {
      const currentPost = state.posts.findIndex(
        (e) => e.id == action.payload.postId
      );
      state.posts[currentPost].comments = action.payload.comments;
      // return state.posts[currentPost].comments ;
    },
    postComment: (state, action) => {
      const currentPost = state.posts.findIndex(
        (e) => e.id == action.payload.post_id
      );
      state.posts[currentPost].comments = [
        ...state.posts[currentPost].comments,
        action.payload,
      ].reverse();
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAllPosts, addPost, toggleLike, postComment, loadComments } =
  postSlice.actions;

export default postSlice.reducer;
