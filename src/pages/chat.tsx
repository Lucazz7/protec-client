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
  useAddMessageMutation,
  useChatGenerateSqlMutation,
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
  const [chatGenerateSql, { isLoading: isGeneratingSql }] =
    useChatGenerateSqlMutation();
  const [addMessage, { isLoading: isAdding }] = useAddMessageMutation();
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

  const handleAddMessage = useCallback(() => {
    if (!id) return;
    const currentMessage = chatMessage;
    setChatMessage("");

    // Adiciona a mensagem do usuário ao histórico
    const updatedHistory: Message[] = [
      ...chatHistory,
      {
        id: "",
        type: "user",
        question: currentMessage,
      },
    ];
    dispatch(setChatHistory(updatedHistory));

    // Pega a última pergunta do usuário
    const lastUserMessage = [...chatHistory]
      .reverse()
      .find((msg) => msg.type === "user" && msg.question);

    const last_question = lastUserMessage?.question || "";
    const new_question = currentMessage;

    addMessage({
      last_question,
      new_question,
    }).then((res) => {
      if (res.error) {
        toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
        setChatMessage(currentMessage);
        // Remove a mensagem do usuário em caso de erro
        dispatch(setChatHistory(chatHistory));
        return;
      }

      createChat({ question: currentMessage }).then((res) => {
        if (res.error) {
          toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
          setChatMessage(currentMessage);
          dispatch(setChatHistory(chatHistory));
          return;
        }

        // Adiciona a resposta da API ao histórico
        const newHistory: Message[] = [
          ...updatedHistory,
          {
            ...res.data,
            question: res.data.text,
          },
        ];
        dispatch(setChatHistory(newHistory));

        // Se for SQL, gera o SQL
        if (res.data.type === "sql") {
          chatGenerateSql(res.data.id).then((sqlRes) => {
            if (sqlRes.error || sqlRes.data.error) {
              toast.error("Erro ao rodar SQL.");
              dispatch(
                setChatHistory([
                  ...newHistory,
                  {
                    id: res.data.id,
                    type: "error",
                    question: sqlRes?.data?.error || "Erro ao rodar SQL",
                  },
                ])
              );
              return;
            }
            // Adiciona a resposta do SQL ao histórico
            dispatch(
              setChatHistory([
                ...newHistory,
                {
                  ...sqlRes.data,
                  question: sqlRes.data.text,
                },
              ])
            );
          });
        }
      });
    });
  }, [
    id,
    chatMessage,
    dispatch,
    chatHistory,
    addMessage,
    createChat,
    chatGenerateSql,
  ]);

  const handleCreateChat = useCallback(() => {
    const currentMessage = chatMessage;
    setChatMessage("");

    // Adiciona a mensagem do usuário ao histórico
    const updatedHistory: Message[] = [
      ...chatHistory,
      {
        id: "",
        type: "user",
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

      // Navega para o novo chat
      navigate(`/chat/${res.data.id}`);

      // Adiciona a resposta da API ao histórico
      const newHistory: Message[] = [
        ...updatedHistory,
        {
          ...res.data,
          question: res.data.text,
        },
      ];
      dispatch(setChatHistory(newHistory));

      // Se for SQL, gera o SQL
      if (res.data.type === "sql") {
        chatGenerateSql(res.data.id).then((sqlRes) => {
          if (sqlRes.error || sqlRes.data.error) {
            toast.error("Erro ao rodar o SQL.");
            dispatch(
              setChatHistory([
                ...newHistory,
                {
                  id: res.data.id,
                  type: "error",
                  question: sqlRes?.data?.error || "",
                },
              ])
            );
            return;
          }
          // Adiciona a resposta do SQL ao histórico
          dispatch(
            setChatHistory([
              ...newHistory,
              {
                ...sqlRes.data,
                question: sqlRes.data.text,
              },
            ])
          );
        });
      }
    });
  }, [
    chatGenerateSql,
    chatHistory,
    chatMessage,
    createChat,
    dispatch,
    navigate,
  ]);

  const handleSendMessage = useCallback(() => {
    if (!id) {
      return handleCreateChat();
    }
    return handleAddMessage();
  }, [handleAddMessage, handleCreateChat, id]);

  const loading =
    isAdding || isCreating || isGeneratingSql || isFetching || isLoadingChat;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [isAdding, isCreating, chatHistory]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

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
          className={`mx-auto h-full md:h-auto w-full max-w-3xl flex flex-col items-center transition-all duration-500 overflow-hidden
            ${
              id
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
            className={`w-full overflow-y-auto mx-auto px-2 md:px-0 ${
              !id || (id && chatHistory.length > 0)
                ? "h-[72%] min-h-[72%]"
                : "h-full"
            }`}
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
            className={`w-full md:h-[25%] max-w-3xl mx-auto mb-4 px-2 mt-auto`}
            data-aos="zoom-in"
            data-aos-duration="700"
          >
            <ChatInput
              message={chatMessage}
              setMessage={setChatMessage}
              onSendMessage={handleSendMessage}
              onClearMessage={handleClearMessage}
              isLoading={isAdding || isCreating}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
