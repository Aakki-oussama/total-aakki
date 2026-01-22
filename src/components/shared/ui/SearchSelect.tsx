
import { type ReactNode, useState, useRef, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, Check, X, Loader2 } from 'lucide-react';

interface SearchOption {
    value: string;
    label: string;
}

interface SearchSelectProps {
    label?: ReactNode;
    options: SearchOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    isLoading?: boolean;
}

/**
 * COMPONENT: SearchSelect (Combobox Ultimate)
 * - Résout le problème de coupure dans les modales grâce à createPortal.
 * - S'adapte PC (Menu flottant) / Mobile (Bottom Sheet).
 * - "Simple & Perfect" UX.
 */
export default function SearchSelect({
    label,
    options,
    value,
    onChange,
    placeholder = "Sélectionner...",
    disabled = false,
    required = false,
    error,
    isLoading = false
}: SearchSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
    const [isMobile, setIsMobile] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 1. Détection Mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 2. Labels & Filtres
    const selectedLabel = useMemo(() => options.find(opt => opt.value === value)?.label || '', [options, value]);
    const filteredOptions = useMemo(() => {
        if (!searchTerm.trim()) return options;
        return options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [options, searchTerm]);

    // 3. Calcul de Position (C'est ICI que la magie opère pour ne pas être caché)
    const updatePosition = useCallback(() => {
        if (!triggerRef.current || isMobile) return;

        const rect = triggerRef.current.getBoundingClientRect();

        // On calcule la place disponible en bas
        const spaceBelow = window.innerHeight - rect.bottom;
        const shoudShowAbove = spaceBelow < 250; // Si moins de 250px en bas, on affiche en haut

        setMenuStyle({
            position: 'fixed',
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            // Si on manque de place en bas, on le met au-dessus
            top: shoudShowAbove ? 'auto' : `${rect.bottom + 8}px`,
            bottom: shoudShowAbove ? `${window.innerHeight - rect.top + 8}px` : 'auto',
            zIndex: 9999,
        });
    }, [isMobile]);

    // Mettre à jour la position quand on scroll ou resize
    useLayoutEffect(() => {
        if (isOpen && !isMobile) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, isMobile, updatePosition]);

    // Focus automatique
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
    }, [isOpen]);

    // Fermeture clic extérieur
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            // Ignorer si clic dans le menu lui-même
            const target = e.target as HTMLElement;
            if (target.closest('.search-select-menu') || containerRef.current?.contains(target)) {
                return;
            }
            setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // --- RENDERERS ---

    // Menu PC (Portal)
    const renderDesktopMenu = () => {
        return createPortal(
            <div
                className="search-select-menu bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col"
                style={{ ...menuStyle, maxHeight: '300px' }}
            >
                {/* Recherche */}
                <div className="p-2 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full pl-9 pr-8 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-red-500"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-y-auto custom-scrollbar p-1 flex-1">
                    {isLoading ? (
                        <div className="p-4 flex items-center justify-center text-muted gap-2">
                            <Loader2 className="animate-spin" size={16} />
                            <span className="text-xs">Chargement...</span>
                        </div>
                    ) : filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => { onChange(option.value); setIsOpen(false); setSearchTerm(''); }}
                                className={`
                                    px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between cursor-pointer transition-colors
                                    ${value === option.value ? 'bg-primary/10 text-primary' : 'text-main hover:bg-muted/50'}
                                `}
                            >
                                <span>{option.label}</span>
                                {value === option.value && <Check size={14} />}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-xs text-muted italic">Aucun résultat</div>
                    )}
                </div>
            </div>,
            document.body // On attache au body pour sortir de la modale
        );
    };

    // Menu Mobile (Bottom Sheet Portal)
    const renderMobileMenu = () => {
        return createPortal(
            <div className="search-select-menu fixed inset-0 z-[9999] flex flex-col justify-end sm:justify-center">
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />

                <div className="relative w-full bg-surface rounded-t-[2rem] sm:rounded-2xl sm:max-w-lg sm:mx-auto shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
                    <div className="flex justify-center pt-3 pb-2 sm:hidden" onClick={() => setIsOpen(false)}>
                        <div className="w-12 h-1.5 bg-muted/20 rounded-full" />
                    </div>

                    <div className="p-4 border-b border-border">
                        <h3 className="font-bold text-lg mb-4 text-center sm:text-left">{label || "Sélectionner"}</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-muted/20 border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto p-2 custom-scrollbar flex-1 pb-8 sm:pb-2">
                        {isLoading ? (
                            <div className="p-8 flex flex-col items-center justify-center text-muted gap-2">
                                <Loader2 className="animate-spin" size={24} />
                                <span className="text-sm">Chargement...</span>
                            </div>
                        ) : filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => { onChange(option.value); setIsOpen(false); setSearchTerm(''); }}
                                    className={`
                                        px-4 py-3.5 mb-1 rounded-xl text-base font-medium flex items-center justify-between active:scale-[0.98] transition-all
                                        ${value === option.value ? 'bg-primary/10 text-primary' : 'text-main active:bg-muted/30'}
                                    `}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && <Check size={20} />}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted italic">Aucun résultat</div>
                        )}
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
            {label && (
                <label className="text-sm font-bold text-main ml-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Trigger Button */}
            <div
                ref={triggerRef}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    w-full px-4 py-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 select-none
                    ${isOpen ? 'border-primary ring-4 ring-primary/10 bg-surface' : 'border-border bg-surface-hover/30 hover:bg-surface hover:border-muted'}
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-muted' : ''}
                    ${error ? 'border-red-500' : ''}
                `}
            >
                <span className={`text-sm truncate ${value ? 'text-main font-bold' : 'text-muted'}`}>
                    {selectedLabel || placeholder}
                </span>

                {isLoading ? (
                    <Loader2 className="animate-spin text-primary" size={20} />
                ) : (
                    <ChevronDown
                        className={`transition-transform duration-200 text-muted ${isOpen ? 'rotate-180 text-primary' : ''}`}
                        size={20}
                    />
                )}
            </div>

            {/* Render Menu via Portal (PC or Mobile) */}
            {isOpen && (isMobile ? renderMobileMenu() : renderDesktopMenu())}

            {error && <p className="text-xs text-red-500 ml-1 font-bold">{error}</p>}
        </div>
    );
}
