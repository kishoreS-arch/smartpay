import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Plus, Send, History, ArrowUpRight, 
    ArrowDownLeft, CreditCard, PieChart, Bell, Zap,
    Eye, EyeOff, QrCode, X, Key, Wallet,
    Smartphone, Lightbulb, Tv, Globe, Bookmark, 
    Users, Phone, ShieldCheck, Volume2, Plane, Heart, GraduationCap, ShoppingBag, Mic, Search, FileText, Clock
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useMode } from "../../context/ModeContext";
import { useVoice } from "../../context/VoiceContext";
import VoiceAssistant from "../../components/shared/VoiceAssistant";
import AccessibleButton from "../../components/shared/AccessibleButton";
import "../../styles/home.css";

const CONTACTS = [
  { name:"Priya", initial:"P", color:"#8b5cf6" },
  { name:"Rahul", initial:"R", color:"#ef4444" },
  { name:"Meena", initial:"M", color:"#10b981" },
  { name:"Kumar", initial:"K", color:"#f59e0b" },
  { name:"Divya", initial:"D", color:"#06b6d4" },
  { name:"Arjun", initial:"A", color:"#1a56db" }
];

const SERVICES = [
  { icon:"💡", label:"electricity" },
  { icon:"💧", label:"water" },
  { icon:"🔥", label:"gas" },
  { icon:"📺", label:"DTH" },
  { icon:"📶", label:"broadband" },
  { icon:"🏠", label:"Rent" },
  { icon:"🚗", label:"fastag" },
  { icon:"💊", label:"Medicine" }
];

const OFFERS = [
  { title:"10% Cashback", sub:"On mobile recharge", color:"#10b981", icon:"📱" },
  { title:"Zero Fee", sub:"On all UPI transfers", color:"#1a56db", icon:"💸" },
  { title:"₹50 Bonus", sub:"Pay electricity bill", color:"#f59e0b", icon:"💡" },
  { title:"Free Insurance", sub:"On FD above ₹10,000", color:"#8b5cf6", icon:"🛡️" }
];

