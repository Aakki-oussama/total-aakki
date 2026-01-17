import { Users, Truck } from 'lucide-react';

interface ViewTabsProps {
    activeTab: 'employes' | 'vehicules';
    onTabChange: (tab: 'employes' | 'vehicules') => void;
}

export default function ViewTabs({ activeTab, onTabChange }: ViewTabsProps) {
    return (
        <div className="flex w-full sm:w-auto bg-muted/20 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm">
            <button
                onClick={() => onTabChange('employes')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 ${activeTab === 'employes'
                    ? 'bg-surface text-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] scale-[1.02]'
                    : 'text-muted-foreground/70 hover:text-main hover:bg-surface/40'
                    }`}
            >
                <Users size={18} className={activeTab === 'employes' ? 'animate-in zoom-in-75 duration-300' : ''} />
                <span>Chauffeurs</span>
            </button>
            <button
                onClick={() => onTabChange('vehicules')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 ${activeTab === 'vehicules'
                    ? 'bg-surface text-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] scale-[1.02]'
                    : 'text-muted-foreground/70 hover:text-main hover:bg-surface/40'
                    }`}
            >
                <Truck size={18} className={activeTab === 'vehicules' ? 'animate-in zoom-in-75 duration-300' : ''} />
                <span>Camions</span>
            </button>
        </div>
    );
}
