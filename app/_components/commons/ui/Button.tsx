import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => (
  <button
    {...props}
    style={{
      padding: '8px 16px',
      borderRadius: 4,
      border: 'none',
      background: '#2d72d9',
      color: '#fff',
      fontWeight: 600,
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.6 : 1,
    }}
  >
    {children}
  </button>
);

export default Button; 