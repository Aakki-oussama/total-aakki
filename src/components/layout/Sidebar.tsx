import { useLocation, Link } from 'react-router-dom';
import { type NavItem } from '../../types';
import { currentUser } from '../../config/user';
import { appConfig } from '../../config/app';
import { iconConfig } from '../../config/icons';

interface SidebarProps {
    items: NavItem[];
    isOpen: boolean;
}

const Sidebar = ({ items, isOpen }: SidebarProps) => {
    const location = useLocation();
    const Logo = appConfig.logo;

    return (
        <aside
            className={`hidden lg:flex flex-col border-r sticky top-0 h-screen overflow-hidden
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'} 
        bg-surface border-border
      `}
        >
            {/* Header Section with Logo only */}
            <div className={`flex items-center min-h-[80px] transition-all duration-300 ${isOpen ? 'px-5' : 'pl-5'}`}>
                <div className={`flex items-center gap-3 overflow-hidden`}>
                    <div className="bg-primary p-2 rounded-xl text-primary-foreground shrink-0 transition-transform duration-300">
                        <Logo className={`${iconConfig.sizes.logo} fill-current`} strokeWidth={iconConfig.strokeWidth} />
                    </div>
                    <span className={`text-xl font-bold tracking-tight whitespace-nowrap text-main transition-all duration-300 ${isOpen ? 'opacity-100 ml-0' : 'opacity-0 ml-0 w-0 overflow-hidden'}`}>
                        {appConfig.name}
                    </span>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`w-full flex items-center p-3 rounded-xl group relative transition-all duration-300
                ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-indigo-200 dark:shadow-none'
                                    : 'hover:bg-muted/10 text-muted hover:text-main'
                                }
                ${isOpen ? 'pl-3' : 'pl-4'} 
              `}
                        >
                            <Icon className={`${iconConfig.sizes.sidebar} shrink-0 ${iconConfig.transitions}`} strokeWidth={iconConfig.strokeWidth} />
                            <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
                                ${isOpen ? 'opacity-100 max-w-xs ml-3' : 'opacity-0 max-w-0 ml-0'}
                            `}>
                                {item.label}
                            </span>

                            {!isOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Info Placeholder */}
            <div className="p-4 border-t border-border">
                <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && 'justify-center'}`}>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {currentUser.initials}
                    </div>
                    <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                        <span className="text-sm font-semibold truncate text-main">{currentUser.name}</span>
                        <span className="text-xs text-muted truncate">{currentUser.role}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
