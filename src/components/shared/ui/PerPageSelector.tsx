import { ChevronDown } from 'lucide-react';
import { iconConfig } from '../../../config/icons';

interface PerPageSelectorProps {
    value: number;
    onChange: (value: number) => void;
    options?: number[];
    className?: string;
}

/**
 * PER PAGE SELECTOR COMPONENT
 * A compact, premium selector to choose items count per page.
 */
export default function PerPageSelector({
    value,
    onChange,
    options = [10, 25, 50, 100],
    className = ""
}: PerPageSelectorProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative group">
                <select
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="
                        appearance-none cursor-pointer
                        bg-surface/50 border border-border/60 hover:border-primary/50
                        rounded-lg sm:rounded-xl 
                        pl-3 pr-8 sm:pl-4 sm:pr-10
                        h-9 sm:h-10
                        text-xs sm:text-sm font-bold text-main
                        focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all
                        shadow-sm
                    "
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt} className="bg-surface text-main font-medium">
                            {opt} lignes
                        </option>
                    ))}
                </select>

                <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-hover:text-primary transition-colors"
                    strokeWidth={iconConfig.strokeWidth}
                />
            </div>
        </div>
    );
}
