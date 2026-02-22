import React from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BreathingPage() {
    const navigate = useNavigate();
    const [phase, setPhase] = React.useState('inhale');
    const [isActive, setIsActive] = React.useState(false);
    const [text, setText] = React.useState('Ready to begin?');

    React.useEffect(() => {
        let interval;
        if (isActive) {
            const cycle = async () => {
                setPhase('inhale');
                setText('Breathe In...');
                await new Promise(r => setTimeout(r, 4000));

                if (!isActive) return;
                setPhase('hold');
                setText('Hold');
                await new Promise(r => setTimeout(r, 4000));

                if (!isActive) return;
                setPhase('exhale');
                setText('Breathe Out...');
                await new Promise(r => setTimeout(r, 4000));
            };

            cycle();
            interval = setInterval(cycle, 12000);
        } else {
            setPhase('idle');
            setText('Ready to begin?');
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const variants = {
        idle: { scale: 1, opacity: 0.6 },
        inhale: { scale: 1.8, opacity: 1 },
        hold: { scale: 1.8, opacity: 1 },
        exhale: { scale: 1, opacity: 0.6 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-teal-900/20 dark:to-purple-900/20 flex flex-col items-center justify-center relative p-6">
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
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">Box Breathing</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Find your calm through mindful breathing</p>
            </motion.div>

            <div className="relative flex items-center justify-center mb-20">
                {/* Outer Glow */}
                <motion.div
                    animate={phase}
                    variants={variants}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-80 h-80 rounded-full bg-gradient-to-br from-teal-400/30 to-blue-500/30 absolute blur-3xl"
                />

                {/* Main Circle */}
                <motion.div
                    animate={phase}
                    variants={variants}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="w-64 h-64 rounded-full bg-gradient-to-br from-teal-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-teal-500/50 z-10 relative"
                >
                    <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
                    <span className="text-3xl font-bold text-white tracking-widest z-10">{text}</span>
                </motion.div>
            </div>

            <div className="flex gap-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsActive(!isActive)}
                    className="px-10 py-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/30 flex items-center gap-3 transition-all"
                >
                    {isActive ? (
                        <>
                            <Pause size={22} fill="currentColor" />
                            Pause
                        </>
                    ) : (
                        <>
                            <Play size={22} fill="currentColor" className="ml-1" />
                            Start
                        </>
                    )}
                </motion.button>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-gray-500 dark:text-gray-400 text-sm max-w-md text-center leading-relaxed bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-gray-700/50"
            >
                <strong className="text-gray-700 dark:text-gray-300">Box Breathing Technique:</strong><br />
                Inhale for 4 seconds → Hold for 4 seconds → Exhale for 4 seconds<br />
                Repeat to reduce stress and increase focus.
            </motion.p>
        </div>
    );
}
