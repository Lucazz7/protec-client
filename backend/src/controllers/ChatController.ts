import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

const chats: Chat[] = [];

export class ChatController {
  getAllChats = async (req: Request, res: Response) => {
    try {
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar chats" });
    }
  };

  getChatById = async (req: Request, res: Response) => {
    try {
      const chat = chats.find((c) => c.id === req.params.id);
      if (!chat) {
        return res.status(404).json({ error: "Chat não encontrado" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar chat" });
    }
  };

  createChat = async (req: Request, res: Response) => {
    try {
      const { question } = req.body;
      const newChat: Chat = {
        id: Math.random().toString(36).substring(2, 15),
        messages: [
          {
            id: Math.random().toString(36).substring(2, 15),
            type: "user",
            message: question,
            timestamp: new Date().toISOString(),
          },
          {
            id: Math.random().toString(36).substring(2, 15),
            type: "assistant",
            message: "Olá! Como posso ajudar você hoje?",
            timestamp: new Date().toISOString(),
          },
        ],
      };
      chats.push(newChat);
      res.status(201).json(newChat);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar chat" });
    }
  };

  addMessage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { message } = req.body;

      const chatIndex = chats.findIndex((c) => c.id === id);
      if (chatIndex === -1) {
        return res.status(404).json({ error: "Chat não encontrado" });
      }

      // Garantir que a mensagem do usuário siga o formato correto
      const userMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        type: "user",
        message: typeof message === "string" ? message : message.message,
        timestamp: new Date().toISOString(),
      };

      chats[chatIndex].messages.push(userMessage);

      // Simular resposta do assistente
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(2, 15),
        type: "assistant",
        message: "Esta é uma resposta simulada do assistente.",
        timestamp: new Date().toISOString(),
      };
      chats[chatIndex].messages.push(assistantMessage);

      res.json(chats[chatIndex]);
    } catch (error) {
      res.status(500).json({ error: "Erro ao adicionar mensagem" });
    }
  };
}
