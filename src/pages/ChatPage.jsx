import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MoreVertical, Phone, Plus, Search, MessageSquare, Sparkles, X } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

export default function ChatPage() {
    const [messages, setMessages] = useState([{
        id: 1,
        text: "Hello! I'm here to support you. How are you feeling today?",
        isUser: false,
        timestamp: new Date().toISOString()
    }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const messagesEndRef = useRef(null);

    // Clear any stale chat history from localStorage on mount
    useEffect(() => {
        localStorage.removeItem('chat_history');
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, isUser: true, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch(API_ENDPOINTS.chat, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'user', content: userMsg.text }] })
            });
            const data = await response.json();

            const aiMsg = {
                id: Date.now() + 1,
                text: data.reply || "I'm having trouble connecting right now. Let's try again later.",
                isUser: false,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const aiMsg = {
                id: Date.now() + 1,
                text: "I seem to be offline. Please check your backend connection.",
                isUser: false,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex gap-4 p-4">
            {/* Sidebar */}
            <AnimatePresence>
                {showSidebar && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="hidden lg:flex flex-col w-80 p-6 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl"
                    >
                        <button
                            onClick={() => setShowSidebar(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X size={18} className="text-gray-500" />
                        </button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all mb-6 font-bold"
                        >
                            <Plus size={20} />
                            New Chat
                        </motion.button>

                        <div className="relative mb-6">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 pl-11 pr-4 py-3 rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            <div className="p-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Today</div>
                            {['Anxiety relief', 'Work stress', 'Daily check-in'].map((title, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ x: 4 }}
                                    className="w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 transition-all group"
                                >
                                    <MessageSquare size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                                    <span className="truncate">{title}</span>
                                </motion.button>
                            ))}

                            <div className="p-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-6">Yesterday</div>
                            {['Sleep patterns', 'Goal setting'].map((title, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ x: 4 }}
                                    className="w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 transition-all group"
                                >
                                    <MessageSquare size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                                    <span className="truncate">{title}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-b border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center gap-4">
                        {!showSidebar && (
                            <button
                                onClick={() => setShowSidebar(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <MessageSquare size={20} />
                            </button>
                        )}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                                AI
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 dark:text-white text-lg">MindMate AI</h2>
                            <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Always here for you
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 text-gray-400">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            <Phone size={20} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            <MoreVertical size={20} />
                        </motion.button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/30 to-transparent dark:from-gray-900/30">
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            key={msg.id}
                            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex flex-col max-w-[85%] md:max-w-[70%] lg:max-w-[60%] ${msg.isUser ? 'items-end' : 'items-start'}`}>
                                <div className={`p-5 rounded-3xl text-sm md:text-base leading-relaxed shadow-lg ${msg.isUser
                                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-md shadow-purple-500/30'
                                    : 'bg-white dark:bg-gray-800 dark:text-gray-100 text-gray-800 rounded-tl-md border border-gray-100 dark:border-gray-700 shadow-gray-200/50 dark:shadow-gray-900/50'
                                    }`}>
                                    {msg.text}
                                </div>
                                <span className="text-xs text-gray-400 mt-2 px-2">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl rounded-tl-md border border-gray-100 dark:border-gray-700 shadow-lg flex gap-2 items-center">
                                <motion.span
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                    className="w-2 h-2 bg-purple-500 rounded-full"
                                />
                                <motion.span
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                    className="w-2 h-2 bg-purple-500 rounded-full"
                                />
                                <motion.span
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                    className="w-2 h-2 bg-purple-500 rounded-full"
                                />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-t border-gray-100 dark:border-gray-700/50">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Share how you're feeling..."
                                className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white px-5 py-4 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                rows="1"
                                style={{ minHeight: '56px', maxHeight: '120px' }}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Mic size={20} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
