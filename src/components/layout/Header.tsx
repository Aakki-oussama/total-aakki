
import { useTheme } from '../../context/ThemeContext';
import Breadcrumbs from './Breadcrumbs';
import { Sun, Moon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { currentUser } from '../../config/user';
import { appConfig } from '../../config/app';
import { iconConfig } from '../../config/icons';

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
    const { theme, toggleTheme } = useTheme();
    const Logo = appConfig.logo;

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4 border-b bg-surface border-border transition-colors duration-300">
            <div className="flex items-center gap-3 lg:gap-4">
                {/* Compact Mobile Brand Icon */}
                <div className="lg:hidden bg-primary p-1.5 rounded-lg text-primary-foreground shadow-sm">
                    <Logo className={`${iconConfig.sizes.logoMobile} fill-current`} strokeWidth={iconConfig.strokeWidth} />
                </div>

                {/* Sidebar Toggle Button (Desktop Only) */}
                <button
                    onClick={toggleSidebar}
                    className="hidden lg:flex p-2 rounded-xl border border-border bg-background text-muted hover:bg-surface hover:text-main transition-colors"
                    aria-label={isSidebarOpen ? "Réduire le menu" : "Développer le menu"}
                >
                    {isSidebarOpen ? (
                        <PanelLeftClose className={`${iconConfig.sizes.header} ${iconConfig.transitions}`} strokeWidth={iconConfig.strokeWidth} />
                    ) : (
                        <PanelLeftOpen className={`${iconConfig.sizes.header} ${iconConfig.transitions}`} strokeWidth={iconConfig.strokeWidth} />
                    )}
                </button>

                <Breadcrumbs />
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg lg:rounded-xl border border-border bg-surface text-muted dark:text-yellow-400 hover:bg-background transition-colors"
                    title="Changer le thème"
                >
                    {theme === 'dark' ? (
                        <Sun className={`${iconConfig.sizes.header} ${iconConfig.transitions}`} strokeWidth={iconConfig.strokeWidth} />
                    ) : (
                        <Moon className={`${iconConfig.sizes.header} ${iconConfig.transitions}`} strokeWidth={iconConfig.strokeWidth} />
                    )}
                </button>

                <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-[10px] lg:text-sm shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                    {currentUser.initials}
                </div>
            </div>
        </header>
    );
};

export default Header;
