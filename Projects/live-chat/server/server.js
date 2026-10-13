import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import User from "./models/User.js";

dotenv.config();


const app = express();

// Database connection
connectDB();

//Middleware
app.use(cors());
app.use(express.json());


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("userConnected", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Online users:", Array.from(onlineUsers.keys()));
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });


  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined room: ${conversationId}`);
  })

  socket.on("sendMessage", (data) => {
    socket.to(data.conversationId).emit("newMessage",data);
  });

  socket.on ("disconnect", async () => {
    console.log("User disconnected:", socket.id);


    if(socket.userId){
      onlineUsers.delete(socket.userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      await User.findByIdAndUpdate(socket.userId, { isOnline: false });
    }
  });
  
  socket.on("typing", (data) => {
    socket.to(data.conversationId).emit("typing", data);
  });
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Live chat api is running",
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});