import React, { useRef, useEffect } from 'react';
import { TextField } from '@mui/material';
import { animateLabel, animateIcon, addPenAnimation, removePenAnimation } from '../utils/jQueryAnimations';
import '../styles/AnimatedInput.css';

interface AnimatedInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ 
  label, 
  value, 
  onChange,
  name = '',
  type = 'text'
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);
  const iconRef = useRef<HTMLElement>(null);

  const handleFocus = () => {
    if (labelRef.current && iconRef.current) {
      animateLabel(labelRef.current, '80px');
      animateIcon(iconRef.current, '5px');
      addPenAnimation(iconRef.current);
    }
  };

  const handleBlur = () => {
    if (labelRef.current && iconRef.current) {
      animateLabel(labelRef.current, '0px');
      animateIcon(iconRef.current, '-100px');
      removePenAnimation(iconRef.current);
    }
  };

  useEffect(() => {
    // Cleanup animations on unmount
    return () => {
      if (iconRef.current) {
        removePenAnimation(iconRef.current);
      }
    };
  }, []);

  return (
    <div className="input-wrapper">
      <div className="wrap-label">
        <label ref={labelRef}>{label}</label>
        <i ref={iconRef} className="fas fa-pen pen-icon"></i>
      </div>
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={name}
        type={type}
        variant="outlined"
        className="animated-input"
      />
    </div>
  );
};

export default AnimatedInput;
