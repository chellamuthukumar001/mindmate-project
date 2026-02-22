import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LandingPage from './pages/LandingPage';
import BreathingPage from './pages/BreathingPage';
import FocusPage from './pages/FocusPage';
import MoodPage from './pages/MoodPage';

function AppLayout() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/breathing" element={<BreathingPage />} />
        <Route path="/focus" element={<FocusPage />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/*" element={<AppLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
