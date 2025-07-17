import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, ...props }, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    {label && <label style={{ fontWeight: 500 }}>{label}</label>}
    <input ref={ref} {...props} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }} />
  </div>
));
Input.displayName = 'Input';

export default Input;

