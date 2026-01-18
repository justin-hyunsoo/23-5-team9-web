import React from 'react';

const BASE_STYLE = "rounded-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer";

const VARIANTS = {
  primary: "bg-primary text-text-inverse hover:bg-primary-hover border border-transparent",
  secondary: "bg-bg-box-alt text-text-body hover:bg-bg-box-hover border border-transparent",
  outline: "border border-border-medium text-text-body hover:bg-bg-box-light",
  ghost: "bg-transparent text-text-secondary hover:bg-bg-box-light hover:text-text-primary"
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-6 py-3.5 text-lg"
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  fullWidth?: boolean;
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${BASE_STYLE} ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    />
  );
}