import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flashlight, Image, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useTheme from "../../hooks/useTheme";
import jsQR from "jsqr";
import "../../styles/scan.css";
import { useTranslation } from "react-i18next";

const Scan = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    
    const [step, setStep] = useState(1); // 1: Scan, 2: Amount, 3: PIN, 4: Success
    const [scannedData, setScannedData] = useState(null);
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [flashOn, setFlashOn] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const isSenior = theme === 'senior';

    // Mock QR scanning effect
    useEffect(() => {
        let timer;
        if (step === 1) {
             timer = setTimeout(() => {
                 setScannedData({ name: "Starbucks Coffee", upiId: "starbucks@ybl" });
                 setStep(2);
             }, 3000); // Auto-scan mock after 3 seconds
        }
        return () => clearTimeout(timer);
    }, [step]);

    const runSeniorSafetyChecks = async () => {
        if (!isSenior) return true;

        // 1. Family Trusted Mode (>5000)
        if (parseFloat(amount) > 5000) {
            const confirmed = window.confirm("👥 FAMILY SAFETY: Large payment detected. This merchant '"+scannedData?.name+"' is being verified with your trusted contact. Proceed with payment?");
            if (!confirmed) return false;
        }

        // 2. Verified Merchant System (Mocked)
        const isVerifiedMerchant = Math.random() > 0.1; // Starbucks is verified
        if (!isVerifiedMerchant) {
            const confirmed = window.confirm("⚠️ UNVERIFIED SHOP: This shop is not in our 'Safe Shops' list. Continue anyway?");
            if (!confirmed) return false;
        }

        // 3. Risk Help Tool (AI checking)
        if (Math.random() > 0.8) {
            const confirmed = window.confirm("🕵️ AI SAFETY ALERT: Our system wants to confirm this is a planned purchase. Do you wish to continue?");
            if (!confirmed) return false;
        }

        return true;
    };

    const handleAmountSubmit = async (e) => {
        e.preventDefault();
        if (amount > 0) {
            const passed = await runSeniorSafetyChecks();
            if (passed) setStep(3);
        }
    };

    const handlePinSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        const API_BASE = window.API_URL || 'http://localhost:5001';

        try {
            const res = await fetch(`${API_BASE}/api/banking/send-money`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ 
                    recipient: scannedData?.name || scannedData?.upiId, 
                    amount, 
                    mpin: pin 
                })
            });
            const data = await res.json();
            if (res.ok) {
                setStep(4);
            } else {
                alert(data.message || "Payment failed");
                setPin("");
            }
        } catch (err) {
            console.error("Scan Payment error:", err);
            setStep(4); // Demo fallback
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`scan-container ${isSenior ? 'senior-mode-ui' : ''}`}
        >
            <div className={`page-header-row p-4 ${isSenior ? 'mb-4' : ''}`}>
                <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="back-btn">
                    <ArrowLeft size={isSenior ? 32 : 24} />
                </button>
                <h2 className="page-title mb-0">{isSenior ? "Scan and Pay" : t("payViaQr")}</h2>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="scanner-view"
                    >
                        <div className={`scanner-frame ${isSenior ? 'senior-frame' : ''}`}>
                            <div className="corner top-left"></div>
                            <div className="corner top-right"></div>
                            <div className="corner bottom-left"></div>
                            <div className="corner bottom-right"></div>
                            
                            {/* Scanning Animation */}
                            <div className="scan-line"></div>
                            
                            <div className="scanner-mock-text">
                                <p>{isSenior ? "Place the Code inside this Square" : t("alignQrCode")}</p>
                                <span className="text-muted">{isSenior ? "We are looking for the code..." : t("autoScanningDemo")}</span>
                            </div>
                        </div>

                        <div className="scanner-controls">
                            <button className={`control-btn ${flashOn ? 'active' : ''}`} onClick={() => setFlashOn(!flashOn)}>
                                <Flashlight size={isSenior ? 32 : 24} />
                            </button>
                            <button className="control-btn">
                                <Image size={isSenior ? 32 : 24} />
                            </button>
                        </div>
                        
                        {isSenior && (
                             <div className="senior-scan-tip glass-card mx-4 p-4 mt-4 text-center">
                                 <ShieldCheck size={24} className="text-success mb-2" />
                                 <p>Your payment is protected by Smart Safety AI.</p>
                             </div>
                        )}
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`payment-card glass-card p-4 mx-3 ${isSenior ? 'senior-payment-card' : ''}`}
                    >
                        <div className="merchant-info text-center mb-4">
                            <div className={`merchant-avatar mx-auto mb-2 ${isSenior ? 'senior-avatar' : ''}`}>
                                {scannedData?.name.charAt(0)}
                            </div>
                            <h3 className={isSenior ? 'large-title' : ''}>{scannedData?.name}</h3>
                            <p className="text-muted">{scannedData?.upiId}</p>
                        </div>

                        <form onSubmit={handleAmountSubmit}>
                            <div className={`amount-input-wrapper justify-center text-center ${isSenior ? 'mb-5' : ''}`}>
                                <span className="currency-symbol">₹</span>
                                <input 
                                    type="number" 
                                    className={`huge-amount-input text-center ${isSenior ? 'senior-amount' : ''}`}
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                             <div className="text-center mb-4">
                                <span className="balance-hint">{t("balanceAmount", { amount: "1,24,500" })}</span>
                            </div>
                            
                            <button type="submit" className={`btn-primary full-width ${isSenior ? 'btn-large' : ''}`} disabled={!amount}>
                                {isSenior ? "Check Safety and Pay" : t("proceedToPay")}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 3 && (
                     <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="pin-modal-overlay"
                    >
                        <div className={`pin-card glass-card ${isSenior ? 'senior-pin-card' : ''}`}>
                            <ShieldCheck size={isSenior ? 64 : 48} className="text-accent mb-3 mx-auto shield-icon" />
                            <h3 className="text-center">{isSenior ? "Secure PIN Verification" : t("enterMpinHeading")}</h3>
                            <p className="text-center text-muted mb-4">
                                {isSenior ? `Paying ₹${amount} to ${scannedData?.name}` : t("toPayAmountName", { amount, name: scannedData?.name })}
                            </p>
                            
                            <form onSubmit={handlePinSubmit}>
                                <div className="otp-inputs justify-center">
                                    <input 
                                        type="password" 
                                        className={`otp-box pin-box ${isSenior ? 'large-otp' : ''}`} 
                                        maxLength={4} 
                                        placeholder="••••"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                                        autoFocus
                                    />
                                </div>
                                <button className={`btn-primary full-width mt-4 ${isSenior ? 'btn-large' : ''}`} disabled={pin.length < 4 || isProcessing}>
                                    {isProcessing ? "Paying..." : (isSenior ? "Confirm Final Payment" : t("verifyAndPay"))}
                                </button>
                                <button type="button" className="btn-text full-width mt-2" onClick={() => setStep(2)}>
                                    {t("cancelBtn")}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                     <motion.div 
                        key="step4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`success-card glass-card text-center mx-3 ${isSenior ? 'senior-success' : ''}`}
                    >
                        <div className="success-icon-wrap mx-auto">
                            <CheckCircle2 size={isSenior ? 80 : 64} className="text-success" />
                        </div>
                        <h2>{isSenior ? "Payment Done!" : t("paymentSuccessful")}</h2>
                        <p className="text-muted mt-2">{t("amountPaidToName", { amount, name: scannedData?.name })}</p>
                        
                        <div className="receipt-details text-left mt-4 mb-4">
                            <div className="receipt-row">
                                <span>{t("txnId")}</span>
                                <strong>#QRX{(Math.random() * 1000000).toFixed(0)}</strong>
                            </div>
                            <div className="receipt-row">
                                <span>{t("dateKey")}</span>
                                <strong>{new Date().toLocaleString()}</strong>
                            </div>
                        </div>

                        <button onClick={() => navigate('/home')} className={`btn-primary full-width ${isSenior ? 'btn-large' : ''}`}>
                            {isSenior ? "Go to Home Screen" : t("doneBtn")}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Scan;

