import { Button } from "antd";
import { Cpu, List, RefreshCcwDot, Settings } from "lucide-react";
import { ChatHistory } from "../../interface/IChat";

interface HeaderChatViewProps {
  setChatHistory: (chatHistory: ChatHistory[]) => void;
  setMessage: (message: string) => void;
  setIsSubmitted: (isSubmitted: boolean) => void;
}

export default function HeaderChatView({
  setChatHistory,
  setMessage,
  setIsSubmitted,
}: HeaderChatViewProps) {
  return (
    <>
      <span className="text-base text-gray-500 flex items-center gap-2">
        <Cpu size={22} /> Seu copiloto com tecnologia de IA para consultas SQL
      </span>
      <div className="flex items-center gap-2">
        <Button
          className=" !text-gray-500 w-auto !rounded-full hover:!border-gray-500"
          onClick={() => {
            setChatHistory([]);
            setMessage("");
            setIsSubmitted(false);
          }}
        >
          <RefreshCcwDot size={16} />
          Reiniciar
        </Button>
        <Button className=" !text-gray-500 w-auto !rounded-full hover:!border-gray-500">
          <Settings size={16} />
          Configurações
        </Button>
        <Button className=" !text-gray-500 w-auto !rounded-full hover:!border-gray-500">
          <List size={16} />
          Logs
        </Button>
      </div>
    </>
  );
}
