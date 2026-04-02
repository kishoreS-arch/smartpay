import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { 
    Search, Filter, ShoppingBag, Utensils, 
    Home, CreditCard, Car, Zap, ArrowUpRight, ArrowDownLeft, ShieldCheck 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import "../../styles/transactions.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Transactions = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [filter, setFilter] = useState("All");

    const isSenior = theme === 'senior';

    const categories = {
        shoppingCat: { icon: <ShoppingBag />, color: "#f472b6" },
        foodCat: { icon: <Utensils />, color: "#fb923c" },
        rentCat: { icon: <Home />, color: "#60a5fa" },
        billsCat: { icon: <Zap />, color: "#facc15" },
        transportCat: { icon: <Car />, color: "#4ade80" },
        incomeCat: { icon: <ArrowDownLeft />, color: "#2dd4bf" }
    };

    const transactionData = [
        { id: 1, name: "Amazon Shopping", category: "shoppingCat", amount: -2500, date: "2 Hours ago" },
        { id: 2, name: "Swiggy Food", category: "foodCat", amount: -450, date: "Today, 1:00 PM" },
        { id: 3, name: "Monthly Salary", category: "incomeCat", amount: 75000, date: "Yesterday" },
        { id: 4, name: "Airtel Internet Bill", category: "billsCat", amount: -999, date: "28 Mar" },
        { id: 5, name: "Uber Taxi", category: "transportCat", amount: -320, date: "27 Mar" },
        { id: 6, name: "Zara Clothing", category: "shoppingCat", amount: -4200, date: "26 Mar" },
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [
            {
                label: t("expenses"),
                data: [45000, 52000, 38000, 42000],
                backgroundColor: '#6366f1',
                borderRadius: 8,
            }
        ],
    };

    const filteredTx = filter === "All" ? transactionData : transactionData.filter(t => t.category === filter);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`tx-page-container ${isSenior ? 'senior-mode-ui' : ''}`}
        >
            <div className="tx-header mb-4">
                <h2 className="page-title">{isSenior ? "Payment History" : t("activity")}</h2>
                {isSenior && (
                    <div className="senior-safe-indicator">
                        <ShieldCheck size={20} color="#10b981" />
                        <span>Protected Activity Log</span>
                    </div>
                )}
            </div>

            {/* Chart Section - Hidden in Senior Mode */}
            {!isSenior && (
                <div className="chart-card glass-card">
                    <div className="chart-header">
                        <h4>{t("spendingAnalysis")}</h4>
                        <span className="total-outflow">-₹ 42,000 {t("thisMonth")}</span>
                    </div>
                    <div className="chart-wrapper">
                        <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
            )}

            {/* Filters - Simplified for Seniors */}
            <div className="filter-scroll">
                {(isSenior ? ["All", "incomeCat", "shoppingCat"] : ["All", ...Object.keys(categories)]).map(cat => (
                    <button 
                        key={cat}
                        className={`filter-chip ${filter === cat ? 'active' : ''} ${isSenior ? 'senior-chip' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat === "All" ? "All Payments" : (cat === "incomeCat" ? "Received" : (cat === "shoppingCat" ? "Spent" : t(cat)))}
                    </button>
                ))}
            </div>

            {/* Tx List */}
            <div className={`tx-list-full ${isSenior ? 'senior-list' : ''}`}>
                {filteredTx.map(tx => (
                    <motion.div layout key={tx.id} className={`tx-row glass-card ${isSenior ? 'senior-tx-row' : ''}`}>
                        <div className="tx-icon-large" style={{ color: categories[tx.category].color, background: `${categories[tx.category].color}22` }}>
                            {categories[tx.category].icon}
                        </div>
                        <div className="tx-main-info">
                            <div className="tx-name-text">{tx.name}</div>
                            <div className="tx-cat-text">{isSenior ? tx.date : `${t(tx.category)} • ${tx.date}`}</div>
                        </div>
                        <div className={`tx-val-text ${tx.amount > 0 ? 'pos' : 'neg'} ${isSenior ? 'large-val' : ''}`}>
                            {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {isSenior && (
                <div className="senior-info-footer glass-card mt-5 p-4 text-center">
                    <p className="text-muted" style={{fontSize: '1.2rem'}}>Showing your last 30 days of safe payments.</p>
                </div>
            )}
        </motion.div>
    );
};

export default Transactions;

