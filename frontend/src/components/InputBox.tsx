import React from 'react'
import './InputBox.css'

interface InputBoxProps {
    label: string;
    type: string;
    value: string;
    placeholder: string;
    required: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
}

const InputBox: React.FC<InputBoxProps> = ({ 
    label, 
    type, 
    value, 
    placeholder, 
    required, 
    onChange,
    icon
}) => {
    return (
      <div className="input-box">
        <label>
            {label}
            {required && <span style={{ color: 'var(--accent-color)', marginLeft: '4px' }}>*</span>}
        </label>
        <div style={{ position: 'relative' }}>
            <input 
                type={type} 
                value={value} 
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
            {icon && (
                <div style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                }}>
                    {icon}
                </div>
            )}
        </div>
      </div>
    );
  };

export default InputBox