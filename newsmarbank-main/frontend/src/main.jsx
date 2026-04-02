import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ModeProvider } from './context/ModeContext.jsx';
import { VoiceProvider } from './context/VoiceContext.jsx';
import './i18n';

// Global API Configuration
window.API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Removed manual SW registration to allow vite-plugin-pwa to handle it automatically

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ModeProvider>
        <VoiceProvider>
          <App />
        </VoiceProvider>
      </ModeProvider>
    </AuthProvider>
  </React.StrictMode>
)
