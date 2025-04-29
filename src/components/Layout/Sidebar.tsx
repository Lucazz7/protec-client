import { ArrowRight, Database, History, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";

const listMenu = [
  {
    name: "Nova conversa",
    icon: <Plus size={20} />,
    path: "/chat",
  },
  {
    name: "Dados de treinamento",
    icon: <Database size={20} />,
    path: "/chat",
  },
];

export default function Sidebar() {
  return (
    <div className="w-80 bg-[#ffffff75] h-full  rounded-2xl flex flex-col items-center p-3 transition-all duration-300">
      <div className="w-full flex gap-2 items-center relative py-2">
        <img
          src="/image/svg/fav-icon-biofy.svg"
          alt="logo"
          className="h-14 dark:invert cursor-pointer "
        />
        <div className="flex w-full items-center">
          <span className="text-2xl font-semibold text-gray-700">Protec</span>
          <span className="text-sm text-gray-500 pt-11 -ms-4 -mt-2">
            AI Chatbot
          </span>
        </div>
        <span className="text-sm text-gray-500 absolute right-0 top-0">
          v1.0.0
        </span>
      </div>
      <hr className="w-full border-gray-300 mt-5" />
      <div className="w-full flex flex-col gap-6 my-4 text-gray-500">
        {listMenu.map((item, index) =>
          item.name === "Nova conversa" ? (
            <Link
              key={index}
              to={item.path}
              className={`mx-auto w-full flex justify-center items-center gap-3 font-semibold text-gray-200 bg-gray-500  hover:text-white hover:bg-gray-700 p-2  rounded-lg transition-all duration-300`}
            >
              {item.icon}
              <span className="text- uppercase">{item.name}</span>
            </Link>
          ) : (
            <Link
              key={index}
              to={item.path}
              className={`w-full flex items-center gap-3 font-semibold  hover:text-white hover:bg-gray-600 p-2  rounded-md transition-all duration-300`}
            >
              {item.icon}
              <span className="text-base">{item.name}</span>
            </Link>
          )
        )}
      </div>
      <hr className="w-full border-gray-300 " />
      <div className="w-full h-[50%] overflow-y-auto  flex flex-col gap-6 my-4 text-black ">
        <span className="w-full text-sm text-gray-500 text-center flex items-center gap-2 px-2">
          <History size={20} />
          Conversas Recentes
        </span>
      </div>{" "}
      <hr className="w-full border-gray-300 mt-auto" />
      <div className="w-full py-4 flex items-center gap-2 justify-between px-2">
        <div className="w-auto p-2 bg-gray-300 rounded-full">
          <User size={20} />
        </div>
        <span className="text-gray-700 font-semibold">Protec AI Chatbot</span>
        <ArrowRight size={18} className="text-gray-500 cursor-pointer" />
      </div>
    </div>
  );
}
