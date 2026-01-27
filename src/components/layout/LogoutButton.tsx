import { useState } from 'react';
import { LogOut, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { iconConfig } from '../../config/icons';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/toast/useToast';

interface LogoutButtonProps {
    isOpen?: boolean;
    variant?: 'sidebar' | 'mobile' | 'header';
    onAction?: () => void;
}

const LogoutButton = ({ isOpen = true, variant = 'sidebar', onAction }: LogoutButtonProps) => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const { error: notifyError } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (onAction) onAction(); // Fermer le menu si besoin
            await signOut();
            navigate('/login');
        } catch {
            notifyError('Erreur lors de la déconnexion');
        } finally {
            setIsLoading(false);
        }
    };

    const IconComponent = isLoading ? Loader2 : LogOut;
    const iconClass = isLoading ? 'animate-spin' : '';

    // --- VARIANTE HEADER (Icône Seule) ---
    if (variant === 'header') {
        return (
            <button
                onClick={handleLogout}
                disabled={isLoading}
                aria-busy={isLoading}
                aria-disabled={isLoading}
                className={`hidden lg:flex p-2 rounded-xl bg-red-50 text-red-500 transition-colors ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                title="Se déconnecter"
            >
                <IconComponent className={`${iconConfig.sizes.header} ${iconConfig.transitions} ${iconClass}`} strokeWidth={iconConfig.strokeWidth} />
            </button>
        );
    }

    // --- VARIANTE MOBILE (Liste avec Flèche) ---
    if (variant === 'mobile') {
        return (
            <button
                onClick={handleLogout}
                disabled={isLoading}
                aria-busy={isLoading}
                aria-disabled={isLoading}
                className={`w-full mt-6 flex items-center justify-between px-2 py-4 border-t border-border group ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
            >
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                        <IconComponent className={`w-5 h-5 ${iconClass}`} />
                    </div>
                    <span className="text-[0.95rem] font-bold tracking-tight text-main">
                        {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
                    </span>
                </div>
                {!isLoading && <ChevronRight className="w-5 h-5 opacity-50 text-muted" />}
            </button>
        );
    }

    // --- VARIANTE SIDEBAR (Pilule Rouge) ---
    return (
        <div className="px-3 pb-2 mt-auto">
            <button
                onClick={handleLogout}
                disabled={isLoading}
                aria-busy={isLoading}
                aria-disabled={isLoading}
                className={`w-full flex items-center p-3 rounded-2xl group relative transition-all duration-300
                    hover:bg-red-50 dark:hover:bg-red-900/10 text-muted hover:text-red-600
                    ${isOpen ? 'justify-start px-4' : 'justify-center px-2'} 
                    ${isLoading ? 'opacity-50 cursor-wait' : ''}
                `}
            >
                <IconComponent
                    className={`${iconConfig.sizes.sidebar} shrink-0 transition-transform duration-300 ${!isLoading && 'group-hover:scale-110'} ${iconClass}`}
                    strokeWidth={iconConfig.strokeWidth}
                />

                <span className={`font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] text-red-600
                    ${isOpen ? 'opacity-100 max-w-xs ml-3 translate-x-0' : 'opacity-0 max-w-0 ml-0 translate-x-4'}
                `}>
                    {isLoading ? '...' : 'Déconnexion'}
                </span>

                {!isOpen && !isLoading && (
                    <div className="fixed left-20 ml-2 px-3 py-2 bg-slate-900 border border-slate-800 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-[100] shadow-2xl">
                        Déconnexion
                    </div>
                )}
            </button>
        </div>
    );
};

export default LogoutButton;
