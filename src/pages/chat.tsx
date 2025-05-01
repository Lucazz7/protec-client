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

export default function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [chatMessage, setChatMessage] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [createChat, { isLoading: isCreating }] = useCreateChatMutation();
  const [addMessage, { isLoading: isAdding }] = useAddMessageMutation();
  const { data: chatData } = useGetChatByIdQuery(String(id), {
    skip: !id,
  });

  // const messageList = useMemo(() => {
  //   if (chatData?.messages) {
  //     return chatData.messages;
  //   } else {
  //     return chatHistory;
  //   }
  // }, [chatData, chatHistory]);

  const handleClearMessage = () => {
    setChatMessage("");
  };

  const handleSendMessage = useCallback(() => {
    try {
      if (!id) {
        // Criar novo chat
        const response = createChat({ question: chatMessage });

        response.then((res: any) => {
          if (!res.data) {
            toast.error("Erro ao criar chat");
          }
          navigate(`/chat/${res.data.id}`);
        });
      } else {
        // Adicionar mensagem ao chat existente
        const newMessage: Message = {
          id: Math.random().toString(36).substring(2, 15),
          type: "user",
          message: chatMessage,
          timestamp: new Date().toISOString(),
        };

        const response = addMessage({ id, message: newMessage });
        response.then((res: any) => {
          if (!res.data) {
            toast.error("Erro ao enviar mensagem");
          }
        });
      }

      setChatMessage("");
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
    }
  }, [id, createChat, chatMessage, navigate, addMessage]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData, isAdding, isCreating]);

  return (
    <div className="w-full h-full flex flex-col font-inter overflow-y-auto">
      {id && (
        <div className="w-full min-[400px]:h-[20%] md:h-[8%] p-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl relative shadow-sm">
          <HeaderChatView setMessage={setChatMessage} />
        </div>
      )}
      <div
        className={`w-full ${
          id
            ? "h-[70%] min-[400px]:h-[75%] min-[400px]:min-h-[75%] md:h-[92%] md:min-[400px]:min-h-[92%]"
            : "h-full md:h-auto  md:my-auto"
        } mx-auto flex flex-col py-4 md:py-0 md:justify-center gap-2 md:gap-7 md:px-2`}
      >
        {/* Header */}
        <div
          className={`mx-auto h-full md:h-auto w-full max-w-3xl flex flex-col items-center  transition-all duration-500 overflow-hidden
            ${
              id
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
        {id && (
          <div
            ref={chatContainerRef}
            className="w-full h-[72%] min-h-[72%] overflow-y-auto mx-auto px-2 md:px-0"
          >
            <ChatView
              chatHistory={chatData?.messages || []}
              isLoading={isAdding || isCreating}
            />
          </div>
        )}
        {/* Input do chat */}
        <div
          className={`w-full md:h-[25%] max-w-3xl mx-auto ${
            id ? "mb-4" : "md:mb-4"
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
      </div>
    </div>
  );
}
