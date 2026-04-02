import React from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';

/**
 * AccessibleButton implementing the double-tap interaction system.
 * 
 * First Tap: Speaks label, vibrates, and highlights button.
 * Second Tap: Executes action (navigate/callback).
 * Reset: Automatic reset after 3 seconds of inactivity.
 * 
 * Behavior active ONLY for Visually Impaired mode.
 */
const AccessibleButton = ({ 
    id, 
    label, 
    onClick, 
    children, 
    className = "", 
    ariaLabel,
    style = {} 
}) => {
    const { isVisual, handleAccessibleClick, tapStates } = useAccessibility();
    
    // Highlight if selected on first tap
    const isSelected = isVisual && tapStates[id];

    return (
        <button
            className={`${className} ${isSelected ? 'vi-btn-highlight' : ''}`}
            onClick={() => handleAccessibleClick(id, label, onClick)}
            aria-label={ariaLabel || label}
            tabIndex={0}
            style={style}
        >
            {children}
        </button>
    );
};

export default AccessibleButton;
