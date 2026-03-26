import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, MessageCircle, Smile, Stethoscope, Bell, BellDot, Download, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import SymptomChecker from './SymptomChecker';
import { usePushNotifications, usePWAInstall } from '../hooks/usePWA';

const navItems = [
    { icon: Home, label: 'Home', path: '/app' },
    { icon: MessageCircle, label: 'Chat', path: '/app/chat' },
    { icon: HeartPulse, label: 'Services', path: '/app/services' },
    { icon: Smile, label: 'Mood', path: '/app/mood' },
];

export default function Navigation() {
    const [symptomOpen, setSymptomOpen] = useState(false);
    const [notifTooltip, setNotifTooltip] = useState(false);
    const { permission, isSupported, requestPermission, sendLocalNotification } = usePushNotifications();
    const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

    const handleNotifClick = async () => {
        if (!isSupported) return;
        if (permission === 'granted') {
            // Send a test reminder notification
            await sendLocalNotification('MindMate Reminder ✨', {
                body: 'Just checking in – how are you feeling right now?',
                tag: 'manual-reminder',
                data: { url: '/app/mood' },
            });
            setNotifTooltip(true);
            setTimeout(() => setNotifTooltip(false), 2000);
        } else {
            await requestPermission();
        }
    };

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:flex fixed top-0 left-0 right-0 h-20 bg-white/60 dark:bg-surface/80 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 z-50 px-8 items-center justify-between shadow-sm transition-all duration-300">
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <motion.img
                        src="/logo.png"
                        alt="MindMate Logo"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="w-10 h-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] object-contain"
                    />
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

                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    {isSupported && (
                        <div className="relative">
                            <motion.button
                                id="notif-bell"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleNotifClick}
                                title={permission === 'granted' ? 'Send test reminder' : 'Enable notifications'}
                                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                            >
                                {permission === 'granted' ? (
                                    <BellDot size={20} className="text-purple-600 dark:text-purple-400" />
                                ) : (
                                    <Bell size={20} />
                                )}
                                {permission === 'default' && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-gray-900" />
                                )}
                            </motion.button>
                            {/* Tooltip */}
                            <AnimatePresence>
                                {notifTooltip && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute top-12 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
                                    >
                                        Reminder sent! ✨
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Install button (desktop) */}
                    {isInstallable && !isInstalled && (
                        <motion.button
                            id="desktop-install-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={promptInstall}
                            title="Install MindMate app"
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                        >
                            <Download size={14} />
                            Install
                        </motion.button>
                    )}

                    <ThemeToggle />
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-surface/90 backdrop-blur-2xl border-t border-white/20 dark:border-white/5 pb-safe-area-bottom z-50 transition-all duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-none">
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

                    {/* Mobile Notification Bell */}
                    {isSupported && (
                        <button
                            id="mobile-notif-bell"
                            onClick={handleNotifClick}
                            className="relative flex flex-col items-center justify-center w-16 h-full text-gray-400 dark:text-gray-500"
                        >
                            {permission === 'granted' ? (
                                <BellDot size={24} strokeWidth={2} className="text-purple-500 dark:text-purple-400" />
                            ) : (
                                <Bell size={24} strokeWidth={2} />
                            )}
                            {permission === 'default' && (
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-500 rounded-full" />
                            )}
                            <span className="text-[10px] font-medium mt-1">
                                {permission === 'granted' ? 'Remind' : 'Alerts'}
                            </span>
                        </button>
                    )}

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
