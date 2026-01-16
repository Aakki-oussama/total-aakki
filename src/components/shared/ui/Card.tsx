/**
 * CARD COMPONENT
 * Premium card with glassmorphism, elevation variants, and hover effects.
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
    // Style Variants
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
        ? 'transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer'
        : '';

    return (
        <div
            className={`
                ${variantClasses[variant]}
                ${paddingClasses[padding]}
                ${hoverClass}
                rounded-2xl
                overflow-hidden
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
}
