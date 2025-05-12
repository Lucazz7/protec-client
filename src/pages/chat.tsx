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

  const { isLoading: isLoadingChat } = useGetChatByIdQuery(String(id), {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [chatMessage, setChatMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const { chatHistory, error } = useAppSelect((state) => {
    return {
      chatHistory: state.chatSlice.chatHistory,
      error: state.chatSlice.error,
    };
  });

  const handleClearMessage = () => {
    setChatMessage("");
    setHasError(false);
  };

  const handleCreateChat = useCallback(() => {
    const currentMessage = chatMessage;
    setChatMessage("");
    setHasError(false);

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
        setHasError(true);
        dispatch(setChatHistory(chatHistory));
        return;
      }

      const isValidSQL = (sql: string): boolean => {
        const cleanSQL = sql?.trim()?.replace(/\s+/g, " ");
        const sqlKeywords = [
          "SELECT",
          "INSERT",
          "UPDATE",
          "DELETE",
          "CREATE",
          "ALTER",
          "DROP",
        ];
        const upperSQL = cleanSQL?.toUpperCase();
        const startsWithKeyword = sqlKeywords?.some((keyword) =>
          upperSQL?.startsWith(keyword)
        );
        const hasBasicElements =
          upperSQL?.includes("FROM") ||
          (upperSQL?.includes("INTO") && upperSQL?.includes("VALUES")) ||
          (upperSQL?.includes("SET") && upperSQL?.includes("WHERE")) ||
          upperSQL?.includes("WHERE");
        const endsWithSemicolon = cleanSQL?.trim()?.endsWith(";");

        return (
          startsWithKeyword &&
          hasBasicElements &&
          endsWithSemicolon &&
          sql?.includes("\n")
        );
      };

      if (res?.data?.vanna_question?.id) {
        navigate(`/chat/${res.data.vanna_question.id}`);
      }

      const validateSQL = isValidSQL(res?.data?.response);

      const newHistory: Message[] = [
        ...updatedHistory,
        {
          id: res?.data?.vanna_question?.id?.toString() ?? "",
          response_type: validateSQL
            ? "SQL_WITH_TABLE"
            : res?.data?.response_type,
          df: res?.data?.answer,
          question: validateSQL ? "" : res?.data?.response,
          sql:
            res?.data?.response_type === "SQL_WITH_TABLE" || validateSQL
              ? res?.data?.vanna_question?.generated_sql ?? res?.data?.response
              : res?.data?.vanna_question?.generated_sql,
        },
      ];
      dispatch(setChatHistory(newHistory));
    });
  }, [chatHistory, chatMessage, createChat, dispatch, navigate]);

  const loading = isCreating || isLoadingChat;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeout);
  }, [chatHistory]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col font-inter overflow-y-auto">
      {chatHistory.length > 0 && (
        <div className="w-full min-[400px]:h-32 md:h-[8%] p-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl relative shadow-sm dark:bg-gray-900">
          <HeaderChatView setMessage={setChatMessage} />
        </div>
      )}
      <div
        className={`w-full ${
          chatHistory.length > 0
            ? "h-[calc(100%-135px)] md:min-[400px]:min-h-[92%]"
            : "h-full md:h-auto  md:my-auto"
        } mx-auto flex flex-col py-4 md:justify-center gap-2  md:px-2`}
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
        {chatHistory[chatHistory.length - 1]?.response_type !==
        "SQL_WITH_TABLE" ? (
          <div
            className={`w-full max-w-3xl mx-auto mb-4 px-2 mt-auto`}
            data-aos="zoom-in"
            data-aos-duration="700"
          >
            <ChatInput
              message={chatMessage}
              setMessage={setChatMessage}
              onSendMessage={handleCreateChat}
              onClearMessage={handleClearMessage}
              isLoading={loading}
              hasError={hasError}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
