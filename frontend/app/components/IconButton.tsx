import React from 'react';
import { IconType } from 'react-icons';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  variant = 'ghost',
  size = 'sm',
  className = '',
  ...props
}) => {
  const baseStyles = "rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";
  
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };

  const sizeStyles = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

export default IconButton; 