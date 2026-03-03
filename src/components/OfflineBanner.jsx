import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWA';

export default function OfflineBanner() {
    const isOnline = useOnlineStatus();
    const [wasOffline, setWasOffline] = React.useState(false);
    const [showReconnected, setShowReconnected] = React.useState(false);

    React.useEffect(() => {
        if (!isOnline) {
            setWasOffline(true);
        } else if (wasOffline && isOnline) {
            setShowReconnected(true);
            const t = setTimeout(() => setShowReconnected(false), 3000);
            return () => clearTimeout(t);
        }
    }, [isOnline, wasOffline]);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    key="offline"
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[180] flex justify-center px-4 pt-3 pointer-events-none"
                >
                    <div
                        className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl shadow-xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30,10,10,0.97), rgba(127,29,29,0.9))',
                            border: '1px solid rgba(239,68,68,0.3)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <WifiOff size={15} className="text-red-400" />
                        <span className="text-red-200 text-xs font-semibold">You're offline – Some features may be limited</span>
                    </div>
                </motion.div>
            )}
            {showReconnected && (
                <motion.div
                    key="reconnected"
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[180] flex justify-center px-4 pt-3 pointer-events-none"
                >
                    <div
                        className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl shadow-xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(5,46,22,0.97), rgba(6,78,59,0.9))',
                            border: '1px solid rgba(52,211,153,0.3)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <Wifi size={15} className="text-emerald-400" />
                        <span className="text-emerald-200 text-xs font-semibold">Back online! 🎉</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
