import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Battery, Activity, ArrowRight, Play, Heart, TrendingUp, Calendar, MoreHorizontal, Sparkles, Brain, Wind, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Greeting = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    return (
        <div className="mb-0">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white tracking-tight mb-2"
            >
                {greeting}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-500 dark:text-gray-400 md:text-xl"
            >
                Ready to find your balance today?
            </motion.p>
        </div>
    );
};

const QuickAction = ({ icon: Icon, title, description, gradient, onClick }) => (
    <motion.button
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`relative p-8 rounded-3xl flex flex-col items-start justify-between gap-4 ${gradient} text-white shadow-2xl overflow-hidden group min-h-[200px] text-left`}
    >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500">
            <Icon size={80} />
        </div>

        <div className="relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md inline-block mb-4">
                <Icon size={28} />
            </div>
            <div>
                <span className="text-2xl font-bold block mb-2">{title}</span>
                <span className="text-sm opacity-90 font-medium">{description}</span>
            </div>
        </div>
    </motion.button>
);

const FeatureCard = ({ title, subtitle, gradient, icon: Icon }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all cursor-pointer group relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 p-32 opacity-5 group-hover:opacity-10 transition-opacity ${gradient}`}>
            <Icon size={200} />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
                <div className={`w-14 h-14 rounded-2xl ${gradient} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{subtitle}</p>
            </div>
            <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold text-sm group-hover:gap-2 transition-all mt-6">
                Start Session <ArrowRight size={18} className="ml-1" />
            </div>
        </div>
    </motion.div>
);

const StatCard = ({ label, value, trend, trendUp }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 flex items-center justify-between transition-all"
    >
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
            <h4 className="text-3xl font-bold text-gray-800 dark:text-white">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl ${trendUp ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'} flex items-center text-sm font-bold gap-1`}>
            {trendUp ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
            {trend}
        </div>
    </motion.div>
);

export default function HomePage() {
    const navigate = useNavigate();
    const [activeMood, setActiveMood] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Greeting />
                    <div className="hidden md:flex gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 px-5 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            <Calendar size={18} className="text-purple-600 dark:text-purple-400" />
                            Today, Feb 6
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 px-5 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            <Battery size={18} className="text-green-500" />
                            84% Energy
                        </motion.div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mood Tracker */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
                                    How are you feeling?
                                </h2>
                                <button
                                    onClick={() => navigate('/app/mood')}
                                    className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
                                >
                                    See History
                                </button>
                            </div>
                            <div className="p-8 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl flex justify-between gap-4 overflow-x-auto">
                                {[
                                    { emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-400' },
                                    { emoji: '😐', label: 'Neutral', color: 'from-gray-400 to-gray-500' },
                                    { emoji: '😔', label: 'Sad', color: 'from-blue-400 to-blue-600' },
                                    { emoji: '😡', label: 'Angry', color: 'from-red-400 to-red-600' },
                                    { emoji: '😰', label: 'Anxious', color: 'from-purple-400 to-purple-600' }
                                ].map((m, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ y: -8, scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveMood(i)}
                                        className={`flex flex-col items-center gap-3 min-w-[80px] transition-all ${activeMood === i ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        <div className={`text-5xl bg-gradient-to-br ${m.color} bg-opacity-10 w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${activeMood === i ? 'ring-4 ring-purple-500/50 shadow-2xl shadow-purple-500/30' : ''} transition-all`}>
                                            {m.emoji}
                                        </div>
                                        <span className={`text-sm font-bold ${activeMood === i ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {m.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.section>

                        {/* Quick Actions Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                            <QuickAction
                                icon={Brain}
                                title="Focus Mode"
                                description="25m Timer • Deep Work"
                                gradient="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600"
                                onClick={() => navigate('/app/focus')}
                            />
                            <QuickAction
                                icon={Wind}
                                title="Breathing"
                                description="3m Session • Relax"
                                gradient="bg-gradient-to-br from-teal-400 via-blue-500 to-teal-600"
                                onClick={() => navigate('/app/breathing')}
                            />
                        </motion.div>

                        {/* Recommendations */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Recommended for you</h2>
                            <FeatureCard
                                title="Morning Clarity"
                                subtitle="Start your day with a guided 10-minute meditation session designed to center your mind and set positive intentions."
                                gradient="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20"
                                icon={Play}
                            />
                        </motion.section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Weekly Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-8 rounded-3xl bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-teal-900/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-gray-800 dark:text-white text-xl">Weekly Wellness</h3>
                                <button><MoreHorizontal size={20} className="text-gray-400" /></button>
                            </div>

                            <div className="grid grid-cols-7 gap-3 mb-8 text-center">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-2 h-20 rounded-full relative bg-white/50 dark:bg-gray-700/50 overflow-hidden">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.random() * 100}%` }}
                                                transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full"
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{day}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <StatCard label="Focus Time" value="4h 20m" trend="+12%" trendUp={true} />
                                <StatCard label="Avg Mood" value="Positive" trend="+8%" trendUp={true} />
                            </div>
                        </motion.div>

                        {/* AI Assistant Promo */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-br from-gray-900 to-purple-900 dark:from-gray-800 dark:to-purple-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-purple-500/20"
                        >
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-4">
                                    <MessageCircle className="text-purple-300" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Talk to MindMate</h3>
                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                    Feeling overwhelmed? Let's chat and work through it together.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/app/chat')}
                                    className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 group"
                                >
                                    Start Chat
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                            {/* Decorative */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mb-10" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
