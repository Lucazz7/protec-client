import { Database, History, LogOut, Menu, Plus, User, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setChatHistory } from "../../store/redux/chatSlice";
import { useGetHistoryQuery } from "../../store/services/chatApi";
const listMenu = [
  {
    name: "Nova conversa",
    icon: <Plus size={20} />,
    path: "/chat",
  },
  {
    name: "Dados de treinamento",
    icon: <Database size={20} />,
    path: "/training-files",
  },
];

import AOS from "aos";
import { useCallback, useEffect } from "react";
import GradientText from "../GradientText";
import SwitchTheme from "../SwitchTheme";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const {
    data: historyQuestion,
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
  } = useGetHistoryQuery();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleReset = useCallback(() => {
    navigate("/");
    dispatch(setChatHistory([]));
    // dispatch(chatApi.util.resetApiState());
  }, [dispatch, navigate]);

  return (
    <div
      className={`lg:w-96 bg-[#ffffff75] dark:bg-[#131324b4] lg:h-full rounded-2xl flex flex-col items-center transition-all duration-300 p-3 z-50 ${
        isOpen
          ? "w-[calc(100%-1rem)] h-[calc(100%-1rem)] bg-white dark:bg-gray-900 absolute"
          : "h-[80px]"
      }`}
    >
      <div
        className={`${
          isOpen ? "h-[10%]" : "h-full"
        } w-full lg:h-[10%] max-h-[80px] flex flex-row-reverse lg:flex-row gap-2 items-center relative py-2 px-3`}
      >
        <div
          onClick={() => {
            navigate("/chat");
          }}
          data-aos="fade-right"
          data-aos-duration="1000"
        >
          <img
            src="/image/svg/fav-icon-biofy.svg"
            alt="logo"
            className="object-contain h-12 lg:h-14 cursor-pointer invert dark:invert-0"
          />
        </div>
        <div className="hidden lg:flex w-full items-center">
          <span
            className="text-2xl font-semibold text-gray-700 dark:text-gray-200"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            Protec
          </span>

          <GradientText
            text=""
            gradientText="AI Expert"
            gradientColors="from-pink-600 to-blue-800"
            className="text-sm  pt-11 -ms-2 -mt-2"
          />
        </div>
        <span className="hidden lg:flex text-sm text-gray-500 dark:text-gray-200 absolute right-0 bottom-0">
          v1.0.0
        </span>{" "}
        <div className="hidden lg:flex absolute right-0 top-0 ">
          <SwitchTheme />
        </div>
        <div
          className="flex lg:hidden items-center cursor-pointer me-auto text-gray-500 dark:text-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </div>
      </div>
      <div
        className={`w-full h-[calc(100%-10%)] ${
          isOpen ? "flex flex-col" : "hidden lg:flex lg:flex-col"
        }`}
      >
        <div className="w-full md:h-[18%] max-h-[130px] flex flex-col py-2">
          <hr className="w-full border-gray-300 dark:border-gray-700 pb-2" />
          <div className="w-full h-full flex flex-col gap-5 text-gray-500 dark:text-gray-200">
            {listMenu.map((item, index) =>
              item.name === "Nova conversa" ? (
                <div
                  key={index}
                  onClick={handleReset}
                  data-aos="zoom-in"
                  data-aos-duration="400"
                  className={`mx-auto w-full flex justify-center items-center gap-3 font-semibold text-gray-200 bg-gray-500  dark:hover:bg-gray-600 dark:text-gray-200 hover:text-white hover:bg-gray-700 p-2 cursor-pointer rounded-lg transition-all duration-300`}
                >
                  {item.icon}
                  <span className="text- uppercase">{item.name}</span>
                </div>
              ) : (
                <div
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  data-aos="zoom-in"
                  data-aos-duration="400"
                  className={`w-full flex items-center gap-3 font-semibold justify-center hover:text-white hover:bg-gray-600 p-2  ${
                    location.pathname.includes(item.path)
                      ? "border-1 border-b-2 border-gray-400 text-gray-500 dark:border-transparent dark:bg-[#131324b4] dark:text-gray-200"
                      : ""
                  } rounded-md transition-all duration-300 cursor-pointer`}
                >
                  {item.icon}
                  <span className="text-base">{item.name}</span>
                </div>
              )
            )}
          </div>
        </div>
        <div className="w-full h-[70%] md:h-[80%] flex flex-col">
          <hr className="w-full border-gray-300 dark:border-gray-700" />
          <div
            className="w-full h-full overflow-y-auto flex flex-col py-4 text-black"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-200 text-center flex items-center gap-2 px-2 ">
                <History size={20} />
                Conversas Recentes
              </span>
              <div className="flex lg:hidden p-2 absolute right-0 top-0">
                <SwitchTheme />
              </div>
            </div>
            <div className="w-full my-auto flex flex-col h-full md:max-h-[55lvh] overflow-y-auto font-inter p-2 gap-1">
              {isLoadingHistory || isFetchingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                </div>
              ) : (
                historyQuestion &&
                historyQuestion?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (Number(id) !== item.id) {
                        dispatch(setChatHistory([]));
                        navigate(`/chat/${item.id}`);
                      }
                    }}
                    className={`w-full flex items-center gap-3 font-light p-2 rounded-md transition-all duration-300 text-gray-600 cursor-pointer ${
                      id == String(item?.id)
                        ? "bg-gradient-to-l from-gray-400 to-gray-500 to-40% text-white hover:bg-opacity-80"
                        : "hover:text-white hover:bg-gray-600"
                    }`}
                  >
                    <span className="text-sm line-clamp-1  dark:text-gray-200">
                      {item?.question?.charAt(0).toUpperCase() +
                        item?.question?.slice(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>{" "}
        </div>
        <div className="w-full flex lg:hidden flex-col mt-auto ">
          <hr className="w-full border-gray-300 dark:border-gray-700" />
          <div className="w-full py-4 flex items-center gap-2 justify-between px-2 ">
            <div className="w-auto p-2 bg-gray-400 dark:bg-gray-700 rounded-full">
              <User size={20} />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-semibold">
              Protec AI Chatbot
            </span>
            <LogOut
              size={18}
              className="text-gray-500 dark:text-gray-200 cursor-pointer"
              onClick={() => navigate("/login")}
            />
          </div>
        </div>
      </div>
      <div className="w-full hidden lg:flex flex-col mt-auto">
        <hr className="w-full border-gray-300 dark:border-gray-700" />
        <div className="w-full py-4 flex items-center gap-2 justify-between px-2">
          <div className="w-auto p-2 bg-gray-400 dark:bg-gray-700 rounded-full">
            <User size={20} />
          </div>
          <span className="text-gray-700 dark:text-gray-400 font-semibold">
            Protec AI Chatbot
          </span>
          <div className="flex items-center gap-2">
            <LogOut
              size={18}
              className="text-gray-500 dark:text-gray-200 cursor-pointer"
              onClick={() => navigate("/login")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
