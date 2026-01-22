import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/shared/ui';

interface SocieteIdentityHeaderProps {
    societe?: {
        nom_societe: string;
    };
}

/**
 * COMPONENT: SocieteIdentityHeader
 * Un en-tête simple et propre affichant le nom de la société.
 */
export default function SocieteIdentityHeader({ societe }: SocieteIdentityHeaderProps) {
    const navigate = useNavigate();

    if (!societe) return null;

    return (
        <div className="flex items-center justify-between gap-6 p-4 -ml-2">
            {/* Identity Section */}
            <div className="flex items-center gap-5">
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 shadow-inner">
                        <Building2 size={32} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-surface shadow-sm border border-border flex items-center justify-center text-[10px] font-bold">
                        SOC
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-main tracking-tight leading-tight">
                        {societe.nom_societe}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="info" size="sm">Entreprise / Société</Badge>
                    </div>
                </div>
            </div>

            {/* Bouton Retour */}
            <button
                onClick={() => navigate('/societes')}
                className="p-2.5 rounded-xl bg-surface border border-border hover:bg-muted/10 transition-colors text-muted hover:text-main group"
                title="Retour à la liste"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
}
