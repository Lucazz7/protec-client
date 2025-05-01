import { startTransition, useEffect, useRef, useState } from "react";
import ChatView from "../components/Chat/ChatView";
import HeaderChatView from "../components/Chat/HeaderChatView";
import PromptSuggestions from "../components/Chat/PromptSuggestions";
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
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  return (
    <div className="w-full h-full flex flex-col font-inter overflow-y-auto">
      {isSubmitted && (
        <div className="w-full min-[400px]:h-[20%] md:h-[8%] p-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl relative shadow-sm">
          <HeaderChatView
            setChatHistory={setChatHistory}
            setMessage={setMessage}
            setIsSubmitted={setIsSubmitted}
          />
        </div>
      )}
      <div
        className={`w-full ${
          isSubmitted
            ? "h-[70%] min-[400px]:h-[75%] min-[400px]:min-h-[75%] md:h-[92%] md:min-[400px]:min-h-[92%]"
            : "h-full md:h-auto  md:my-auto"
        } mx-auto flex flex-col py-4 md:py-0 md:justify-center gap-2 md:gap-7 md:px-2`}
      >
        {/* Header */}
        <div
          className={`mx-auto h-full md:h-auto w-full max-w-3xl flex flex-col items-center  transition-all duration-500 overflow-hidden
            ${
              isSubmitted
                ? "max-h-0 opacity-0 -translate-y-20 mb-0"
                : "max-h-[1000px] opacity-100 translate-y-0"
            }
          `}
        >
          <div className="text-center mb-2 md:mb-8 p-2">
            <h1 className="text-base min-[400px]:text-xl lg:text-2xl md:text-4xl font-semibold mb-1">
              <GradientText
                text="Explore o poder da"
                gradientText="Inteligência Artificial"
                gradientColors="from-pink-600 to-blue-800"
              />
            </h1>
            <h2 className="text-base min-[400px]:text-xl lg:text-2xl md:text-3xl font-semibold mb-2 md:mb-4">
              <GradientText
                text="Otimize suas"
                gradientText=" consultas"
                gradientColors="from-blue-800 to-pink-600"
              />
            </h2>
            <p className="text-gray-500 text-sm sm:text-base md:text-base">
              Transforme seus dados em resultados eficientes
            </p>
          </div>

          {/* Prompt Suggestions */}
          <PromptSuggestions setMessage={setMessage} />
        </div>
        {/* Chat Area */}
        {isSubmitted && (
          <div
            ref={chatContainerRef}
            className="w-full h-[72%] min-h-[72%] overflow-y-auto mx-auto px-2 md:px-0"
          >
            <ChatView chatHistory={chatHistory} isLoading={isLoading} />
          </div>
        )}
        {/* Input do chat */}
        <div
          className={`w-full md:h-[25%] max-w-3xl mx-auto ${
            isSubmitted ? "mb-4" : "md:mb-4"
          } px-2 mt-auto`}
        >
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
