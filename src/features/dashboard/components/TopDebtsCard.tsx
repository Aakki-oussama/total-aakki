import { AlertCircle, User, Building2, TrendingDown } from 'lucide-react';
import type { Impaye } from '@/types/views';
import { iconConfig } from '@/config/icons';
import { Card, EmptyState } from '@/components/shared/ui';
import { formatCurrency } from '@/lib/supabase/helpers';

interface TopDebtsCardProps {
    debts: Impaye[];
}

/**
 * COMPONENT: TopDebtsCard (Red List)
 * Affiche les 5 plus grosses dettes (clients ou sociétés) sur le dashboard.
 */
const TopDebtsCard = ({ debts }: TopDebtsCardProps) => {
    return (
        <Card className="h-full shadow-sm" padding="md">
            {/* Simple Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <AlertCircle className={iconConfig.sizes.header} strokeWidth={iconConfig.strokeWidth} />
                </div>
                <h3 className="font-black text-main uppercase text-sm tracking-widest">
                    Plus grosses dettes
                </h3>
            </div>

            {/* Simple List */}
            <div className="divide-y divide-border/50">
                {debts.length > 0 ? debts.map((debt, index) => (
                    <div key={index} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${debt.type_entite === 'CLIENT' ? 'bg-client/10 text-client' : 'bg-societe/10 text-societe'}`}>
                                {debt.type_entite === 'CLIENT' ? (
                                    <User className={iconConfig.sizes.header} strokeWidth={iconConfig.strokeWidth} />
                                ) : (
                                    <Building2 className={iconConfig.sizes.header} strokeWidth={iconConfig.strokeWidth} />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-main">{debt.nom}</span>
                                <span className="text-[10px] uppercase font-bold text-muted">{debt.type_entite}</span>
                            </div>
                        </div>
                        <div className="text-sm font-black text-societe">
                            {formatCurrency(debt.montant_du)}
                        </div>
                    </div>
                )) : (
                    <EmptyState
                        icon={TrendingDown}
                        title="Tout est à jour"
                        description="Aucune dette importante à signaler pour le moment."
                        className="border-none py-10"
                    />
                )}
            </div>
        </Card>
    );
};

export default TopDebtsCard;
