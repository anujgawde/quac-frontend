"use client";

import { quaxios } from "@/axios/api";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function EditProfile(props: any) {
  const user = props.user;
  const router = useRouter();
  const signOutHandler = () => {
    signOut(props.auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
    router.push("/");
  };

  const [bio, setBio] = useState(user.bio ?? "");
  const [selectedFiles, setSelectedFiles] = useState<any>(null);

  const handleFiles = (event: any) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const editSubmitHandler = async () => {
    const formData: any = new FormData();
    selectedFiles?.forEach((file: any) => {
      formData.append("files", file);
    });

    formData.append("bio", bio);
    formData.append("user", user.id);

    const editProfilePicture = await quaxios.post(
      "/user/profile/edit-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    location.reload();
  };
  return (
    <>
      <div className="h-full w-full z-50 bg-black fixed  top-0 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <button onClick={() => props.toggleEditProfile(false)} className="">
              <img src="/images/cancel-icon.svg" className="h-6 w-6" />
            </button>
            <p className=" font-bold">Edit Profile</p>
            <div></div>
          </div>

          <div className="py-10 space-y-8">
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              // onChange={(e) => setMedia(e.target.files)}
              onChange={handleFiles}
            />
            <div className="profile-photo flex items-center space-x-2">
              <label htmlFor="dropzone-file">
                <img
                  className="h-16 w-16  rounded-full"
                  src={user.profile_url ?? "/images/default-user-icon.png"}
                />
              </label>
              <div className="">
                <p>{user.username}</p>
                <label
                  htmlFor="dropzone-file"
                  className="font-semibold text-quac-primary"
                >
                  Change profile photo
                </label>
              </div>
            </div>

            <div className="">
              <label className="font-bold" htmlFor="bio">
                Bio
              </label>
              <textarea
                rows={5}
                className="w-full bg-transparent border-[#303030] border rounded-sm my-1 p-2"
                value={bio}
                onChange={(e: any) => setBio(e.target.value)}
                id="bio"
              />
            </div>
            <button
              onClick={() => editSubmitHandler()}
              className=" rounded-md bg-quac-primary px-4 py-1 font-semibold"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button
            onClick={() => signOutHandler()}
            className="font-bold px-4 py-4 text-red-600 text-right"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
