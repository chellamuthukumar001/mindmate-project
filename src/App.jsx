import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LandingPage from './pages/LandingPage';
import BreathingPage from './pages/BreathingPage';
import FocusPage from './pages/FocusPage';
import MoodPage from './pages/MoodPage';
import MentalHealthPage from './pages/MentalHealthPage';
import InstallBanner from './components/InstallBanner';
import NotificationPrompt from './components/NotificationPrompt';
import UpdateBanner from './components/UpdateBanner';
import OfflineBanner from './components/OfflineBanner';

function PageTransition({ children }) {
  const isLanding = useLocation().pathname === '/';

  return (
    <motion.div
      initial={{ opacity: 0, scale: isLanding ? 1.05 : 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: isLanding ? 0.95 : 1.05 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  const location = useLocation();

  return (
    <>
      {/* Global PWA Overlays */}
      <UpdateBanner />
      <OfflineBanner />
      <NotificationPrompt />
      <InstallBanner />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />

          {/* Protected App Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="chat" element={<PageTransition><ChatPage /></PageTransition>} />
            <Route path="mood" element={<PageTransition><MoodPage /></PageTransition>} />
            <Route path="breathing" element={<PageTransition><BreathingPage /></PageTransition>} />
            <Route path="focus" element={<PageTransition><FocusPage /></PageTransition>} />
            <Route path="services" element={<PageTransition><MentalHealthPage /></PageTransition>} />
            {/* Catch-all for /app/something */}
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
