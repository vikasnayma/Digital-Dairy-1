import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Message from "./models/message.js";
import { log } from "console";

const jwtSecret = Buffer.from(process.env.JWT_SECRET, 'base64');



const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
}); 

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chat-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


//Socket Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log(jwt.decode(token));
  try {
    const decoded = jwt.verify(token, jwtSecret );
    console.log(decoded);
    console.log("JWT Auth verified for user:", decoded.userId);
    socket.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Auth Error");
    next(new Error("Authentication Error"));
  }
});

io.on("connection", (socket) => {
  const { dairyId , userId } = socket.user;
  const room = `Dairy_${dairyId}`;
  socket.join(room);
  console.log(`User ${userId} joined the room ${room}`);

  socket.on("send-message" , async ({message , receiverId}) => {
    const newMessage = new Message({
      senderId: userId,
      receiverId: receiverId,
      dairyId: dairyId,
      message: message,
      timestamp: new Date()
    });

    try {
      await newMessage.save();
      io.to(room).emit("receive-message", {
        senderId: userId,
        receiverId: receiverId,
        message: message,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  })

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected from room ${room}`);
  });
});


// Fetch chat history between two users for a dairy
app.get("/chat-history", async (req, res) => {
  const { dairyId, userId, otherUserId } = req.query;

  if (!dairyId || !userId || !otherUserId) {
    return res.status(400).json({ message: "Missing required query parameters." });
  }

  try {
    const messages = await Message.find({
      dairyId: dairyId,
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching chat history." });
  }
});

server.listen(5174, () => {
  console.log("Chat service is running on port 5174");
})





//opertor dont have the dairyid so his cvhat ois not being showed , and while saving the msg data is being taken from the token so need to take the dairy id from the token so need to feed the dairy id in the operstor ' s user table.