import { Activity, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { iconConfig } from '@/config/icons';
import { Card, EmptyState } from '@/components/shared/ui';
import { formatCurrency, formatDateShort } from '@/lib/supabase/helpers';

interface TimelineItem {
    id: string;
    date_operation: string;
    type: 'GASOIL' | 'PAIEMENT';
    description: string;
    montant: number;
    type_entite: 'CLIENT' | 'SOCIETE';
    nom_entite: string;
}

interface ActivityTimelineProps {
    activities: TimelineItem[];
}

/**
 * COMPONENT: ActivityTimeline
 * Affiche le journal d'activité avec le design spécifique demandé.
 */
const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
    return (
        <Card variant="elevated" padding="lg" className="shadow-xl">
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

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border/50 transition-all hover:bg-surface shadow-sm sm:shadow-none sm:hover:shadow-md">
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-xs font-black text-main uppercase truncate max-w-[150px] sm:max-w-[200px]">
                                        {act.nom_entite || 'Inconnu'}
                                    </span>

                                    {/* Responsive Meta: Stacked on mobile, row on desktop */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                        <span className="text-[9px] font-black text-muted uppercase tracking-tighter leading-none">
                                            {act.type_entite}
                                        </span>
                                        <span className="hidden sm:inline text-[9px] text-muted/30">•</span>
                                        <div className="flex items-center gap-1 text-[9px] text-muted font-bold uppercase leading-none">
                                            <Clock className="w-2.5 h-2.5" strokeWidth={iconConfig.strokeWidth} />
                                            {formatDateShort(act.date_operation)}
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex items-start sm:items-center gap-1 text-sm font-black shrink-0 ${isRevenu ? 'text-avance-text' : 'text-gasoil-text'
                                    }`}>
                                    <span className="mt-0.5 sm:mt-0">{isRevenu ? '+' : '-'}</span>
                                    <span>{formatCurrency(act.montant)}</span>
                                    {isRevenu ? (
                                        <ArrowUpRight className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                                    ) : (
                                        <ArrowDownRight className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <EmptyState
                        icon={Activity}
                        title="Aucune activité"
                        description="Le journal d'activité est vide pour le moment."
                        className="border-none py-10"
                    />
                )}
            </div>
        </Card>
    );
};

export default ActivityTimeline;
