import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import type { Vehicule } from '@/types/tables';
import { TableActions, DataTable } from '@/components/shared/ui';

interface VehiculeTableProps<T extends Vehicule = Vehicule> {
    vehicules: T[];
    loading: boolean;
    onEdit: (vehicule: T) => void;
    onDelete: (vehicule: T) => void;
}

export default function VehiculeTable<T extends Vehicule>({
    vehicules,
    loading,
    onEdit,
    onDelete
}: VehiculeTableProps<T>) {
    const columns = useMemo(() => [
        {
            header: 'Matricule',
            render: (veh: T) => (
                <div className="flex flex-col py-1">
                    <span className="font-mono font-bold text-main tracking-widest uppercase text-sm md:text-base border border-border/50 px-2 py-0.5 rounded-lg bg-muted/20 w-fit">
                        {veh.matricule}
                    </span>
                </div>
            )
        },
        {
            header: 'Ajouté le',
            render: (veh: T) => (
                <div className="flex items-center gap-2 text-muted">
                    <Calendar size={14} className="hidden sm:inline" />
                    <span className="font-medium text-xs md:text-sm">
                        {new Date(veh.created_at || '').toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            render: (veh: T) => (
                <TableActions
                    onEdit={() => onEdit(veh)}
                    onDelete={() => onDelete(veh)}
                />
            )
        }
    ], [onEdit, onDelete]);

    return (
        <DataTable
            data={vehicules}
            columns={columns}
            loading={loading}
            emptyState={
                <div className="py-12 text-center">
                    <p className="text-muted font-medium">Aucun véhicule enregistré.</p>
                </div>
            }
        />
    );
}
