"use client";

import { quaxios } from "@/axios/api";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllUsers,
  setFriendRequestSent,
  acceptFriendRequest,
  unfriendUserAction,
  rejectFriendRequest,
} from "@/redux/userSlice";
import { RootState } from "@/redux/store";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ExplorePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const users = useSelector((state: RootState) => state.user.users);

  const [friends, setFriends] = useState<any>([]);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const getFriends = async () => {
    const res = await quaxios.get(`/user/friends/${user?.uid}/`);
    // dispatch(setAllFriends(res.data))

    setFriends(res.data);
  };

  const getUsers = async (userId: string) => {
    setIsLoading(true);
    const res = await quaxios.get(`/user/${userId}`, {
      params: {
        limit,
      },
    });

    dispatch(setAllUsers(res.data));
    setIsLoading(false);
  };

  const getFriendRequests = async () => {
    const res = await quaxios.get(
      `/user/friends/get-friend-requests/${user?.uid}`
    );
  };

  const sendFriendRequest = async (receiverId: string) => {
    const data = {
      sender_id: user?.uid,
      receiver_id: receiverId,
    };
    const res = await quaxios.post("/user/friends/send-request", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(setFriendRequestSent(data));
  };

  const cancelFriendRequest = async (ownId: string, otherUserId: string) => {
    const res = await quaxios.post(
      "/user/friends/cancel-friend-request",
      { ownId, otherUserId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const unfriendUser = async (ownId: string, otherUserId: string) => {
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
  const logData = () => {};
  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) {
      router.push("/auth");
      return;
    } else {
      getFriends();
      getFriendRequests();
    }
  }, []);
  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) {
      router.push("/auth");
      return;
    } else {
      getUsers(user!.uid);
    }
  }, [limit]);
  return (
    <ProtectedRoute>
      <div className="px-4">
        <p className="font-semibold text-2xl py-6 ">Quackers</p>

        {users &&
          users.map((e: any) => (
            <div key={e.id} className="py-3 ">
              <div className="flex  justify-between w-full items-center">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={e.profile_url ?? "/images/default-user-icon.png"}
                  />
                  <p>{e.username}</p>
                </div>
                <div>
                  {!e.is_sender_self && e.friend_request_pending ? (
                    <div className="space-x-4">
                      <button>
                        <img
                          src="/images/check-mark-icon.svg"
                          className="h-8 w-8"
                        />
                      </button>
                      <button>
                        <img
                          src="/images/cancel-icon-red.svg"
                          className="h-8 w-8"
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        e.id === user?.uid
                          ? logData()
                          : e.is_friend
                          ? unfriendUser(user!.uid, e.id)
                          : e.friend_request_pending && e.is_sender_self
                          ? cancelFriendRequest(user!.uid, e.id)
                          : sendFriendRequest(e.id)
                      }
                      className={`font-  rounded-md px-4 py-1 text-sm ${
                        e.id === user?.uid
                          ? ""
                          : e.is_friend
                          ? "bg-red-500"
                          : e.friend_request_pending && e.is_sender_self
                          ? "bg-[#303030]"
                          : "bg-quac-primary"
                      }`}
                    >
                      {e.id === user?.uid
                        ? ""
                        : e.is_friend
                        ? "Unfriend"
                        : e.friend_request_pending && e.is_sender_self
                        ? "Cancel"
                        : "Send Request"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        {users?.length > 0 && !users[0].is_last_element && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
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

// if(self){
//   hidden
// } else if(friend){
//   red
// } else if(not friend and not self and not pending request){
//   purple
// } else if (not friend and not self and pending request){
//   grey
// }
