import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MoreHorizontal, X, ChevronRight, type LucideIcon } from 'lucide-react';
import { type NavItem } from '../../types';
import LogoutButton from './LogoutButton';

interface MobileNavProps {
    items: NavItem[];
}

const MobileNav = ({ items }: MobileNavProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // LOGIQUE 4+1
    const visibleItems = items.slice(0, 4);
    const hiddenItems = items.slice(4);

    // Vérifier si la page active est dans le menu caché

    const navTo = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* 1. OVERLAY (Backdrop) */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* 2. MENU CACHÉ (Tiroir Liste - Couleurs App) */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border rounded-t-[2rem] shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>

                {/* Handle bar */}
                <div className="flex justify-center py-3" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-12 h-1.5 bg-muted/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pb-2">
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted">Menu</h2>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-muted/10 rounded-full text-muted transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content List */}
                <div className="px-5 py-4 pb-12 max-h-[70vh] overflow-y-auto">
                    {/* Navigation Group */}
                    <div className="flex flex-col">
                        {hiddenItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon as LucideIcon;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navTo(item.path)}
                                    className={`w-full flex items-center justify-between px-2 py-4 border-b border-border/50 group`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted/5 text-muted'}`}>
                                            <Icon className="w-5 h-5" strokeWidth={2} />
                                        </div>
                                        <span className={`text-[0.95rem] font-bold tracking-tight ${isActive ? 'text-primary' : 'text-main'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 transition-transform group-active:translate-x-1 text-muted`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Logout Button (Reusable) */}
                    <LogoutButton variant="mobile" onAction={() => setIsMenuOpen(false)} />
                </div>
            </div>

            {/* 3. BARRE DE NAVIGATION (Bottom Tab Bar - FIX) */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between px-6 py-2">
                    {visibleItems.map((item) => {
                        const Icon = item.icon as LucideIcon;
                        const isActive = location.pathname === item.path;

                        return (
                            <button
                                key={item.id}
                                onClick={() => navTo(item.path)}
                                className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 rounded-xl transition-all duration-200
                                    ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}
                                `}
                            >
                                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10' : ''}`}>
                                    <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    {/* BOUTON PLUS */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 rounded-xl transition-all duration-200
                            ${isMenuOpen ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'}
                        `}
                    >
                        <div className={`p-1.5 rounded-xl transition-all duration-200 ${isMenuOpen ? 'bg-primary/10' : ''}`}>
                            <MoreHorizontal className="w-6 h-6" strokeWidth={isMenuOpen ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${isMenuOpen ? 'opacity-100' : 'opacity-70'}`}>
                            Plus
                        </span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default MobileNav;
