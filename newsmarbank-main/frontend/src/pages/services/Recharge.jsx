import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Smartphone, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

const Recharge = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isSenior = theme === 'senior';
    const [phone, setPhone] = useState("");

    const operators = [
        { name: "Jio", color: "#1a56db" },
        { name: "Airtel", color: "#ef4444" },
        { name: "Vi", color: "#f59e0b" },
        { name: "BSNL", color: "#0ea5e9" }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`page-container ${isSenior ? 'senior-mode-ui' : ''}`}>
            <div className="page-header-row p-4">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={isSenior ? 32 : 24} />
                </button>
                <h2 className="page-title mb-0">{t("recharge", "Mobile Recharge")}</h2>
            </div>

            <div className="p-4 pt-1">
                <div className="glass-card p-4 mb-4">
                    <div className="amount-input-wrapper mb-2" style={{border: '1px solid var(--glass-border)'}}>
                        <Smartphone className="input-icon" size={24} style={{marginLeft: '15px'}} />
                        <input 
                            type="tel" 
                            className="bg-transparent text-white border-0 w-100 p-3" 
                            placeholder="Enter Mobile Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                            style={{fontSize: '1.2rem', outline: 'none'}}
                        />
                    </div>
                    {phone.length === 10 && (
                        <motion.button 
                            initial={{opacity: 0}} animate={{opacity: 1}}
                            className="btn-primary full-width mt-3 py-3"
                            onClick={() => alert("Recharge successful!")}
                        >
                            Continue
                        </motion.button>
                    )}
                </div>

                <h3 className="section-title mb-3">Select Operator</h3>
                <div className="operator-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                    {operators.map((op, i) => (
                        <div key={i} className="glass-card p-4 text-center" style={{cursor: 'pointer'}} onClick={() => alert(`Selected ${op.name}`)}>
                            <div className="mx-auto" style={{width: '50px', height: '50px', borderRadius: '50%', background: op.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'}}>
                                <span className="text-white fw-bold">{op.name[0]}</span>
                            </div>
                            <div className="fw-bold">{op.name}</div>
                        </div>
                    ))}
                </div>

                <h3 className="section-title mt-4 mb-3">Recent Recharges</h3>
                <div className="glass-card p-0 overflow-hidden">
                    <div className="p-3 border-bottom d-flex align-items-center justify-content-between" style={{borderColor: 'var(--glass-border) !important', cursor: 'pointer'}}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="operator-logo" style={{width: '40px', height: '40px', borderRadius: '50%', background: '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <span className="text-white fw-bold">J</span>
                            </div>
                            <div>
                                <div className="fw-bold">9876543210</div>
                                <div className="text-muted" style={{fontSize: '0.8rem'}}>Jio Prepaid • Last recharged 12 Mar</div>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-muted" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Recharge;
