import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Zap, Bell, Wifi } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWA';

const DISMISSED_KEY = 'mindmate_install_dismissed';

export default function InstallBanner() {
    const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
    const [dismissed, setDismissed] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [showFull, setShowFull] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const wasDismissed = sessionStorage.getItem(DISMISSED_KEY);
        setDismissed(!!wasDismissed);
        setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
        // Show full modal after 5s for mobile
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            const timer = setTimeout(() => setShowFull(true), 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        sessionStorage.setItem(DISMISSED_KEY, '1');
        setDismissed(true);
        setShowFull(false);
    };

    const handleInstall = async () => {
        setInstalling(true);
        const accepted = await promptInstall();
        if (!accepted) setInstalling(false);
    };

    // Don't show if already installed, dismissed, or not installable
    if (isInstalled || dismissed || !isInstallable) return null;

    const features = [
        { icon: Zap, text: 'Instant access from home screen' },
        { icon: Bell, text: 'Wellness reminders & notifications' },
        { icon: Wifi, text: 'Works offline too' },
    ];

    return (
        <>
            {/* Full Screen Mobile Modal */}
            <AnimatePresence>
                {showFull && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-end justify-center"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="w-full max-w-md mx-auto rounded-t-3xl overflow-hidden"
                            style={{ background: 'linear-gradient(160deg, #1a0533 0%, #0f172a 100%)' }}
                        >
                            {/* Handle */}
                            <div className="flex justify-center pt-4 pb-2">
                                <div className="w-12 h-1.5 rounded-full bg-white/20" />
                            </div>

                            {/* Icon */}
                            <div className="px-6 pt-4 pb-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-2xl shadow-purple-500/50"
                                        style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' }}>
                                        M
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Install MindMate</h2>
                                        <p className="text-sm text-purple-300">Add to your home screen</p>
                                    </div>
                                    <button
                                        onClick={handleDismiss}
                                        className="ml-auto p-2 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Features */}
                                <div className="space-y-3 mb-6">
                                    {features.map(({ icon: Icon, text }, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i + 0.2 }}
                                            className="flex items-center gap-3 p-3 rounded-2xl"
                                            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                                        >
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' }}>
                                                <Icon size={16} className="text-white" />
                                            </div>
                                            <span className="text-white/80 text-sm font-medium">{text}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDismiss}
                                        className="flex-1 py-3.5 rounded-2xl text-white/50 font-semibold text-sm"
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    >
                                        Not now
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleInstall}
                                        disabled={installing}
                                        className="flex-[2] py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-2xl"
                                        style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', boxShadow: '0 10px 30px rgba(124,58,237,0.4)' }}
                                    >
                                        {installing ? (
                                            <span className="animate-spin rounded-full border-2 border-white/30 border-t-white w-4 h-4" />
                                        ) : (
                                            <Download size={16} />
                                        )}
                                        {installing ? 'Installing...' : 'Install App'}
                                    </motion.button>
                                </div>

                                {/* Safe area padding */}
                                <div className="h-safe-area-bottom" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop / Compact Bottom Toast Banner */}
            <AnimatePresence>
                {!showFull && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 2 }}
                        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[100]"
                    >
                        <div
                            className="rounded-2xl p-4 flex items-center gap-4 shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(26,5,51,0.95) 0%, rgba(15,23,42,0.95) 100%)',
                                border: '1px solid rgba(139,92,246,0.3)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            {/* Icon */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' }}
                            >
                                M
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">
                                    {isMobile ? <><Smartphone size={13} className="inline mr-1" />Add to Home Screen</> : <><Monitor size={13} className="inline mr-1" />Install MindMate</>}
                                </p>
                                <p className="text-white/50 text-xs mt-0.5">Get the full app experience</p>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2 shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleInstall}
                                    disabled={installing}
                                    className="px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1"
                                    style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }}
                                >
                                    {installing ? (
                                        <span className="animate-spin rounded-full border border-white/30 border-t-white w-3 h-3" />
                                    ) : (
                                        <Download size={12} />
                                    )}
                                    Install
                                </motion.button>
                                <button
                                    onClick={handleDismiss}
                                    className="p-1.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
