/**
 * INPUT COMPONENT
 * Champ de saisie optimisé tactile avec label et gestion d'erreur
 */

import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, fullWidth = false, className = '', ...props }, ref) => {
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

                <input
                    ref={ref}
                    className={`
            px-4 py-3 min-h-[44px]
            bg-surface border-2 ${errorClass}
            rounded-xl text-main placeholder:text-muted
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-red-500 font-medium">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-muted">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
