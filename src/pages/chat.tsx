import { RefreshCw } from "lucide-react";
import { useState } from "react";
import ChatInput from "../components/ChatInput";
import GradientText from "../components/GradientText";

export default function Chat() {
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-inter">
      <div className="w-full max-w-3xl m-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold mb-1">
            <GradientText
              text="Explore o poder do "
              gradientText="SQL Inteligente"
              gradientColors="from-pink-600 to-blue-800"
            />
          </h1>
          <h2 className="text-3xl font-semibold mb-4">
            <GradientText
              text="Otimize suas"
              gradientText=" consultas"
              gradientColors="from-blue-800 to-pink-600"
            />
          </h2>
          <p className="text-gray-500 text-sm">
            Transforme seus dados em resultados eficientes
          </p>
        </div>

        {/* Prompt Suggestions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            className="bg-white p-4 rounded-lg shadow-sm  flex flex-col items-center text-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() =>
              setMessage("Como otimizar uma consulta SQL que está muito lenta?")
            }
          >
            <div className="mb-2">📊</div>
            <p className="text-xs text-gray-700">
              Como otimizar uma consulta SQL que está muito lenta?
            </p>
          </div>
          <div
            className="bg-white p-4 rounded-lg shadow-sm  flex flex-col items-center text-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() =>
              setMessage(
                "Ajude-me a criar uma query com JOIN entre várias tabelas"
              )
            }
          >
            <div className="mb-2">🔍</div>
            <p className="text-xs text-gray-700">
              Ajude-me a criar uma query com JOIN entre várias tabelas
            </p>
          </div>
          <div
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() =>
              setMessage(
                "Como criar uma consulta para análise de dados com GROUP BY"
              )
            }
          >
            <div className="mb-2">📈</div>
            <p className="text-xs text-gray-700">
              Como criar uma consulta para análise de dados com GROUP BY
            </p>
          </div>
          <div
            className="bg-white p-4 rounded-lg shadow-sm  flex flex-col items-center text-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() =>
              setMessage(
                "Preciso converter uma subquery em uma CTE, pode me ajudar?"
              )
            }
          >
            <div className="mb-2">🔄</div>
            <p className="text-xs text-gray-700">
              Preciso converter uma subquery em uma CTE, pode me ajudar?
            </p>
          </div>
          {/* Refresh Prompts */}
          <button className="flex items-center text-gray-500 text-sm hover:text-gray-700 cursor-pointer">
            <RefreshCw size={14} className="mr-2" />
            Refresh Prompts
          </button>
        </div>

        <ChatInput
          message={message}
          onInputChange={handleInputChange}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
