import Plot from "react-plotly.js";
import { Message } from "../../interface/IChat";

interface ChatViewProps {
  chatHistory: Message[];
  isLoading: boolean;
}

export default function ChatView({ chatHistory, isLoading }: ChatViewProps) {
  return (
    <div className="mx-auto w-full max-w-3xl mb-6 space-y-6 font-inter text-sm">
      {chatHistory?.map((chat, index) => {
        if (chat.question?.includes("sql")) {
          let mock;
          try {
            mock = JSON.parse(chat.question);
          } catch {
            mock = null;
          }

          if (mock && mock.sql) {
            return (
              <div
                key={index}
                className="w-full flex justify-start animate-fade-in flex-col gap-2"
              >
                <div className="bg-gray-100 p-2 rounded">
                  <div className="font-mono text-xs text-gray-700 mb-1">
                    Resultado SQL:
                  </div>
                  <pre className="bg-white p-2 rounded text-xs">
                    {JSON.parse(mock.df)
                      .map((row: any, i: number) =>
                        Object.entries(row)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" | ")
                      )
                      .join("\n")}
                  </pre>
                </div>
                <div className="w-full h-96">
                  {mock.fig && (
                    <div className="w-full relative  bg-white h-full p-2 rounded shadow">
                      <Plot
                        data={JSON.parse(mock.fig).data}
                        layout={JSON.parse(mock.fig).layout}
                        className="w-full h-full"
                        style={{ width: "100%", height: "100%" }}
                        config={{ displayModeBar: true }}
                      />
                    </div>
                  )}
                </div>
                <div className="font-mono text-xs text-gray-700 mt-2">SQL:</div>
                <pre className="bg-gray-100 p-2 rounded text-xs">
                  {mock.sql}
                </pre>
              </div>
            );
          }
        }

        return (
          <div
            key={index}
            className={`flex ${
              chat.type === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            <div
              className={`max-w-[80%] p-2 px-4 rounded-2xl rounded-br-none ${
                chat.type === "user" ? "bg-white text-gray-600" : ""
              }`}
            >
              <p className="text-gray-700">{chat.question}</p>
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-center items-center ">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-800 my-6"></div>
        </div>
      )}
    </div>
  );
}
