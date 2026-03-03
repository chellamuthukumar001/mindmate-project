import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

export default function UpdateBanner() {
    const [needsUpdate, setNeedsUpdate] = useState(false);
    const [reg, setReg] = useState(null);

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        navigator.serviceWorker.ready.then((registration) => {
            setReg(registration);

            // Check for waiting worker (update available)
            if (registration.waiting) {
                setNeedsUpdate(true);
            }

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        setNeedsUpdate(true);
                    }
                });
            });
        });

        // Reload page after SW takes control
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    }, []);

    const handleUpdate = () => {
        if (!reg?.waiting) {
            window.location.reload();
            return;
        }
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    };

    return (
        <AnimatePresence>
            {needsUpdate && (
                <motion.div
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed top-0 left-0 right-0 z-[200] flex justify-center px-4 pt-3"
                >
                    <div
                        className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl max-w-md w-full"
                        style={{
                            background: 'linear-gradient(135deg, #065f46, #064e3b)',
                            border: '1px solid rgba(52, 211, 153, 0.3)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <RefreshCw size={15} className="text-emerald-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-emerald-100 text-sm font-semibold">Update Available</p>
                            <p className="text-emerald-300/70 text-xs">Tap to reload and get the latest MindMate.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleUpdate}
                                className="px-3 py-1.5 rounded-xl text-emerald-900 font-bold text-xs bg-emerald-400 hover:bg-emerald-300 transition-colors"
                            >
                                Reload
                            </motion.button>
                            <button
                                onClick={() => setNeedsUpdate(false)}
                                className="p-1 rounded-lg text-emerald-400/50 hover:text-emerald-400 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
