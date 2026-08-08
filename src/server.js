import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import whatsappRouter from "./routes/whatsapp.js";

dotenv.config();

const app = express();

// ========================================
// Middleware
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// Health / Root
// ========================================

app.get("/", (req, res) => {

res.json({
name: "ChatFlow AI Backend",
status: "running",
version: "1.0.0"
});

});

// ========================================
// WhatsApp Webhook
// ========================================

app.use(
"/webhooks/whatsapp",
whatsappRouter
);

// ========================================
// 404
// ========================================

app.use((req, res) => {

res.status(404).json({
error: "Route not found"
});

});

// ========================================
// Server
// ========================================

const PORT =
process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

console.log(
"ChatFlow AI running on port ${PORT}"
);

});