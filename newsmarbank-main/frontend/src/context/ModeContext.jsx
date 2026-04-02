import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
    const { user } = useAuth();
    const [currentMode, setCurrentMode] = useState(localStorage.getItem('smartpay-mode') || 'normal');

    const switchMode = (mode) => {
        setCurrentMode(mode);
        localStorage.setItem('smartpay-mode', mode);

        // Apply visual classes to body
        document.body.className = '';
        if (mode !== 'normal') {
            document.body.classList.add(`${mode}-mode`);
        }

        // AUTO-ENABLE SAFETY FOR SENIOR MODE
        if (mode === 'senior' && user?.token) {
            enableSeniorSafety(user.token);
        }
    };

    const enableSeniorSafety = async (token) => {
        const API_BASE = window.API_URL || 'http://localhost:5001';
        try {
            await fetch(`${API_BASE}/api/banking/settings`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    settings: {
                        isFamilyModeEnabled: true,
                        isGeoFenceEnabled: true,
                        isRoundUpEnabled: true,
                        isVerifiedOnlyEnabled: true
                    } 
                }),
            });
            console.log("Senior Safety Automations Enabled");
        } catch (err) {
            console.error("Failed to enable safety", err);
        }
    };

    useEffect(() => {
        // Initial application of classes
        document.body.className = '';
        if (currentMode !== 'normal') {
            document.body.classList.add(`${currentMode}-mode`);
        }
    }, [currentMode]);

    return (
        <ModeContext.Provider value={{ currentMode, switchMode }}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = () => useContext(ModeContext);
