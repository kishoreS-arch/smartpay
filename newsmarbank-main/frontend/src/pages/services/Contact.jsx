import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, MessageCircle, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

const Contact = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isSenior = theme === 'senior';

    const contacts = [
        { icon: <Phone size={24} />, title: "Call Support", desc: "1800-SMART-PAY", action: "tel:1800000000", color: "#10b981" },
        { icon: <MessageCircle size={24} />, title: "WhatsApp Support", desc: "Available 24x7", action: "#", color: "#25D366" },
        { icon: <Mail size={24} />, title: "Email Us", desc: "care@smartpay.in", action: "mailto:care@smartpay.in", color: "#3b82f6" },
        { icon: <HelpCircle size={24} />, title: "FAQs", desc: "Find quick answers", action: "#", color: "#f59e0b" }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`page-container ${isSenior ? 'senior-mode-ui' : ''}`}>
            <div className="page-header-row p-4">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={isSenior ? 32 : 24} />
                </button>
                <h2 className="page-title mb-0">{t("helpSupport", "Help & Support")}</h2>
            </div>

            <div className="p-4 pt-1">
                 <div className="glass-card mb-4 text-center p-5">
                      <div className="avatar-circle mx-auto mb-3" style={{width: 64, height: 64, background: 'var(--accent)', color: 'white'}}>
                          <Phone size={32} />
                      </div>
                      <h3>How can we help?</h3>
                      <p className="text-muted">We're here to assist you 24/7 with any issue related to SmartPay.</p>
                 </div>

                 <div className="row g-3">
                    {contacts.map((c, i) => (
                        <div className="col-6" key={i}>
                            <a href={c.action} style={{textDecoration: 'none', color: 'inherit'}}>
                                <div className="glass-card p-4 text-center h-100">
                                    <div className="mx-auto" style={{width: '50px', height: '50px', borderRadius: '50%', background: `${c.color}22`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'}}>
                                        {c.icon}
                                    </div>
                                    <div className="fw-bold" style={{fontSize: '0.9rem'}}>{c.title}</div>
                                    <div className="text-muted" style={{fontSize: '0.75rem'}}>{c.desc}</div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Contact;
