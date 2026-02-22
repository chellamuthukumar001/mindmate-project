import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FocusPage() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus');

    useEffect(() => {
        let interval;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus') setTimeLeft(25 * 60);
        if (mode === 'shortBreak') setTimeLeft(5 * 60);
        if (mode === 'longBreak') setTimeLeft(15 * 60);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'focus') setTimeLeft(25 * 60);
        if (newMode === 'shortBreak') setTimeLeft(5 * 60);
        if (newMode === 'longBreak') setTimeLeft(15 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progress = mode === 'focus'
        ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
        : mode === 'shortBreak'
            ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
            : ((15 * 60 - timeLeft) / (15 * 60)) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20 flex flex-col items-center justify-center p-6">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="absolute top-8 right-8 p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg border border-white/20 dark:border-gray-700/50"
            >
                <X size={24} />
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">Focus Mode</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Deep work for maximum productivity</p>
                </div>

                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white/20 dark:border-gray-700/50">
                    {/* Mode Selector */}
                    <div className="flex justify-center gap-2 mb-12 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-2xl backdrop-blur-sm">
                        {[
                            { id: 'focus', label: 'Focus', color: 'from-indigo-600 to-purple-600' },
                            { id: 'shortBreak', label: 'Short Break', color: 'from-teal-500 to-blue-500' },
                            { id: 'longBreak', label: 'Long Break', color: 'from-orange-500 to-pink-500' }
                        ].map((m) => (
                            <motion.button
                                key={m.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => switchMode(m.id)}
                                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${mode === m.id
                                        ? `bg-gradient-to-r ${m.color} text-white shadow-lg`
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                            >
                                {m.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Timer Display */}
                    <div className="text-center mb-12 relative">
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            <motion.circle
                                cx="100"
                                cy="100"
                                r="90"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: progress / 100 }}
                                transition={{ duration: 0.5 }}
                                strokeDasharray="565.48"
                                strokeDashoffset={565.48 * (1 - progress / 100)}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#8B5CF6" />
                                    <stop offset="100%" stopColor="#3B82F6" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="relative z-10 py-16">
                            <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 font-mono tracking-tighter">
                                {formatTime(timeLeft)}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium uppercase tracking-widest text-sm">
                                {isActive ? 'Stay Focused' : 'Ready to Start'}
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTimer}
                            className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 transition-all"
                        >
                            {isActive ? (
                                <Pause size={32} fill="currentColor" />
                            ) : (
                                <Play size={32} fill="currentColor" className="ml-1" />
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetTimer}
                            className="w-20 h-20 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl flex items-center justify-center transition-all shadow-lg"
                        >
                            <RotateCcw size={28} />
                        </motion.button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-gray-700/50"
                >
                    <strong className="text-gray-700 dark:text-gray-300">Pomodoro Technique:</strong><br />
                    Work in focused 25-minute intervals, followed by short breaks to maintain peak productivity.
                </motion.div>
            </motion.div>
        </div>
    );
}
