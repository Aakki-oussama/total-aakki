import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useRef } from 'react';
import { iconConfig } from '../../../config/icons';
import Button from './Button';

interface DateFilterProps {
    date?: string;
    onDateChange: (date: string) => void;
    label?: string;
    className?: string;
}

/**
 * DATE FILTER COMPONENT
 * SOLUTION UNIVERSELLE - Works on ALL devices including iPhone
 */
export default function DateFilter({
    date,
    onDateChange,
    label = "Filtrer par date",
    className = ""
}: DateFilterProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
        // Direct click on visible input - Safari CANNOT block this
        inputRef.current?.click();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDateChange('');
    };

    return (
        <div className={`relative ${className}`}>
            {/* Invisible input overlay - CLICKABLE */}
            <input
                ref={inputRef}
                type="date"
                value={date || ''}
                onChange={(e) => onDateChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {/* Visual button - pointer-events-none so clicks go to input */}
            <Button
                variant="secondary"
                onClick={handleContainerClick}
                className="h-[48px] px-3 sm:px-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 border-border/60 shadow-sm group whitespace-nowrap bg-surface/80 hover:bg-surface transition-all pointer-events-none relative z-0"
            >
                <CalendarIcon
                    className={`text-muted group-hover:text-primary transition-colors ${iconConfig.sizes.breadcrumb}`}
                    strokeWidth={iconConfig.strokeWidth}
                />

                <span className={`text-xs sm:text-sm font-bold ${date ? 'text-primary' : 'text-main'} ${!date ? 'hidden sm:inline-block' : 'inline-block'}`}>
                    {date ? new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : label}
                </span>

                {date && (
                    <div
                        onClick={handleClear}
                        className="p-1 rounded-md hover:bg-red-50 text-muted/50 hover:text-red-500 transition-all ml-1 pointer-events-auto z-20 relative"
                    >
                        <X className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} />
                    </div>
                )}
            </Button>
        </div>
    );
}