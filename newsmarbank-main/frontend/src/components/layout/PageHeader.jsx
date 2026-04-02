import React from "react";
import { useMode } from "../../context/ModeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Sun, Accessibility, Eye, Menu, ShieldCheck, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../styles/header.css";

const PageHeader = () => {
    const { currentMode: theme, switchMode } = useMode();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const isHome = location.pathname === '/home' || location.pathname === '/';

    const setNormal = () => switchMode('normal');
    const setSenior = () => switchMode('senior');
    const setVisual = () => switchMode('visual');

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <header className="page-header fixed-top glass-card">
            <div className="header-content container">
                <div className="logo-section">
                    {!isHome ? (
                        <button onClick={() => navigate(-1)} className="back-btn-header" style={{background: 'transparent', color: 'inherit', display: 'flex', alignItems: 'center', padding: '5px'}}>
                            <ArrowLeft size={28} />
                        </button>
                    ) : (
                        <div className="logo-icon">SP</div>
                    )}
                    <h1 className="logo-text" style={{marginLeft: isHome ? '0' : '10px'}}>SmartPay</h1>
                </div>

                <div className="mode-switcher-container">
                    <div className="mode-switcher">
                        <button 
                            onClick={setNormal} 
                            className={`mode-btn ${theme === 'normal' ? 'active' : ''}`}
                            title={t("normalMode", "Normal Mode")}
                        >
                            <Sun size={20} />
                        </button>
                        <button 
                            onClick={setSenior} 
                            className={`mode-btn ${theme === 'senior' ? 'active' : ''}`}
                            title={t("seniorMode", "Senior Mode")}
                        >
                            <Accessibility size={20} />
                        </button>
                        <button 
                            onClick={setVisual} 
                            className={`mode-btn ${theme === 'visual' ? 'active' : ''}`}
                            title={t("visualMode", "Visual Mode")}
                        >
                            <Eye size={20} />
                        </button>
                    </div>

                    <div className="language-switcher">
                        <select 
                            onChange={changeLanguage} 
                            value={i18n.language.split('-')[0]} // Handle potential 'en-US' etc
                            className="lang-select"
                        >
                            <option value="en">EN</option>
                            <option value="ta">TA</option>
                            <option value="hi">HI</option>
                            <option value="ml">ML</option>
                        </select>
                    </div>
                </div>

                <div className="profile-section">
                   <button className="profile-btn"><User size={22} /></button>
                </div>
            </div>
        </header>
    );
};

export default PageHeader;
