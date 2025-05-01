import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-lvw h-dvh flex flex-col lg:flex-row relative p-2 md:p-4 gap-2 md:gap-4 font-sans">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="w-full h-full flex flex-col relative">
        <div className="bg-[#ffffff75] w-full h-[calc(100lvh-8rem)] min-[400px]:h-[calc(100dvh-100px)] md:h-full relative z-10 shadow-md  rounded-2xl">
          <Outlet />
        </div>
      </div>
    </header>
  );
}
