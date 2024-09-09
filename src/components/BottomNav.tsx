"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddPost from "./posts/AddPost";

export default function BottomNav() {
  // Variables:
  const [activeTab, setActiveTab] = useState(0);
  const [addPostOpen, setAddPostOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navTabs = [
    {
      id: 0,
      src: "/images/house-icon.svg",
      isActive: pathname.endsWith("/") ? true : false,
      route: "/",
    },
    {
      id: 1,
      src: "/images/search-icon.svg",
      isActive: pathname.endsWith("/explore") ? true : false,
      route: "/explore",
    },
    {
      id: 2,
      src: "/images/plus-icon.svg",
    },
    // {
    //   id: 3,
    //   src: "/images/message-icon.svg",
    //   isActive: pathname.endsWith("/message") ? true : false,
    //   route: "/message",
    //   isDisabled: true,
    // },
    {
      id: 4,
      src: "/images/profile-icon.svg",
      isActive: pathname.endsWith("/profile") ? true : false,
      route: "/profile",
    },
  ];

  // Functions:

  const tabClickHandler = (tabId: number) => {
    if (tabId != 2) {
      const route = navTabs.find((e) => e.id == tabId);
      setActiveTab(tabId);
      router.push(route?.route ?? "/");
    } else {
      setAddPostOpen(true);
    }
  };

  useEffect(() => {}, []);

  return (
    <div>
      <div className="bottom-0 w-full fixed  flex justify-between items-center px-6 border-t border-[#303030] bg-black h-[8vh]">
        {navTabs.map((e: any) => (
          <button
            disabled={e.isDisabled ? true : false}
            onClick={() => tabClickHandler(e.id)}
            key={e.id}
            className={`${
              e.isActive ? "bg-[rgba(144,81,217,0.5)]" : ""
            } p-2 rounded-lg`}
          >
            <img className="h-6 w-6 z-10" src={e.src} />
          </button>
        ))}
      </div>
      {addPostOpen && <AddPost toggleAddPost={() => location.reload()} />}
    </div>
  );
}
