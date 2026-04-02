import React, { useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/shared-theme.css";
import { useMode } from "./context/ModeContext";
import { useAuth } from "./context/AuthContext";
import { App as CapacitorApp } from '@capacitor/app';

// Components
import PageHeader from "./components/layout/PageHeader";
import BottomNav from "./components/layout/BottomNav";
import AIChatbot from "./components/ai/AIChatbot";
import VoiceAssist from "./components/accessibility/VoiceAssist";
import VoiceAssistant from "./components/shared/VoiceAssistant";

// Pages
import Login from "./pages/auth/Login";
import Home from "./pages/dashboard/Home";
import Transactions from "./pages/transactions/Transactions";
import Budget from "./pages/budget/Budget";
import Reminders from "./pages/reminders/Reminders";
import Assets from "./pages/assets/Assets";
import Transfer from "./pages/transfer/Transfer";
import Deposit from "./pages/deposit/Deposit";
import Scan from "./pages/scan/Scan";
import Statement from "./pages/statement/Statement";
import Security from "./pages/security/Security";
import Recharge from "./pages/services/Recharge";
import Bills from "./pages/services/Bills";
import Notifications from "./pages/services/Notifications";
import Contact from "./pages/services/Contact";

function App() {
  const { currentMode: mode } = useMode();
  const { user } = useAuth();
  const isVisual = mode === 'visual' || mode === 'visual-impaired';

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (!isVisual) return;

    const handleClick = (e) => {
      const el = e.target.closest('[aria-label]') || e.target;
      const text = el.getAttribute('aria-label') || el.innerText?.trim() || el.value;
      if (text && text.length > 0 && text.length < 300) {
        speak(text);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isVisual, speak]);

  useEffect(() => {
    // Handle Android hardware back button
    const backButtonListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
    return () => {
      backButtonListener.then(listener => listener.remove());
    };
  }, []);

  return (
    <Router>
      <PageHeader />
      <VoiceAssist />
      <div className="main-content container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/statement" element={<Statement />} />
          <Route path="/security" element={<Security />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <BottomNav />
      <VoiceAssistant />
      <AIChatbot />
    </Router>
  );
}

export default App;
