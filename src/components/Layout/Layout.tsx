import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-lvw h-dvh flex flex-col lg:flex-row bg-gradient-to-tr from-blue-200 via-blue-100 to-rose-100 relative p-4 gap-4 font-sans">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full h-full flex flex-col relative">
        <div className="bg-[#ffffff75] w-full h-full relative z-10 shadow-md  rounded-2xl">
          <Outlet />
        </div>
      </div>
    </header>
  );
}
