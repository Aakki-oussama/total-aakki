import { type ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-surface border border-border rounded-2xl shadow-sm overflow-hidden ${className}`}>
            {children}
        </div>
    );
}
