export interface Message {
  id: string;
  type: "user" | "assistant";
  message: string;
  timestamp: string;
}
