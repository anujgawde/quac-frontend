"use client";

import { quaxios } from "@/axios/api";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "@/redux/postSlice";
import { useRouter } from "next/navigation";

export default function AddPost(props: any) {
  // Variables
  const postTabs = [
    {
      id: 0,
      type: "text",
      src: "/images/pencil-icon.svg",
    },
    // {
    //   id: 1,
    //   type: "photo",
    //   src: "/images/media-icon.svg",
    // },
  ];
  const [activeTab, setActiveTab] = useState(postTabs[0]);
  const [media, setMedia] = useState<FileList | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [quacContent, setQuacContent] = useState<string>("");
  const router = useRouter();
  // Redux
  const dispatch = useDispatch();
  // Authorization
  const auth: any = useAuthContext();
  const user: any = auth.user;

  // Functions

  const toggleType = (postTab: any) => {
    setActiveTab(postTab);
    setQuacContent("");
    setMedia(null);
    setSelectedFiles(null);
  };

  const handleFiles = (event: any) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (activeTab.type == "text") {
      const form = e.target;
      const formData = new FormData(form);
      formData.append("type", "text");
      formData.append("user", user.uid);
      // const res = await quaxios.post("/post/create-post");
      const res = await quaxios.post(`/post/create-post`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(res.data);
      dispatch(addPost(res.data));
    } else {
      // const formData = new FormData();
      // selectedFiles?.forEach((file: any) => {
      //   formData.append("files", file);
      // });
      // const res = await quaxios.post("upload-files", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      // console.log(res);
    }

    props.toggleAddPost();
  };

  const getUserProfile = async (userId: string) => {
    const res = await quaxios.get(`/user/profile/${userId}`);
    setCurrentUser(res.data[0]);
    console.log(res.data);
  };

  useEffect(() => {
    console.log(user);
    if (user === null) {
      router.push("/auth");
      return;
    } else {
      getUserProfile(user!.uid);
    }
  }, []);

  return (
    <>
      <div className="h-full w-full z-50 bg-black fixed p-6 top-0 ">
        <button onClick={() => props.toggleAddPost(false)} className="">
          <img src="/images/cancel-icon.svg" className="h-6 w-6" />
        </button>

        {/* <div className="flex w-full space-x-10 py-10">
          {postTabs.map((postTab) => (
            <button
              key={postTab.id}
              onClick={() => toggleType(postTab)}
              className={`${
                activeTab.id == postTab.id ? "bg-[rgba(144,81,217,0.5)]" : ""
              } w-1/2 flex justify-center rounded-md py-2`}
            >
              <img src={postTab.src} className={`h-8 w-8 `} />
            </button>
          ))}
        </div> */}

        <form className="py-10" onSubmit={submitHandler}>
          {activeTab.type == "text" && (
            <div className="w-full rounded-lg border-gray-700  border py-6 px-2 text-white">
              <div className="border-gray-700 text-sm ">
                <div className="flex space-x-2 items-center pb-4 px-2 font-bold">
                  <img
                    className="h-12 w-12  rounded-full"
                    src={
                      currentUser.profile_url ?? "/images/default-user-icon.png"
                    }
                  />
                  <div>
                    <p>
                      {currentUser.first_name} {currentUser.last_name}
                    </p>
                    <p className="font-light text-xs">
                      @{currentUser.username}
                    </p>
                  </div>
                </div>
                <textarea
                  value={quacContent}
                  name="text"
                  onChange={(e) => setQuacContent(e.target.value)}
                  className="px-2 border-none bg-transparent w-full h-32 outline-none text-sm "
                  placeholder="Share your thoughts!"
                />
              </div>
            </div>
          )}
          {activeTab.type == "photo" && (
            <div className="w-full rounded-lg border-gray-700   py-6 px-2 text-white">
              <div className="border-gray-700 text-sm ">
                <div>
                  <p>
                    {currentUser.first_name} {currentUser.last_name}
                  </p>
                  <p className="font-light text-xs">@{currentUser.username}</p>
                </div>
                <textarea
                  className="px-2 border-none bg-transparent w-full h-12 outline-none text-sm"
                  placeholder="Thought of a caption yet?!"
                />

                {/* <div className="p-4 flex flex-col items-center gap-2 bg-black border text-violet-500 rounded-lg  cursor-pointer">

                <img src="/images/plus-icon.svg" className="h-10 w-10" />
                <input type="file" className="hidden" />
              </div> */}

                {/* <img
                className="w-full rounded-md  h-64"
                src="/images/test-image.png"
              /> */}

                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full py-10 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  "
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                        <span className="font-semibold text-4xl block">
                          Click
                        </span>{" "}
                        to share a memory!
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      multiple
                      // onChange={(e) => setMedia(e.target.files)}
                      onChange={handleFiles}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="bg-quac-primary w-full py-2 my-6 rounded-lg"
          >
            Add Post
          </button>
        </form>
      </div>
    </>
  );
}
