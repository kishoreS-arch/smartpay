import { useState, useCallback, useEffect, useRef } from 'react';
import { useMode } from '../context/ModeContext';

/**
 * Hook for Accessibility interactions in SmartPay.
 * Standardizes Speech, Vibration, and Double-tap logic for VI mode.
 */
export const useAccessibility = () => {
    const { currentMode } = useMode();
    const [tapStates, setTapStates] = useState({});
    const timeouts = useRef({});

    const isVisual = currentMode === 'visual' || currentMode === 'visual-impaired' || currentMode === 'visually-impaired';

    const speak = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85; // Slightly slower for clarity
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }, []);

    const vibrate = useCallback((pattern = 50) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore vibration errors
            }
        }
    }, []);

    const handleAccessibleClick = (id, label, action) => {
        if (!isVisual) {
            action();
            return;
        }

        if (tapStates[id]) {
            // SECOND TAP: Execute action
            vibrate([40, 40]); // Double vibration feedback
            setTapStates(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
            if (timeouts.current[id]) clearTimeout(timeouts.current[id]);
            
            action();
        } else {
            // FIRST TAP: Speak and highlight
            speak(label);
            vibrate(60);
            
            // Clear other active tap states to ensure only one is selected
            setTapStates({ [id]: true });
            
            // Reset after 3 seconds timeout
            if (timeouts.current[id]) clearTimeout(timeouts.current[id]);
            timeouts.current[id] = setTimeout(() => {
                setTapStates(prev => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
            }, 3000);
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup timeouts on unmount
            Object.values(timeouts.current).forEach(clearTimeout);
        };
    }, []);

    return {
        isVisual,
        speak,
        vibrate,
        handleAccessibleClick,
        tapStates
    };
};
