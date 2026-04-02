import React, { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, Volume2, ShieldCheck, PlayCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVoice } from "../../context/VoiceContext";

const VoiceAssistant = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isVoiceActive, setVoiceActive } = useVoice();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isSupported, setIsSupported] = useState(true);

    const speak = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }, []);

    useEffect(() => {
        if (isVoiceActive) {
            speak("Voice Assistant Active. How can I help you today?");
            // Optionally auto-start listening:
            // startListening();
        }
        return () => window.speechSynthesis.cancel();
    }, [isVoiceActive, speak]);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            speak("I'm listening...");
        };

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            setTranscript(command);
            handleCommand(command);
        };

        recognition.onerror = () => {
            setIsListening(false);
            speak("Sorry, I didn't catch that. Please try again.");
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleCommand = (command) => {
        if (command.includes("send") || command.includes("pay") || command.includes("transfer")) {
            speak("Opening payment screen.");
            setVoiceActive(false);
            navigate("/transfer");
        } else if (command.includes("balance") || command.includes("money i have")) {
            speak("Navigating to home to check balance.");
            setVoiceActive(false);
            navigate("/home");
        } else if (command.includes("scan") || command.includes("qr")) {
            speak("Opening scanner.");
            setVoiceActive(false);
            navigate("/scan");
        } else if (command.includes("activity") || command.includes("history") || command.includes("transactions")) {
            speak("Showing your recent activity.");
            setVoiceActive(false);
            navigate("/transactions");
        } else if (command.includes("security") || command.includes("safe") || command.includes("settings")) {
            speak("Opening security and profile.");
            setVoiceActive(false);
            navigate("/security");
        } else if (command.includes("hello") || command.includes("hi")) {
            speak("Hello! I am your SmartPay assistant. Say things like Pay, Balance, or History.");
        } else {
            speak("I heard " + command + ". I'm not sure how to do that yet.");
        }
    };

    if (!isVoiceActive) return null;

    return (
        <div className="voice-assistant-ui">
            <div className="voice-card glass-card">
                <button 
                    className="voice-close-btn" 
                    onClick={() => setVoiceActive(false)}
                    aria-label="Close Assistant"
                >
                    <X size={28} />
                </button>
                <div className="voice-header mt-3">
                    <div className="status-dot pulsing"></div>
                    <h3>Voice Assistant</h3>
                </div>
                
                <div className="voice-wave-container">
                    {isListening && (
                        <div className="wave-bars">
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </div>
                    )}
                    {!isListening && <Volume2 size={48} className="text-muted" />}
                </div>

                <div className="transcript-box">
                    <p>{transcript || "Tap the microphone and say something..."}</p>
                </div>

                <div className="voice-controls">
                    <button 
                        className={`mic-btn-main ${isListening ? 'listening' : ''}`}
                        onClick={startListening}
                    >
                        {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                    </button>
                </div>

                <div className="voice-tips">
                    <span>Try: "Send money", "Check balance", or "Scan QR"</span>
                </div>
            </div>

            <style>{`
                .voice-assistant-ui {
                    position: fixed;
                    bottom: 120px;
                    left: 20px;
                    right: 20px;
                    z-index: 2000;
                }
                .voice-card {
                    padding: 30px;
                    border-radius: 32px;
                    text-align: center;
                    border: 4px solid var(--accent);
                    background: black !important;
                    position: relative;
                }
                .voice-close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                }
                .voice-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .status-dot {
                    width: 12px;
                    height: 12px;
                    background: var(--success);
                    border-radius: 50%;
                }
                .status-dot.pulsing {
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .voice-wave-container {
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                .wave-bars {
                    display: flex;
                    align-items: flex-end;
                    gap: 4px;
                    height: 40px;
                }
                .bar {
                    width: 6px;
                    background: var(--accent);
                    animation: wave 1s infinite;
                }
                .bar:nth-child(2) { animation-delay: 0.2s; height: 60%; }
                .bar:nth-child(3) { animation-delay: 0.4s; height: 100%; }
                .bar:nth-child(4) { animation-delay: 0.1s; height: 40%; }
                .bar:nth-child(5) { animation-delay: 0.3s; height: 80%; }
                @keyframes wave {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
                .transcript-box {
                    background: rgba(255,255,255,0.05);
                    padding: 16px;
                    border-radius: 16px;
                    margin-bottom: 24px;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .transcript-box p {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: var(--accent);
                    margin: 0;
                }
                .mic-btn-main {
                    width: 80px;
                    height: 80px;
                    border-radius: 40px;
                    background: var(--accent);
                    color: black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    border: none;
                    box-shadow: 0 10px 30px var(--accent-glow);
                }
                .mic-btn-main.listening {
                    background: var(--danger);
                }
                .voice-tips {
                    margin-top: 20px;
                    font-size: 1.1rem;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default VoiceAssistant;
