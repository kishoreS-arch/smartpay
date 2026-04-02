import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lightbulb, Droplets, Flame, Tv, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

const Bills = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isSenior = theme === 'senior';

    const categories = [
        { icon: <Lightbulb size={24} />, name: t("electricity", "Electricity"), color: "#f59e0b" },
        { icon: <Droplets size={24} />, name: t("water", "Water"), color: "#3b82f6" },
        { icon: <Flame size={24} />, name: t("gas", "Piped Gas"), color: "#ef4444" },
        { icon: <Tv size={24} />, name: t("dth", "DTH / Cable"), color: "#8b5cf6" },
        { icon: <Wifi size={24} />, name: t("broadband", "Broadband"), color: "#10b981" }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`page-container ${isSenior ? 'senior-mode-ui' : ''}`}>
            <div className="page-header-row p-4">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={isSenior ? 32 : 24} />
                </button>
                <h2 className="page-title mb-0">{t("payBills", "Pay Bills")}</h2>
            </div>

            <div className="p-4 pt-1">
                <div className="glass-card mb-4">
                    <h3 className="section-title mb-3">Due Bills</h3>
                    <div className="d-flex align-items-center justify-content-between">
                         <div className="d-flex align-items-center gap-3">
                             <div className="avatar-circle" style={{background: '#f59e0b22', color: '#f59e0b'}}><Lightbulb size={24} /></div>
                             <div>
                                 <div className="fw-bold">TNEB Electricity</div>
                                 <div className="text-muted" style={{fontSize: '0.85rem'}}>Due by: 25 Mar</div>
                             </div>
                         </div>
                         <div className="text-end">
                             <div className="fw-bold text-danger">₹850</div>
                             <button className="btn-primary px-3 py-1 mt-1" style={{fontSize: '0.8rem', borderRadius: '12px'}} onClick={() => alert("Paying Bill")}>Pay</button>
                         </div>
                    </div>
                </div>

                <h3 className="section-title mb-3">Categories</h3>
                <div className="row g-3">
                    {categories.map((cat, i) => (
                        <div className="col-6" key={i}>
                            <div className="glass-card p-4 text-center h-100" style={{cursor: 'pointer'}} onClick={() => alert(`Selected ${cat.name}`)}>
                                <div className="mx-auto" style={{width: '50px', height: '50px', borderRadius: '50%', background: `${cat.color}22`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'}}>
                                    {cat.icon}
                                </div>
                                <div className="fw-bold" style={{fontSize: '0.9rem'}}>{cat.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Bills;
