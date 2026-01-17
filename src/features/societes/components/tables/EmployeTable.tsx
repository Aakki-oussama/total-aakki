import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import type { Employe } from '@/types/tables';
import { TableActions, DataTable } from '@/components/shared/ui';

interface EmployeTableProps<T extends Employe = Employe> {
    employes: T[];
    loading: boolean;
    onEdit: (employe: T) => void;
    onDelete: (employe: T) => void;
    onView?: (employe: T) => void;
}

export default function EmployeTable<T extends Employe>({
    employes,
    loading,
    onEdit,
    onDelete,
    onView
}: EmployeTableProps<T>) {
    const columns = useMemo(() => [
        {
            header: 'Chauffeur',
            render: (emp: T) => (
                <div className="flex flex-col py-1">
                    <span className="font-bold text-main leading-tight">{emp.nom} {emp.prenom}</span>
                </div>
            )
        },
        {
            header: 'Enregistré le',
            render: (emp: T) => (
                <div className="flex items-center gap-2 text-muted">
                    <Calendar size={14} className="hidden sm:inline" />
                    <span className="font-medium text-xs md:text-sm">
                        {new Date(emp.created_at || '').toLocaleDateString('fr-FR', {
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
            render: (emp: T) => (
                <TableActions
                    onView={onView ? () => onView(emp) : undefined}
                    onEdit={() => onEdit(emp)}
                    onDelete={() => onDelete(emp)}
                    viewLabel="Voir Profil"
                />
            )
        }
    ], [onEdit, onDelete, onView]);

    return (
        <DataTable
            data={employes}
            columns={columns}
            loading={loading}
            emptyState={
                <div className="py-12 text-center">
                    <p className="text-muted font-medium">Aucun chauffeur enregistré.</p>
                </div>
            }
        />
    );
}
