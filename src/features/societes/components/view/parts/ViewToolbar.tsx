import { SearchBar, DateFilter } from '@/components/shared/ui';

interface ViewToolbarProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    selectedDate: string;
    onDateChange: (val: string) => void;
    placeholder: string;
}

/**
 * COMPONENT: ViewToolbar
 * Barre d'outils avec recherche et filtre date pour la vue détaillée.
 */
export default function ViewToolbar({
    searchTerm,
    onSearchChange,
    selectedDate,
    onDateChange,
    placeholder
}: ViewToolbarProps) {
    return (
        <div className="flex items-center gap-2 sm:gap-4 bg-surface/50 p-3 sm:p-4 rounded-2xl border border-border/50">
            <div className="flex-1">
                <SearchBar
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder={placeholder}
                />
            </div>
            <div className="flex-shrink-0">
                <DateFilter
                    date={selectedDate}
                    onDateChange={onDateChange}
                    label="Date"
                />
            </div>
        </div>
    );
}
