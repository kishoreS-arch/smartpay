import React, { createContext, useState, useContext } from 'react';

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
    const [isVoiceActive, setVoiceActive] = useState(false);

    return (
        <VoiceContext.Provider value={{ isVoiceActive, setVoiceActive }}>
            {children}
        </VoiceContext.Provider>
    );
};

export const useVoice = () => useContext(VoiceContext);
