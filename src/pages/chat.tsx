import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ChatView from "../components/Chat/ChatView";
import HeaderChatView from "../components/Chat/HeaderChatView";
import PromptSuggestions from "../components/Chat/PromptSuggestions";
import ChatInput from "../components/ChatInput";
import GradientText from "../components/GradientText";
import { Message } from "../interface/IChat";
import {
  useAddMessageMutation,
  useCreateChatMutation,
  useGetChatByIdQuery,
} from "../store/services/chatApi";

const MOCK_RESPONSE = {
  df: '[{"count":7373}]',
  fig: '{"data":[{"hovertemplate":"variable=count<br>index=%{x}<br>value=%{y}<extra></extra>","legendgroup":"count","line":{"color":"#636efa","dash":"solid"},"marker":{"symbol":"circle"},"mode":"lines","name":"count","orientation":"v","showlegend":true,"x":{"dtype":"i1","bdata":"AA=="},"xaxis":"x","y":{"dtype":"i2","bdata":"zRw="},"yaxis":"y","type":"scatter"}],"layout":{"template":{"data":{}},"xaxis":{"anchor":"y","domain":[0.0,1.0],"title":{"text":"index"}},"yaxis":{"anchor":"x","domain":[0.0,1.0],"title":{"text":"value"}},"legend":{"title":{"text":"variable"},"tracegroupgap":0},"margin":{"t":60}}}',
  id: "e9d3f6d7-823d-4dbe-9136-9163b034cabf",
  question:
    "Quais são os pedidos que foram cancelados e quantos produtos estão ativos no sistema hoje?",
  sql: "SELECT \n    COUNT(*) \nFROM \n    PRODUTO \nWHERE \n    PRODUTO.ativo = 1;",
  summary: null,
  type: "question_cache",
};

export default function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [chatMessage, setChatMessage] = useState("");
  const [mockHistory, setMockHistory] = useState<Message[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [createChat, { isLoading: isCreating }] = useCreateChatMutation();
  const [addMessage, { isLoading: isAdding }] = useAddMessageMutation();
  const {
    data: chatData,
    isLoading: isLoadingChat,
    isFetching,
    error,
    refetch,
  } = useGetChatByIdQuery(String(id), {
    skip: !id,
  });

  const handleClearMessage = () => {
    setChatMessage("");
  };

  const handleSendMessage = useCallback(() => {
    try {
      if (!chatMessage.trim()) return;

      // Adiciona a mensagem do usuário
      const userMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        type: "user",
        question: chatMessage,
      };

      setMockHistory((prev) => [...prev, userMessage]);

      // Adiciona a resposta mockada
      setTimeout(() => {
        const mockMsg: Message = {
          id: MOCK_RESPONSE.id,
          type: "question_cache",
          question: JSON.stringify(MOCK_RESPONSE),
        };
        setMockHistory((prev) => [...prev, mockMsg]);
      }, 500);

      setChatMessage("");
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
    }
  }, [chatMessage]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData, isAdding, isCreating, mockHistory]);

  return (
    <div className="w-full h-full flex flex-col font-inter overflow-y-auto">
      {mockHistory.length > 0 && (
        <div className="w-full min-[400px]:h-[20%] md:h-[8%] p-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl relative shadow-sm">
          <HeaderChatView setMessage={setChatMessage} />
        </div>
      )}
      <div
        className={`w-full ${
          mockHistory.length > 0
            ? "h-[70%] min-[400px]:h-[75%] min-[400px]:min-h-[75%] md:h-[92%] md:min-[400px]:min-h-[92%]"
            : "h-full md:h-auto  md:my-auto"
        } mx-auto flex flex-col py-4 md:py-0 md:justify-center gap-2 md:gap-7 md:px-2`}
      >
        {/* Header */}
        <div
          className={`mx-auto h-full md:h-auto w-full max-w-3xl flex flex-col items-center  transition-all duration-500 overflow-hidden
            ${
              mockHistory.length > 0
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
          <PromptSuggestions setMessage={setChatMessage} />
        </div>
        {/* Chat Area */}
        {mockHistory.length > 0 && (
          <div
            ref={chatContainerRef}
            className="w-full h-[72%] min-h-[72%] overflow-y-auto mx-auto px-2 md:px-0"
          >
            <ChatView chatHistory={mockHistory} isLoading={false} />
          </div>
        )}
        {/* Input do chat */}
        {!isLoadingChat && !isFetching && (
          <div
            className={`w-full md:h-[25%] max-w-3xl mx-auto ${
              mockHistory.length > 0 ? "mb-4" : "md:mb-4"
            } px-2 mt-auto`}
          >
            <ChatInput
              message={chatMessage}
              setMessage={setChatMessage}
              onSendMessage={handleSendMessage}
              onClearMessage={handleClearMessage}
              isLoading={isAdding || isCreating}
            />
          </div>
        )}
      </div>
    </div>
  );
}
