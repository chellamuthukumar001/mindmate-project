import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, Check, Sparkles } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePWA';

const NOTIF_ASKED_KEY = 'mindmate_notif_asked';

export default function NotificationPrompt() {
    const { permission, isSupported, requestPermission, sendLocalNotification } = usePushNotifications();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [justGranted, setJustGranted] = useState(false);

    useEffect(() => {
        // Show prompt after 8s if not yet asked and notifications not granted/denied
        if (!isSupported) return;
        const wasAsked = localStorage.getItem(NOTIF_ASKED_KEY);
        if (wasAsked || permission !== 'default') return;

        const timer = setTimeout(() => setVisible(true), 8000);
        return () => clearTimeout(timer);
    }, [isSupported, permission]);

    const handleAllow = async () => {
        setLoading(true);
        localStorage.setItem(NOTIF_ASKED_KEY, '1');
        const result = await requestPermission();
        setLoading(false);

        if (result === 'granted') {
            setJustGranted(true);
            // Send welcome notification
            setTimeout(async () => {
                await sendLocalNotification('Welcome to MindMate! 🧠', {
                    body: 'You\'ll now receive gentle wellness reminders throughout your day.',
                    tag: 'welcome',
                    data: { url: '/app' },
                });
                setVisible(false);
            }, 1500);
        } else {
            setVisible(false);
        }
    };

    const handleDeny = () => {
        localStorage.setItem(NOTIF_ASKED_KEY, '1');
        setVisible(false);
    };

    if (!isSupported || !visible) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed top-4 left-4 right-4 md:left-auto md:right-6 md:top-24 md:w-96 z-[150]"
                >
                    <div
                        className="rounded-2xl p-5 shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(26,5,51,0.97) 0%, rgba(15,23,42,0.97) 100%)',
                            border: '1px solid rgba(139,92,246,0.4)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 25px 60px rgba(124,58,237,0.25)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' }}
                                >
                                    {justGranted ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', damping: 15 }}
                                        >
                                            <Check size={20} className="text-white" />
                                        </motion.div>
                                    ) : (
                                        <Bell size={20} className="text-white" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">
                                        {justGranted ? 'Notifications Enabled!' : 'Stay on Track'}
                                    </p>
                                    <p className="text-purple-300 text-xs mt-0.5">
                                        {justGranted ? 'We\'ll send gentle reminders 💜' : 'Enable wellness reminders'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleDeny}
                                className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/10 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {!justGranted && (
                            <>
                                {/* Description */}
                                <p className="text-white/60 text-xs leading-relaxed mb-4">
                                    Get gentle reminders for mood check-ins, breathing exercises, and daily wellness suggestions from your AI companion.
                                </p>

                                {/* Preview of notification types */}
                                <div className="space-y-2 mb-4">
                                    {[
                                        { emoji: '😊', text: 'Daily mood check-in reminder' },
                                        { emoji: '🌬️', text: 'Breathing exercise prompts' },
                                        { emoji: '✨', text: 'Personalised wellness tips' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                                            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                                            <span className="text-sm">{item.emoji}</span>
                                            <span className="text-white/60 text-xs">{item.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDeny}
                                        className="flex-1 py-2.5 rounded-xl text-white/40 font-medium text-sm transition-colors hover:bg-white/5"
                                        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <BellOff size={13} className="inline mr-1.5" />
                                        No thanks
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleAllow}
                                        disabled={loading}
                                        className="flex-[1.5] py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-1.5"
                                        style={{
                                            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                                            boxShadow: '0 8px 20px rgba(124,58,237,0.35)',
                                        }}
                                    >
                                        {loading ? (
                                            <span className="animate-spin rounded-full border border-white/30 border-t-white w-3.5 h-3.5" />
                                        ) : (
                                            <Sparkles size={13} />
                                        )}
                                        {loading ? 'Enabling...' : 'Enable'}
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
