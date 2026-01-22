import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/shared/ui';

interface ClientIdentityHeaderProps {
    client?: {
        nom: string;
        prenom: string;
    };
    loading?: boolean;
}

/**
 * COMPONENT: ClientIdentityHeader
 * Un en-tête simple et propre affichant l'identité du client et un bouton retour.
 */
export default function ClientIdentityHeader({ client }: ClientIdentityHeaderProps) {
    const navigate = useNavigate();

    if (!client) return null;

    return (
        <div className="flex items-center justify-between gap-6 p-4 -ml-2">
            {/* Identity Section */}
            <div className="flex items-center gap-5">
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <User size={32} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-surface shadow-sm border border-border flex items-center justify-center text-[10px] font-bold">
                        ID
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-main tracking-tight leading-tight">
                        {client.nom} <span className="text-primary/80">{client.prenom}</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="neutral" size="sm">Client Particulier</Badge>
                    </div>
                </div>
            </div>

            {/* Bouton Retour */}
            <button
                onClick={() => navigate('/clients')}
                className="p-2.5 rounded-xl bg-surface border border-border hover:bg-muted/10 transition-colors text-muted hover:text-main group"
                title="Retour à la liste"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
}
