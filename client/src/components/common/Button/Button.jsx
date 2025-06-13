import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false
}) => {
  const variantClasses = {
    primary: styles.primary,
    secondary: styles.secondary,
    green: styles.green
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;