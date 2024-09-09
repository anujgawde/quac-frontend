"use client";

import { quaxios } from "@/axios/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostDetail({
  params,
}: {
  params: { id: string; userid: string };
}) {
  const router = useRouter();

  const [postData, setPostData] = useState<any>();
  const getPost = async () => {
    const res = await quaxios.get(
      `/post/get-one-post/${params.userid}/${params.id}/`,
      {}
    );

    setPostData(res.data);
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="flex px-6 py-4">
          <button onClick={() => router.back()} className="">
            <img src="/images/cancel-icon.svg" className="h-6 w-6" />
          </button>

          <div className="flex-1  justify-center flex font-semibold text-lg">
            Post
          </div>
        </div>

        <div className="text-sm px-6 my-6 space-y-6">
          {/* User data */}
          <div className="flex items-start space-x-4">
            <img
              className="h-11 w-11 rounded-full"
              src={postData?.profile_url ?? "/images/default-user-icon.png"}
            />

            <div className="">
              <p className=" font-semibold">
                {postData?.first_name} {postData?.last_name}
              </p>

              <p className="text-xs">@ {postData?.username}</p>
            </div>
          </div>

          <div>{postData?.text}</div>
        </div>
      </div>
    </>
  );
}
