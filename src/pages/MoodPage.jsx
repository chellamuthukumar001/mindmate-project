import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, Minus, Plus, Smile, Frown, Meh, Sun, Cloud, CloudRain, Sparkles, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const moods = [
    { emoji: '😊', label: 'Happy', value: 5, color: 'from-yellow-400 to-orange-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { emoji: '😐', label: 'Neutral', value: 3, color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50 dark:bg-gray-800/20' },
    { emoji: '😔', label: 'Sad', value: 2, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { emoji: '😡', label: 'Angry', value: 1, color: 'from-red-400 to-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    { emoji: '😰', label: 'Anxious', value: 2, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
];

const MoodCard = ({ mood, isSelected, onClick }) => (
    <motion.button
        whileHover={{ y: -8, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex flex-col items-center gap-4 p-6 rounded-3xl transition-all ${isSelected
            ? `bg-gradient-to-br ${mood.color} shadow-2xl ring-4 ring-offset-2 ring-purple-500/50`
            : `${mood.bg} hover:shadow-xl border border-white/20 dark:border-gray-700/50`
            }`}
    >
        <div className={`text-6xl transition-transform ${isSelected ? 'scale-125' : ''}`}>
            {mood.emoji}
        </div>
        <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {mood.label}
        </span>
    </motion.button>
);

const MoodHistoryItem = ({ entry, index }) => {
    const mood = moods.find(m => m.value === entry.value) || moods[1];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-lg transition-all"
        >
            <div className={`text-4xl p-3 rounded-2xl bg-gradient-to-br ${mood.color} flex items-center justify-center`}>
                {mood.emoji}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-800 dark:text-white">{mood.label}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                {entry.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{entry.note}</p>
                )}
            </div>
        </motion.div>
    );
};

export default function MoodPage() {
    const navigate = useNavigate();
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [moodHistory, setMoodHistory] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [stats, setStats] = useState({ average: 0, trend: 0, total: 0 });

    useEffect(() => {
        fetchMoodHistory();
    }, []);

    const fetchMoodHistory = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.moods);
            const data = await response.json();
            setMoodHistory(data);
            calculateStats(data);
        } catch (error) {
            console.error('Failed to fetch mood history:', error);
            // Use mock data if backend fails
            const mockData = [
                { date: new Date().toISOString(), value: 4, note: 'Had a great day!' },
                { date: new Date(Date.now() - 86400000).toISOString(), value: 3, note: 'Average day' }
            ];
            setMoodHistory(mockData);
            calculateStats(mockData);
        }
    };

    const calculateStats = (history) => {
        if (history.length === 0) {
            setStats({ average: 0, trend: 0, total: 0 });
            return;
        }

        const total = history.length;
        const sum = history.reduce((acc, entry) => acc + entry.value, 0);
        const average = (sum / total).toFixed(1);

        // Calculate trend (comparing last 3 vs previous 3)
        const recent = history.slice(-3).reduce((acc, e) => acc + e.value, 0) / Math.min(3, history.length);
        const previous = history.slice(-6, -3).reduce((acc, e) => acc + e.value, 0) / Math.min(3, history.slice(-6, -3).length);
        const trend = previous ? ((recent - previous) / previous * 100).toFixed(0) : 0;

        setStats({ average, trend, total });
    };

    const handleSaveMood = async () => {
        if (!selectedMood) return;

        setIsSaving(true);
        try {
            const response = await fetch(API_ENDPOINTS.moods, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    value: selectedMood.value,
                    note: note
                })
            });

            if (response.ok) {
                const newEntry = await response.json();
                setMoodHistory(prev => [...prev, newEntry]);
                calculateStats([...moodHistory, newEntry]);
                setSelectedMood(null);
                setNote('');
            }
        } catch (error) {
            console.error('Failed to save mood:', error);
            // Save locally if backend fails
            const newEntry = {
                date: new Date().toISOString(),
                value: selectedMood.value,
                note: note
            };
            setMoodHistory(prev => [...prev, newEntry]);
            calculateStats([...moodHistory, newEntry]);
            setSelectedMood(null);
            setNote('');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3 flex items-center justify-center gap-3">
                        <Sparkles className="text-purple-600 dark:text-purple-400" size={40} />
                        Mood Tracker
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Track your emotional journey and find patterns</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Average Mood</span>
                            <Smile className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                            {stats.average}/5
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Trend</span>
                            {stats.trend >= 0 ? (
                                <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                            ) : (
                                <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
                            )}
                        </div>
                        <div className={`text-4xl font-bold ${stats.trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {stats.trend > 0 ? '+' : ''}{stats.trend}%
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total Entries</span>
                            <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                            {stats.total}
                        </div>
                    </motion.div>
                </div>

                {/* Log Mood Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl"
                >
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">How are you feeling today?</h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        {moods.map((mood) => (
                            <MoodCard
                                key={mood.label}
                                mood={mood}
                                isSelected={selectedMood?.label === mood.label}
                                onClick={() => setSelectedMood(mood)}
                            />
                        ))}
                    </div>

                    {selectedMood && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                        >
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="What's on your mind? (optional)"
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none resize-none transition-all"
                                rows="3"
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSaveMood}
                                disabled={isSaving}
                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Mood
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Mood History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-8 rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl"
                >
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Mood History</h2>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {moodHistory.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                                No mood entries yet. Start tracking your emotional journey!
                            </p>
                        ) : (
                            [...moodHistory].reverse().map((entry, index) => (
                                <MoodHistoryItem key={index} entry={entry} index={index} />
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
