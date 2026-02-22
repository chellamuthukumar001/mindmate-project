import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Stethoscope, AlertTriangle, AlertCircle,
    CheckCircle, Pill, Building2, ChevronRight, Loader2,
    MessageSquarePlus, RotateCcw, Activity
} from 'lucide-react';

const URGENCY_CONFIG = {
    emergency: {
        label: 'Emergency',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-700',
        badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
        icon: AlertTriangle,
        glow: 'shadow-red-200/60 dark:shadow-red-900/40',
    },
    urgent: {
        label: 'Urgent',
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-700',
        badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
        icon: AlertCircle,
        glow: 'shadow-orange-200/60 dark:shadow-orange-900/40',
    },
    moderate: {
        label: 'Moderate',
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-700',
        badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
        icon: Activity,
        glow: 'shadow-yellow-200/60 dark:shadow-yellow-900/40',
    },
    low: {
        label: 'Low',
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-700',
        badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
        icon: CheckCircle,
        glow: 'shadow-green-200/60 dark:shadow-green-900/40',
    },
};

function ResultCard({ result }) {
    const urgency = (result.urgency || 'low').toLowerCase();
    const config = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.low;
    const UrgencyIcon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`rounded-2xl border ${config.border} ${config.bg} shadow-lg ${config.glow} overflow-hidden`}
        >
            {/* Urgency Header */}
            <div className={`px-5 py-3 flex items-center gap-3 border-b ${config.border}`}>
                <UrgencyIcon size={18} className={config.color} />
                <span className={`text-xs font-bold uppercase tracking-widest ${config.color}`}>
                    {config.label} Urgency
                </span>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
                    {result.urgency_score || '—'}/10
                </span>
            </div>

            <div className="p-5 space-y-4">
                {/* Department */}
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Building2 size={15} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Recommended Department</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">{result.department}</p>
                        {result.specialist && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                See: <span className="font-medium text-purple-600 dark:text-purple-400">{result.specialist}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Possible Conditions */}
                {result.possible_conditions?.length > 0 && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Activity size={15} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Possible Conditions</p>
                            <div className="flex flex-wrap gap-1.5">
                                {result.possible_conditions.map((c, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Treatment */}
                {result.treatment?.length > 0 && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Pill size={15} className="text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Treatment & Next Steps</p>
                            <ul className="space-y-1.5">
                                {result.treatment.map((t, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                                        <ChevronRight size={12} className="text-teal-500 mt-0.5 flex-shrink-0" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                <p className="text-[10px] text-gray-400 dark:text-gray-600 italic border-t border-gray-200 dark:border-gray-700 pt-3">
                    ⚠️ This is AI-generated guidance only. Always consult a licensed medical professional for diagnosis and treatment.
                </p>
            </div>
        </motion.div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-md shadow flex gap-1.5 items-center">
                {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.span
                        key={i}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1, delay }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                    />
                ))}
            </div>
        </div>
    );
}

export default function SymptomChecker({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Hi! I'm your Symptom Checker 🩺 Describe your symptoms in detail and I'll suggest the right department, urgency level, and treatment plan.",
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) setTimeout(() => textareaRef.current?.focus(), 300);
    }, [isOpen]);

    const handleReset = () => {
        setMessages([{
            id: 1,
            type: 'bot',
            text: "Hi! I'm your Symptom Checker 🩺 Describe your symptoms in detail and I'll suggest the right department, urgency level, and treatment plan.",
        }]);
        setInput('');
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMsg = { id: Date.now(), type: 'user', text: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/symptoms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: trimmed }),
            });

            const data = await response.json();

            if (data.result) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    type: 'result',
                    result: data.result,
                    text: data.summary || '',
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: data.error || "I couldn't analyze those symptoms. Please try describing them differently.",
                }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "Unable to reach the server right now. Please make sure the backend is running and try again.",
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-[70] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-600 to-blue-600">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                <Stethoscope size={18} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-white font-bold text-base leading-tight">Symptom Checker</h2>
                                <p className="text-white/70 text-xs">AI-powered medical guidance</p>
                            </div>
                            <button
                                onClick={handleReset}
                                title="Start over"
                                className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            >
                                <RotateCcw size={16} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.type === 'user' && (
                                        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-md bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm shadow-lg shadow-purple-500/20">
                                            {msg.text}
                                        </div>
                                    )}
                                    {msg.type === 'bot' && (
                                        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm shadow border border-gray-100 dark:border-gray-700">
                                            {msg.text}
                                        </div>
                                    )}
                                    {msg.type === 'result' && (
                                        <div className="w-full space-y-2">
                                            {msg.text && (
                                                <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm shadow border border-gray-100 dark:border-gray-700">
                                                    {msg.text}
                                                </div>
                                            )}
                                            <ResultCard result={msg.result} />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isLoading && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <div className="flex gap-2 items-end">
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Describe your symptoms… e.g. 'I have chest pain and shortness of breath'"
                                    rows={2}
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-3 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                                    style={{ minHeight: '52px', maxHeight: '120px' }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                >
                                    {isLoading
                                        ? <Loader2 size={18} className="animate-spin" />
                                        : <Send size={18} />
                                    }
                                </motion.button>
                            </div>
                            <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-2">
                                For emergencies, call <strong>112</strong> or go to your nearest ER immediately.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
