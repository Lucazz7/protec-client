import { Button } from "antd";
import { Cpu, List, RefreshCcwDot, Settings } from "lucide-react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setChatHistory } from "../../store/redux/chatSlice";

export default function HeaderChatView({
  setMessage,
}: {
  setMessage: (message: string) => void;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleReset = useCallback(() => {
    navigate("/");
    dispatch(setChatHistory([]));
    setMessage("");
    // dispatch(chatApi.util.resetApiState());
  }, [dispatch, navigate, setMessage]);

  return (
    <>
      <span className="text-base text-gray-500 dark:text-gray-300 flex items-center gap-2">
        <Cpu size={22} /> Seu copiloto com tecnologia de IA para consultas SQL
      </span>
      <div className="flex items-center gap-2">
        <Button
          className="!text-xs md:!text-sm !text-gray-500 w-auto dark:!bg-transparent dark:!border-gray-500 dark:!text-gray-300 !rounded-full dark:hover:!bg-gray-900 dark:hover:!brightness-125 hover:!border-gray-500"
          onClick={handleReset}
        >
          <RefreshCcwDot size={16} />
          Reiniciar
        </Button>
        <Button className="!text-xs md:!text-sm !text-gray-500 w-auto dark:!bg-transparent dark:!border-gray-500 dark:!text-gray-300 !rounded-full dark:hover:!bg-gray-900 dark:hover:!brightness-125 hover:!border-gray-500">
          <Settings size={16} />
          Configurações
        </Button>
        <Button className="!text-xs md:!text-sm !text-gray-500 w-auto dark:!bg-transparent dark:!border-gray-500 dark:!text-gray-300 !rounded-full dark:hover:!bg-gray-900 dark:hover:!brightness-125 hover:!border-gray-500">
          <List size={16} />
          Logs
        </Button>
      </div>
    </>
  );
}
