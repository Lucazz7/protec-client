import { Button, Table } from "antd";
import Aos from "aos";
import { AlertCircle, Plus, RefreshCcwDot } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Plot from "react-plotly.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Message } from "../../interface/IChat";
import { setChatHistory } from "../../store/redux/chatSlice";
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

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="mx-auto h-full w-full md:max-w-3xl  pb-6 space-y-6 font-inter text-sm">
      {chatHistory.length > 0 &&
        chatHistory?.map((chat, index) => {
          if (chat.sql || chat.df) {
            return (
              <div
                key={index}
                className="w-full flex justify-start animate-fade-in flex-col gap-2"
                data-aos="zoom-in"
                data-aos-duration="400"
              >
                {chat?.sql && (
                  <div className="w-full flex flex-col gap-1">
                    <div className="font-mono text-xs text-gray-700 mt-2">
                      SQL:
                    </div>
                    <pre className="bg-gray-100  shadow-sm p-2 rounded text-xs overflow-auto  px-5">
                      <ReactMarkdown>{chat?.sql}</ReactMarkdown>
                    </pre>
                  </div>
                )}
                {chat?.df && chat?.df.length > 0 && chat?.df !== "[]" && (
                  <div className="p-2 rounded">
                    <div className="font-mono text-xs text-gray-700 mb-1">
                      Resultado SQL:
                    </div>
                    {(() => {
                      let rows;
                      try {
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
                        // ... existing code ...
                        const columns = headers.map((header) => ({
                          title: (
                            <div className="font-mono text-xs text-gray-700 mt-2 line-clamp-1 max-w-[100px] text-center">
                              {header}
                            </div>
                          ),
                          dataIndex: header,
                          key: header,
                          render: (value: any) => (
                            <div className="line-clamp-1 max-w-[100px] h-6 w-full text-center">
                              {value ?? "null"}
                            </div>
                          ),
                        }));

                        const dataSource = rows.map((row: any, i: number) => ({
                          key: i,
                          ...row,
                        }));
                        return (
                          <div className="overflow-x-auto bg-white rounded-md">
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
                          </div>
                        );
                      }
                      // fallback para o formato antigo se não for possível montar tabela
                      return (
                        <pre className="bg-white p-2 rounded text-xs">
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
                    <div className="w-full relative  bg-white h-full p-2 rounded shadow">
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
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`flex ${
                chat.type === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
              data-aos="zoom-in"
              data-aos-duration="400"
            >
              <div
                className={`max-w-[80%]  rounded-2xl  ${
                  chat.type === "user"
                    ? "bg-white text-gray-600 p-2 px-4 rounded-br-none"
                    : "  p-2 px-4 text-gray-500 rounded-bl-none "
                }`}
              >
                {chat.type === "sql" ? (
                  <div className="flex flex-col gap-2">
                    <div className="font-mono text-xs text-gray-700 mt-2">
                      SQL:
                    </div>
                    <pre className="bg-gray-100 p-2 shadow-sm rounded text-xs overflow-x-auto w-fit px-5 flex flex-col ">
                      <ReactMarkdown>{chat.question}</ReactMarkdown>
                    </pre>
                  </div>
                ) : chat.type === "error" ? (
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex-col text-gray-500 text-sm bg-yellow-50 p-2 px-4 flex rounded gap-2 font-light">
                      <span className="flex items-center gap-2">
                        <AlertCircle className="text-yellow-500 " size={18} />
                        <p className="font-inter">
                          Não foi possível rodar o SQL:
                        </p>
                      </span>
                      <div className="text-sm font-light">
                        <ReactMarkdown>{chat.question}</ReactMarkdown>
                      </div>
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
        <div
          className={`flex justify-center items-center ${
            chatHistory.length === 0 ? "w-full h-full" : ""
          }`}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-800 my-6"></div>
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
