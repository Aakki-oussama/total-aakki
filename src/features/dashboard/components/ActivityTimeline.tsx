import { useState, useEffect } from 'react';
import { Activity, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { iconConfig } from '@/config/icons';

interface TimelineItem {
    id: string;
    date_operation: string;
    type: 'GASOIL' | 'PAIEMENT';
    description: string;
    montant: number;
    type_entite: 'CLIENT' | 'SOCIETE';
    nom_entite: string;
}

/**
 * COMPONENT: ActivityTimeline
 * Affiche le journal d'activité avec le design spécifique demandé.
 */
const ActivityTimeline = () => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<TimelineItem[]>([]);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const data = await dashboardService.getActivityTimeline();
                setActivities(data as TimelineItem[]);
            } catch (error) {
                console.error("Error fetching timeline:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, []);

    if (loading) {
        return <div className="h-[400px] bg-surface rounded-3xl animate-pulse border border-border" />;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                    <Activity className="w-5 h-5" strokeWidth={iconConfig.strokeWidth} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Activités Récentes</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Flux financier en direct</p>
                </div>
            </div>

            <div className="relative space-y-4">
                {/* Vertical Line */}
                <div className="absolute left-6 top-2 bottom-2 w-px bg-border/40 pointer-events-none" />

                {activities.length > 0 ? activities.map((act) => {
                    const isRevenu = act.type === 'PAIEMENT';

                    return (
                        <div key={act.id} className="relative pl-12 group transition-all duration-300">
                            {/* Dot - Clean & Flat */}
                            <div className={`absolute left-4.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-10 ${isRevenu ? 'bg-avance' : 'bg-gasoil'
                                }`} />

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/50 transition-all">
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs font-black text-main uppercase truncate max-w-[120px] sm:max-w-[200px]">
                                        {act.nom_entite || 'Inconnu'}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[9px] font-black text-muted uppercase tracking-tighter">{act.type_entite}</span>
                                        <span className="text-[9px] text-muted/30">•</span>
                                        <div className="flex items-center gap-1 text-[9px] text-muted font-bold uppercase">
                                            <Clock className="w-2 h-2" strokeWidth={iconConfig.strokeWidth} />
                                            {new Date(act.date_operation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-1 text-sm font-black shrink-0 ${isRevenu ? 'text-avance-text' : 'text-gasoil-text'
                                    }`}>
                                    {isRevenu ? '+' : '-'}
                                    {act.montant.toLocaleString('fr-FR')}
                                    <span className="text-[10px] opacity-70 uppercase ml-0.5">DH</span>
                                    {isRevenu ? <ArrowUpRight className="w-3 h-3" strokeWidth={3} /> : <ArrowDownRight className="w-3 h-3" strokeWidth={3} />}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="py-12 text-center text-muted text-sm font-medium">
                        Aucune activité enregistrée.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityTimeline;
