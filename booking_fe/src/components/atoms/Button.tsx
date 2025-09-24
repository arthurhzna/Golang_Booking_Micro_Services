import React, {FC, ReactNode} from 'react'

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  id?: string;
}

const Button: FC<ButtonProps> = ({ type = "button", className, onClick, children, disabled, id }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      onClick={onClick}
      id={id}
    >
      {children}
    </button>
  );
};

export default Button;