"use client";
import React, { useEffect, useState } from "react";

import "react-image-crop/dist/ReactCrop.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FeedPost from "@/components/posts/FeedPost";
import { useDispatch, useSelector } from "react-redux";
import { quaxios } from "@/axios/api";
import {
  setAllPosts,
  toggleLike,
  postComment,
  loadComments,
} from "@/redux/postSlice";
import { RootState } from "@/redux/store";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import ProtectedRoute from "@/components/ProtectedRoute";
// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.

export default function App() {
  const dispatch = useDispatch();
  const feedPosts = useSelector((state: RootState) => state.post.posts);
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const [currentUser, setCurrentUser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const getPosts = async () => {
    setIsLoading(true);
    const res = await quaxios.get(`/post/get-all-posts/${user?.uid}/`, {
      params: {
        currentPage,
        limit,
      },
    });

    dispatch(setAllPosts(res.data));
    setIsLoading(false);
  };

  const fetchComments = async (postId: number, pageSize = 5) => {
    const result = await quaxios.post(
      "/post/fetch-comments",
      { postId, pageSize },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(loadComments({ postId, comments: result.data }));
  };

  const toggleLikeHandler = async (id: number) => {
    dispatch(toggleLike(id));

    const res = await quaxios.post("/post/toggle-like", {
      userId: user?.uid,
      postId: id,
    });
  };

  const postCommentHandler = async (data: any) => {
    const res = await quaxios.post("/post/post-comment", {
      comment: data.comment,
      userId: user?.uid,
      postId: data.postId,
    });
    dispatch(postComment(res.data[0]));
  };

  const getUserProfile = async (userId: string) => {
    const res = await quaxios.get(`/user/profile/${userId}`);
    setCurrentUser(res.data[0]);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) {
      router.push("/auth");
      return;
    } else {
      getUserProfile(user?.uid);
    }
  }, [currentPage]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) {
      router.push("/auth");
      return;
    } else {
      getPosts();
    }
  }, [limit]);

  return (
    <ProtectedRoute>
      <div className=" pb-[10vh]">
        {/* <FeedPost /> */}

        {/* {feedPosts && feedPosts.map((e) => <div key={e.id}>{e.text}</div>)} */}
        {feedPosts?.length > 0 &&
          feedPosts.map((e) => (
            <FeedPost
              key={e.id}
              postData={e}
              toggleLike={toggleLikeHandler}
              fetchComments={fetchComments}
              postComment={postCommentHandler}
              currentUser={currentUser}
            />
          ))}

        {feedPosts?.length > 0 && !feedPosts[0].is_last_element && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                setCurrentPage((prevCount) => prevCount + 1);
                setLimit((prevCount) => prevCount + 10);
              }}
              className=" px-2 py-1 rounded-md text-sm border"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
