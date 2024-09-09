"use client";

import { useEffect, useState } from "react";

export default function PostComments(props: any) {
  const [commentText, setCommentText] = useState("");
  // Functions:
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    console.log(props.currentPost);
    props.fetchComments(props.postId, pageSize);
  }, [pageSize]);

  return (
    <div className="h-full w-full z-50 bg-black fixed overflow-y-auto top-0 ">
      <div className="flex px-6 py-4">
        <button onClick={() => props.toggleIsCommentsOpen(false)} className="">
          <img src="/images/cancel-icon.svg" className="h-6 w-6" />
        </button>

        <div className="flex-1  justify-center flex font-semibold text-lg">
          Comments
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-b border-gray-700  py-4 px-6 space-x-2">
        <img
          className="h-8 w-8  rounded-full"
          src={
            props.currentUser?.profile_url ?? "/images/default-user-icon.png"
          }
        />
        <div className="rounded-full flex-1 flex border border-gray-700 p-2">
          <input
            onChange={(e) => setCommentText(e.target.value)}
            value={commentText}
            className=" bg-transparent text-sm flex-1 outline-none px-2"
            placeholder="got something to say?"
          />
          <button
            onClick={() => {
              props.postComment({
                comment: commentText,
                postId: props.postId,
                userId: props.currentUser?.uid,
              });
              setCommentText("");
            }}
            className="font-semibold text-quac-primary px-1 text-sm"
          >
            Post
          </button>
        </div>
      </div>
      <div className="overflow-y-auto">
        {props.currentPost?.comments?.map((e: any) => (
          <div key={e.id} className="py-4 px-6 flex space-x-4">
            <img
              className="h-8 w-8  rounded-full"
              src={e?.profile_url ?? "/images/default-user-icon.png"}
            />
            <div className="flex-1 text-sm">
              <p className="font-bold">{e.username}</p>
              <p>{e.comment}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="py-4 px-6 flex space-x-4">
        <div className="rounded-full h-8 w-8 bg-white "></div>
        <div className="flex-1 text-sm">
          <p className="font-bold">anuj_999</p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime,
            eum soluta minus labore quo, consequatur aut est eligendi, aliquid
            nulla excepturi temporibus libero perspiciatis nemo porro adipisci
            iste debitis eaque.
          </p>
        </div>
      </div>
      <div className="py-4 px-6 flex space-x-4">
        <div className="rounded-full h-8 w-8 bg-white "></div>
        <div className="flex-1 text-sm">
          <p className="font-bold">anuj_999</p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime,
            eum soluta minus labo
          </p>
        </div>
      </div>
      <div className="py-4 px-6 flex space-x-4">
        <div className="rounded-full h-8 w-8 bg-white "></div>
        <div className="flex-1 text-sm">
          <p className="font-bold">anuj_999</p>
          <p>Lorem ipsum dolor, sit amet consectetur</p>
        </div>
      </div> */}
      {props?.currentPost?.comments?.length > 0 &&
        !props.currentPost.comments[0].is_last_element && (
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
    </div>
  );
}
