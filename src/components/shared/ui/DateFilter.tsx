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
 * A premium button that triggers the browser's native date picker directly.
 */
export default function DateFilter({
    date,
    onDateChange,
    label = "Filtrer par date",
    className = ""
}: DateFilterProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        // Trigger the native date picker
        inputRef.current?.showPicker();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDateChange('');
    };

    return (
        <div className={`relative ${className}`}>
            <Button
                variant="secondary"
                className="h-[48px] px-3 sm:px-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 border-border/60 shadow-sm group whitespace-nowrap bg-surface/80 hover:bg-surface transition-all"
            >
                <CalendarIcon
                    className={`text-muted group-hover:text-primary transition-colors ${iconConfig.sizes.breadcrumb}`}
                    strokeWidth={iconConfig.strokeWidth}
                />

                {/* On mobile: Hide text if no date is picked, show short date if picked. On desktop: show full label, then date. */}
                <span className={`text-xs sm:text-sm font-bold ${date ? 'text-primary' : 'text-main'} ${!date ? 'hidden sm:inline-block' : 'inline-block'}`}>
                    {date ? new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : label}
                </span>

                {date && (
                    <div
                        onClick={handleClear}
                        className="p-1 rounded-md hover:bg-red-50 text-muted/50 hover:text-red-500 transition-all ml-1 z-20"
                    >
                        <X className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} />
                    </div>
                )}
            </Button>

            {/* 
                Hidden native input that overlays the button.
                Tapping the button area now directly taps the native input, 
                triggering the OS date picker reliably on mobile.
            */}
            <input
                ref={inputRef}
                type="date"
                value={date || ''}
                onChange={(e) => onDateChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            />
        </div>
    );
}