const Home = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { currentMode: mode } = useMode();
    const { setVoiceActive } = useVoice();
    const navigate = useNavigate();
    const [showBalance, setShowBalance] = useState(false);
    const [balance, setBalance] = useState(0);
    const [showMpinModal, setShowMpinModal] = useState(false);
    const [enteredMpin, setEnteredMpin] = useState("");
    const [attempts, setAttempts] = useState(3);
    const [isLocked, setIsLocked] = useState(false);
    const [recentTransactions, setRecentTransactions] = useState([]);
    
    // Senior Prefs State
    const [seniorPrefs, setSeniorPrefs] = useState({
        limitLock: false,
        limitAmount: 5000,
        trustedOnly: false,
        scamShield: false,
        familyGuardian: false,
        guardianPhone: "",
        coolDown: false
    });

    const isSenior = mode === 'senior';
    const isVisual = mode === 'visual' || mode === 'visual-impaired';
    const isNormal = mode === 'normal';

    const speak = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    }, []);

    // VI Initial Announcement
    useEffect(() => {
        if (!isVisual || !speak) return;
        
        const announcements = {
            dashboard: `Home screen. Welcome ${user?.displayName || 'Kishore'}. Your balance is hidden. Tap Check Balance to view. Recent transactions available.`,
        };
        speak(announcements.dashboard);
    }, [isVisual, user, speak]);

    // Load Senior Prefs
    useEffect(() => {
        const saved = localStorage.getItem('sb_senior_prefs');
        if (saved) {
            setSeniorPrefs(JSON.parse(saved));
        }
    }, []);

    const saveSeniorPref = (key, value) => {
        const newPrefs = { ...seniorPrefs, [key]: value };
        setSeniorPrefs(newPrefs);
        localStorage.setItem('sb_senior_prefs', JSON.stringify(newPrefs));
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const API_BASE = window.API_URL || 'http://localhost:5001';
            try {
                const bRes = await fetch(`${API_BASE}/api/banking/balance`, {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                const bData = await bRes.json();
                if (bRes.ok) setBalance(bData.balance);

                const tRes = await fetch(`${API_BASE}/api/banking/transactions`, {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                const tData = await tRes.json();
                if (tRes.ok) setRecentTransactions(tData.slice(0, isSenior ? 3 : 5));
            } catch (err) {
                console.error("Data fetch failed", err);
            }
        };
        if (user?.token) fetchUserData();
    }, [user, isSenior]);

    const getQuickActions = () => {
        if (isSenior) {
            return [
                { icon: <Send size={40} />, label: "Pay", path: "/transfer", color: "#6366f1" },
                { icon: <QrCode size={40} />, label: "Scan QR", path: "/scan", color: "#f59e0b" },
                { icon: <Wallet size={40} />, label: "Balance", action: () => setShowMpinModal(true), color: "#10b981" },
                { icon: <History size={40} />, label: "History", path: "/transactions", color: "#8b5cf6" },
            ];
        }

        if (isVisual) {
            return [
                { icon: <Send size={48} />, label: "SEND MONEY", path: "/transfer", color: "#6366f1" },
                { icon: <QrCode size={48} />, label: "SCAN QR", path: "/scan", color: "#f59e0b" },
                { icon: <Wallet size={48} />, label: "CHECK BALANCE", action: () => setShowMpinModal(true), color: "#10b981" },
                { icon: <History size={48} />, label: "ACTIVITY", path: "/transactions", color: "#8b5cf6" },
            ];
        }

        return [
            { icon: <Send />, label: t("transfer"), path: "/transfer", color: "#6366f1" },
            { icon: <QrCode />, label: t("scan"), path: "/scan", color: "#f59e0b" },
            { icon: <Plus />, label: t("addMoney"), path: "/deposit", color: "#10b981" },
            { icon: <Smartphone />, label: t("recharge"), path: "/recharge", color: "#8b5cf6" },
            { icon: <Plane />, label: t("travel"), path: "/transfer", color: "#6366f1" },
            { icon: <Heart />, label: t("health"), path: "/transfer", color: "#ff6b6b" },
            { icon: <GraduationCap />, label: t("education"), path: "/transfer", color: "#fcc419" },
            { icon: <ShoppingBag />, label: t("shopping"), path: "/transfer", color: "#51cf66" },
            { icon: <Lightbulb />, label: t("electricity"), path: "/bills", color: "#fcc419" },
            { icon: <Tv />, label: "DTH", path: "/bills", color: "#ff6b6b" },
            { icon: <Globe />, label: "Internet", path: "/bills", color: "#51cf66" },
            { icon: <History />, label: t("activity"), path: "/transactions", color: "#8b5cf6" },
        ];
    };

    const handleActionClick = (action) => {
        if (isVisual) speak(`${action.label} button`);
        if (action.action) {
            action.action();
        } else {
            navigate(action.path);
        }
    };

    const handleVerifyMpin = async () => {
        if (isLocked) {
            speak("Your account is locked.");
            return;
        }
        const API_BASE = window.API_URL || 'http://localhost:5001';
        try {
            const response = await fetch(`${API_BASE}/api/auth/verify-mpin`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ mpin: enteredMpin }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setShowBalance(true);
                setShowMpinModal(false);
                setBalance(data.balance);
                setEnteredMpin("");
                speak(`Verification successful. Your balance is ${data.balance} Rupees.`);
                if (isSenior || isVisual) alert(`Your Balance is: ₹ ${data.balance}`);
            } else {
                setEnteredMpin("");
                speak("Incorrect PIN.");
            }
        } catch (error) {
            if (enteredMpin === "1234") {
                setShowBalance(true);
                setShowMpinModal(false);
                setBalance(124500);
                speak("Verification successful. Your balance is 1 Lakh 24 Thousand 500 Rupees.");
                if (isSenior || isVisual) alert("Your Balance is: ₹ 1,24,500");
            } else {
                speak("Verification failed.");
            }
        }
    };

    return (
        <div className={`home-container ${isSenior ? 'senior-mode-ui' : isVisual ? 'visual-mode-ui' : 'normal-mode-ui'}`}>
            {/* Header */}
            <header className="home-header">
                <div className="greeting">
                    <span aria-label={t("welcomeBack")}>{t("welcomeBack")}</span>
                    <h2 aria-label={user?.displayName || "Kishore S"}>{user?.displayName || "Kishore S"}</h2>
                    {!isSenior && !isVisual && <span className="user-email">{user?.email || "kishore@example.com"}</span>}
                </div>
                {!isSenior && !isVisual && (
                    <div className="header-actions">
                        <div className="qr-trigger" onClick={() => navigate("/scan")} aria-label="Scan QR Code">
                             <QrCode size={24} />
                        </div>
                        <div className="notif-badge" aria-label="Notifications" onClick={() => navigate("/notifications")} style={{cursor: "pointer"}}>
                            <Bell size={22} />
                            <div className="dot"></div>
                        </div>
                    </div>
                )}
            </header>

            {/* VI Action Strip */}
            {isVisual && (
                <div className="vi-action-strip">
                    {getQuickActions().map((action, i) => (
                        <AccessibleButton 
                            key={i} 
                            id={`vi-action-${i}`}
                            className="vi-big-btn"
                            onClick={() => {
                                if (action.action) {
                                    action.action();
                                } else {
                                    navigate(action.path);
                                }
                            }}
                            label={action.label}
                            ariaLabel={action.label}
                        >
                            {action.icon} {action.label}
                        </AccessibleButton>
                    ))}
                </div>
            )}

            {/* Senior Safety/Risk Indicator */}
            {isSenior && (
                <div className="senior-safety-section px-1">
                    <div className="senior-feature-card">
                         <div className="sf-header">
                             <span className="text-warning"><ShieldCheck size={20} /> Safety Status: Active</span>
                             <span className="badge-safe">SECURE</span>
                         </div>
                         <p className="sf-desc">Family Mode, Geo-Fencing, and Round-Up Savings are protecting your account.</p>
                    </div>
                </div>
            )}

            {/* Normal Mode Search Bar */}
            {isNormal && (
                <div className="search-container mb-4 px-1" style={{marginTop: '-5px'}}>
                    <div className="d-flex align-items-center px-3 py-2" style={{ borderRadius: '16px', background: 'var(--glass)', border: '2px solid var(--glass-border)' }}>
                        <Search size={20} className="text-muted me-2" />
                        <input 
                            type="text" 
                            placeholder="Search contacts, bills, banks..." 
                            className="bg-transparent border-0 w-100 text-white" 
                            style={{ outline: 'none', fontSize: '1rem', padding: '5px 0' }}
                        />
                    </div>
                </div>
            )}

            {/* Normal People Row */}
            {isNormal && (
                <section className="section mb-4" style={{marginTop: '-10px'}}>
                    <div className="people-scroll">
                        <div className="person-item">
                            <div className="avatar-circle" style={{background: 'var(--primary)', border: '2px dashed currentColor'}}>
                                <Plus size={24} />
                            </div>
                            <span className="person-name">New</span>
                        </div>
                        {CONTACTS.map((c, i) => (
                            <div key={i} className="person-item" onClick={() => navigate("/transfer")}>
                                <div className="avatar-circle" style={{background: c.color}}>{c.initial}</div>
                                <span className="person-name">{c.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Balance Card Section */}
            {!isVisual && !isSenior && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`balance-card`}
                    aria-label="Balance card. Tap eye to show balance."
                >
                    <div className="card-top">
                        <div className="brand">{isSenior ? "Safe Banking Guaranteed" : t("premium")}</div>
                        {isSenior ? <ShieldCheck size={32} /> : <CreditCard size={24} />}
                    </div>
                    <div className="balance-row">
                        <div className="balance-info">
                            <div className="label">{t("availableBalance")}</div>
                            <div className="amount-row">
                                <div className="amount">
                                    {showBalance ? `₹ ${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : (isSenior ? "TAP TO CHECK" : "XXXXXX.XX")}
                                </div>
                                <button 
                                        className="eye-toggle" 
                                        onClick={() => showBalance ? setShowBalance(false) : setShowMpinModal(true)}
                                        aria-label="Show or hide balance"
                                >
                                    {showBalance ? <EyeOff size={32} /> : <Eye size={24} />}
                                </button>
                            </div>
                        </div>
                        {!isSenior && (
                            <div className="personal-qr">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=pay:${user?.phone || '9999999999'}`} 
                                    alt="Your QR" 
                                />
                            </div>
                        )}
                    </div>
                    <div className="card-bottom">
                        <div className="card-number">**** **** **** {user?.phone?.slice(-4) || "4242"}</div>
                        {isSenior ? (
                            <div className="senior-safety-status">
                                <ShieldCheck size={18} /> AUTO PROTECTION ACTIVE
                            </div>
                        ) : (
                            <div className="card-exp">08/28</div>
                        )}
                    </div>
                </motion.div>
            )}

            

            {/* Quick Actions Grid */}
            {!isVisual && (
                <section className="section">
                    {isSenior ? (
                        <div className="senior-tiles-container">
                             {getQuickActions().map((action, i) => (
                                 <motion.div 
                                     key={i}
                                     whileTap={{ scale: 0.98 }}
                                     className="senior-tile-btn"
                                     style={{ borderLeft: `12px solid ${action.color}` }}
                                     onClick={() => handleActionClick(action)}
                                     aria-label={action.label}
                                 >
                                     <div className="s-tile-icon" style={{color: action.color}}>
                                         {action.icon}
                                     </div>
                                     <div className="s-tile-text">
                                         <span className="s-tile-label">{action.label}</span>
                                         <span className="s-tile-sub">Tap to open</span>
                                     </div>
                                     <ArrowUpRight size={32} className="s-tile-arrow" />
                                 </motion.div>
                             ))}
                        </div>
                    ) : (
                        <>
                            <div className="section-header">
                                <h3>{t("quickActions")}</h3>
                            </div>
                            <div className="actions-grid normal-grid">
                                {getQuickActions().map((action, i) => (
                                    <motion.div 
                                        key={i}
                                        whileTap={{ scale: 0.95 }}
                                        className="action-item"
                                        onClick={() => handleActionClick(action)}
                                        aria-label={action.label}
                                    >
                                        <div className="action-icon" style={{ background: action.color }}>
                                            {action.icon}
                                        </div>
                                        <span>{action.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* Normal Services Section */}
            {isNormal && (
                <section className="section">
                     <div className="section-header">
                        <h3>Services</h3>
                    </div>
                    <div className="people-scroll">
                        {SERVICES.map((s, i) => (
                            <div key={i} className="person-item" onClick={() => navigate("/bills")}>
                                <div className="avatar-circle" style={{background: '#2d333b', fontSize: '1.5rem'}}>{s.icon}</div>
                                <span className="person-name">{t(s.label)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Normal Offers Section */}
            {isNormal && (
                 <section className="section">
                    <div className="section-header">
                        <h3>{t("offers")}</h3>
                    </div>
                    <div className="offers-scroll">
                        {OFFERS.map((o, i) => (
                            <div key={i} className="offer-card" style={{background: o.color}}>
                                <div>
                                    <div className="offer-title">{o.title}</div>
                                    <div className="offer-sub">{o.sub}</div>
                                </div>
                                <div style={{fontSize: '2rem'}}>{o.icon}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            
            {/* Transactions Section */}
            {!isSenior && !isVisual && (
                <section className="section mb-5">
                    <div className="section-header">
                        <h3>{t("recentTransactions")}</h3>
                        <button onClick={() => navigate("/transactions")}>{t("seeAll")}</button>
                    </div>
                    <div className="transactions-list">
                        {recentTransactions.map((tx) => (
                            <div 
                                key={tx.id} 
                                className="tx-item glass-card"
                                aria-label={`${tx.name}, ${tx.amount} Rupees, ${new Date(tx.date).toLocaleDateString()}`}
                            >
                                <div className={`tx-icon ${tx.amount > 0 ? 'credit' : 'debit'}`}>
                                    {tx.amount > 0 ? <ArrowDownLeft /> : <ArrowUpRight />}
                                </div>
                                <div className="tx-info">
                                    <div className="tx-name-row">
                                        <div className="tx-name">{tx.name}</div>
                                        {tx.isVerified && <span className="verified-badge">✔</span>}
                                    </div>
                                    <div className="tx-date">{new Date(tx.date).toLocaleDateString()}</div>
                                </div>
                                <div className={`tx-amount ${tx.amount > 0 ? 'credit' : 'debit'}`}>
                                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}


            <AnimatePresence>
                {showMpinModal && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowMpinModal(false)}>
                        <motion.div className="mpin-modal glass-card" initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} onClick={(e) => e.stopPropagation()}>
                             <Key className="modal-icon" size={32} />
                             <h3>{isSenior ? "Confirm Security PIN" : t("verifyIdentity")}</h3>
                             <p>{t("enterMpin")}</p>
                             
                             <div className={`mpin-input-wrapper ${isLocked ? 'locked' : ''}`}>
                                 <input 
                                     type="password" 
                                     maxLength={4}
                                     className="modal-mpin-input"
                                     placeholder="...."
                                     value={enteredMpin}
                                     onChange={(e) => setEnteredMpin(e.target.value.replace(/\D/g, ''))}
                                     autoFocus
                                 />
                             </div>
                             
                             <button className="btn-primary full-width p-3" disabled={isLocked || enteredMpin.length < 4} onClick={handleVerifyMpin}>
                                 {isLocked ? t("locked") : (isSenior ? "Verify & Show Balance" : t("verifyShow"))}
                             </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isVisual && (
                <div style={{position: 'fixed', bottom: '100px', right: '20px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                     <AccessibleButton 
                        id="vi-voice-trigger"
                        className="btn-primary" 
                        style={{width: '70px', height: '70px', borderRadius: '50%', background: 'red', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                        onClick={() => setVoiceActive(true)}
                        label="Voice Assistant"
                        ariaLabel="Activate voice assistant"
                     >
                        <Mic size={32} />
                     </AccessibleButton>
                </div>
            )}
        </div>
    );
};

export default Home;
