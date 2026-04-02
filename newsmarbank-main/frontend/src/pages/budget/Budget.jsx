import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Target, ShieldCheck } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import "../../styles/budget.css";
import { useTranslation } from "react-i18next";

const Budget = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const isSenior = theme === 'senior';

    const budgets = [
        { id: 1, category: "shoppingCat", spent: 12500, limit: 15000, color: "#f472b6" },
        { id: 2, category: "foodDiningCat", spent: 8400, limit: 10000, color: "#fb923c" },
        { id: 3, category: "transportCat", spent: 4200, limit: 5000, color: "#4ade80" },
        { id: 4, category: "entertainmentCat", spent: 3000, limit: 3000, color: "#c084fc" }
    ];

    const generateSavingsTip = () => {
        return "You're spending 80% on Shopping. Reduce Zara visits to save ₹2,500 this month!";
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`budget-container ${isSenior ? 'senior-mode-ui' : ''}`}
        >
            <h2 className="page-title">{isSenior ? "My Savings & Budget" : t("wealthBudget")}</h2>

            {/* AI Insights Card - Finetuned for Seniors */}
            <div className={`ai-insight-card glass-card ${isSenior ? 'senior-insight-card' : ''}`}>
                <div className="insight-header">
                    {isSenior ? <ShieldCheck className="text-success" size={32} /> : <Sparkles className="text-yellow" size={20} />}
                    <h4 style={{fontSize: isSenior ? '1.8rem' : '1.1rem'}}>{isSenior ? "You are Saving Well" : t("aiInsight")}</h4>
                </div>
                <p className="insight-text" style={{fontSize: isSenior ? '1.4rem' : '1rem'}}>
                    {isSenior ? "Your 'Savings Jar' has grown by ₹420 this week from automatic round-ups." : generateSavingsTip()}
                </p>
                <div className="insight-footer">
                    <TrendingUp size={isSenior ? 24 : 16} />
                    <span style={{fontSize: isSenior ? '1.2rem' : '0.9rem'}}>{isSenior ? "Total Jar Balance: ₹8,450" : t("onTrackSave")}</span>
                </div>
            </div>

            {/* Budget Progress - Simplified for Seniors */}
            {!isSenior ? (
                <>
                    <h3 className="section-title">{t("monthlyBudgets")}</h3>
                    <div className="budget-list">
                        {budgets.map(b => {
                            const percent = (b.spent / b.limit) * 100;
                            const isWarning = percent > 85;
                            const isExceeded = percent >= 100;

                            return (
                                <div key={b.id} className="budget-item glass-card">
                                    <div className="budget-info">
                                        <div className="budget-cat">
                                            <span className="dot" style={{ backgroundColor: b.color }}></span>
                                            {t(b.category)}
                                        </div>
                                        <div className="budget-amounts">
                                            ₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}
                                        </div>
                                    </div>
                                    
                                    <div className="progress-bg">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(percent, 100)}%` }}
                                            className={`progress-fill ${isExceeded ? 'danger' : isWarning ? 'warning' : ''}`}
                                            style={{ backgroundColor: (!isWarning && !isExceeded) ? b.color : undefined }}
                                        />
                                    </div>

                                    {isWarning && !isExceeded && (
                                        <div className="budget-alert warning">
                                            <AlertTriangle size={14} /> {t("nearLimit")}
                                        </div>
                                    )}
                                    {isExceeded && (
                                        <div className="budget-alert danger">
                                            <AlertTriangle size={14} /> {t("budgetExceeded")}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="senior-auto-message glass-card p-5 mt-4 text-center">
                    <AlertTriangle size={48} color="#f59e0b" className="mb-3 mx-auto" />
                    <h3>Automated Protection</h3>
                    <p className="text-muted mt-3" style={{fontSize: '1.2rem'}}>
                        Your budgets are currently managed by the Smart Safety AI to prevent overspending. 
                        You will receive an alert if any payment exceeds your safe daily limit.
                    </p>
                </div>
            )}

            {/* Goals - Finetuned for Seniors */}
            <h3 className="section-title mt-4">{isSenior ? "My Savings Goal" : t("savingsGoals")}</h3>
            <div className={`goal-card glass-card ${isSenior ? 'senior-goal-card' : ''}`}>
                <div className="goal-icon">
                    <Target size={isSenior ? 40 : 24} />
                </div>
                <div className="goal-details">
                    <h4 style={{fontSize: isSenior ? '1.8rem' : '1.1rem'}}>{t("emergencyFund")}</h4>
                    <p style={{fontSize: isSenior ? '1.4rem' : '1rem'}}>₹1,50,000 / ₹5,00,000</p>
                    <div className={`progress-bg mt-2 ${isSenior ? 'large-p-bg' : ''}`}>
                        <div className="progress-fill" style={{ width: '30%', backgroundColor: '#6366f1' }}></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Budget;

