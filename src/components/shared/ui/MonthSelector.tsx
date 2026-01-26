import { Calendar } from 'lucide-react';
import { iconConfig } from '../../../config/icons';

interface MonthSelectorProps {
    value: string; // Format: "YYYY-MM"
    onChange: (value: string) => void;
    className?: string;
}

/**
 * COMPONENT: MonthSelector
 * A simple wrapper around native input[type="month"] with DateFilter styling.
 * Fixes the icon alignment issue on iPhone/Safari.
 */
export default function MonthSelector({ value, onChange, className = "" }: MonthSelectorProps) {
    return (
        <div className={`relative ${className}`}>
            {/* Calendar Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <Calendar
                    className={`${iconConfig.sizes.breadcrumb} text-primary`}
                    strokeWidth={iconConfig.strokeWidth}
                />
            </div>

            {/* Native Month Input */}
            <input
                type="month"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                min={`${new Date().getFullYear() - 20}-01`}
                max={new Date().toISOString().slice(0, 7)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/60 bg-muted/5 text-main font-black text-[11px] uppercase tracking-widest focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-center cursor-pointer"
                style={{
                    // Hide native Safari calendar icon
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                }}
            />

            {/* Hide the native picker indicator on Safari */}
            <style>{`
                input[type="month"]::-webkit-calendar-picker-indicator {
                    opacity: 0;
                    position: absolute;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
