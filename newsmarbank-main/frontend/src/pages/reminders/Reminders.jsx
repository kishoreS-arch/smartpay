import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import "../../styles/reminders.css";
import { useTranslation } from "react-i18next";

const Reminders = () => {
    const { t } = useTranslation();
    const [reminders, setReminders] = useState([
        { id: 1, title: "Electricity Bill", amount: 1250, dueDate: "Today", status: "overdue", type: "bill" },
        { id: 2, title: "Netflix Subscription", amount: 649, dueDate: "Tomorrow", status: "due-soon", type: "subscription" },
        { id: 3, title: "Home Rent", amount: 15000, dueDate: "5th April", status: "upcoming", type: "rent" },
        { id: 4, title: "Car EMI", amount: 8500, dueDate: "10th April", status: "upcoming", type: "loan" }
    ]);

    const markAsPaid = (id) => {
        setReminders(reminders.filter(r => r.id !== id));
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="reminders-container"
        >
            <h2 className="page-title">{t("billReminders")}</h2>

            {/* Notification Banner */}
            <div className="alert-banner error glass-card">
                <AlertCircle size={20} />
                <div className="alert-content">
                    <h4>{t("overduePaymentTitle")}</h4>
                    <p>{t("overduePaymentDesc")}</p>
                </div>
            </div>

            <div className="reminders-list">
                {reminders.map(reminder => (
                    <div key={reminder.id} className={`reminder-card glass-card ${reminder.status}`}>
                        <div className="reminder-icon">
                            <Calendar size={24} />
                        </div>
                        <div className="reminder-info">
                            <h4>{reminder.title}</h4>
                            <div className="reminder-meta">
                                <span className={`status-badge ${reminder.status}`}>
                                    {reminder.dueDate}
                                </span>
                                <span className="reminder-amount">₹{reminder.amount.toLocaleString()}</span>
                            </div>
                        </div>
                        <button 
                            className="pay-btn"
                            onClick={() => markAsPaid(reminder.id)}
                        >
                            {t("payBtn")}
                        </button>
                    </div>
                ))}

                {reminders.length === 0 && (
                    <div className="empty-state">
                        <CheckCircle2 size={48} className="text-success" />
                        <h3>{t("allCaughtUp")}</h3>
                        <p>{t("noPendingBills")}</p>
                    </div>
                )}
            </div>
            
            <button className="btn-primary full-width mt-4">
                <Bell size={18} style={{marginRight: '8px'}} /> {t("addNewReminder")}
            </button>
        </motion.div>
    );
};

export default Reminders;
