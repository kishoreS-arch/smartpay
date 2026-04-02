import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, CheckCircle, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

const Notifications = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isSenior = theme === 'senior';

    const notifs = [
        { id: 1, title: "Payment Successful", desc: "Your transfer of ₹5,000 to Priya was successful.", time: "10 mins ago", type: "success" },
        { id: 2, title: "Bill Reminder", desc: "Electricity bill of ₹850 is due tomorrow.", time: "2 hours ago", type: "warning" },
        { id: 3, title: "Security Alert", desc: "New login detected from Chrome on Windows.", time: "1 day ago", type: "danger" }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`page-container ${isSenior ? 'senior-mode-ui' : ''}`}>
            <div className="page-header-row p-4">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={isSenior ? 32 : 24} />
                </button>
                <h2 className="page-title mb-0">Notifications</h2>
            </div>

            <div className="p-4 pt-1">
                {notifs.map((n) => (
                    <div key={n.id} className="glass-card mb-3 p-4 d-flex gap-3 align-items-center">
                        <div className="avatar-circle" style={{
                            background: n.type === 'success' ? '#10b98122' : n.type === 'warning' ? '#f59e0b22' : '#ef444422',
                            color: n.type === 'success' ? '#10b981' : n.type === 'warning' ? '#f59e0b' : '#ef4444'
                        }}>
                            {n.type === 'success' ? <CheckCircle size={24} /> : n.type === 'warning' ? <Bell size={24} /> : <ShieldAlert size={24} />}
                        </div>
                        <div style={{flex: 1}}>
                            <div className="fw-bold fs-6">{n.title}</div>
                            <div className="text-muted" style={{fontSize: '0.85rem', marginBottom: '4px'}}>{n.desc}</div>
                            <div className="text-muted" style={{fontSize: '0.75rem', fontWeight: 600}}>{n.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Notifications;
