import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFarmersByDairy, getDairyDetails } from "../Redux/Slices/dairyActions";
import { motion } from "framer-motion";
import { FaPaperPlane, FaUser } from "react-icons/fa";

export default function OperatorChatComponent() {
  const dispatch = useDispatch();
  const { dairy } = useSelector((state) => state.dairy);
  const { allFarmers } = useSelector((state) => state.allFarmers);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [selectedFarmerName, setSelectedFarmerName] = useState("");
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(getDairyDetails());
  }, [dispatch]);

  useEffect(() => {
    if (dairy?.dairyId) {
      dispatch(fetchAllFarmersByDairy(dairy.dairyId));
    }
  }, [dairy, dispatch]);

  useEffect(() => {
    if (authUser && token) {
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
    const fetchChatHistory = async () => {
      if (selectedFarmerId) {
        try {
          const response = await axios.get("http://localhost:5174/chat-history", {
            params: {
              dairyId: dairy.dairyId,
              userId: authUser.userId,
              otherUserId: selectedFarmerId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      } else {
        setMessages([]);
      }
    };

    fetchChatHistory();
  }, [selectedFarmerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFarmerSelect = (e) => {
    const farmerId = e.target.value;
    const farmer = allFarmers.find(f => f.user_id === farmerId);
    setSelectedFarmerId(farmerId);
    setSelectedFarmerName(farmer?.name || "");
  };

  const sendMessage = () => {
    if (socket && selectedFarmerId && input.trim() !== "") {
      socket.emit("send-message", { 
        receiverId: selectedFarmerId, 
        message: input 
      });
      setInput("");
      socket.emit("stop-typing", selectedFarmerId);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    } else if (socket && selectedFarmerId) {
      socket.emit("typing", selectedFarmerId);
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
        Farmer Chat
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Farmer Selection */}
        <div className="w-full md:w-1/3">
          <label className="block mb-2 font-medium text-green-700">
            Select Farmer:
          </label>
          <select
            value={selectedFarmerId}
            onChange={handleFarmerSelect}
            className="w-full p-3 rounded-lg border border-green-300 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">-- Select Farmer --</option>
            {allFarmers.map((farmer) => (
              <option key={farmer.user_id} value={farmer.user_id}>
                {farmer.name} (ID: {farmer.user_id})
              </option>
            ))}
          </select>

          {selectedFarmerName && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <FaUser className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">{selectedFarmerName}</p>
                  <p className="text-sm text-gray-600">Farmer ID: {selectedFarmerId}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="w-full md:w-2/3">
          <div className="h-80 overflow-y-auto bg-green-50 p-4 rounded-lg border border-green-200 mb-4 flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                {selectedFarmerId 
                  ? "No messages yet. Start the conversation!" 
                  : "Select a farmer to start chatting"}
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
                      {msg.senderId === authUser.userId ? "You" : selectedFarmerName}
                    </strong>
                    <span className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p>{msg.message}</p>
                </div>
              ))
            )}
            {isTyping && selectedFarmerId && (
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

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => socket?.emit("stop-typing", selectedFarmerId)}
              placeholder="Type your message..."
              disabled={!selectedFarmerId}
              className="flex-1 p-3 rounded-lg border border-green-300 bg-white text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              onClick={sendMessage}
              disabled={!selectedFarmerId || input.trim() === ""}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}