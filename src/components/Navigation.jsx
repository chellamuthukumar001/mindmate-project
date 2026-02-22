import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, MessageCircle, Smile, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import SymptomChecker from './SymptomChecker';

const navItems = [
    { icon: Home, label: 'Home', path: '/app' },
    { icon: MessageCircle, label: 'Chat', path: '/app/chat' },
    { icon: Smile, label: 'Mood', path: '/app/mood' },
];

export default function Navigation() {
    const [symptomOpen, setSymptomOpen] = useState(false);

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:flex fixed top-0 left-0 right-0 h-20 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700 z-50 px-8 items-center justify-between shadow-sm transition-colors">
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <motion.div
                        whileHover={{ rotate: 10 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    >
                        M
                    </motion.div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:opacity-80 transition-opacity">MindMate</span>
                </Link>

                <div className="flex items-center gap-8">
                    {navItems.map(({ icon: Icon, label, path }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === '/app'}
                            className={({ isActive }) =>
                                `flex items-center gap-2 text-sm font-medium transition-all ${isActive
                                    ? 'text-primary bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* Symptom Checker Button */}
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSymptomOpen(true)}
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                    >
                        <Stethoscope size={17} strokeWidth={2.2} />
                        <span>Symptom Check</span>
                    </motion.button>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <span className="text-sm text-gray-400 font-medium hidden lg:block">Open Source</span>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-safe-area-bottom z-50 transition-colors">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map(({ icon: Icon, label, path }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === '/app'}
                            className={({ isActive }) =>
                                `relative flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill-mobile"
                                            className="absolute -top-0 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[10px] font-medium mt-1">{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* Mobile Symptom Checker button */}
                    <button
                        onClick={() => setSymptomOpen(true)}
                        className="relative flex flex-col items-center justify-center w-16 h-full text-purple-500 dark:text-purple-400"
                    >
                        <Stethoscope size={24} strokeWidth={2} />
                        <span className="text-[10px] font-medium mt-1">Symptom</span>
                    </button>

                    <div className="flex flex-col items-center justify-center w-16 h-full text-gray-400">
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Symptom Checker Sliding Panel */}
            <SymptomChecker isOpen={symptomOpen} onClose={() => setSymptomOpen(false)} />
        </>
    );
}
