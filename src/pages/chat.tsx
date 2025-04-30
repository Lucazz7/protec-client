import { Button } from "antd";
import { Cpu, List, RefreshCcwDot, Settings } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import ChatInput from "../components/ChatInput";
import GradientText from "../components/GradientText";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{
      type: "user" | "assistant";
      message: string;
    }>
  >([]);

  // Adicionar respostas mocadas
  const mockResponses: { [key: string]: string } = {
    "Como otimizar uma consulta SQL que está muito lenta?":
      "Para otimizar uma consulta SQL lenta, você pode: \n1. Adicionar índices apropriados\n2. Evitar SELECT *\n3. Usar EXPLAIN para analisar a execução\n4. Limitar resultados com WHERE adequado",
    "Ajude-me a criar uma query com JOIN entre várias tabelas":
      "Aqui está um exemplo de JOIN múltiplo:\n```sql\nSELECT a.nome, b.departamento, c.salario\nFROM funcionarios a\nINNER JOIN departamentos b ON a.dept_id = b.id\nINNER JOIN salarios c ON a.id = c.funcionario_id;\n```",
    default: "Desculpe, não entendi sua pergunta. Pode reformular?",
  };

  // Adicionar função para buscar histórico
  const fetchQuestionHistory = async () => {
    try {
      const response = await fetch(
        "https://protec.biofy.tech/api/v0/get_question_history"
      );
      if (!response.ok) {
        throw new Error("Falha ao buscar histórico");
      }
      const data = await response.json();
      // Assumindo que a API retorna um array de objetos com type e message
      setChatHistory(data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  // Usar useEffect para carregar o histórico quando o componente montar
  useEffect(() => {
    fetchQuestionHistory();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setIsLoading(true);

      startTransition(() => {
        setIsSubmitted(true);

        // Adicionar mensagem do usuário
        setChatHistory((prev) => [...prev, { type: "user", message: message }]);

        // Simular delay de resposta
        setTimeout(() => {
          // Adicionar resposta do assistente
          const response =
            mockResponses[message.trim()] || mockResponses.default;
          setChatHistory((prev) => [
            ...prev,
            { type: "assistant", message: response },
          ]);
          setIsLoading(false);
        }, 1000);
      });

      setMessage("");
    }
  };

  const handleClearMessage = () => {
    setMessage("");
  };

  return (
    <div className="w-full h-full flex flex-col font-inter  ">
      {isSubmitted && (
        <div className="w-full p-4 flex justify-between items-center gap-4  rounded-t-2xl relative shadow-sm">
          <span className="text-base text-gray-500 flex items-center gap-2">
            <Cpu size={22} /> Seu copiloto com tecnologia de IA para consultas
            SQL
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
        </div>
      )}
      <div className="w-full h-full  mx-auto flex flex-col justify-center gap-7 px-2">
        {/* Header */}
        <div
          className={`mx-auto w-full max-w-3xl flex flex-col items-center justify-center transition-all duration-500 overflow-hidden
            ${
              isSubmitted
                ? "max-h-0 opacity-0 -translate-y-20 mb-0"
                : "max-h-[1000px] opacity-100 translate-y-0"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
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
          </div>
        </div>
        {/* Chat Area */}
        {isSubmitted && (
          <div className="w-full h-[calc(100%-15rem)] overflow-y-auto  mx-auto">
            <div className="mx-auto w-full max-w-3xl mb-6 space-y-6 font-inter text-sm">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${
                    chat.type === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] p-2 px-4 rounded-full rounded-br-none ${
                      chat.type === "user" ? "bg-white text-gray-600" : ""
                    }`}
                  >
                    <p className="text-gray-700">{chat.message}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-center items-center ">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-800 my-6"></div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Input do chat */}
        <div className="w-full max-w-3xl mx-auto mb-4">
          <ChatInput
            message={message}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onClearMessage={handleClearMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
