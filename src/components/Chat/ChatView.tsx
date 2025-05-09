import { Player } from "@lottiefiles/react-lottie-player";
import { Button, ConfigProvider, Table } from "antd";
import Aos from "aos";
import {
  AlertCircle,
  Loader2,
  Plus,
  RefreshCcwDot,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Plot from "react-plotly.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Message } from "../../interface/IChat";
import { useAppSelector } from "../../store";
import { setChatHistory, updateMessage } from "../../store/redux/chatSlice";
import { useRelevantMessageMutation } from "../../store/services/chatApi";

interface ChatViewProps {
  chatHistory: Message[];
  isLoading: boolean;
  error: string | null;
}

export default function ChatView({
  chatHistory,
  isLoading,
  error,
}: ChatViewProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { themeSelected } = useAppSelector((state) => {
    return {
      themeSelected: state.themeSlice.theme,
    };
  });

  const [relevantMessage, { isLoading: isLoadingRelevant }] =
    useRelevantMessageMutation();

  const handleRelevantMessage = useCallback(
    (id: string, index: number, isCorrect: boolean) => {
      relevantMessage(id);
      dispatch(
        updateMessage({
          position: index,
          is_correct: isCorrect,
        })
      );
    },
    [dispatch, relevantMessage]
  );

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="mx-auto h-full w-full md:max-w-3xl pb-6 space-y-6 font-inter text-sm px-4 xl:px-0">
      {chatHistory.length > 0 &&
        chatHistory?.map((chat, index) => {
          if (chat.sql || chat.df || chat.response_type === "SQL_WITH_TABLE") {
            return (
              <div
                key={index}
                className="w-full flex justify-start animate-fade-in flex-col gap-2"
                data-aos="zoom-in"
                data-aos-duration="400"
              >
                {chat?.sql ||
                  (chat?.question &&
                    chat.question.toLowerCase().includes("select") &&
                    (chat.question.toLowerCase().includes("from") ||
                      chat.question.toLowerCase().includes("where")) && (
                      <div className="flex flex-col gap-2">
                        <div className="font-mono text-xs text-gray-700 dark:text-gray-300 mt-2">
                          SQL:
                        </div>
                        <pre className="bg-gray-100 dark:bg-[#10182898] p-2 shadow-sm rounded text-xs overflow-x-auto w-fit px-5 flex flex-col ">
                          <ReactMarkdown>{chat.question}</ReactMarkdown>
                        </pre>
                      </div>
                    ))}
                {chat?.df && chat?.df.length > 0 && chat?.df !== "[]" && (
                  <div className="p-2 rounded">
                    <div className="font-mono text-xs text-gray-700 mb-1">
                      Resultado SQL:
                    </div>
                    {(() => {
                      let rows;
                      try {
                        console.log(chat?.df);
                        rows = JSON.parse(chat?.df || "");
                      } catch {
                        rows = [];
                      }
                      if (
                        Array.isArray(rows) &&
                        rows.length > 0 &&
                        typeof rows[0] === "object"
                      ) {
                        const headers = Object.keys(rows[0]);
                        const columns = headers.map((header) => ({
                          title: (
                            <div className="font-mono text-xs text-gray-700 mt-2 line-clamp-1 max-w-[150px] text-center">
                              {header}
                            </div>
                          ),
                          dataIndex: header,
                          key: header,
                          render: (value: any) => {
                            if (
                              value === null ||
                              (typeof value === "number" && isNaN(value))
                            ) {
                              return (
                                <div className="line-clamp-1 max-w-[150px] h-6 w-full text-center text-gray-400">
                                  -
                                </div>
                              );
                            }
                            if (
                              typeof value === "string" &&
                              value.match(/^\d{4}-\d{2}-\d{2}/)
                            ) {
                              return (
                                <div className="line-clamp-1 max-w-[150px] h-6 w-full text-center">
                                  {new Date(value).toLocaleString()}
                                </div>
                              );
                            }
                            return (
                              <div className="line-clamp-1 max-w-[150px] h-6 w-full text-center">
                                {value?.toString() ?? "-"}
                              </div>
                            );
                          },
                        }));

                        const dataSource = rows.map((row: any, i: number) => ({
                          key: i,
                          ...row,
                        }));
                        return (
                          <div className="overflow-x-auto bg-white dark:bg-[#10182852] rounded-md">
                            <ConfigProvider
                              theme={
                                themeSelected
                                  ? {
                                      token: {
                                        colorPrimary: "#e5e7eb",
                                        colorText: "#e5e7eb",
                                        colorBorder: "#364153",
                                        colorBgContainer: "#101828",
                                      },
                                      components: {
                                        Table: {
                                          headerBg: "#101828",
                                          headerColor: "#e5e7eb",
                                          stickyScrollBarBg: "#031842c5",
                                          stickyScrollBarBorderRadius: 4,
                                          borderColor: "#364153",
                                          headerSplitColor: "#364153",
                                        },
                                        Pagination: {
                                          colorBgContainer: "#101828a2",
                                        },
                                      },
                                    }
                                  : undefined
                              }
                            >
                              <Table
                                columns={columns}
                                dataSource={dataSource}
                                pagination={
                                  dataSource.length > 10
                                    ? {
                                        pageSize: 10,
                                        position: ["bottomCenter"],
                                      }
                                    : false
                                }
                                size="small"
                                scroll={{ x: true }}
                              />
                            </ConfigProvider>
                          </div>
                        );
                      }
                      return (
                        <pre className="bg-white dark:bg-[#10182852] p-2 rounded text-xs">
                          {rows
                            .map((row: any) =>
                              Object.entries(row)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" | ")
                            )
                            .join("\n")}
                        </pre>
                      );
                    })()}
                  </div>
                )}
                {chat.fig && (
                  <div className="w-full flex justify-center h-96">
                    <div className="w-full relative  bg-white dark:bg-[#10182852] h-full p-2 rounded shadow">
                      <Plot
                        data={JSON.parse(chat.fig).data}
                        layout={JSON.parse(chat.fig).layout}
                        className="w-full h-full"
                        style={{ width: "100%", height: "100%" }}
                        config={{
                          displayModeBar: true,
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-2 ">
                  <Button
                    type="text"
                    size="small"
                    className={`flex items-center gap-1  hover:!bg-white dark:hover:!bg-gray-900 dark:hover:!brightness-125 !rounded-md ${
                      chat.is_correct === true
                        ? "!text-blue-400"
                        : "!text-gray-400 dark:!text-gray-300"
                    }`}
                    disabled={isLoadingRelevant}
                    onClick={() => {
                      handleRelevantMessage(chat.id, index, true);
                    }}
                  >
                    {isLoadingRelevant ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <ThumbsUp size={16} className="hover:scale-110" />
                    )}
                    <span>Correto</span>
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    disabled={isLoadingRelevant}
                    className={`flex items-center gap-1  hover:scale-110 hover:!bg-white dark:hover:!bg-gray-900 dark:hover:!brightness-125 !rounded-md ${
                      chat.is_correct === false
                        ? "!text-red-500 dark:!text-red-500"
                        : "!text-gray-400 dark:!text-gray-300"
                    }`}
                    onClick={() => {
                      handleRelevantMessage(chat.id, index, false);
                    }}
                  >
                    <ThumbsDown size={16} />
                    <span>Incorreto</span>
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`flex ${
                chat.response_type === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
              data-aos="zoom-in"
              data-aos-duration="400"
            >
              <div
                className={`max-w-[80%] rounded-2xl  ${
                  chat.response_type === "user"
                    ? "bg-white dark:bg-[#101828b7] text-gray-600  dark:text-gray-300 p-2 px-4 rounded-br-none"
                    : "  p-2 px-4 text-gray-500 dark:text-gray-300 rounded-bl-none"
                }`}
              >
                {chat.response_type === "error" ? (
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex-col text-gray-500 text-sm bg-yellow-50 p-2 px-4 flex rounded gap-2 font-light">
                      <span className="flex items-center gap-2">
                        <AlertCircle className="text-yellow-500 " size={18} />
                        <p className="font-inter">
                          Não foi possível rodar o SQL:
                        </p>
                      </span>
                      <ReactMarkdown>{chat.question}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <ReactMarkdown>{chat.question}</ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}

      {isLoading ? (
        <div className={`flex justify-center items-center`}>
          <Player
            src={
              themeSelected
                ? "/image/lottie/IA-animation.json"
                : "/image/lottie/IA-animation-light.json"
            }
            loop
            autoplay
            className="w-44 h-44"
          />
        </div>
      ) : error && chatHistory.length === 0 ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <img
            src={"/image/No data-bro.png"}
            alt="chat"
            className="w-10/12 max-h-96 object-contain"
            data-aos="fade-in"
            data-aos-duration="800"
          />
          <div
            className="flex justify-center items-center gap-2 mt-6"
            data-aos="fade-in"
            data-aos-duration="800"
          >
            <Button
              className=" !text-gray-500 w-auto !rounded-full hover:!border-gray-500"
              onClick={() => {
                window.location.reload();
              }}
            >
              <RefreshCcwDot className="text-gray-500" size={16} />
              Recarregar
            </Button>
            <Button
              className=" !text-gray-500 w-auto !rounded-full hover:!border-gray-500"
              onClick={() => {
                navigate("/");
                dispatch(setChatHistory([]));
              }}
            >
              <Plus className="text-gray-500" size={16} />
              Nova conversa
            </Button>
          </div>
          <div
            className="text-gray-500 text-sm bg-yellow-50 p-2 px-4 rounded-full flex items-center gap-2 mt-6 font-light"
            data-aos="fade-in"
            data-aos-duration="1000"
          >
            <AlertCircle className="text-yellow-500" />
            {error}
          </div>
        </div>
      ) : null}
    </div>
  );
}
