import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Smartphone, Key, ArrowRight, AlertCircle } from "lucide-react";
import { auth, googleProvider } from "../../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../../styles/login.css";

const Login = () => {
    const [step, setStep] = useState(1); // 1: Google/Start, 2: Phone, 3: OTP, 4: Set MPIN
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [mpin, setMpin] = useState("");
    const [confirmMpin, setConfirmMpin] = useState("");
    const [googleUser, setGoogleUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setGoogleUser(result.user);
            setStep(2);
        } catch (err) {
            console.error("Google login failed:", err);
            if (err.code === 'auth/operation-not-allowed') {
                setError("Google Sign-In is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method → Google.");
            } else if (err.code === 'auth/popup-blocked') {
                setError("Popup was blocked by your browser. Please allow popups for this site.");
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError("Sign-in cancelled. Please try again.");
            } else {
                setError(err.message || "Sign-in failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (phone.length === 10) setStep(3);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp.length === 4) setStep(4);
    };

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        if (mpin === confirmMpin && mpin.length === 4) {
            setLoading(true);
            setError("");
            const userData = {
                googleId: googleUser?.uid || "DEMO_" + Date.now(),
                email: googleUser?.email || `user_${phone}@smartpay.env`,
                displayName: googleUser?.displayName || "SmartPay User",
                phone,
                mpin,
            };

            try {
                // Send to backend
                const response = await fetch(`${API_URL}/api/auth/google-register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });
                
                const data = await response.json();
                if (response.ok) {
                    loginUser(data);
                    // Force navigation after short delay for better UX
                    setTimeout(() => navigate("/home"), 500);
                } else {
                    setError(data.message || "Final registration step failed. Please check your data.");
                }
            } catch (err) {
                console.error("Network error:", err);
                // For demo/emergency fallback if backend is offline or has issues
                loginUser(userData);
                navigate("/home");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-orb pink"></div>
            <div className="login-orb blue"></div>
            
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card login-card"
                    >
                        <div className="icon-badge">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="title">{t("security")}</h2>
                        <p className="subtitle">{t("chooseAccount")}</p>

                        {error && (
                            <div className="error-banner">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <button className="btn-google full-width" onClick={handleGoogleLogin} disabled={loading}>
                            {loading
                                ? <span>{t("connecting")}</span>
                                : <><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} />{t("signInGoogle")}</>
                            }
                        </button>

                        <div className="divider">{t("or")}</div>

                        <form onSubmit={handleSendOtp}>
                             <div className="input-group">
                                <span className="prefix">+91</span>
                                <input 
                                    type="tel" 
                                    placeholder={t("mobileNumber")} 
                                    maxLength={10} 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                />
                            </div>
                            <button className="btn-primary full-width" disabled={phone.length < 10}>
                                {t("continuePhone")}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card login-card"
                    >
                        <div className="icon-badge">
                            <Smartphone size={32} />
                        </div>
                        <h2 className="title">{t("almostThere")}</h2>
                        <p className="subtitle">{t("enterMobile", { name: googleUser?.displayName })}</p>
                        <form onSubmit={handleSendOtp}>
                             <div className="input-group">
                                <span className="prefix">+91</span>
                                <input 
                                    type="tel" 
                                    placeholder={t("mobileNumber")} 
                                    maxLength={10} 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    autoFocus
                                />
                            </div>
                            <button className="btn-primary full-width" disabled={phone.length < 10}>
                                {t("getOtp")} <ArrowRight size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card login-card"
                    >
                        <div className="icon-badge">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="title">{t("verification")}</h2>
                        <p className="subtitle">{t("sentTo", { phone })}</p>
                        
                        <form onSubmit={handleVerifyOtp}>
                            <div className="otp-inputs">
                                <input 
                                    type="text" 
                                    className="otp-box" 
                                    maxLength={4} 
                                    placeholder="0000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    autoFocus
                                />
                            </div>
                            <button className="btn-primary full-width" disabled={otp.length < 4}>
                                {t("verifyOtp")}
                            </button>
                            <p className="resend">{t("resendOtp")} <b>00:45</b></p>
                        </form>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div 
                        key="step4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card login-card"
                    >
                        <div className="icon-badge">
                            <Key size={32} />
                        </div>
                        <h2 className="title">{t("setMpin")}</h2>
                        <p className="subtitle">{t("secureAccount")}</p>
                        
                        {error && (
                            <div className="error-banner">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleCompleteRegistration}>
                             <div className="mpin-container">
                                <input 
                                    type="password" 
                                    className="otp-box small" 
                                    maxLength={4} 
                                    placeholder={t("setMpin")}
                                    value={mpin}
                                    onChange={(e) => setMpin(e.target.value.replace(/\D/g, ""))}
                                    autoFocus
                                />
                                <input 
                                    type="password" 
                                    className="otp-box small" 
                                    maxLength={4} 
                                    placeholder={t("confirmPin")}
                                    value={confirmMpin}
                                    onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, ""))}
                                />
                            </div>
                            {mpin.length === 4 && confirmMpin.length === 4 && mpin !== confirmMpin && (
                                <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center', marginBottom: '10px' }}>{t("pinsDoNotMatch")}</p>
                            )}
                            <button className="btn-primary full-width" disabled={loading || mpin.length < 4 || mpin !== confirmMpin}>
                                {loading ? t("saving") : t("completeSetup")}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
