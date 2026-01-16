import { Search, X } from 'lucide-react';
import { iconConfig } from '../../../config/icons';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * SEARCH BAR COMPONENT
 * A premium, responsive search input with clear action.
 */
export default function SearchBar({
    value,
    onChange,
    placeholder = "Rechercher...",
    className = ""
}: SearchBarProps) {
    return (
        <div className={`relative group w-full ${className}`}>
            <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors ${iconConfig.sizes.breadcrumb}`}
                strokeWidth={iconConfig.strokeWidth}
            />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-11 pr-10 py-3 bg-surface border border-border rounded-2xl text-sm font-medium text-main placeholder:text-muted/60 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
            />

            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted hover:text-main hover:bg-muted/10 transition-all"
                >
                    <X className="w-4 h-4" strokeWidth={iconConfig.strokeWidth} />
                </button>
            )}
        </div>
    );
}
