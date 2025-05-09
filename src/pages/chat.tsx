import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ChatView from "../components/Chat/ChatView";
import HeaderChatView from "../components/Chat/HeaderChatView";
import PromptSuggestions from "../components/Chat/PromptSuggestions";
import ChatInput from "../components/ChatInput";
import GradientText from "../components/GradientText";
import { useAppSelect } from "../store";
import { setChatHistory } from "../store/redux/chatSlice";
import {
  useCreateChatMutation,
  useGetChatByIdQuery,
} from "../store/services/chatApi";

import AOS from "aos";
import { Message } from "../interface/IChat";

export default function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [createChat, { isLoading: isCreating }] = useCreateChatMutation();

  const { isLoading: isLoadingChat, isFetching } = useGetChatByIdQuery(
    String(id),
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );

  const [chatMessage, setChatMessage] = useState("");
  const { chatHistory, error } = useAppSelect((state) => {
    return {
      chatHistory: state.chatSlice.chatHistory,
      error: state.chatSlice.error,
    };
  });

  const handleClearMessage = () => {
    setChatMessage("");
  };

  const handleCreateChat = useCallback(() => {
    const currentMessage = chatMessage;
    setChatMessage("");

    // Adiciona a mensagem do usuário ao histórico
    const updatedHistory: Message[] = [
      ...chatHistory,
      {
        id: "",
        response_type: "user",
        question: currentMessage,
      },
    ];

    dispatch(setChatHistory(updatedHistory));

    createChat({ question: currentMessage }).then((res) => {
      if (res.error) {
        toast.error("Erro ao enviar mensagem!");
        setChatMessage(currentMessage);
        dispatch(setChatHistory(chatHistory));
        return;
      }
      if (res?.data?.vanna_question?.id) {
        // Navega para o novo chat
        navigate(`/chat/${res.data.vanna_question.id}`);
      }
      // Adiciona a resposta da API ao histórico
      const newHistory: Message[] = [
        ...updatedHistory,
        {
          id: res?.data?.vanna_question?.id?.toString() ?? "",
          response_type: res?.data?.response_type,
          df: res?.data?.answer,
          question:
            res?.data?.response || res?.data?.vanna_question?.generated_sql,
        },
      ];
      dispatch(setChatHistory(newHistory));
    });
  }, [chatHistory, chatMessage, createChat, dispatch, navigate]);

  const handleSendMessage = useCallback(() => {
    return handleCreateChat();
  }, [handleCreateChat]);

  const loading = isCreating || isFetching || isLoadingChat;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [isCreating, chatHistory]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col font-inter overflow-y-auto">
      {chatHistory.length > 0 && (
        <div className="w-full min-[400px]:h-[20%] md:h-[8%] p-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl relative shadow-sm dark:bg-gray-900">
          <HeaderChatView setMessage={setChatMessage} />
        </div>
      )}
      <div
        className={`w-full ${
          chatHistory.length > 0
            ? "h-[70%] min-[400px]:h-[75%] min-[400px]:min-h-[75%] md:h-[92%] md:min-[400px]:min-h-[92%]"
            : "h-full md:h-auto  md:my-auto"
        } mx-auto flex flex-col py-4 md:py-0 md:justify-center gap-2 md:gap-7 md:px-2`}
      >
        {/* Header */}
        <div
          className={`mx-auto h-full md:h-auto w-full max-w-3xl flex flex-col items-center transition-all duration-500 overflow-hidden
            ${
              chatHistory.length > 0
                ? "max-h-0 opacity-0 -translate-y-20 mb-0"
                : "max-h-[1000px] opacity-100 translate-y-0"
            }
          `}
        >
          <div className="text-center mb-2 md:mb-8 p-2">
            <h1 className="text-base min-[400px]:text-xl md:text-2xl lg:text-4xl font-semibold mb-1">
              <GradientText
                text="Explore o poder da"
                gradientText="Inteligência Artificial"
                gradientColors="from-pink-600 to-blue-800"
              />
            </h1>
            <h2 className="text-base min-[400px]:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 md:mb-4">
              <GradientText
                text="Otimize suas"
                gradientText=" consultas"
                gradientColors="from-blue-800 to-pink-600"
              />
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base md:text-base">
              Transforme seus dados em resultados eficientes
            </p>
          </div>

          {/* Prompt Suggestions */}
          <PromptSuggestions setMessage={setChatMessage} />
        </div>
        {/* Chat Area */}
        {chatHistory.length > 0 && (
          <div
            ref={chatContainerRef}
            className={`w-full overflow-y-auto mx-auto px-2 md:px-0 h-full`}
          >
            <ChatView
              chatHistory={chatHistory}
              isLoading={loading}
              error={error}
            />
          </div>
        )}
        {/* Input do chat */}
        {(!isLoadingChat && !isFetching && !error) ||
        !id ||
        chatHistory.length > 0 ? (
          <div
            className={`w-full max-w-3xl mx-auto mb-4 px-2 mt-auto`}
            data-aos="zoom-in"
            data-aos-duration="700"
          >
            <ChatInput
              message={chatMessage}
              setMessage={setChatMessage}
              onSendMessage={handleSendMessage}
              onClearMessage={handleClearMessage}
              isLoading={isCreating}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
