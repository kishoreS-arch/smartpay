import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, MapPin, Target, CheckCircle2, AlertTriangle, ArrowRight, Mic, MicOff, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";
import "../../styles/security.css";

const Security = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [settings, setSettings] = useState(user?.settings || {
        isFamilyModeEnabled: false,
        isGeoFenceEnabled: false,
        isRoundUpEnabled: false
    });
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState("");

    const isSenior = theme === 'senior';
    const isVisual = theme === 'visual';

    const speak = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }, []);

    const toggleSetting = async (key, silent = false) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);

        if (!silent && (isVisual || isSenior)) {
            const feature = features.find(f => f.id === key);
            const status = newSettings[key] ? "Enabled" : "Disabled";
            speak(`${feature.title} ${status}`);
            setFeedback(`${feature.title} ${status} Successfully`);
            setTimeout(() => setFeedback(""), 3000);
            
            // Vibration feedback for mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }

        const API_BASE = window.API_URL || 'http://localhost:5001';
        try {
            await fetch(`${API_BASE}/api/banking/settings`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ settings: newSettings })
            });
        } catch (err) {
            console.error("Failed to update settings", err);
        }
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice commands are not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            console.log("Voice Command:", command);
            
            if (command.includes("family mode")) {
                if (!settings.isFamilyModeEnabled) toggleSetting('isFamilyModeEnabled');
            } else if (command.includes("savings") || command.includes("round up")) {
                if (!settings.isRoundUpEnabled) toggleSetting('isRoundUpEnabled');
            } else if (command.includes("safety") || command.includes("check safety")) {
                speak("Safety Check: All shields are active.");
            }
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
    };

    const features = [
        {
            id: "isFamilyModeEnabled",
            title: isSenior ? "Family Mode (Extra Security)" : "Family Trusted Mode",
            desc: isSenior ? "Safety for your family payments" : "Require approval for high-value payments",
            actionLabel: "Enable Family Protection",
            icon: <Users size={isSenior ? 32 : 24} />,
            color: "#6366f1"
        },
        {
            id: "isGeoFenceEnabled",
            title: isSenior ? "Safe Zone Protection" : "Geo-Fenced Zone",
            desc: isSenior ? "Keeps your money in safe locations" : "Restrict payments to your safe locations",
            actionLabel: "Secure My Location",
            icon: <MapPin size={isSenior ? 32 : 24} />,
            color: "#f59e0b"
        },
        {
            id: "isRoundUpEnabled",
            title: isSenior ? "Automatic Savings Jar" : "Round-Up Savings",
            desc: isSenior ? "Save small change every time" : "Save change on every transaction",
            actionLabel: "Start Saving",
            icon: <Target size={isSenior ? 32 : 24} />,
            color: "#10b981"
        }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`security-container ${theme}-mode-ui`}
        >
            <div className="security-header mb-6">
                <div className="icon-badge">
                    <Shield size={isSenior ? 40 : 32} color="#6366f1" aria-hidden="true" />
                </div>
                <div>
                    <h2 className="page-title mb-1">Smart Security</h2>
                    <p className="text-muted">{isSenior ? "Your account is fully protected" : "Manage your advanced banking shields"}</p>
                </div>
                
                <button 
                    className={`mic-btn ${isListening ? 'listening' : ''}`} 
                    onClick={startListening}
                    aria-label="Voice Command Assistant"
                >
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {feedback && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="status-toast"
                    >
                        {feedback}
                    </motion.div>
                )}
            </AnimatePresence>

            {isSenior ? (
                <div className="senior-auto-security glass-card p-5 text-center">
                    <div className="auto-icon-wrap mx-auto mb-4">
                        <Lock size={48} className="text-success" />
                    </div>
                    <h3 className="mb-3">Safety is Automatic</h3>
                    <p className="text-muted mb-4" style={{fontSize: '1.2rem', lineHeight: '1.6'}}>
                        For your peace of mind, we've enabled all security shields. 
                        Family protection, safe-zone checks, and AI fraud monitoring are 
                        now working automatically in the background.
                    </p>
                    <div className="senior-features-list text-left mx-auto" style={{maxWidth: '400px'}}>
                         <div className="s-feat-item mb-3 d-flex align-items-center gap-3">
                             <CheckCircle2 size={24} className="text-success" />
                             <span><strong>Family Protection:</strong> Alerting contacts for large spends.</span>
                         </div>
                         <div className="s-feat-item mb-3 d-flex align-items-center gap-3">
                             <CheckCircle2 size={24} className="text-success" />
                             <span><strong>Safe Locations:</strong> Checking location during payments.</span>
                         </div>
                         <div className="s-feat-item mb-3 d-flex align-items-center gap-3">
                             <CheckCircle2 size={24} className="text-success" />
                             <span><strong>Fraud Guard:</strong> Our AI watches for any risks.</span>
                         </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="features-stack">
                        {features.map(f => (
                            <div 
                                key={f.id} 
                                className="feature-item glass-card mb-4 p-4"
                                onClick={() => isVisual && speak(f.desc)}
                                role="region"
                                aria-label={f.title}
                            >
                                <div className="feature-main">
                                    <div className="feature-icon" style={{ backgroundColor: `${f.color}22`, color: f.color }}>
                                        {f.icon}
                                    </div>
                                    <div className="feature-info">
                                        <h4 onClick={(e) => { e.stopPropagation(); speak(f.title); }}>{f.title}</h4>
                                        <p onClick={(e) => { e.stopPropagation(); speak(f.desc); }}>{f.desc}</p>
                                    </div>
                                    
                                    {isVisual ? (
                                        <button 
                                            className={`quick-action-btn ${settings[f.id] ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); toggleSetting(f.id); }}
                                            aria-pressed={settings[f.id]}
                                        >
                                            {settings[f.id] ? "Enabled" : f.actionLabel}
                                        </button>
                                    ) : (
                                        <label className="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                checked={settings[f.id]} 
                                                onChange={() => toggleSetting(f.id)}
                                                aria-label={`Toggle ${f.title}`}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="info-cards mt-4">
                        <div 
                            className="info-card glass-card p-4 mb-4"
                            onClick={() => isVisual && speak("Verified Merchants. You are automatically protected against unverified stores.")}
                        >
                            <div className="info-header">
                                <CheckCircle2 size={isSenior ? 28 : 20} color="#10b981" />
                                <span>Verified Merchants</span>
                            </div>
                            <p className="small text-muted mt-2">
                                {isSenior ? "We only let safe shops take your money." : "You are automatically protected against unverified stores. Look for the ✔ badge."}
                            </p>
                            {isVisual && (
                                <button className="quick-action-btn mt-3" onClick={() => speak("Showing safe shops near you.")}>
                                    Show Safe Shops
                                </button>
                            )}
                        </div>

                        <div 
                            className="info-card glass-card p-4"
                            onClick={() => isVisual && speak("Risk Help Tool. Our AI monitors unusual behavior.")}
                        >
                            <div className="info-header">
                                <AlertTriangle size={isSenior ? 28 : 20} color="#f59e0b" />
                                <span>Risk Help Tool</span>
                            </div>
                            <p className="small text-muted mt-2">
                                {isSenior ? "Our AI watches for scams." : "Our AI monitors unusual behavior. You'll get an alert if something looks risky."}
                            </p>
                            {isVisual ? (
                                <button className="quick-action-btn mt-3" onClick={() => speak("Safety check in progress. No risks found.")}>
                                    Check My Safety
                                </button>
                            ) : (
                                <button className="btn-text mt-3 p-0">View risk logs <ArrowRight size={14} /></button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default Security;


