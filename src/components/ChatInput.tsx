import { Image, Paperclip, SendHorizontal } from "lucide-react";
import React, { useRef } from "react";

interface ChatInputProps {
  message: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onInputChange,
  onSendMessage,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
    autoResizeTextarea();
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
        <div className="flex gap-2 p-3">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Image className="h-5 w-5" />
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          className="flex-grow resize-none min-h-[40px] max-h-[120px] py-3 focus:outline-none text-sm placeholder:text-gray-400"
          placeholder="Faça-me uma pergunta sobre seus dados que eu possa transformar em SQL"
          rows={1}
        />
        <button
          onClick={onSendMessage}
          disabled={!message.trim()}
          className={`p-3 ${
            message.trim()
              ? "text-purple-600 hover:text-purple-800"
              : "text-gray-300"
          } transition-colors `}
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
