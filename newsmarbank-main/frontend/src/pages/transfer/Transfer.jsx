import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Building2, Phone, ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle, ShieldAlert, XCircle, MoreVertical } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useTheme from "../../hooks/useTheme";
import "../../styles/transfer.css";
import { useTranslation } from "react-i18next";

const Transfer = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Method, 2: Details, 3: PIN, 4: Success
    const [method, setMethod] = useState(null);
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [note, setNote] = useState("");
    const [pin, setPin] = useState("");
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Risk Management States
    const [riskLevel, setRiskLevel] = useState("LOW");
    const [riskReason, setRiskReason] = useState("");
    const [showRiskAlert, setShowRiskAlert] = useState(false);
    const [isFamilyApprovalRequired, setIsFamilyApprovalRequired] = useState(false);

    // Senior Mode Timer (Cool-down)
    const [showCooldown, setShowCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(30);
    const [cooldownInterval, setCooldownInterval] = useState(null);

    const isSenior = theme === 'senior';
    const isVisual = theme === 'visual';

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(pos => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            }, err => console.warn("GPS access denied"));
        }
    }, []);

    const transferMethods = [
        { id: "upi", title: "upiId", icon: <Phone />, color: "#10b981", desc: "instantTransferUpi" },
        { id: "bank", title: "bankAccount", icon: <Building2 />, color: "#6366f1", desc: "neftTransfer" },
        { id: "contact", title: "contactMethod", icon: <Users />, color: "#f59e0b", desc: "sendToContacts" },
    ];

    const handleMethodSelect = (m) => {
        setMethod(m);
        setStep(2);
    };

    /**
     * Senior Mode Risk Identifier
     * Automatically called before showing PIN entry
     */
    const performRiskCheck = async () => {
        if (!isSenior) return true;

        const API_BASE = window.API_URL || 'http://localhost:5001';
        try {
            const res = await fetch(`${API_BASE}/api/banking/check-risk`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ recipient, amount, lat: location.lat, lng: location.lng })
            });
            const data = await res.json();
            
            if (res.ok) {
                setRiskLevel(data.risk);
                setRiskReason(data.reason);
                setIsFamilyApprovalRequired(data.needsFamilyApproval);
                
                // MEDIUM RISK Path: Simple confirmation
                if (data.risk === "MEDIUM") {
                    const proceed = window.confirm(`⚠️ SAFE BANKING: ${data.reason}`);
                    return proceed;
                }
                
                // HIGH RISK Path: Big modal alert
                if (data.risk === "HIGH") {
                    setShowRiskAlert(true);
                    return false; // Interrupt flow to show modal
                }
            }
        } catch (err) {
            console.error("Risk evaluation failed", err);
        }
        return true; // Fallback to allow if API fails
    };

    const handleProceedDetails = async (e) => {
        e.preventDefault();
        if (amount && recipient) {
            const safetyPassed = await performRiskCheck();
            if (safetyPassed) setStep(3);
        }
    };

    const handleConfirmRiskModal = () => {
        setShowRiskAlert(false);
        // Requirement: HIGH + Large Amount -> Family Approval (simulated)
        if (isFamilyApprovalRequired) {
            const pinCode = window.prompt(`👥 FAMILY APPROVAL: This ₹${amount} payment is highly unusual. A code has been sent to your Trusted Guardian. Please enter the 4-digit approval code to unlock:`, "");
            if (pinCode === "1234") {
                setStep(3);
            } else {
                alert("❌ Approval failed. Transaction cancelled for your safety.");
            }
        } else {
            setStep(3);
        }
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        // Final protection override for Senior Mode
        const prefs = JSON.parse(localStorage.getItem('sb_senior_prefs') || '{}');
        if (isSenior && prefs.coolDown) {
            setShowCooldown(true);
            setCooldownTime(30);
            const interval = setInterval(() => {
                setCooldownTime(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        finalizeTransaction();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            setCooldownInterval(interval);
        } else {
            finalizeTransaction();
        }
    };

    const finalizeTransaction = async () => {
        setShowCooldown(false);
        const API_BASE = window.API_URL || 'http://localhost:5001';

        try {
            const res = await fetch(`${API_BASE}/api/banking/send-money`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ recipient, amount, mpin: pin, lat: location.lat, lng: location.lng })
            });

            if (res.ok) {
                setStep(4);
            } else {
                const data = await res.json();
                alert(data.message || "Something went wrong.");
                setPin("");
                setIsProcessing(false);
            }
        } catch (err) {
            setStep(4); // Offline demo success
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className={`transfer-container ${isSenior ? 'senior-mode-ui' : isVisual ? 'visual-mode-ui' : ''}`}
        >
            <div className="page-header-row mb-4">
                <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="back-btn">
                    <ArrowLeft size={isSenior ? 32 : 24} />
                </button>
                <h2 className="page-title mb-0">{isSenior ? "Secure Pay" : t("sendMoney")}</h2>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <h3 className="section-title mb-4">{isSenior ? "Choose Payment Method" : t("selectTransferMethod")}</h3>
                        <div className={`method-grid ${isSenior ? 'senior-methods' : ''}`}>
                            {transferMethods.map(m => (
                                <div key={m.id} className="method-card glass-card p-4" onClick={() => handleMethodSelect(m)}>
                                    <div className="method-icon-wrap" style={{ backgroundColor: `${m.color}22`, color: m.color }}>
                                        {m.icon}
                                    </div>
                                    <h4 className="mt-3">{t(m.title)}</h4>
                                    {!isSenior && <p className="small text-muted">{t(m.desc)}</p>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <div className={`transfer-details-card glass-card p-4 ${isSenior ? 'senior-form' : ''}`}>
                            <form onSubmit={handleProceedDetails} className="transfer-form">
                                <div className="form-group mb-4">
                                    <label className="mb-2 d-block">{isSenior ? "Send to (Name/Shop/Phone):" : t("recipientMethod", { method: t(method.title) })}</label>
                                    <input 
                                        type="text" className="styled-input p-3" style={{width: '100%', fontSize: isSenior ? '1.5rem' : '1.1rem'}}
                                        value={recipient} onChange={(e) => setRecipient(e.target.value)} required
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label className="mb-2 d-block">{isSenior ? "How much (₹):" : t("amountInr")}</label>
                                    <input 
                                        type="number" className="styled-input amount-input p-3" style={{width: '100%', fontSize: isSenior ? '2rem' : '1.5rem'}}
                                        value={amount} onChange={(e) => setAmount(e.target.value)} required
                                    />
                                </div>
                                <button type="submit" className={`btn-primary full-width mt-4 ${isSenior ? 'btn-large' : ''}`} style={{height: isSenior ? '80px' : '60px', fontSize: isSenior ? '1.6rem' : '1.2rem'}}>
                                    {isSenior ? "Verify & Proceed Safely" : t("continueBtn")}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pin-modal-overlay">
                        <div className={`pin-card glass-card p-5 text-center ${isSenior ? 'senior-pin' : ''}`}>
                            <ShieldCheck size={isSenior ? 80 : 48} color="#f59e0b" className="mb-3 mx-auto" />
                            <h3>{isSenior ? "Confirm Identity" : t("enterMpinHeading")}</h3>
                            <p className="mb-4">{isSenior ? `Confirming ₹${amount} for ${recipient}` : t("toSendAmountRecipient", { amount, recipient })}</p>
                            <form onSubmit={handlePinSubmit}>
                                <input 
                                    type="password" maxLength={4} placeholder="••••" value={pin}
                                    style={{width: '100%', fontSize: '2.5rem', letterSpacing: '15px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: '2px solid #f59e0b', borderRadius: '15px', padding: '15px'}}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} autoFocus
                                />
                                <button className={`btn-primary full-width mt-4 ${isSenior ? 'btn-large' : ''}`} style={{fontSize: '1.5rem'}} disabled={pin.length < 4 || isProcessing}>
                                    {isProcessing ? "Verifying..." : (isSenior ? "Finish & Pay Now" : t("verifyAndPay"))}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="success-page text-center">
                        <CheckCircle2 size={120} color="#10b981" className="mx-auto mb-4" />
                        <h2 style={{fontSize: isSenior ? '2.5rem' : '2.1rem'}}>Payment Completed!</h2>
                        <p style={{fontSize: isSenior ? '1.4rem' : '1.2rem'}}>{t("amountSentToRecipient", { amount, recipient })}</p>
                        <button onClick={() => navigate('/home')} className={`btn-primary full-width p-4 mt-5 ${isSenior ? 'btn-large' : ''}`} style={{fontSize: '1.5rem'}}>
                            Done: Back to Home
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Senior Mode: HIGH RISK Alert Modal */}
            <AnimatePresence>
                {showRiskAlert && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="glass-card p-5 text-center shadow-xl" style={{maxWidth: '430px', border: '5px solid #ef4444', borderRadius: '40px'}}>
                            <ShieldAlert size={110} color="#ef4444" className="mb-4 mx-auto" />
                            <h2 className="mb-4" style={{fontSize: '2.6rem', fontWeight: 900, color: '#ef4444'}}>SAFETY ALERT</h2>
                            <p className="mb-5" style={{fontSize: '1.7rem', fontWeight: 700, lineHeight: 1.4}}>
                                {riskReason || "Something looks different about this payment."}
                                {isFamilyApprovalRequired && <><br/><br/>🛡️ <b>Family Approval Needed:</b> This is a large amount.</>}
                            </p>
                            <div className="d-flex flex-column gap-3">
                                <button className="btn-primary" style={{background: '#ef4444', padding: '24px', fontSize: '1.7rem', fontWeight: 800}} onClick={handleConfirmRiskModal}>
                                    I Understand, Continue
                                </button>
                                <button className="btn-text" style={{fontSize: '1.5rem', fontWeight: 600}} onClick={() => {setShowRiskAlert(false); setStep(2);}}>
                                    Cancel Payment Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Senior Mode: Payment Timer Overlay */}
            {showCooldown && (
                <div className="cooldown-overlay" style={{background: 'rgba(0,0,0,0.95)', position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                    <ShieldAlert size={90} color="#f59e0b" className="mb-4" />
                    <div style={{fontSize: '7rem', fontWeight: 900, color: '#f59e0b'}}>{cooldownTime}</div>
                    <div style={{fontSize: '1.8rem', color: 'white', margin: '20px 40px', fontWeight: 600}}>
                        Payment will process automatically.<br/>
                        Tap BELOW to stop it if you changed your mind.
                    </div>
                    <button className="btn-primary" style={{background: '#ef4444', height: '110px', width: '320px', fontSize: '2.5rem', borderRadius: '60px', marginTop: '40px'}} 
                        onClick={() => {if (cooldownInterval) clearInterval(cooldownInterval); setShowCooldown(false); setIsProcessing(false); alert("Payment Stopped Automatically.");}}>
                       CANCEL NOW
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default Transfer;
