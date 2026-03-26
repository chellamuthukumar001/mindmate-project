import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, Smile, Sparkles, Save, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';

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
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
    const { user, loginWithGoogle } = useAuth();
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [moodHistory, setMoodHistory] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [stats, setStats] = useState({ average: 0, trend: 0, total: 0 });

    useEffect(() => {
        if (user) {
            fetchMoodHistory();
        } else {
            const localData = JSON.parse(localStorage.getItem('guest_moods') || '[]');
            setMoodHistory(localData);
            calculateStats(localData);
        }
    }, [user]);

    const fetchMoodHistory = async () => {
        try {
            const q = query(
                collection(db, 'mood_logs'),
                where('userId', '==', user.uid),
                orderBy('date', 'asc') // Fetch in chronological order to calculate stats easily
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMoodHistory(data);
            calculateStats(data);
        } catch (error) {
            console.error('Failed to fetch mood history from Firebase:', error);
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

        const recent = history.slice(-3).reduce((acc, e) => acc + e.value, 0) / Math.min(3, history.length);
        const previous = history.slice(-6, -3).reduce((acc, e) => acc + e.value, 0) / Math.min(3, history.slice(-6, -3).length);
        const trend = previous ? ((recent - previous) / previous * 100).toFixed(0) : 0;

        setStats({ average, trend, total });
    };

    const handleSaveMood = async () => {
        if (!selectedMood) return;

        setIsSaving(true);
        const newEntryData = {
            value: selectedMood.value,
            note: note,
            date: new Date().toISOString(),
        };

        try {
            if (user) {
                const docRef = await addDoc(collection(db, 'mood_logs'), {
                    userId: user.uid,
                    ...newEntryData,
                    createdAt: serverTimestamp()
                });
                const savedEntry = { id: docRef.id, ...newEntryData };
                const newHistory = [...moodHistory, savedEntry];
                setMoodHistory(newHistory);
                calculateStats(newHistory);
            } else {
                const newHistory = [...moodHistory, { id: Date.now().toString(), ...newEntryData }];
                localStorage.setItem('guest_moods', JSON.stringify(newHistory));
                setMoodHistory(newHistory);
                calculateStats(newHistory);
            }
            setSelectedMood(null);
            setNote('');
        } catch (error) {
            console.error('Failed to save mood:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8 pb-32">
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

                {/* Logged Out Warning */}
                {!user && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
                            <LogIn size={24} />
                            <p className="text-sm">You are tracking moods locally. Log in to sync across devices securely.</p>
                        </div>
                        <button onClick={loginWithGoogle} className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-yellow-600 transition-colors">
                            Sign In
                        </button>
                    </motion.div>
                )}

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
                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none resize-none transition-all"
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

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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
