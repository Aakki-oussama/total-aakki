import { Calendar, Wallet, Fuel } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

/**
 * COMPONENT: TodayActivityCard
 * Displays today's activity (Avances + Gasoil) with visual split bar
 * Uses existing useDashboard hook - NO NEW QUERIES
 */
const TodayActivityCard = () => {
    const { stats, loading } = useDashboard();

    if (loading) {
        return <div className="h-48 bg-muted/10 dark:bg-gray-800 rounded-3xl animate-pulse border border-border" />;
    }

    const avancesToday = stats?.avances_aujourdhui || 0;
    const gasoilToday = stats?.gasoil_aujourdhui || 0;
    const totalToday = avancesToday + gasoilToday;

    const avancesPercent = totalToday > 0 ? (avancesToday / totalToday) * 100 : 0;
    const gasoilPercent = totalToday > 0 ? (gasoilToday / totalToday) * 100 : 0;

    return (
        <div className="bg-surface dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-border h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-main uppercase tracking-widest">Activité du Jour</h3>
                    <p className="text-[10px] text-muted uppercase font-bold tracking-tighter">Avances vs Gasoil</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Visual Bar - Clean & Flat */}
                <div className="flex h-10 w-full rounded-2xl overflow-hidden bg-muted/10 border border-border/50">
                    <div
                        className="h-full bg-avance flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000"
                        style={{ width: `${avancesPercent}%` }}
                    >
                        {avancesPercent > 15 && `${avancesPercent.toFixed(0)}%`}
                    </div>
                    <div
                        className="h-full bg-gasoil flex items-center justify-center text-[10px] font-black text-white transition-all duration-1000"
                        style={{ width: `${gasoilPercent}%` }}
                    >
                        {gasoilPercent > 15 && `${gasoilPercent.toFixed(0)}%`}
                    </div>
                </div>

                {/* Legend - Avances */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 dark:bg-gray-900/50 border border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-avance" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Avances</span>
                                <span className="text-xs text-muted font-bold flex items-center gap-1">
                                    <Wallet className="w-3 h-3" />
                                    Encaissé
                                </span>
                            </div>
                        </div>
                        <div className="text-sm font-black text-main">
                            {avancesToday.toLocaleString('fr-FR')} <span className="text-[10px] text-muted uppercase">DH</span>
                        </div>
                    </div>

                    {/* Legend - Gasoil */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/10 dark:bg-gray-900/50 border border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gasoil" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Gasoil</span>
                                <span className="text-xs text-muted font-bold flex items-center gap-1">
                                    <Fuel className="w-3 h-3" />
                                    Crédit donné
                                </span>
                            </div>
                        </div>
                        <div className="text-sm font-black text-main">
                            {gasoilToday.toLocaleString('fr-FR')} <span className="text-[10px] text-muted uppercase">DH</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodayActivityCard;
