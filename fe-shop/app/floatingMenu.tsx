import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaFacebook, FaTwitter, FaInstagram, FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";

const FloatingMenu = (user: any) => {

  interface Message {
    id: number;
    from_user_id: number | undefined;
    to_user_id: number;
    content: string;
    created_at: string;
  }

  const [open, setOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Lấy dữ liệu người dùng và tin nhắn từ sessionStorage khi component mount
  useEffect(() => {
    const storedMessages = sessionStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gửi tin nhắn mới và lưu vào sessionStorage
  const sendMessage = async () => {
    if (message.trim() === "") return;

    // 1. Push tin nhắn người dùng trước
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
    };

    setMessages((prevMessages) => {
      const updated = [...prevMessages, userMessage];
      sessionStorage.setItem("messages", JSON.stringify(updated));
      return updated;
    });

    const currentMessage = message; // lưu để dùng sau
    setMessage(""); // Reset input

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
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: result.content,
        };
        setMessages((prevMessages) => {
          const updated = [...prevMessages, assistantMessage];
          sessionStorage.setItem("messages", JSON.stringify(updated));
          return updated;
        });
      } else {
        console.error("Lỗi khi nhận phản hồi:", result);
      }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
    }
  };


  return (
      <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
        {/* Hộp tin nhắn */}
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

                {/* Danh sách tin nhắn */}
                <div className="flex-1 z-50 overflow-y-auto p-2 space-y-2">
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? "justify-end" : "justify-start"}`}>
                        <div className={`p-2 rounded-lg max-w-xs text-sm ${msg.role === 'assistant' ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                          {msg.content}
                        </div>
                      </div>
                  ))}
                  <div ref={chatEndRef}></div>
                </div>

                {/* Ô nhập tin nhắn */}
                <div className="flex items-center border-t pt-2">
                  <input
                      type="text"
                      className="flex-1 p-2 border rounded-lg outline-none text-sm"
                      placeholder="Nhập tin nhắn..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                    <FaPaperPlane />
                  </button>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Nút con */}
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

        {/* Nút chính */}
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
