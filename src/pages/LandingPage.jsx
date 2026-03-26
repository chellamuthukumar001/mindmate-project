import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Shield, Heart, Zap, MessageCircle, Star, Brain,
    Activity, Sparkles, Wind, CheckCircle, Download, Bell, LogOut
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { usePWAInstall } from '../hooks/usePWA';
import { useAuth } from '../context/AuthContext';

/* ─── Animated Counter ─────────────────────────────────────── */
const LoadingSplash = ({ onComplete }) => (
    <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[100] bg-[#0c0118] flex flex-col items-center justify-center p-6"
    >
        <motion.img
            src="/logo.png"
            alt="MindMate Logo"
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-24 h-24 mb-8 drop-shadow-[0_0_50px_rgba(124,58,237,0.5)]"
        />
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
        >
            <h1 className="text-3xl font-bold text-white mb-2">MindMate</h1>
            <div className="flex gap-1 justify-center">
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                    />
                ))}
            </div>
        </motion.div>
    </motion.div>
);

const AnimatedCounter = ({ end, suffix = '', duration = 2 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, end, duration]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Feature Card ─────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, gradient, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
        className="group relative p-7 rounded-3xl border border-white/10 overflow-hidden cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
    >
        {/* Hover glow */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} style={{ mixBlendMode: 'overlay' }} />
        <div className="relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-white/10 ${gradient}`}>
                <Icon size={26} className="text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

/* ─── Testimonial ───────────────────────────────────────────── */
const TestimonialCard = ({ quote, name, role, rating, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="p-7 rounded-3xl border border-white/10 flex flex-col gap-5"
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
    >
        <div className="flex gap-1">
            {[...Array(rating)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
            ))}
        </div>
        <p className="text-gray-300 text-sm leading-relaxed flex-1">"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {name[0]}
            </div>
            <div>
                <p className="font-semibold text-white text-sm">{name}</p>
                <p className="text-xs text-gray-500">{role}</p>
            </div>
        </div>
    </motion.div>
);

/* ─── Main Landing Page ─────────────────────────────────────── */
const LandingPage = () => {
    const navigate = useNavigate();
    const { user, loginWithGoogle, logout } = useAuth();
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroY = useTransform(scrollY, [0, 400], [0, -60]);
    const { isInstallable, promptInstall } = usePWAInstall();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const features = [
        { icon: MessageCircle, title: 'AI Emotional Support', desc: 'Chat with an empathetic AI that understands your feelings and offers genuine support 24/7.', gradient: 'bg-gradient-to-br from-purple-600/30 to-purple-800/10', delay: 0 },
        { icon: Activity, title: 'Mood Tracking', desc: 'Track your emotional patterns and gain deep insights into your mental health trends.', gradient: 'bg-gradient-to-br from-blue-600/30 to-blue-800/10', delay: 0.08 },
        { icon: Brain, title: 'Focus Mode', desc: 'Pomodoro-based deep work sessions with calming ambience to stay productive.', gradient: 'bg-gradient-to-br from-indigo-600/30 to-indigo-800/10', delay: 0.16 },
        { icon: Wind, title: 'Breathing Exercises', desc: 'Science-backed breathing sessions to calm your nervous system in just 3 minutes.', gradient: 'bg-gradient-to-br from-teal-600/30 to-teal-800/10', delay: 0.24 },
        { icon: Shield, title: 'Private & Secure', desc: 'Your conversations are confidential. We never share your data with third parties.', gradient: 'bg-gradient-to-br from-green-600/30 to-green-800/10', delay: 0.32 },
        { icon: Zap, title: 'Symptom Checker', desc: 'AI-powered mental health symptom checker with professional resource recommendations.', gradient: 'bg-gradient-to-br from-orange-600/30 to-orange-800/10', delay: 0.4 },
    ];

    const stats = [
        { end: 10000, suffix: '+', label: 'Users Supported', gradient: 'from-purple-400 to-blue-400' },
        { end: 50000, suffix: '+', label: 'Sessions Completed', gradient: 'from-blue-400 to-teal-400' },
        { end: 87, suffix: '%', label: 'Feel Better', gradient: 'from-teal-400 to-purple-400' },
    ];

    const testimonials = [
        { quote: 'MindMate has become my daily sanctuary. The AI really understands me and helps me process complex emotions.', name: 'Sarah M.', role: 'Software Engineer', rating: 5, delay: 0 },
        { quote: 'I was skeptical but this app genuinely helped me through anxiety. The breathing exercises are a game changer.', name: 'James T.', role: 'Creative Director', rating: 5, delay: 0.1 },
        { quote: 'The mood tracking showed me patterns I never noticed. I feel more in control of my mental health now.', name: 'Emily R.', role: 'University Student', rating: 5, delay: 0.2 },
    ];

    return (
        <div className="min-h-screen text-white overflow-x-hidden" style={{ background: 'linear-gradient(160deg, #0c0118 0%, #0f172a 40%, #0c0118 100%)' }}>
            <AnimatePresence>
                {showSplash && <LoadingSplash />}
            </AnimatePresence>

            {/* ── Ambient Background Orbs ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)', filter: 'blur(80px)' }} />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)', filter: 'blur(80px)' }} />
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
                    className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #0D9488 0%, transparent 70%)', filter: 'blur(100px)' }} />
            </div>

            {/* ── Navbar ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
                style={{ background: 'rgba(12,1,24,0.7)', backdropFilter: 'blur(30px)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2.5 cursor-pointer group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                        />
                        <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #c4b5fd, #818cf8)' }}>
                            MindMate
                        </span>
                    </motion.div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'How It Works', 'Testimonials'].map((item) => (
                            <button key={item}
                                onClick={() => document.getElementById(item.toLowerCase().replace(/ /g, '-'))?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:block"><ThemeToggle /></div>
                        {isInstallable && (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={promptInstall}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all">
                                <Download size={13} />Install
                            </motion.button>
                        )}

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-xs font-bold text-white">{user.displayName}</span>
                                    <button onClick={logout} className="text-[10px] text-gray-500 hover:text-red-400 flex items-center gap-1">
                                        <LogOut size={10} /> Logout
                                    </button>
                                </div>
                                <img src={user.photoURL} alt="Profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-purple-500/50" />
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/app')}
                                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-full font-bold text-sm shadow-lg transition-all"
                                    style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', boxShadow: '0 8px 25px rgba(124,58,237,0.35)' }}>
                                    Open App
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={loginWithGoogle}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-full font-bold text-sm shadow-lg transition-all border border-white/20 bg-white/5 backdrop-blur-md"
                            >
                                Sign In
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="relative min-h-screen flex items-center pt-16 sm:pt-20 overflow-hidden text-center">
                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                    <motion.div style={{ opacity: heroOpacity, y: heroY }}>
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-purple-500/30"
                            style={{ background: 'rgba(124,58,237,0.1)', backdropFilter: 'blur(10px)' }}
                        >
                            <Sparkles size={14} className="text-purple-400" />
                            <span className="text-purple-300">AI-Powered Mental Wellness App</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)' }}>FREE</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-5 sm:mb-6"
                        >
                            Your AI Companion<br />
                            for{' '}
                            <motion.span
                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                className="text-transparent bg-clip-text inline-block"
                                style={{ backgroundImage: 'linear-gradient(270deg, #c4b5fd 0%, #818cf8 30%, #67e8f9 70%, #c4b5fd 100%)', backgroundSize: '200% auto' }}
                            >
                                Better Mental
                            </motion.span>
                            <br className="sm:hidden" /> Wellness
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10"
                        >
                            Find peace, clarity, and emotional support through AI conversations, mood tracking, breathing exercises, and personalized wellness guidance.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/app')}
                                className="w-full sm:w-auto px-8 py-4 sm:py-4.5 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 group relative overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', boxShadow: '0 20px 50px rgba(124,58,237,0.4)' }}
                            >
                                <span>Start Your Journey</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/app/chat')}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 border border-white/15 transition-all"
                                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                <MessageCircle size={20} className="text-purple-400" />
                                <span>Chat with AI</span>
                            </motion.button>
                        </motion.div>

                        {!user && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                                className="mt-6 flex justify-center"
                            >
                                <button
                                    onClick={loginWithGoogle}
                                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-gray-900 font-bold shadow-xl hover:scale-105 transition-all"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                    Continue with Google
                                </button>
                            </motion.div>
                        )}

                        {/* Trust indicators */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
                            className="flex flex-wrap items-center gap-4 sm:gap-6 mt-12 justify-center text-gray-500 text-xs sm:text-sm"
                        >
                            {[
                                { icon: Shield, text: '100% Private' },
                                { icon: CheckCircle, text: 'No signup needed' },
                                { icon: Heart, text: 'Always free' },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-1.5">
                                    <Icon size={14} className="text-purple-400" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2.5 } }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <div className="w-px h-10 bg-gradient-to-b from-purple-400/60 to-transparent" />
                    <div className="text-gray-500 text-xs tracking-widest uppercase">Scroll</div>
                </motion.div>
            </section>

            {/* ── Stats Strip ── */}
            <section className="relative py-12 sm:py-16 border-y border-white/5" style={{ background: 'rgba(124,58,237,0.05)' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
                        {stats.map(({ end, suffix, label, gradient }, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-1"
                            >
                                <div className={`text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                                    <AnimatedCounter end={end} suffix={suffix} />
                                </div>
                                <p className="text-gray-500 text-xs sm:text-sm">{label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="relative py-20 sm:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4 border border-purple-500/20 text-purple-400"
                            style={{ background: 'rgba(124,58,237,0.1)' }}>
                            <Zap size={12} />Everything You Need
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                            Everything you need<br className="hidden sm:block" /> to thrive
                        </h2>
                        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                            Powerful tools designed to support your mental wellness journey — available anytime, anywhere.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {features.map((f) => <FeatureCard key={f.title} {...f} />)}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" className="relative py-20 sm:py-32" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4 border border-blue-500/20 text-blue-400"
                            style={{ background: 'rgba(37,99,235,0.1)' }}>
                            <Activity size={12} />Simple Steps
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Start in seconds</h2>
                        <p className="text-gray-400 text-base sm:text-lg">No sign-up required. Just open the app and begin.</p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-4 relative">
                        {/* Connector line (desktop) */}
                        <div className="hidden sm:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-teal-500/30" />

                        {[
                            { num: '1', title: 'Share Your Feelings', desc: 'Open MindMate in your browser or install it as an app. No login needed.', color: 'from-purple-500 to-purple-600' },
                            { num: '2', title: 'Get AI Insights', desc: 'Receive personalized guidance, coping strategies, and mood analysis.', color: 'from-blue-500 to-blue-600' },
                            { num: '3', title: 'Grow Every Day', desc: 'Track your progress and develop healthier mental habits over time.', color: 'from-teal-500 to-teal-600' },
                        ].map(({ num, title, desc, color }, i) => (
                            <motion.div key={num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="flex-1 flex flex-col items-center text-center relative z-10 sm:px-4"
                            >
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-2xl font-bold mb-5 shadow-2xl`}
                                    style={{ boxShadow: '0 15px 40px rgba(124,58,237,0.35)' }}>
                                    {num}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── App Preview Showcases ── */}
            <section className="relative py-20 sm:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Feature highlights */}
                        <div className="flex-1 space-y-5">
                            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4 border border-teal-500/20 text-teal-400"
                                    style={{ background: 'rgba(13,148,136,0.1)' }}>
                                    <Sparkles size={12} />Works on Any Device
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Install as an app<br />on any device</h2>
                                <p className="text-gray-400 text-base leading-relaxed">MindMate works as a Progressive Web App — install it from your browser on Android, iOS, Windows, or Mac. No app store needed.</p>
                            </motion.div>

                            {[
                                { icon: Download, title: 'Add to Home Screen', desc: 'Install directly from Chrome or Safari — works like a native app.' },
                                { icon: Bell, title: 'Wellness Notifications', desc: 'Get gentle daily reminders for mood check-ins and breathing exercises.' },
                                { icon: Heart, title: 'Offline Support', desc: 'Core features work even without an internet connection.' },
                                { icon: Zap, title: 'Fast & Lightweight', desc: 'Instant loading and smooth animations on any device.' },
                            ].map(({ icon: Icon, title, desc }, i) => (
                                <motion.div key={title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.03)' }}
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(109,40,217,0.2))', border: '1px solid rgba(124,58,237,0.3)' }}>
                                        <Icon size={18} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm mb-0.5">{title}</p>
                                        <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Floating elements instead of second phone */}
                        <div className="flex-shrink-0 lg:flex-1 flex justify-center relative">
                            <motion.div
                                animate={{ y: [-10, 10, -10], rotate: [0, 2, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative z-20 w-64 p-6 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md"
                                style={{ background: 'rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(13,148,136,0.2)' }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white" style={{ boxShadow: '0 10px 20px rgba(13,148,136,0.3)' }}>
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">MindMate App</div>
                                        <div className="text-teal-300/70 text-xs">PWA Ready</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-teal-500/50" />
                                            <div className="flex-1 h-2 rounded-full bg-white/10" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <div className="px-6 py-2 rounded-full text-xs font-bold text-white border border-teal-500/30" style={{ background: 'linear-gradient(135deg,rgba(13,148,136,0.2),transparent)' }}>
                                        Instant Loading
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [10, -10, 10], rotate: [0, -2, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                className="absolute -bottom-8 -right-4 z-30 w-48 p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md"
                                style={{ background: 'rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(124,58,237,0.2)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <img src="/logo.png" alt="M" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                                    <div>
                                        <div className="text-white text-xs font-bold">Wellness Alert</div>
                                        <div className="text-purple-300 text-[10px]">Time to breathe</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full opacity-20 filter blur-[80px] pointer-events-none" style={{ background: 'radial-gradient(circle, #0D9488 0%, transparent 70%)' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section id="testimonials" className="relative py-20 sm:py-32" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Loved by thousands</h2>
                        <p className="text-gray-400 text-base sm:text-lg">See what our community has to say</p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="relative py-20 sm:py-32 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0"
                        style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%)' }}
                    />
                </div>
                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6 sm:space-y-8">
                        <div className="text-5xl sm:text-6xl">🧠</div>
                        <h2 className="text-3xl sm:text-5xl font-bold">Your wellness journey<br />starts today</h2>
                        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                            Join thousands taking control of their mental health. Free, private, and always here for you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/app')}
                                className="px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 group"
                                style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', boxShadow: '0 25px 60px rgba(124,58,237,0.45)' }}
                            >
                                Get Started for Free
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            {isInstallable && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                                    onClick={promptInstall}
                                    className="px-10 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 border border-white/15 transition-all"
                                    style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
                                >
                                    <Download size={18} />
                                    Install App
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="relative py-10 border-t border-white/5" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.png" alt="M" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                            <span className="font-bold text-white">MindMate</span>
                            <span className="text-gray-600 text-xs">· Final Year Project 2025</span>
                        </div>
                        <div className="flex gap-6 text-gray-500 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Support</a>
                        </div>
                    </div>
                    <div className="text-center mt-6 text-gray-600 text-xs">
                        © 2025 MindMate. Crafted with 💜 for better mental wellness.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
