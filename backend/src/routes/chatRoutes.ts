import { Router } from "express";
import { ChatController } from "../controllers/ChatController";

const router = Router();
const chatController = new ChatController();

// Rotas para o chat
router.get("/", chatController.getAllChats);
router.get("/:id", chatController.getChatById);
router.post("/", chatController.createChat);
router.post("/:id/messages", chatController.addMessage);

export const chatRoutes = router;
