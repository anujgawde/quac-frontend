"use client";
import { quaxios } from "@/axios/api";
import Loader from "@/components/Loader";
import FeedPost from "@/components/posts/FeedPost";
import ProtectedRoute from "@/components/ProtectedRoute";
import EditProfile from "@/components/user/EditProfile";
import FriendRequestModal from "@/components/user/FriendRequestModal";
import FriendsModal from "@/components/user/FriendsModal";
import {
  loadComments,
  postComment,
  setAllPosts,
  toggleLike,
} from "@/redux/postSlice";
import { RootState } from "@/redux/store";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUserAction,
} from "@/redux/userSlice";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [currentUser, setCurrentUser] = useState<any>({});

  const [isFriendRequestOpen, setIsFriendRequestOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const router = useRouter();
  //   const [userPosts, setUserPosts] = useState([]);
  const dispatch = useDispatch();
  const userPosts = useSelector((state: RootState) => state.post.posts);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const [friendRequests, setFriendRequests] = useState<any>([]);
  const [friends, setFriends] = useState<any>([]);

  const acceptFriendRequests = async (value: number) => {
    setCurrentUser((prevState: any) => ({
      ...prevState,
      friend_count: parseInt(prevState.friend_count) + 1,
      friend_request_count: parseInt(prevState.friend_request_count) - 1,
    }));
    const res = await quaxios.post(
      "/user/friends/accept-request",
      {
        friend_request_id: value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(acceptFriendRequest(res.data));
    const currentFriendRequest: any = friendRequests.find(
      (e: any) => e.friend_request_id == value
    );
    const { friend_request_id, receiver_id, sender_id, ...rest } =
      currentFriendRequest;

    const filteredFriendRequests = friendRequests.filter(
      (e: any) => e.friend_request_id != value
    );
    setFriendRequests(filteredFriendRequests);
    setFriends([...friends, rest]);
  };

  const rejectFriendRequests = async (value: number) => {
    setCurrentUser((prevState: any) => ({
      ...prevState,
      friend_request_count: parseInt(prevState.friend_request_count) - 1,
    }));
    const res = await quaxios.post(
      "/user/friends/reject-request",
      {
        friend_request_id: value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(rejectFriendRequest(res.data));

    const filteredFriendRequests = friendRequests.filter(
      (e: any) => e.friend_request_id != value
    );
    setFriendRequests(filteredFriendRequests);
  };

  const getUserPosts = async (userId: string) => {
    if (userId === "") {
      return;
    }

    setIsLoading(true);
    const res = await quaxios.get(`/user/posts/${userId}`, {
      params: { pageSize },
    });
    dispatch(setAllPosts(res.data));
    setIsLoading(false);
  };

  //    This function will be in the login process, profile will get stored in the local storage
  const getUserProfile = async (userId: string) => {
    const res = await quaxios.get(`/user/profile/${userId}`);
    setCurrentUser(res.data[0]);
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

  const toggleEditProfile = () => {
    setIsEditProfileOpen(false);
  };
  const toggleFriendRequestModal = () => {
    setIsFriendRequestOpen(false);
  };

  const toggleFriendsModal = () => {
    setIsFriendsOpen(false);
  };

  const unfriendUser = async (ownId: string, otherUserId: string) => {
    setCurrentUser((prevState: any) => ({
      ...prevState,
      friend_count: parseInt(prevState.friend_count) - 1,
    }));
    const updatedFriendsArray = friends.filter((e: any) => e.id != otherUserId);
    setFriends(updatedFriendsArray);
    dispatch(unfriendUserAction({ other_user: otherUserId }));

    const res = await quaxios.post(
      "/user/friends/unfriend-user",
      { ownId, otherUserId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };
  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) {
      router.push("/auth");
      return;
    } else {
      getUserProfile(user!.uid);
    }
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) {
      router.push("/auth");
      return;
    } else {
      getUserPosts(user!.uid);
    }
  }, [pageSize]);
  return (
    <ProtectedRoute>
      <div className="py-4">
        <div className="profile-banner">
          <div className="flex justify-between items-center px-4 space-x-4">
            {/* <div className="rounded-full h-16 w-16 bg-white"></div> */}

            <img
              className="h-16 w-16 rounded-full"
              src={currentUser?.profile_url ?? "/images/default-user-icon.png"}
            />
            <div className="flex-1 space-y-2">
              <p className="">{currentUser?.username}</p>
              <div className="flex space-x-2 w-full justify-start text-sm items-center">
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="w-full py-1 bg-[#363636]  rounded-md text-white"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
          <div className="text-sm px-4 py-4">
            <p className="font-semibold">
              {currentUser?.first_name} {currentUser?.last_name}
            </p>
            <p>{currentUser?.bio}</p>
          </div>

          <div className="border-t border-b border-[#303030] flex items-center justify-between py-2 text-sm px-8 text-[#A8A8A8]">
            <button>
              <span className="font-bold text-white block">
                {currentUser?.post_count}
              </span>{" "}
              posts
            </button>
            <button
              onClick={() => {
                setIsFriendsOpen(true);
              }}
            >
              <span className="font-bold text-white block">
                {currentUser?.friend_count}
              </span>{" "}
              friends
            </button>
            <button onClick={() => setIsFriendRequestOpen(true)}>
              <span className="font-bold text-white block">
                {currentUser?.friend_request_count}
              </span>{" "}
              requests
            </button>
          </div>

          <div className="border-b border-[#303030] text-sm flex justify-center py-2  items-center font-semibold">
            Your Quacs
          </div>
        </div>
        <div className="pb-8">
          {userPosts?.length > 0 &&
            userPosts.map((e: any, index: number) => (
              <FeedPost
                key={index}
                postData={e}
                toggleLike={toggleLikeHandler}
                fetchComments={fetchComments}
                postComment={postCommentHandler}
                currentUser={currentUser}
              />
            ))}
        </div>
        {userPosts?.length > 0 && !userPosts[0].is_last_element && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                setPageSize((prevCount) => prevCount + 10);
              }}
              className=" px-2 py-1 rounded-md text-sm border"
            >
              Show More
            </button>
          </div>
        )}
        {isEditProfileOpen && (
          <EditProfile
            toggleEditProfile={toggleEditProfile}
            user={currentUser}
            auth={auth}
          />
        )}

        {isFriendRequestOpen && (
          <FriendRequestModal
            currentUser={currentUser}
            toggleFriendRequestModal={toggleFriendRequestModal}
            acceptFriendRequest={acceptFriendRequests}
            rejectFriendRequest={rejectFriendRequests}
          />
        )}

        {isFriendsOpen && (
          <FriendsModal
            toggleFriendsModal={toggleFriendsModal}
            currentUser={currentUser}
            unfriendUser={unfriendUser}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
