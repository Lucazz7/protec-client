import { ChatHistory } from "../../interface/IChat";

interface ChatViewProps {
  chatHistory: ChatHistory[];
  isLoading: boolean;
}

export default function ChatView({ chatHistory, isLoading }: ChatViewProps) {
  return (
    <div className="mx-auto w-full max-w-3xl mb-6 space-y-6 font-inter text-sm">
      {chatHistory.map((chat, index) => (
        <div
          key={index}
          className={`flex ${
            chat.type === "user" ? "justify-end" : "justify-start"
          } animate-fade-in`}
        >
          <div
            className={`max-w-[80%] p-2 px-4 rounded-full rounded-br-none ${
              chat.type === "user" ? "bg-white text-gray-600" : ""
            }`}
          >
            <p className="text-gray-700">{chat.message}</p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-center items-center ">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-800 my-6"></div>
        </div>
      )}
    </div>
  );
}
