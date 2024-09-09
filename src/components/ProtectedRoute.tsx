import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  useEffect(() => {
    if (user === null) {
      router.push("/auth");
      return;
    }
  }, []);
  return <div>{user ? children : null}</div>;
};

export default ProtectedRoute;
