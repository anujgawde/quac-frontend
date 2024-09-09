"use client";
import "./globals.css";
import { Inter, Pacifico, Roboto_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";
import { AuthContextProvider } from "@/context/AuthContext";
import { store } from "../redux/store";
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      <title>quac</title>
      <html lang="en">
        <body className={`${inter.className}`}>
          <AuthContextProvider>
            {!pathname.endsWith("auth") &&
              !pathname.endsWith("profile") &&
              !pathname.includes("post") && <Navbar />}
            <main className=" w-full flex justify-center overflow-y-scroll md:hidden">
              <div className="max-w-6xl w-full ">{children}</div>
            </main>
            <main className="hidden bg-black md:flex items-center justify-center h-[80vh]">
              <p className="text-4xl font-bold">
                Oops, Quac is currently available only for mobile
              </p>
            </main>
            {!pathname.endsWith("auth") && (
              <div className="md:hidden">
                <BottomNav />
              </div>
            )}
          </AuthContextProvider>
        </body>
      </html>
    </Provider>
  );
}
