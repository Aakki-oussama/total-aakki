/**
 * SELECT COMPONENT
 * Sélecteur natif optimisé mobile
 */

import { type SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { iconConfig } from '@/config/icons';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, placeholder, fullWidth = false, className = '', ...props }, ref) => {
        const widthClass = fullWidth ? 'w-full' : '';
        const errorClass = error ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary';

        return (
            <div className={`flex flex-col gap-1.5 ${widthClass}`}>
                {label && (
                    <label className="text-sm font-semibold text-main">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <select
                        ref={ref}
                        className={`
              appearance-none w-full
              px-4 py-3 pr-10 min-h-[44px]
              bg-surface border-2 ${errorClass}
              rounded-xl text-main
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`${iconConfig.sizes.action} text-muted`} strokeWidth={iconConfig.strokeWidth} />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-500 font-medium">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
