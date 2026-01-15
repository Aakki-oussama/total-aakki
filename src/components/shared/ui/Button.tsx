/**
 * BUTTON COMPONENT
 * Bouton avec variantes et animations optimisées mobile
 */

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    children,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    // Classes de base
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    // Variantes de couleur
    const variantClasses = {
        primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-indigo-200 dark:shadow-none',
        secondary: 'bg-surface border-2 border-border text-main hover:bg-background',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200 dark:shadow-none',
        ghost: 'bg-transparent text-muted hover:bg-muted/10 hover:text-main',
    };

    // Tailles (optimisées tactile)
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm min-h-[36px]',
        md: 'px-4 py-3 text-base min-h-[44px]', // 44px = minimum iOS
        lg: 'px-6 py-4 text-lg min-h-[52px]',
    };

    // Largeur complète
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Chargement...</span>
                </>
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    <span>{children}</span>
                </>
            )}
        </button>
    );
}
