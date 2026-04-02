import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Building, CheckCircle2, ShieldCheck } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import "../../styles/deposit.css";
import { useTranslation } from "react-i18next";

const Deposit = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("card"); // 'card' or 'bank'
    const [isLoading, setIsLoading] = useState(false);

    const isSenior = theme === 'senior';
    const presetAmounts = isSenior ? [1000, 2000, 5000] : [500, 1000, 5000, 10000];

    const handleDeposit = (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) return;
        
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1500);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`deposit-container ${isSenior ? 'senior-mode-ui' : ''}`}
        >
            <div className={`page-header-row ${isSenior ? 'mb-4' : ''}`}>
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={isSenior ? 32 : 24} />
                </button>
                <h2 className="page-title mb-0">{isSenior ? "Add Money to Balance" : t("addMoney")}</h2>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`deposit-card glass-card ${isSenior ? 'senior-deposit-card' : ''}`}
                    >
                        <form onSubmit={handleDeposit}>
                            <div className={`amount-input-wrapper text-center ${isSenior ? 'mb-5' : ''}`}>
                                <h4 className="label-text mb-2" style={{fontSize: isSenior ? '1.5rem' : '1rem'}}>{isSenior ? "How much to add?" : ""}</h4>
                                <div className="d-flex align-items-center justify-content-center">
                                    <span className="currency-symbol" style={{fontSize: isSenior ? '3rem' : '2.5rem'}}>₹</span>
                                    <input 
                                        type="number" 
                                        className={`huge-amount-input ${isSenior ? 'senior-amount-input' : ''}`}
                                        placeholder="0"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className={`preset-amounts ${isSenior ? 'senior-presets' : ''}`}>
                                {presetAmounts.map(preset => (
                                    <button 
                                        type="button" 
                                        key={preset}
                                        className={`preset-btn ${isSenior ? 'senior-preset-btn' : ''}`}
                                        onClick={() => setAmount(preset)}
                                    >
                                        +₹{preset}
                                    </button>
                                ))}
                            </div>

                            <div className="payment-methods mt-4">
                                <h4 className="mb-3 text-muted" style={{ fontSize: isSenior ? '1.2rem' : '0.9rem' }}>{isSenior ? "Pay using:" : t("selectPaymentMethod")}</h4>
                                <div className={`method-toggle ${isSenior ? 'senior-toggle' : ''}`}>
                                    <button 
                                        type="button" 
                                        className={`method-btn ${method === 'card' ? 'active' : ''} ${isSenior ? 'senior-m-btn' : ''}`}
                                        onClick={() => setMethod('card')}
                                    >
                                        <CreditCard size={isSenior ? 28 : 20} /> {isSenior ? "Bank Card" : t("debitCard")}
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`method-btn ${method === 'bank' ? 'active' : ''} ${isSenior ? 'senior-m-btn' : ''}`}
                                        onClick={() => setMethod('bank')}
                                    >
                                        <Building size={isSenior ? 28 : 20} /> {isSenior ? "Net Banking" : t("netBanking")}
                                    </button>
                                </div>
                            </div>
                            
                            {isSenior && (
                                <div className="senior-safe-badge mt-4">
                                    <ShieldCheck size={24} className="text-success" />
                                    <span>Safe & Secure Transaction</span>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={`btn-primary full-width mt-4 ${isSenior ? 'btn-large' : ''}`} 
                                disabled={!amount || isLoading}
                            >
                                {isLoading ? (isSenior ? "Please Wait..." : t("processingStr")) : (isSenior ? "Finish & Add Money" : t("addAmountBtn", { amount: amount || '0' }))}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`success-card glass-card text-center ${isSenior ? 'senior-success' : ''}`}
                    >
                        <div className="success-icon-wrap mx-auto">
                            <CheckCircle2 size={isSenior ? 80 : 64} className="text-success" />
                        </div>
                        <h2>{isSenior ? "Money Added!" : t("moneyAdded")}</h2>
                        <p className="text-muted mt-2">{isSenior ? `${amount} added to your account.` : t("amountAddedViaMethod", { amount, method: method === 'card' ? t('debitCard') : t('netBanking') })}</p>
                        
                        <div className="receipt-details text-left mt-4 mb-4">
                            <div className="receipt-row">
                                <span>{t("newBalance")}</span>
                                <strong style={{fontSize: isSenior ? '1.5rem' : '1.1rem'}}>₹{(124500 + Number(amount)).toLocaleString()}</strong>
                            </div>
                        </div>

                        <button onClick={() => navigate('/home')} className={`btn-primary full-width ${isSenior ? 'btn-large' : ''}`}>
                            {isSenior ? "Done" : t("doneBtn")}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Deposit;

