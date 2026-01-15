/**
 * CARD COMPONENT
 * Carte avec effet glassmorphism et hover
 */

import { type ReactNode, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'default' | 'glass' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
}

export default function Card({
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    className = '',
    ...props
}: CardProps) {
    // Variantes de style
    const variantClasses = {
        default: 'bg-surface border border-border',
        glass: 'bg-surface/80 backdrop-blur-xl border border-border/50',
        elevated: 'bg-surface border border-border shadow-xl shadow-indigo-500/5',
    };

    // Padding
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    // Hover effect
    const hoverClass = hoverable
        ? 'transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer'
        : '';

    return (
        <div
            className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverClass}
        rounded-2xl
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}
