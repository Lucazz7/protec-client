import { Button } from "antd";
import { Cpu, List, RefreshCcwDot, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderChatView({
  setMessage,
}: {
  setMessage: (message: string) => void;
}) {
  const navigate = useNavigate();
  return (
    <>
      <span className="text-base text-gray-500 flex items-center gap-2">
        <Cpu size={22} /> Seu copiloto com tecnologia de IA para consultas SQL
      </span>
      <div className="flex items-center gap-2">
        <Button
          className=" !text-gray-500 w-auto !rounded-full hover:!border-gray-500"
          onClick={() => {
            navigate("/");
            setMessage("");
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
