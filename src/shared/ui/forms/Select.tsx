import { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block mb-2 font-bold text-sm text-text-secondary">{label}</label>}
        <select
          ref={ref}
          className={`w-full rounded-xl bg-bg-page border border-border-medium p-4 text-base outline-none transition-all appearance-none focus:border-primary focus:ring-1 focus:ring-primary/20 ${
            error ? 'border-status-error/50 ring-1 ring-status-error/20' : ''
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-status-error ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
