import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <header className="w-lvw h-dvh flex  bg-gradient-to-tr from-blue-200 via-blue-100 to-rose-100 relative p-4 gap-4 font-sans">
      <Sidebar />
      <div className="w-[calc(100%-5rem)] h-full flex flex-col relative">
        <div className="bg-[#ffffff75] w-full h-full relative z-10 shadow-md  rounded-2xl">
          <Outlet />
        </div>
      </div>
    </header>
  );
}
