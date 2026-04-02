import React from "react";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { TrendingUp, TrendingDown, Gem, Coins, ShieldCheck, Wallet } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useTheme from "../../hooks/useTheme";
import "../../styles/assets.css";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

const Assets = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const isSenior = theme === 'senior';

    const donutData = {
        labels: ["Savings", "Stocks", "Gold", "Fixed Deposit"],
        datasets: [{
            data: [45, 25, 15, 15],
            backgroundColor: ["#6366f1", "#10b981", "#f59e0b", "#f472b6"],
            borderWidth: 0,
        }]
    };

    const donutOptions = {
        cutout: "72%",
        plugins: { legend: { display: false } },
        maintainAspectRatio: false
    };

    const assetItems = [
        { label: "savingsAccount", value: "₹ 1,24,500", change: "+2.1%", up: true, color: "#6366f1" },
        { label: "stocksMf", value: "₹ 68,000", change: "+8.4%", up: true, color: "#10b981" },
        { label: "goldHoldings", value: "₹ 41,250", change: "-0.3%", up: false, color: "#f59e0b" },
        { label: "fixedDeposit", value: "₹ 50,000", change: "+6.5%", up: true, color: "#f472b6" },
    ];

    const metalRates = [
        { name: "goldRate", rate: "₹ 6,450", change: "-₹ 20", up: false },
        { name: "silverRate", rate: "₹ 80.50", change: "+₹ 1.2", up: true },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`assets-container ${isSenior ? 'senior-mode-ui' : ''}`}
        >
            <h2 className="page-title">{isSenior ? "My Total Balance" : t("netWorthTitle")}</h2>

            {/* Donut Chart - Hidden/Simplified for Seniors */}
            {!isSenior ? (
                <div className="networth-card glass-card">
                    <div className="donut-wrapper">
                        <Doughnut data={donutData} options={donutOptions} />
                        <div className="donut-center">
                            <span className="donut-label">{t("totalLabel")}</span>
                            <span className="donut-value">₹2.83L</span>
                        </div>
                    </div>
                    <div className="legend-list">
                        {assetItems.map((a, i) => (
                            <div key={i} className="legend-item">
                                <div className="legend-dot" style={{ background: a.color }}></div>
                                <span className="legend-name">{t(a.label)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="senior-total-card glass-card p-5 text-center mb-4">
                    <Wallet size={48} className="text-accent mb-3 mx-auto" />
                    <h3 className="mb-2">Your Total Savings</h3>
                    <div className="huge-balance-text" style={{fontSize: '3.5rem', fontWeight: '800', color: 'var(--accent)'}}>
                        ₹ 2,83,750
                    </div>
                    <p className="text-muted mt-3" style={{fontSize: '1.2rem'}}>Protected by SmartPay Safety Vault</p>
                </div>
            )}

            {/* Asset Breakdown - Simplified for Seniors */}
            <h3 className="section-title mt-4">{isSenior ? "Where your money is" : t("assetBreakdown")}</h3>
            <div className="asset-list">
                {assetItems.map((a, i) => (
                    <div key={i} className={`asset-row glass-card ${isSenior ? 'senior-asset-row' : ''}`}>
                        <div className="asset-dot" style={{ background: a.color }}></div>
                        <div className="asset-info">
                            <div className="asset-label" style={{fontSize: isSenior ? '1.4rem' : '1rem'}}>{t(a.label)}</div>
                            <div className="asset-value" style={{fontSize: isSenior ? '1.6rem' : '1.1rem'}}>{a.value}</div>
                        </div>
                        {!isSenior && (
                            <div className={`asset-change ${a.up ? "up" : "down"}`}>
                                {a.up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {a.change}
                            </div>
                        )}
                        {isSenior && <ShieldCheck size={24} className="text-success" />}
                    </div>
                ))}
            </div>

            {/* Live Metal Rates - Hidden in Senior Mode for simplicity */}
            {!isSenior && (
                <>
                    <h3 className="section-title mt-4">{t("liveMetalRates")}</h3>
                    <div className="metal-grid">
                        {metalRates.map((m, i) => (
                            <div key={i} className="metal-card glass-card">
                                <div className="metal-icon">
                                    {i === 0 ? <Gem size={28} /> : <Coins size={28} />}
                                </div>
                                <div className="metal-name">{t(m.name)}</div>
                                <div className="metal-rate">{m.rate}</div>
                                <div className={`metal-change ${m.up ? "up" : "down"}`}>{m.change} {t("todayStr")}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {isSenior && (
                <div className="senior-auto-footer glass-card mt-5 p-4 text-center">
                    <ShieldCheck size={32} className="text-success mb-2 mx-auto" />
                    <p style={{fontSize: '1.2rem'}}>Your assets are monitored daily for security compliance.</p>
                </div>
            )}
        </motion.div>
    );
};

export default Assets;

