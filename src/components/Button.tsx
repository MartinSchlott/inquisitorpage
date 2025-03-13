import { FC, ButtonHTMLAttributes } from 'react';
import '../styles/button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const Button: FC<ButtonProps> = ({
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`button-container ${fullWidth ? 'full-width' : ''} ${className}`}>
      <button
        className="button"
        {...props}
      >
        <div className="mask" />
        <div className="text">{children}</div>
      </button>
    </div>
  );
};

export default Button;