import { RefreshCw } from "lucide-react";
import { startTransition, useState } from "react";
import ChatInput from "../components/ChatInput";
import GradientText from "../components/GradientText";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setIsLoading(true);

      startTransition(() => {
        setIsSubmitted(true);
        setSentMessage(message);
      });

      try {
        console.log("Sending message:", message);
        // await yourApiCall(message);
      } finally {
        setMessage("");
        // setIsLoading(false); // Descomente quando implementar a chamada real
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-inter py-10 ">
      <div className="w-full h-full max-w-3xl mx-auto flex flex-col items-center justify-center">
        {/* Header */}
        <div
          className={`w-full flex flex-col items-center justify-center transition-all duration-500 overflow-hidden
            ${
              isSubmitted
                ? "max-h-0 opacity-0 -translate-y-20 mb-0"
                : "max-h-[1000px] opacity-100 translate-y-0 mb-8"
            }
          `}
        >
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
                setMessage(
                  "Como otimizar uma consulta SQL que está muito lenta?"
                )
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
        </div>
        {/* Chat Area */}
        {/* Mensagem enviada */}
        {isSubmitted && (
          <div className="w-full mb-6 p-4 h-full rounded-lg">
            <div className="w-auto p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{sentMessage}</p>
            </div>
            {/* Loading */}
            <div
              className={`flex h-full justify-center items-center mb-4 mt-auto transition-opacity duration-500 ${
                isLoading ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
            </div>
          </div>
        )}
        {/* Input do chat */}
        <div
          className={`w-full transition-all duration-500
              ${
                isSubmitted
                  ? "translate-y-2 opacity-100"
                  : "translate-y-0 opacity-100"
              }
            `}
        >
          <ChatInput
            message={message}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
