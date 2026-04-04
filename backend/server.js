// server.js
const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const explainCode = require("./geminiai");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://ai-code-explainer-snowy.vercel.app/",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error(`CORS policy: ${origin} not allowed`));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // replaces body-parser

// MongoDB Connection
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Routes
app.post("/api/codeexplain", async (req, res) => {
  const { code, mode = "explain", language = "javascript" } = req.body;

  // Validate required fields
  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Code is required",
    });
  }

  // Validate mode
  const validModes = ["explain", "line-by-line", "complexity", "bugs"];
  if (!validModes.includes(mode)) {
    return res.status(400).json({
      success: false,
      error: `Invalid mode. Must be one of: ${validModes.join(", ")}`,
    });
  }

  // AI call
  const explanation = await explainCode(code, mode, language);

  res.status(200).json({
    message: "successfully explained",
    explanation: explanation,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
