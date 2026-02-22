import React from 'react';
import Navigation from './Navigation';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    return (
        <div className="min-h-screen bg-background text-text font-sans overflow-x-hidden">
            {!isLandingPage && (
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                    {/* Desktop Ambient Background */}
                    <div className="hidden md:block absolute top-[10%] left-[20%] w-[30vw] h-[30vw] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" />
                    <div className="hidden md:block absolute bottom-[10%] right-[20%] w-[35vw] h-[35vw] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse delay-1000" />

                    {/* Mobile Ambient Background */}
                    <div className="md:hidden absolute top-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
                    <div className="md:hidden absolute bottom-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
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
