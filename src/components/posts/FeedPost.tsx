"use client";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import PostComments from "./PostComments";

export default function FeedPost(props: any) {
  const router = useRouter();
  const post = props.postData;

  // Variables:
  const currentPost = useSelector((state: RootState) =>
    state.post.posts.find((e) => e.id == post.id)
  );
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);

  return isCommentsOpen == false ? (
    <div className="w-full text-sm border-gray-700  text-white px-4 mt-6">
      <div className="space-y-4 ">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 items-center font-bold">
            <img
              className="h-8 w-8  rounded-full"
              src={post.profile_url ?? "/images/default-user-icon.png"}
            />
            {/* <div className="bg-slate-500 rounded-full h-8 w-8"></div> */}
            <p>{post.username}</p>
          </div>

          {/* <div className="text-xs">More</div> */}
          <img src="/images/more-icon.svg" className="h-7 w-7" />
        </div>
        <p
          onClick={() =>
            router.push(`/post/${props.currentUser.id}/${post.id}`)
          }
        >
          {/* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum
          tempore minima, atque voluptatibus unde, id maxime soluta expedita,
          dolores laudantium eos qui repellendus culpa quaerat commodi dolore
          sit iste. Eos. */}
          {post.type == "text" ? post.text : post.urlArr}
        </p>
        <div className="flex items-center justify-between">
          <div className="space-x-4 flex items-center ">
            {!post.is_liked ? (
              <button onClick={() => props.toggleLike(post.id)}>
                <img className="h-6 w-6" src="/images/like-icon.svg" />
              </button>
            ) : (
              <button onClick={() => props.toggleLike(post.id)}>
                <img className="h-6 w-6" src="/images/liked-icon.svg" />
              </button>
            )}
            <button
              onClick={() => {
                setIsCommentsOpen(true);
                props.fetchComments(post.id);
              }}
            >
              <img className="h-6 w-6" src="/images/comment-icon.svg" />
            </button>

            {/* TODO: Add share button feature */}
            {/* <a
              href="https://api.whatsapp.com/send?text=www.google.com"
              data-action="share/whatsapp/share"
            >
              <img className="h-6 w-6" src="/images/share-icon.svg" />
            </a> */}
          </div>
          {/* 
          <div>
            <img className="h-6 w-6" src="/images/clip-icon.svg" />
          </div> */}
        </div>

        <p className="font-bold text-sm">{post.like_count} likes</p>
      </div>

      {/* Caption  */}
      {post.type != "text" && (
        <div className="pt-1  space-x-2 text-sm truncate text-ellipsis overflow-hidden">
          <span className="font-bold">anuj_999</span>
          <span className="">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas
            molestias, assumenda dignissimos sed rerum sit veniam consequatur
            incidunt perferendis quam, hic obcaecati iure fugiat accusantium
            error! Nisi exercitationem commodi mollitia?
          </span>
        </div>
      )}

      <p className="pt-1 text-gray-400 font-semibold">
        {parseInt(post.comment_count) > 0 &&
          `View all ${post.comment_count} comments`}
      </p>
      {/* TODO: Add a creation date in posts */}
      {/* <p className="text-gray-400 font-medium text-[10px]">JUNE 6</p> */}
    </div>
  ) : (
    <PostComments
      postId={post.id}
      postComment={props.postComment}
      toggleIsCommentsOpen={() => setIsCommentsOpen(false)}
      currentPost={currentPost}
      currentUser={props.currentUser}
      fetchComments={props.fetchComments}
    />
  );
}
