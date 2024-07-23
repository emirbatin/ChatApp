import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:3000",
      "https://chatappclient-six.vercel.app",
      "https://chatapp-api-six.vercel.app",
    ];

const corsOption = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOption));
app.options("*", cors(corsOption)); // Preflight OPTIONS request

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server listening at port ${PORT}`);
});
