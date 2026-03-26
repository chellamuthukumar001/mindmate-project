import React from 'react';
import Navigation from './Navigation';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <div className="min-h-screen bg-background text-text font-sans overflow-x-hidden">
            {!isLandingPage && (
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-background">
                    {/* Desktop Ambient Background */}
                    <div className="hidden md:block absolute top-[10%] left-[20%] w-[35vw] h-[35vw] bg-purple-500/20 dark:bg-purple-900/30 rounded-full filter blur-[120px] animate-blob" />
                    <div className="hidden md:block absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-blue-500/20 dark:bg-blue-900/30 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
                    <div className="hidden md:block absolute bottom-[10%] left-[40%] w-[40vw] h-[40vw] bg-teal-500/10 dark:bg-teal-900/20 rounded-full filter blur-[120px] animate-blob animation-delay-4000" />

                    {/* Mobile Ambient Background */}
                    <div className="md:hidden absolute top-0 left-[-10%] w-72 h-72 bg-purple-500/20 dark:bg-purple-900/40 rounded-full filter blur-3xl animate-blob" />
                    <div className="md:hidden absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-blue-500/20 dark:bg-blue-900/40 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
                </div>
            )}

            {/* Main Container - Mobile: Full + Padding, Desktop: Centered Max Width */}
            <main className={`
         relative z-10 
         md:pt-24 md:px-8 md:pb-12 md:max-w-7xl md:mx-auto
         pb-20 pt-4 px-4 min-h-screen
         transition-all duration-300
      `}>
                <div className="w-full h-full">
                    {children}
                </div>
            </main>

            <Navigation />
        </div>
    );
}
