import { AudioOutlined, PaperClipOutlined } from "@ant-design/icons";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Loader2, SendHorizontal, Trash2 } from "lucide-react";
import type React from "react";
import { useRef } from "react";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: () => void;
  onClearMessage: () => void;
}

export default function ChatInput({
  message,
  isLoading,
  setMessage,
  onSendMessage,
  onClearMessage,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="w-full border border-gray-100 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="p-3">
          <TextArea
            placeholder="Faça-me uma pergunta sobre seus dados que eu possa transformar em SQL"
            className="resize-none text-base"
            rows={3}
            autoSize={{ minRows: 3, maxRows: 4 }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={3000}
            bordered={false}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className=" border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input type="file" className="hidden" ref={fileInputRef} />
            <Button
              type="text"
              size="small"
              className="!text-gray-500 hover:text-gray-700 flex items-center !gap-1.5"
              onClick={handleAttachClick}
              icon={<PaperClipOutlined />}
            >
              Anexo
            </Button>
            <div className="h-4 w-px bg-gray-200" />
            <Button
              type="text"
              size="small"
              className="!text-gray-500 hover:text-gray-700 flex items-center !gap-1.5"
              icon={<AudioOutlined />}
            >
              Audio
            </Button>
            {message.length > 0 && (
              <>
                <div className="h-4 w-px bg-gray-200" />
                <Button
                  type="text"
                  size="small"
                  className="!text-gray-500 hover:text-gray-700 !flex !items-center !gap-1.5"
                  icon={<Trash2 size={14} />}
                  onClick={() => onClearMessage()}
                >
                  Limpar
                </Button>
              </>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <div className="text-xs text-gray-500">{message.length}/3000</div>
            <Button
              type="text"
              size="small"
              className="!text-gray-500 hover:text-gray-700"
              onClick={() => onSendMessage()}
              disabled={isLoading || message.length === 0}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <SendHorizontal
                  size={16}
                  className={`${
                    message.length > 0 ? "text-violet-700" : "text-gray-500"
                  }`}
                />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
