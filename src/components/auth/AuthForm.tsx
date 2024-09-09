"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { quaxios } from "@/axios/api";
import signIn from "@/firebase/auth/signin";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function AuthForm(props: any) {
  // Variables:

  // Router
  const router = useRouter();

  // Authorization
  const auth: any = useAuthContext();
  const user: any = auth.user;

  // Login or Sign Up
  const [isAlreadyUser, setIsAlreadyUser] = useState<boolean>(true);

  // Inputs
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contactNo, setContactNo] = useState<string>("");
  const [dob, setDob] = useState<Date>(new Date());
  const [identityInput, setIdentityInput] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Functions:
  const toggleAuth = () => {
    setFirstName("");
    setLastName("");
    setUserName("");
    setEmail("");
    setContactNo("");
    setDob(new Date());
    setIdentityInput("");
    setPassword("");
    setIsAlreadyUser(!isAlreadyUser);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    // const formJson = Object.fromEntries(formData.entries());
    if (isAlreadyUser) {
      const res = await quaxios.get(`/user/sign-in/${identityInput}`);
      const { result, error } = await signIn(res.data[0].email, password);

      if (error) {
        return console.log(error);
      } else {
        // else successful
        console.log(result);
      }
    } else {
      const { result, error } = await signUp(email, password);

      if (error) {
        return console.log(error);
      } else {
        // else successful

        const userId = result?.user.uid;
        formData.append("id", userId!);

        const res = await quaxios.post(`/user/sign-up`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    router.push("/");
  };

  // Use Effects:
  useEffect(() => {
    if (user != null) router.push("/");
  }, [user]);

  // Extras
  const logData = () => {
    console.log("");
  };

  return (
    <>
      <form onSubmit={submitHandler} className="px-4 ">
        {!isAlreadyUser ? (
          <div className="space-y-4">
            <input
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="first name"
              className="text-white text-sm focus:outline-none w-full border rounded-md p-2 bg-transparent border-gray-500"
            />
            <input
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="last name"
              className="text-white text-sm focus:outline-none w-full border rounded-md p-2 bg-transparent border-gray-500"
            />

            <input
              name="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="username"
              className="text-white text-sm focus:outline-none w-full border rounded-md p-2 bg-transparent border-gray-500"
            />
            <input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="text-white text-sm focus:outline-none w-full border rounded-md p-2 bg-transparent border-gray-500"
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="text-white text-sm focus:outline-none w-full border rounded-md p-2 bg-transparent border-gray-500"
            />
            <div className="space-x-2 flex">
              <input
                name="contactNo"
                value={contactNo ?? ""}
                onChange={(e) => setContactNo(e.target.value)}
                placeholder="phone number"
                className="text-white text-sm focus:outline-none w-1/2 border rounded-md p-2 bg-transparent border-gray-500"
              />
              <input
                name="dob"
                value={format(dob, "yyyy-MM-dd")}
                onChange={(e) => setDob(new Date(e.target.value))}
                placeholder="dob"
                type="Date"
                className="text-white text-sm focus:outline-none w-1/2 border rounded-md p-2 bg-transparent border-gray-500"
              />
            </div>
            <button
              type="submit"
              className="border border-quac-primary w-full rounded-lg py-2"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {" "}
            <input
              name="identityInput"
              value={identityInput}
              onChange={(e) => setIdentityInput(e.target.value)}
              placeholder="phone number, username or email"
              className="text-white text-sm focus:outline-none w-full border rounded-md p-2 bg-transparent border-gray-500"
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="text-white text-sm focus:outline-none w-full border rounded-md p-2 bg-transparent border-gray-500"
            />
            <button
              type="submit"
              className="border border-quac-primary w-full rounded-lg py-2"
            >
              Log In
            </button>
          </div>
        )}
      </form>
      {!isAlreadyUser ? (
        <p className="text-center text-sm">
          Already a member?{" "}
          <button
            // onClick={() => props.}
            onClick={toggleAuth}
            className="text-quac-primary"
          >
            Log In!
          </button>
        </p>
      ) : (
        <p className="text-center text-sm">
          Don&apos;t have an account yet?{" "}
          <button
            // onClick={() => setIsAlreadyUser(false)}
            onClick={toggleAuth}
            className="text-quac-primary"
          >
            Sign Up!
          </button>
        </p>
      )}
      {/* <button onClick={logData}>LOG</button> */}
    </>
  );
}
