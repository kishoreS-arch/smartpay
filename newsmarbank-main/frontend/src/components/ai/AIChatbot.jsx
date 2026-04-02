import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import "../../styles/chatbot.css";

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your SmartPay Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        
        // Transform current messages to Groq format (role and content instead of role and text)
        const historyForApi = messages.map(msg => ({
            role: msg.role === 'bot' ? 'assistant' : 'user',
            content: msg.text
        }));

        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setInput("");
        setIsLoading(true);

        try {
            const API_BASE = window.API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...historyForApi, userMsg] })
            });

            if (!response.ok) throw new Error("API failed");
            
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-wrapper">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        className="chatbot-window glass-card"
                    >
                        <div className="chat-header">
                            <div className="bot-info">
                                <div className="bot-avatar">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <div className="bot-name">Smart Assistant</div>
                                    <div className="online-status">Online</div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="messages-area" ref={scrollRef}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`msg-bubble-wrapper ${msg.role}`}>
                                    <div className={`msg-bubble ${msg.role}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="msg-bubble-wrapper bot">
                                    <div className="msg-bubble bot typing">
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>.</motion.span>
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                placeholder="Ask about balance, loans..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <button type="submit">
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="chatbot-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                {!isOpen && <div className="notif-ping"></div>}
            </motion.button>
        </div>
    );
};

export default AIChatbot;
