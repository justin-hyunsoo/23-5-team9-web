import { forwardRef } from 'react';
import { Select as MantineSelect } from '@mantine/core';

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
  ({ options, label, error, className = '', disabled, ...props }, ref) => {
    return (
      <MantineSelect
        ref={ref as any}
        className={className}
        styles={{ root: { width: '100%' } }}
        data={options}
        label={label}
        error={error}
        disabled={disabled}
        {...(props as any)}
      />
    );
  }
);

Select.displayName = 'Select';
