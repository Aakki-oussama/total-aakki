import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { iconConfig } from '../../../config/icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

/**
 * BUTTON COMPONENT
 * Premium button with smooth animations and theme-consistent styling.
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl md:rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary text-primary-foreground shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-opacity-90",
        secondary: "bg-surface border border-border text-main hover:bg-muted/5",
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
        ghost: "bg-transparent text-muted hover:bg-muted/5 hover:text-main",
        danger: "bg-red-500 text-white shadow-lg shadow-red-100 dark:shadow-none hover:bg-red-600"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs gap-1.5",
        md: "px-5 py-2.5 text-sm gap-2",
        lg: "px-8 py-4 text-base gap-3"
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div
                    className={`${iconConfig.sizes.breadcrumb} border-2 border-current border-t-transparent rounded-full animate-spin`}
                    style={{ borderWidth: iconConfig.strokeWidth }}
                />
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
}
