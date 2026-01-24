import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/supabase/helpers';
import { iconConfig } from '@/config/icons';

export interface StatCardProps {
    label: string;
    amount: number;
    icon: LucideIcon;
    color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'cyan';
    loading?: boolean;
    isCurrency?: boolean;
    description?: string;
}

/**
 * Universal StatCard Component
 * Version ALIGNÉE sur le système de design de l'application (Total-Aakki).
 */
const StatCard = ({
    label,
    amount,
    icon: Icon,
    color,
    loading = false,
    isCurrency = true,
    description
}: StatCardProps) => {

    // Utilisation des variables de couleurs sémantiques du projet
    const colorClasses = {
        blue: 'bg-indigo-50 dark:bg-indigo-900/20 text-primary border-indigo-100 dark:border-indigo-800/50',
        green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800/50',
        red: 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100 dark:border-red-800/50',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-100 dark:border-purple-800/50',
        orange: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800/50',
        cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 border-cyan-100 dark:border-cyan-800/50',
    };

    const dotColors = {
        blue: 'bg-primary',
        green: 'bg-emerald-600',
        red: 'bg-red-600',
        purple: 'bg-purple-600',
        orange: 'bg-amber-600',
        cyan: 'bg-cyan-600',
    };

    if (loading) {
        return (
            <div className="h-24 md:h-32 bg-muted/10 rounded-2xl md:rounded-3xl animate-pulse border border-border" />
        );
    }

    return (
        <div className="bg-surface dark:bg-surface rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-sm border border-border flex flex-col gap-1.5 md:gap-3 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            {/* 1. Header with Icon and Label */}
            <div className="flex items-center gap-2 md:gap-3">
                <div className={`p-1.5 md:p-2.5 rounded-xl md:rounded-2xl ${colorClasses[color]} border-2 border-surface shadow-sm flex-shrink-0`}>
                    <Icon className={iconConfig.sizes.header} strokeWidth={iconConfig.strokeWidth} />
                </div>
                <span className="text-[9px] md:text-xs font-black text-muted uppercase tracking-widest truncate">
                    {label}
                </span>
            </div>

            {/* 2. Amount and Currency - Split for Responsiveness & Design */}
            <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                    {isCurrency ? (() => {
                        const fullFormat = formatCurrency(amount);
                        // Séparer le chiffre de l'unité (DH ou MAD)
                        const parts = fullFormat.split(/(\s+[^0-9,.\s]+$)/);
                        const value = parts[0];
                        const unit = parts[1] || '';

                        return (
                            <>
                                <span className="text-xl md:text-2xl font-black text-main leading-none">
                                    {value}
                                </span>
                                <span className="text-[10px] md:text-xs font-bold text-muted uppercase">
                                    {unit.trim()}
                                </span>
                            </>
                        );
                    })() : (
                        <span className="text-xl md:text-2xl font-black text-main leading-none">
                            {new Intl.NumberFormat('fr-FR').format(amount)}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-[8px] md:text-[10px] font-medium text-muted mt-1">
                        {description}
                    </p>
                )}
            </div>

            {/* 3. Decorative Background Element */}
            <div className={`absolute -right-4 -bottom-4 w-12 h-12 md:w-16 md:h-16 rounded-full opacity-5 ${dotColors[color]}`} />
        </div>
    );
};

export default memo(StatCard);
