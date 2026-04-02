import React, { useEffect } from 'react';
import useTheme from '../../hooks/useTheme';

const VoiceAssist = () => {
    const { theme } = useTheme();

    useEffect(() => {
        // Only active in visual mode
        if (theme !== 'visual') return;

        const handleInteraction = (e) => {
            const target = e.target;
            
            // Try to find readable text
            let textToSpeak = "";
            
            if (target.tagName === 'BUTTON' || target.closest('button')) {
                const btn = target.closest('button');
                textToSpeak = btn.getAttribute('aria-label') || btn.innerText || "Button";
            } else if (target.tagName === 'A' || target.closest('a')) {
                const link = target.closest('a');
                textToSpeak = link.getAttribute('aria-label') || link.innerText || "Link";
            } else if (target.tagName === 'INPUT') {
                textToSpeak = target.placeholder || target.name || "Input field";
            } else if (target.innerText && target.children.length === 0) {
                 textToSpeak = target.innerText;
            }

            if (textToSpeak) {
                speak(textToSpeak);
            }
        };

        const speak = (text) => {
             // Cancel any ongoing speech
             window.speechSynthesis.cancel();
             
             const utterance = new SpeechSynthesisUtterance(text);
             
             // Try to find Indian English voice
             const voices = window.speechSynthesis.getVoices();
             const indianVoice = voices.find(v => v.lang === 'en-IN');
             
             if (indianVoice) {
                 utterance.voice = indianVoice;
             }
             
             utterance.rate = 0.9; // Slightly slower for clarity
             window.speechSynthesis.speak(utterance);
        };
        
        // Announce mode activation
        speak("Visual Accessibility Mode Activated. Tap anywhere to read text.");

        // Add listeners for click/touch
        document.body.addEventListener('click', handleInteraction);

        return () => {
             window.speechSynthesis.cancel();
             document.body.removeEventListener('click', handleInteraction);
        };
    }, [theme]);

    // This component doesn't render any UI
    return null;
};

export default VoiceAssist;
