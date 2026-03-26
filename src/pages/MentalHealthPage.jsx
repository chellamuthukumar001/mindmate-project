import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Phone, BookOpen, Users, Activity, Sparkles, AlertCircle } from 'lucide-react';

export default function MentalHealthPage() {
    const resources = [
        {
            title: 'Crisis Support',
            description: 'Immediate help is available if you or someone you know is struggling.',
            icon: AlertCircle,
            color: 'text-red-500 bg-red-500/10 border-red-500/20',
            buttonText: 'Emergency Hotlines',
        },
        {
            title: 'Therapist Finder',
            description: 'Connect with licensed mental health professionals in your area or online.',
            icon: Users,
            color: 'text-purple-600 bg-purple-600/10 border-purple-600/20',
            buttonText: 'Find a Therapist',
        },
        {
            title: 'Self-Help Articles',
            description: 'Read expert articles on managing anxiety, depression, and stress.',
            icon: BookOpen,
            color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
            buttonText: 'Browse Library',
        },
        {
            title: 'Wellness Activities',
            description: 'Engage in exercises designed to boost mental clarity and peace.',
            icon: Activity,
            color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            buttonText: 'Start Activities',
        }
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#0c0118] transition-colors overflow-y-auto">
            <div className="max-w-6xl mx-auto p-6 md:p-8 lg:p-12 space-y-12 pb-32">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 max-w-3xl mx-auto"
                >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-purple-600 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/20 animate-float">
                        <HeartPulse size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-6">
                        Mental Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Services</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">
                        Explore dedicated resources and professional help curated to support your mental well-being journey.
                    </p>
                </motion.div>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {resources.map((resource, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all group flex flex-col justify-between"
                        >
                            <div className="space-y-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${resource.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <resource.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {resource.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {resource.description}
                                </p>
                            </div>

                            <button className="w-full py-4 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 font-bold transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-white/5">
                                {resource.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <Sparkles className="mx-auto mb-4 text-white/80" size={32} />
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">You are not alone.</h2>
                    <p className="text-white/80 md:text-lg max-w-2xl mx-auto">
                        Seeking help is a sign of strength. The MindMate community and our carefully selected professional services are here to guide you every step of the way.
                    </p>
                </motion.div>

            </div>
        </div>
    );
}
