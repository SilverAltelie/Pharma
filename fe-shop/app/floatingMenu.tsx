import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaFacebook, FaTwitter, FaInstagram, FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";
import type {User} from "@/app/type";

const FloatingMenu = ({ user }: { user: User | undefined }) => {
  interface Message {
    id: number;
    from_user_id?: number;
    to_user_id?: number;
    content: string;
    created_at?: string;
    role: string;
  }

  const [open, setOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const quickMessages = [
    "Làm sao để biết được mình có bệnh gì?",
    "Tôi bị đau bụng thì làm sao?",
    "Tôi bị nhức đầu thì làm sao?",
    "Tôi bị mất ngủ thì làm sao?",
  ];

  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((prevMessages) => {
      // Remove the oldest message if the array exceeds 150 messages
      const updated = [...prevMessages, userMessage];
      if (updated.length > 150) {
        updated.shift(); // Remove the first (oldest) message
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("messages", JSON.stringify(updated));
      }
      return updated;
    });

    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      const result = await res.json();
      if (res.ok && result && result.content) {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: result.content,
        };
        setMessages((prevMessages) => {
          const updated = [...prevMessages, assistantMessage];
          if (updated.length > 150) {
            updated.shift(); // Remove the first (oldest) message
          }
          if (typeof window !== "undefined") {
            localStorage.setItem("messages", JSON.stringify(updated));
          }
          return updated;
        });
      } else {
        console.error("Error receiving response:", result);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickMessage = (msg: string) => {
    setMessage(msg);
  };

  return (
      <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
        <AnimatePresence>
          {isChatOpen && user && (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white w-[500px] h-[700px] p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col fixed bottom-20 right-20"
              >
                <div className="flex justify-between items-center pb-2 border-b">
                  <h2 className="text-lg font-semibold">Hộp tin nhắn</h2>
                  <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <FaTimes />
                  </button>
                </div>

                <div className="flex-1 z-50 overflow-y-auto p-2 space-y-2">
                  {messages.length === 0 && (
                    <div className="flex flex-col gap-2 p-4">
                      <p className="text-gray-500 text-sm text-center mb-2">Chọn câu hỏi thường gặp:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {quickMessages.map((msg, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickMessage(msg)}
                            className="text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900"
                          >
                            {msg}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? "justify-end" : "justify-start"}`}>
                        <div className={`p-2 rounded-lg max-w-xs text-sm ${msg.role === 'assistant' ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                          {msg.content}
                        </div>
                      </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-600 p-2 rounded-lg max-w-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <span className="text-sm">Đang phân tích...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}></div>
                </div>

                <div className="space-y-2">
                  {messages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                      {quickMessages.map((msg, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickMessage(msg)}
                          className="flex-shrink-0 px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-700 hover:text-gray-900 whitespace-nowrap"
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center border-t pt-2">
                    <input
                        type="text"
                        className="flex-1 p-2 border rounded-lg outline-none text-sm"
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
                        disabled={isLoading}
                    />
                    <button 
                      onClick={sendMessage} 
                      disabled={isLoading}
                      className={`ml-2 p-2 rounded-full transition-colors duration-200 ${
                        isLoading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
              <motion.div
                  className="flex flex-col space-y-3 mb-2 z-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
              >
                {[
                  { icon: <FaFacebook className="w-6 h-6" />, color: "bg-blue-600", link: "https://facebook.com" },
                  { icon: <FaTwitter className="w-6 h-6" />, color: "bg-blue-400", link: "https://twitter.com" },
                  { icon: <FaInstagram className="w-6 h-6" />, color: "bg-pink-500", link: "https://instagram.com" },
                  { icon: <FaCommentDots className="w-6 h-6" />, color: "bg-green-600", link: "#" }
                ].map((item, index) => (
                    <motion.button
                        key={index}
                        onClick={() => item.link === "#" ? setIsChatOpen(!isChatOpen) : window.open(item.link, "_blank")}
                        className="group"
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center ${item.color} text-white rounded-full shadow-lg transition transform hover:scale-110`}>
                        {item.icon}
                      </div>
                    </motion.button>
                ))}
              </motion.div>
          )}
        </AnimatePresence>

        <motion.button
            onClick={() => setOpen(!open)}
            initial={false}
            animate={{ rotate: open ? 135 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition hover:scale-110"
        >
          <FaPlus className="w-7 h-7" />
        </motion.button>
      </div>
  );
};

export default FloatingMenu;