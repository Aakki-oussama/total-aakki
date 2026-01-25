import { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { iconConfig } from '../../../config/icons';

interface DateFilterProps {
    date?: string; // YYYY-MM-DD
    onDateChange: (date: string) => void;
    className?: string;
}

/**
 * COMPONENT: DateFilter (The "Zero-Failure" Version)
 * Industry standard approach: Custom grid calendar.
 * Guaranteed to work on iOS, Android, and PC.
 * Features:
 * - Direct toggle (open/close)
 * - Timezone-safe date parsing
 * - Responsive grid layout
 * - Unified design system styling
 */
const parseDate = (date: string) => new Date(`${date}T00:00:00`);

export default function DateFilter({
    date,
    onDateChange,
    className = ""
}: DateFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Month navigation state
    const [viewDate, setViewDate] = useState<Date>(
        date ? parseDate(date) : new Date()
    );

    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const weekdays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    // Sync view with external date selection
    useEffect(() => {
        if (date) setViewDate(parseDate(date));
    }, [date]);

    // Handle outside clicks and keyboard
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const calendarGrid = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Start week on Monday
        const offset = firstDay === 0 ? 6 : firstDay - 1;

        return [
            ...Array(offset).fill(null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
        ];
    }, [viewDate]);

    const isSelected = (day: number) => {
        if (!date) return false;
        const d = parseDate(date);
        return d.getDate() === day && d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
    };

    const handleSelect = (day: number) => {
        const y = viewDate.getFullYear();
        const m = String(viewDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        onDateChange(`${y}-${m}-${d}`);
        setIsOpen(false);
    };

    const handleToday = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        onDateChange(`${y}-${m}-${d}`);
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {/* TRIGER BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    h-[48px] w-[48px] flex items-center justify-center rounded-xl sm:rounded-2xl border transition-all shadow-sm group relative
                    ${isOpen ? 'border-primary ring-2 ring-primary/10 bg-surface' : 'border-border/60 bg-surface/80 hover:bg-surface'}
                    ${date ? 'border-primary/50 bg-primary/5' : ''}
                `}
                aria-label="Choisir une date"
            >
                <CalendarIcon
                    className={`${iconConfig.sizes.breadcrumb} ${date ? 'text-primary' : 'text-muted'} group-hover:text-primary transition-colors`}
                    strokeWidth={iconConfig.strokeWidth}
                />
                {date && <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-surface shadow-sm" />}
            </button>

            {/* CUSTOM CALENDAR GRID DROP-DOWN */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-[280px] z-[200] bg-surface rounded-2xl shadow-2xl border border-border p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header: Month & Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-muted/10 rounded-lg text-muted transition-colors">
                            <ChevronLeft className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} />
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-main">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                        <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-muted/10 rounded-lg text-muted transition-colors">
                            <ChevronRight className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} />
                        </button>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 text-center mb-1">
                        {weekdays.map(w => <span key={w} className="text-[8px] font-black text-muted uppercase">{w}</span>)}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarGrid.map((day, i) => (
                            day ? (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(day)}
                                    className={`
                                        h-8 w-8 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center
                                        ${isSelected(day) ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/10 text-main hover:text-primary'}
                                    `}
                                >
                                    {day}
                                </button>
                            ) : (
                                <div key={i} className="h-8 w-8" />
                            )
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                        <button
                            onClick={handleToday}
                            className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                        >
                            Aujourd'hui
                        </button>

                        <button
                            onClick={() => { onDateChange(''); setIsOpen(false); }}
                            className="p-2 hover:bg-red-50 text-danger rounded-lg transition-colors"
                            title="Réinitialiser"
                        >
                            <RotateCcw className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}