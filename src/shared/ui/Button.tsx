import React from 'react';

// 버튼 스타일을 한곳에서 관리하여 일관성 확보
export function Button({ 
  className = '', 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }) {
  const base = "px-4 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50";
  const styles = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20",
    outline: "border border-gray-200 hover:bg-gray-50 text-slate-700"
  };

  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
