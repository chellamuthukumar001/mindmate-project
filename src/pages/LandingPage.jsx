import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Heart, Zap, MessageCircle, Star, Users, Brain, Activity, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

// Optimized mental wellness video backgrounds
const backgrounds = [
    { type: 'video', src: 'https://cdn.pixabay.com/video/2022/11/02/137346-769037755_large.mp4', poster: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400' },
    { type: 'video', src: 'https://cdn.pixabay.com/video/2020/05/25/40139-424930030_large.mp4', poster: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=400' },
    { type: 'video', src: 'https://cdn.pixabay.com/video/2021/08/04/83835-584693462_large.mp4', poster: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=400' },
];

// Animated Counter Component
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
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Hero Video Background with Fallback
const VideoBackground = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLowPower, setIsLowPower] = useState(false);

    useEffect(() => {
        // Detect low-power mode or mobile
        if (window.matchMedia('(max-width: 768px)').matches ||
            navigator.connection?.saveData) {
            setIsLowPower(true);
        }
    }, []);

    useEffect(() => {
        if (isLowPower) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
        }, 15000);
        return () => clearInterval(interval);
    }, [isLowPower]);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {isLowPower ? (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgrounds[0].poster})` }}
                />
            ) : (
                backgrounds.map((bg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: currentIndex === i ? 1 : 0 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0"
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster={bg.poster}
                            className="w-full h-full object-cover scale-105"
                            preload="metadata"
                        >
                            <source src={bg.src} type="video/mp4" />
                        </video>
                    </motion.div>
                ))
            )}
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-purple-900/60 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>
    );
};

// Glassmorphism Feature Card
const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className="group p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                <Icon size={32} className="text-purple-300" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-base">{desc}</p>
        </div>
    </motion.div>
);

// How It Works Step
const Step = ({ number, title, desc, delay, isLast }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="flex flex-col items-center text-center relative z-10"
    >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold mb-6 shadow-2xl shadow-purple-500/30">
            {number}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 max-w-sm">{desc}</p>

        {!isLast && (
            <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent" />
        )}
    </motion.div>
);

// Testimonial Card
const TestimonialCard = ({ quote, name, role, rating, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="p-8 rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 hover:bg-white/[0.08] transition-all"
    >
        <div className="flex mb-4">
            {[...Array(rating)].map((_, i) => (
                <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
            ))}
        </div>
        <p className="text-gray-300 italic mb-6 leading-relaxed">"{quote}"</p>
        <div>
            <p className="font-bold text-white">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
        </div>
    </motion.div>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

    return (
        <div className="min-h-screen text-white overflow-x-hidden font-sans relative scroll-smooth">
            {/* Sticky Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/30">M</div>
                        <span className="text-xl font-bold">MindMate</span>
                    </motion.div>

                    <div className="flex gap-4 items-center">
                        <ThemeToggle />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/app')}
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
                        >
                            Open App
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Video Background */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <VideoBackground />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
                    <motion.div
                        style={{ opacity, scale }}
                        className="space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium mb-8"
                        >
                            <Sparkles size={16} className="text-purple-300" />
                            <span>AI-Powered Mental Wellness</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight mb-6"
                        >
                            Your AI Companion for<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400">
                                Better Mental Wellness
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        >
                            Find peace, clarity, and emotional support through AI-powered conversations, mood tracking, and personalized wellness guidance.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/app')}
                                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/40 flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <span className="relative z-10">Start Your Wellness Journey</span>
                                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/app/chat')}
                                className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-xl hover:bg-white/15 rounded-2xl font-bold text-lg border border-white/20 transition-all"
                            >
                                Chat with MindMate
                            </motion.button>
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, 10, 0] }}
                            transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
                            className="absolute bottom-12 left-1/2 -translate-x-1/2"
                        >
                            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                                <div className="w-1.5 h-2 bg-white/50 rounded-full" />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-32 bg-gradient-to-b from-black to-gray-950">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">Everything you need to thrive</h2>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto">Powerful tools designed to support your mental wellness journey, available anytime, anywhere.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={MessageCircle}
                            title="AI Emotional Support"
                            desc="Chat with an empathetic AI that understands your feelings and offers genuine support 24/7."
                            delay={0}
                        />
                        <FeatureCard
                            icon={Activity}
                            title="Mood Tracking"
                            desc="Track your emotional patterns and gain insights into your mental health trends over time."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Brain}
                            title="Smart Journaling"
                            desc="AI-powered journaling with prompts and analysis to help you process your thoughts."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Guided Meditation"
                            desc="Access calming meditation sessions and breathing exercises tailored to your needs."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="relative py-32 bg-gradient-to-b from-gray-950 to-black">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">Simple steps to better wellbeing</h2>
                        <p className="text-gray-400 text-xl">Start your journey in three easy steps</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-16 md:gap-8 relative">
                        <Step
                            number="1"
                            title="Share Your Feelings"
                            desc="Open up to MindMate in a safe, judgment-free space. Express what's on your mind."
                            delay={0}
                        />
                        <Step
                            number="2"
                            title="Get AI-Powered Insights"
                            desc="Receive personalized guidance and coping strategies based on your unique situation."
                            delay={0.2}
                        />
                        <Step
                            number="3"
                            title="Improve Your Wellbeing"
                            desc="Track your progress and watch as you develop healthier mental habits over time."
                            delay={0.4}
                            isLast
                        />
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="relative py-32 bg-gradient-to-b from-black to-gray-950">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                <AnimatedCounter end={10000} suffix="+" />
                            </div>
                            <p className="text-gray-400 text-lg">Users Supported</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="space-y-2"
                        >
                            <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                <AnimatedCounter end={50000} suffix="+" />
                            </div>
                            <p className="text-gray-400 text-lg">Sessions Completed</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                        >
                            <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
                                <AnimatedCounter end={87} suffix="%" />
                            </div>
                            <p className="text-gray-400 text-lg">Wellness Improvement</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative py-32 bg-gradient-to-b from-gray-950 to-black">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">Loved by thousands</h2>
                        <p className="text-gray-400 text-xl">See what our community has to say</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="MindMate has become my daily sanctuary. The AI really understands me and helps me process my emotions."
                            name="Sarah M."
                            role="Software Engineer"
                            rating={5}
                            delay={0}
                        />
                        <TestimonialCard
                            quote="I was skeptical at first, but this app genuinely helped me through my anxiety. The mood tracking is invaluable."
                            name="James T."
                            role="Creative Director"
                            rating={5}
                            delay={0.1}
                        />
                        <TestimonialCard
                            quote="The breathing exercises and meditation guides are perfect. I feel calmer and more centered every day."
                            name="Emily R."
                            role="Teacher"
                            rating={5}
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-teal-900/50" />
                <div className="absolute inset-0 backdrop-blur-3xl" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold">Ready to start your wellness journey?</h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Join thousands who are taking control of their mental health. It's free, private, and always available.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/app')}
                            className="px-12 py-6 bg-white text-black rounded-2xl font-bold text-xl shadow-2xl shadow-white/20 hover:shadow-white/40 transition-all inline-flex items-center gap-3 group"
                        >
                            Get Started for Free
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 bg-black border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold">M</div>
                            <span className="font-bold">MindMate</span>
                        </div>

                        <div className="flex gap-8 text-gray-400 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Support</a>
                        </div>
                    </div>

                    <div className="text-center mt-8 text-gray-500 text-sm">
                        © 2024 MindMate. Crafted with care for better mental wellness.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
