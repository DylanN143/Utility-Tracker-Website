import React from 'react'
import './InputBox.css'

interface InputBoxProps {
    label: string;
    type: string;
    value: string;
    placeholder: string;
    required: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ label, type, value, placeholder, required, onChange }) => {
    return (
      <div >
        <label className='text'>
            {label}
            <input 
                type={type} 
                value={value} 
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="input-box"/>
        </label>
      </div>
    );
  };

export default InputBox