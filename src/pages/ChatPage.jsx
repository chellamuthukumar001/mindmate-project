import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MoreVertical, Phone, Plus, Search, MessageSquare, Sparkles, X, Menu, LogIn, Trash2 } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function ChatPage() {
    const { user, loginWithGoogle } = useAuth();
    const [messages, setMessages] = useState([{
        id: 1,
        text: "Hello! I'm here to support you. How are you feeling today?",
        isUser: false,
        timestamp: new Date().toISOString()
    }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchChatHistory();
        } else {
            setChatHistory([]);
            setCurrentChatId(null);
        }
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const fetchChatHistory = async () => {
        try {
            const q = query(
                collection(db, 'chats'),
                where('userId', '==', user.uid),
                orderBy('updatedAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChatHistory(history);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    const handleNewChat = () => {
        setMessages([{
            id: Date.now(),
            text: "Hello! I'm here to support you. How are you feeling today?",
            isUser: false,
            timestamp: new Date().toISOString()
        }]);
        setCurrentChatId(null);
        setInput('');
        setIsTyping(false);
    };

    const loadChat = (chat) => {
        setMessages(chat.messages);
        setCurrentChatId(chat.id);
        setIsTyping(false);
        if (window.innerWidth < 1024) setShowSidebar(false);
    };

    const deleteChat = async (e, chatId) => {
        e.stopPropagation();
        try {
            await deleteDoc(doc(db, 'chats', chatId));
            fetchChatHistory();
            if (currentChatId === chatId) handleNewChat();
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, isUser: true, timestamp: new Date().toISOString() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch(API_ENDPOINTS.chat, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.isUser ? 'user' : 'assistant', content: m.text })) })
            });

            const data = await response.json();
            const aiMsg = {
                id: Date.now() + 1,
                text: data.reply || "I'm here for you. Take a deep breath — you're doing great.",
                isUser: false,
                timestamp: new Date().toISOString()
            };

            const finalMessages = [...newMessages, aiMsg];
            setMessages(finalMessages);

            if (user) {
                if (currentChatId) {
                    await updateDoc(doc(db, 'chats', currentChatId), {
                        messages: finalMessages,
                        updatedAt: serverTimestamp()
                    });
                } else {
                    const docRef = await addDoc(collection(db, 'chats'), {
                        userId: user.uid,
                        title: input.substring(0, 30) + (input.length > 30 ? '...' : ''),
                        messages: finalMessages,
                        updatedAt: serverTimestamp()
                    });
                    setCurrentChatId(docRef.id);
                }
                fetchChatHistory();
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm having a little trouble connecting. 💜 But I'm still here for you.",
                isUser: false,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex gap-0 md:gap-4 p-0 md:p-4 overflow-hidden relative">
            {/* Sidebar Toggle (Mobile) */}
            {!showSidebar && (
                <button
                    onClick={() => setShowSidebar(true)}
                    className="lg:hidden absolute top-6 left-6 z-50 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl"
                >
                    <Menu size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
            )}

            {/* Sidebar */}
            <AnimatePresence>
                {showSidebar && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="fixed lg:relative z-40 w-[300px] h-full flex flex-col p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-r lg:border border-white/20 dark:border-gray-700/50 lg:rounded-3xl shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">History</h2>
                            <button onClick={() => setShowSidebar(false)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <X size={18} />
                            </button>
                        </div>

                        <motion.button
                            onClick={handleNewChat}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all mb-6 font-bold"
                        >
                            <Plus size={20} />
                            New Chat
                        </motion.button>

                        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                            {!user ? (
                                <div className="text-center py-8 px-4 bg-purple-500/5 rounded-2xl border border-dashed border-purple-500/20">
                                    <LogIn size={32} className="mx-auto text-purple-400 mb-3 opacity-50" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Login to save your personal chat history</p>
                                    <button
                                        onClick={loginWithGoogle}
                                        className="w-full py-2.5 bg-white dark:bg-gray-700 text-sm font-bold rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:bg-gray-50 transition-all"
                                    >
                                        Log In
                                    </button>
                                </div>
                            ) : chatHistory.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 text-xs italic">No past conversations yet.</div>
                            ) : (
                                chatHistory.map((chat) => (
                                    <motion.button
                                        key={chat.id}
                                        onClick={() => loadChat(chat)}
                                        whileHover={{ x: 4 }}
                                        className={`w-full text-left p-4 rounded-xl text-sm flex items-center justify-between group transition-all ${currentChatId === chat.id ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                    >
                                        <div className="flex items-center gap-3 truncate">
                                            <MessageSquare size={16} className={currentChatId === chat.id ? 'text-purple-500' : 'text-gray-400'} />
                                            <span className="truncate font-medium">{chat.title}</span>
                                        </div>
                                        <button
                                            onClick={(e) => deleteChat(e, chat.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.button>
                                ))
                            )}
                        </div>

                        {user && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-xl border border-purple-500/20 shadow-sm" />
                                    <div className="flex-1 truncate">
                                        <p className="text-sm font-bold dark:text-white truncate">{user.displayName}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col lg:rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl lg:border border-white/20 dark:border-gray-700/50 shadow-xl overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-b border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg">
                                AI
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 dark:text-white text-base md:text-lg">MindMate AI</h2>
                            <p className="text-[10px] md:text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Active Support
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.isUser ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 md:p-5 rounded-3xl text-sm md:text-base shadow-sm ${msg.isUser
                                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-md'
                                    : 'bg-white dark:bg-gray-800 dark:text-gray-100 text-gray-800 rounded-tl-md border border-gray-100 dark:border-gray-700'
                                    }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-2 px-2">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl rounded-tl-sm border border-gray-100 dark:border-gray-700 flex gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-t border-gray-100 dark:border-gray-700/50">
                    <div className="max-w-4xl mx-auto flex gap-3 items-end">
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
                                placeholder="How can I support you?"
                                className="w-full bg-gray-100 dark:bg-gray-700/50 dark:text-white px-5 py-4 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder-gray-400"
                                rows="1"
                                style={{ minHeight: '56px', maxHeight: '120px' }}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
                        >
                            <Send size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
