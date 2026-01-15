
import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { navItems } from '../../config/navigation';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-background dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">

            {/* Sidebar - Handles its own logic now */}
            <Sidebar
                items={navItems}
                isOpen={sidebarOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                <Header
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    isSidebarOpen={sidebarOpen}
                />

                <main className="flex-1 overflow-auto p-4 lg:p-8 pb-24 lg:pb-8">
                    {children}
                </main>
            </div>

            <MobileNav items={navItems} />
        </div>
    );
};

export default MainLayout;
