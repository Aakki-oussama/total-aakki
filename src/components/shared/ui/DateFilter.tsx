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
            {/* Hidden native input that holds the actual value */}
            <input
                ref={inputRef}
                type="date"
                value={date || ''}
                onChange={(e) => onDateChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 -z-10 pointer-events-none"
            />

            <Button
                variant="secondary"
                onClick={handleButtonClick}
                className="w-full sm:w-auto h-[50px] px-4 sm:px-6 rounded-2xl flex items-center justify-center gap-3 border-border shadow-sm group whitespace-nowrap"
            >
                <CalendarIcon
                    className={`text-muted group-hover:text-primary transition-colors ${iconConfig.sizes.breadcrumb}`}
                    strokeWidth={iconConfig.strokeWidth}
                />
                <span className={`text-sm font-bold hidden sm:inline ${date ? 'text-primary' : 'text-main'}`}>
                    {date ? new Date(date).toLocaleDateString('fr-FR') : label}
                </span>

                {date && (
                    <div
                        onClick={handleClear}
                        className="ml-0 sm:ml-2 p-1 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-all"
                    >
                        <X className="w-3.5 h-3.5" strokeWidth={iconConfig.strokeWidth} />
                    </div>
                )}
            </Button>
        </div>
    );
}
