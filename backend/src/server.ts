import cors from "cors";
import express from "express";
import { chatRoutes } from "./routes/chatRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/chats", chatRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
