import React, { FC } from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const ToggleSwitch: FC<ToggleSwitchProps> = ({ checked, onChange }) => {
    return (
        <label className="toggle-switch">
            <input 
                type="checkbox" 
                checked={checked} 
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="toggle-slider"></span>
        </label>
    );
};
