import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

export default function FarmerChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const token = localStorage.getItem("token");

  let operatorid;

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5174/chat-history", {
        params: {
          dairyId: authUser.dairyId,
          userId: authUser.userId,
          otherUserId: 13, // Assuming operator ID is 13
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const fetchDairyDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/dairy-details/dairy/${authUser.dairyId}`);
      operatorid = res.data.operatorId;
    } catch (error) {
      console.error("Error fetching dairy details:", error);
    }
  };

  useEffect(() => {
    fetchDairyDetails();
    if (authUser && token) {
      fetchChatHistory();
      const newSocket = io("http://localhost:5174", { 
        auth: { token },
        transports: ['websocket'] 
      });

      newSocket.on("receive-message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      newSocket.on("typing", () => {
        setIsTyping(true);
      });

      newSocket.on("stop-typing", () => {
        setIsTyping(false);
      });

      setSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (socket && operatorid && input.trim() !== "") {
      socket.emit("send-message", { 
        receiverId: operatorid, 
        message: input 
      });
      setInput("");
      socket.emit("stop-typing", operatorid);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    } else if (socket && operatorid) {
      socket.emit("typing", operatorid);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white mt-24 border border-green-200 rounded-2xl p-6 shadow-lg max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-green-800 pb-2 border-b border-green-200">
        Operator Chat
      </h2>

      <div className="flex flex-col gap-6">
        {/* Operator Info */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <FaUser className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Dairy Operator</p>
              <p className="text-sm text-gray-600">Available for support</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-80 overflow-y-auto bg-green-50 p-4 rounded-lg border border-green-200 mb-4 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 p-3 rounded-xl max-w-[80%] ${
                  msg.senderId === authUser.userId
                    ? "ml-auto bg-green-600 text-white"
                    : "mr-auto bg-white border border-green-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${
                    msg.senderId === authUser.userId ? "bg-green-200" : "bg-green-600"
                  }`} />
                  <strong className="text-sm">
                    {msg.senderId === authUser.userId ? "You" : "Operator"}
                  </strong>
                  <span className="text-xs opacity-70">
                    {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p>{msg.message}</p>
              </div>
            ))
          )}
          {isTyping && (
            <div className="mr-auto bg-white border border-green-200 p-2 px-3 rounded-xl max-w-[50%]">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={() => socket?.emit("stop-typing", operatorid)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg border border-green-300 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={input.trim() === ""}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
            <span>Send</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}