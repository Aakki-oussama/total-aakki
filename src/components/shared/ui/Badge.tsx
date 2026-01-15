/**
 * BADGE COMPONENT
 * Badge de statut avec variantes de couleur
 */

import { type ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
}

export default function Badge({ children, variant = 'neutral', size = 'md', dot = false }: BadgeProps) {
    // Variantes de couleur
    const variantClasses = {
        success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        neutral: 'bg-muted/20 text-muted',
    };

    // Couleur du point
    const dotColors = {
        success: 'bg-green-500',
        danger: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
        neutral: 'bg-muted',
    };

    // Tailles
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-semibold rounded-full
        whitespace-nowrap
      `}
        >
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
            {children}
        </span>
    );
}
