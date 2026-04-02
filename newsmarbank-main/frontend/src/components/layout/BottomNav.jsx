import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Send, QrCode, Bookmark, User, Clock, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMode } from "../../context/ModeContext";
import { useVoice } from "../../context/VoiceContext";
import AccessibleButton from "../shared/AccessibleButton";
import { useNavigate } from "react-router-dom";
import "../../styles/bottom-nav.css";

const BottomNav = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const { currentMode: theme } = useMode();
    const { setVoiceActive } = useVoice();
    const navigate = useNavigate();
    
    // Hide nav on login page (path = '/')
    if (location.pathname === "/") return null;

    const isSenior = theme === 'senior';
    const isVisual = theme === 'visual' || theme === 'visual-impaired';
    const isNormal = theme === 'normal';

    if (isSenior) {
        return (
            <nav className="bottom-nav senior-nav p-2" style={{height: '90px'}}>
                <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`} style={{flex: 1, flexDirection: 'column', gap: '5px'}}>
                    <Home size={34} />
                    <span style={{fontSize: '1rem', fontWeight: 700}}>Home</span>
                </Link>
                <Link to="/security" className={`nav-item ${location.pathname === '/security' ? 'active' : ''}`} style={{flex: 1, flexDirection: 'column', gap: '5px'}}>
                    <ShieldCheck size={34} />
                    <span style={{fontSize: '1rem', fontWeight: 700}}>Safety</span>
                </Link>
            </nav>
        );
    }

    if (isVisual) {
        return (
            <nav className="bottom-nav bg-dark border-top visual-nav" style={{height: '100px', borderTop: '5px solid yellow !important'}}>
                <AccessibleButton 
                    id="nav-home"
                    className={`nav-item text-yellow ${location.pathname === '/home' ? 'active' : ''}`} 
                    style={{flex: 1}} 
                    onClick={() => navigate("/home")}
                    label="HOME"
                    ariaLabel="Go to Home Screen"
                >
                    <Home size={40} color="yellow" />
                    <span style={{color: 'yellow', fontSize: '1.2rem'}}>HOME</span>
                </AccessibleButton>
                
                <AccessibleButton 
                    id="nav-speak"
                    className={`nav-item text-yellow`} 
                    style={{flex: 1, cursor: 'pointer'}} 
                    onClick={() => setVoiceActive(true)}
                    label="SPEAK"
                    ariaLabel="Open Voice Commands"
                >
                    <User size={40} color="yellow" />
                    <span style={{color: 'yellow', fontSize: '1.2rem'}}>SPEAK</span>
                </AccessibleButton>

                <AccessibleButton 
                    id="nav-profile"
                    className={`nav-item text-yellow ${location.pathname === '/security' ? 'active' : ''}`} 
                    style={{flex: 1}} 
                    onClick={() => navigate("/security")}
                    label="PROFILE"
                    ariaLabel="Go to Profile"
                >
                    <User size={40} color="yellow" />
                    <span style={{color: 'yellow', fontSize: '1.2rem'}}>PROFILE</span>
                </AccessibleButton>
            </nav>
        );
    }

    return (
        <nav className="bottom-nav glass-card py-2">
            <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
                <Home size={22} />
                <span>Home</span>
            </Link>
            <Link to="/transfer" className={`nav-item ${location.pathname === '/transfer' ? 'active' : ''}`}>
                <Send size={22} />
                <span>Send</span>
            </Link>
            <Link to="/scan" className="nav-item scan-btn text-white" style={{background: 'var(--primary)', borderRadius: '15px', padding: '10px 15px', transform: 'translateY(-10px)', boxShadow: '0 5px 15px rgba(0,0,0,0.2)'}}>
                <QrCode size={26} />
            </Link>
            <Link to="/transactions" className={`nav-item ${location.pathname === '/transactions' ? 'active' : ''}`}>
                <Clock size={22} />
                <span>History</span>
            </Link>
            <Link to="/security" className={`nav-item ${location.pathname === '/security' ? 'active' : ''}`}>
                <User size={22} />
                <span>Profile</span>
            </Link>
        </nav>
    );
};

export default BottomNav;
