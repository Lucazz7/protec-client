import { Button, Table } from "antd";
import { AlertCircle, Plus, RefreshCcwDot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Plot from "react-plotly.js";
import { useNavigate } from "react-router-dom";
import { Message } from "../../interface/IChat";
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
  return (
    <div className="mx-auto h-full w-full max-w-3xl  pb-6 space-y-6 font-inter text-sm">
      {chatHistory.length > 0 &&
        chatHistory?.map((chat, index) => {
          if (chat.sql || chat.df) {
            return (
              <div
                key={index}
                className="w-full flex justify-start animate-fade-in flex-col gap-2"
              >
                {chat?.sql && (
                  <div className="w-full flex flex-col">
                    <div className="font-mono text-xs text-gray-700 mt-2">
                      SQL:
                    </div>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto w-fit px-5">
                      <ReactMarkdown>{chat?.sql}</ReactMarkdown>
                    </pre>
                  </div>
                )}
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
            >
              <div
                className={`max-w-[80%]  rounded-2xl  ${
                  chat.type === "user"
                    ? "bg-white text-gray-600 p-2 px-4 rounded-br-none"
                    : " text-gray-600 rounded-bl-none px-1"
                }`}
              >
                <ReactMarkdown>{chat.question}</ReactMarkdown>
              </div>
            </div>
          );
        })}

      {isLoading ? (
        <div className="flex justify-center items-center ">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-800 my-6"></div>
        </div>
      ) : error ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <img
            src={"/image/No data-bro.png"}
            alt="chat"
            className="w-10/12 max-h-96 object-contain"
          />
          <div className="flex justify-center items-center gap-2 mt-6">
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
              }}
            >
              <Plus className="text-gray-500" size={16} />
              Nova conversa
            </Button>
          </div>
          <div className="text-gray-500 text-sm bg-yellow-50 p-2 px-4 rounded-full flex items-center gap-2 mt-6 font-light">
            <AlertCircle className="text-yellow-500" />
            {error}
          </div>
        </div>
      ) : null}
    </div>
  );
}
