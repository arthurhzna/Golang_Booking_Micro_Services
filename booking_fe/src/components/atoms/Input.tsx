import React, { FC } from 'react';

type InputProps = {
  type: string;
  name: string;
  value?: string;
  maxLength?: number;
  minLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  autoComplete?: string;
  required?: boolean;
};

const Input: FC<InputProps> = ({ type, name, value, onChange, placeholder, className , autoComplete, id, minLength, maxLength, required}) => {
  return (
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      minLength={minLength}
      maxLength={maxLength}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`form-control ${className}`}
      required={required}
    />
  );
};

export default Input;
