import { useState, useEffect } from 'react';
import { AlertCircle, User, Building2 } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import type { Impaye } from '@/types/views';
import { iconConfig } from '@/config/icons';

/**
 * COMPONENT: TopDebtsCard (Red List)
 * Affiche les 5 plus grosses dettes (clients ou sociétés) sur le dashboard.
 */
const TopDebtsCard = () => {
    const [loading, setLoading] = useState(true);
    const [debts, setDebts] = useState<Impaye[]>([]);

    useEffect(() => {
        const fetchDebts = async () => {
            try {
                const data = await dashboardService.getTopDebts();
                setDebts(data);
            } catch (error) {
                console.error("Error fetching top debts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDebts();
    }, []);

    if (loading) {
        return <div className="h-[400px] bg-surface rounded-3xl animate-pulse border border-border" />;
    }

    return (
        <div className="bg-surface rounded-3xl p-6 border border-border h-full shadow-sm">
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
                            {debt.montant_du.toLocaleString('fr-FR')} DH
                        </div>
                    </div>
                )) : (
                    <div className="py-10 text-center text-muted text-sm font-medium">
                        Aucun impayé à afficher
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopDebtsCard;
