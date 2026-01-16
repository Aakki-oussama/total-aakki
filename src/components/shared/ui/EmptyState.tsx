/**
 * EMPTY STATE COMPONENT
 * Composant partagé pour afficher un message quand une liste est vide
 */

import Card from './Card';
import Button from './Button';
import { type LucideIcon } from 'lucide-react';
import { iconConfig } from '../../../config/icons';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = '',
}: EmptyStateProps) {
    return (
        <Card
            className={`col-span-full py-20 flex flex-col items-center justify-center gap-4 border-dashed border-2 bg-transparent text-center px-6 ${className}`}
        >
            <div className="p-5 bg-muted/10 rounded-full">
                <Icon className={`${iconConfig.sizes.emptyState} text-muted`} strokeWidth={iconConfig.strokeWidth} />
            </div>

            <div className="flex flex-col gap-1 max-w-sm">
                <h3 className="text-xl font-bold text-main">{title}</h3>
                <p className="text-muted font-medium">{description}</p>
            </div>

            {actionLabel && onAction && (
                <Button
                    variant="primary"
                    onClick={onAction}
                    className="mt-2"
                >
                    {actionLabel}
                </Button>
            )}
        </Card>
    );
}
