"use client";
import { quaxios } from "@/axios/api";
import { useEffect, useState } from "react";
import Loader from "../Loader";

export default function FriendsModal(props: any) {
  const [friends, setFriends] = useState<any>([]);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFriends = async () => {
    setIsLoading(true);

    const res = await quaxios.get(`/user/friends/${props?.currentUser.id}/`, {
      params: {
        pageSize: pageSize,
      },
    });
    // dispatch(setAllFriends(res.data))
    setFriends(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFriends();
  }, [pageSize]);

  return isLoading ? (
    <div className="flex flex-col justify-center h-[80vh]">
      <Loader />
    </div>
  ) : (
    <>
      <div className="h-full w-full z-50 bg-black fixed py-6 px-4 top-0 ">
        <div className="flex items-center justify-between py-4">
          <button onClick={() => props.toggleFriendsModal(false)} className="">
            <img src="/images/cancel-icon.svg" className="h-6 w-6" />
          </button>
          <p className=" font-bold">Friends</p>
          <div></div>
        </div>

        {friends.map((e: any) => (
          <div
            key={e.id}
            className="flex w-full py-4 items-center text-sm space-x-4"
          >
            <img
              className="h-12 w-12 rounded-full"
              src={e.profile_url ?? "/images/default-user-icon.png"}
            />
            <div className="flex-1 leading-0">
              <p className="font-semibold">
                {e.first_name} {e.last_name}
              </p>
              <p>{e.username}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => props.unfriendUser(props.currentUser.id, e.id)}
                className="px-4 py-1 font-semibold rounded-md bg-red-500"
              >
                Unfriend
              </button>
            </div>
          </div>
        ))}

        {friends?.length > 0 && !friends[0].is_last_element && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                console.log("oinside");
                setPageSize((prevCount) => prevCount + 10);
              }}
              className=" px-2 py-1 rounded-md text-sm border"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </>
  );
}
