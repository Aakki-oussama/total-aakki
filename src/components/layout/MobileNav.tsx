import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MoreHorizontal, X } from 'lucide-react';
import { type NavItem } from '../../types';
import { iconConfig } from '../../config/icons';

interface MobileNavProps {
    items: NavItem[];
}

const MobileNav = ({ items }: MobileNavProps) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // LOGIQUE 4+1 : 
    // On garde les 4 premiers pour la barre principale
    // Le reste ira dans le menu "Plus"
    const visibleItems = items.slice(0, 4);
    const hiddenItems = items.slice(4);
    const hasMore = hiddenItems.length > 0;

    // Vérifier si la page active est dans le menu caché
    const isHiddenItemActive = hiddenItems.some(item => location.pathname === item.path);

    return (
        <>
            {/* 1. OVERLAY (Couche sombre quand le menu est ouvert) */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* 2. MENU CACHÉ (Bottom Sheet) */}
            <div
                className={`fixed left-4 right-4 z-50 transition-all duration-500 ease-out bg-surface border border-border rounded-3xl p-4 shadow-2xl
                    ${isMenuOpen ? 'bottom-24 opacity-100 scale-100' : '-bottom-full opacity-0 scale-95 pointer-events-none'}
                `}
            >
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="font-bold text-main">Autres sections</span>
                    <button onClick={() => setIsMenuOpen(false)} className="p-1.5 hover:bg-muted/10 rounded-full text-muted">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {hiddenItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200
                                    ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/10 text-muted'}
                                `}
                            >
                                <Icon className={iconConfig.sizes.mobile} strokeWidth={iconConfig.strokeWidth} />
                                <span className="text-[10px] font-semibold text-center leading-tight truncate w-full">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 3. BARRE DE NAVIGATION PRINCIPALE */}
            <nav className="lg:hidden fixed bottom-6 left-4 right-4 z-50 flex justify-between items-center px-4 py-3 border border-border bg-surface/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-500/10 transition-colors duration-300">
                {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex flex-col items-center gap-1 group relative transition-colors duration-300
                                ${isActive ? 'text-primary' : 'text-muted hover:text-main'}
                            `}
                        >
                            <Icon
                                className={`${iconConfig.sizes.mobile} ${iconConfig.transitions} ${isActive ? 'scale-110' : 'scale-100'}`}
                                strokeWidth={isActive ? 2 : iconConfig.strokeWidth}
                            />
                            <span className={`text-[10px] font-bold uppercase tracking-tight transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                {/* LE BOUTON "PLUS" (Affiché seulement si plus de 4 items) */}
                {hasMore && (
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex flex-col items-center gap-1 group relative transition-colors duration-300
                            ${isHiddenItemActive || isMenuOpen ? 'text-primary' : 'text-muted hover:text-main'}
                        `}
                    >
                        <MoreHorizontal
                            className={`${iconConfig.sizes.mobile} ${iconConfig.transitions} ${isMenuOpen ? 'rotate-90 scale-110' : 'scale-100'}`}
                            strokeWidth={iconConfig.strokeWidth}
                        />
                        <span className={`text-[10px] font-bold uppercase tracking-tight transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-60'}`}>
                            Plus
                        </span>
                    </button>
                )}
            </nav>
        </>
    );
};

export default MobileNav;
