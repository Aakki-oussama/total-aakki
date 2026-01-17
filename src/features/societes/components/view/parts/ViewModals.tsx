import { Modal, DeleteConfirmationModal } from '@/components/shared/ui';
import EmployeForm from '../../forms/EmployeForm';
import VehiculeForm from '../../forms/VehiculeForm';
import type { Employe, Vehicule } from '@/types/tables';

interface ViewModalsProps {
    societeId: string;
    // Employés
    empForm: {
        isOpen: boolean;
        selected: Employe | null;
        close: () => void;
        submit: (data: Omit<Employe, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
        isSubmitting: boolean
    };
    empDelete: { isOpen: boolean; confirm: () => void };
    // Véhicules
    vehForm: {
        isOpen: boolean;
        selected: Vehicule | null;
        close: () => void;
        submit: (data: Omit<Vehicule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
        isSubmitting: boolean
    };
    vehDelete: { isOpen: boolean; confirm: () => void };
}

export default function ViewModals({ societeId, empForm, empDelete, vehForm, vehDelete }: ViewModalsProps) {
    return (
        <>
            {/* MODALS EMPLOYES */}
            <Modal
                isOpen={empForm.isOpen}
                onClose={empForm.close}
                title={empForm.selected ? 'Modifier Chauffeur' : 'Nouveau Chauffeur'}
                size="md"
            >
                <EmployeForm
                    initialData={empForm.selected || undefined}
                    onSubmit={(data) => empForm.submit({ ...data, societe_id: societeId })}
                    onCancel={empForm.close}
                    isSubmitting={empForm.isSubmitting}
                    societeId={societeId}
                />
            </Modal>
            <DeleteConfirmationModal
                isOpen={empDelete.isOpen}
                onClose={empForm.close}
                onConfirm={empDelete.confirm}
                title="Supprimer ce chauffeur ?"
                description={`Voulez-vous vraiment supprimer ${empForm.selected?.nom} ${empForm.selected?.prenom} ?`}
                loading={empForm.isSubmitting}
            />

            {/* MODALS VEHICULES */}
            <Modal
                isOpen={vehForm.isOpen}
                onClose={vehForm.close}
                title={vehForm.selected ? 'Modifier Véhicule' : 'Nouveau Véhicule'}
                size="md"
            >
                <VehiculeForm
                    initialData={vehForm.selected || undefined}
                    onSubmit={(data) => vehForm.submit({ ...data, societe_id: societeId })}
                    onCancel={vehForm.close}
                    isSubmitting={vehForm.isSubmitting}
                    societeId={societeId}
                />
            </Modal>
            <DeleteConfirmationModal
                isOpen={vehDelete.isOpen}
                onClose={vehForm.close}
                onConfirm={vehDelete.confirm}
                title="Supprimer ce véhicule ?"
                description={`Voulez-vous vraiment supprimer le véhicule ${vehForm.selected?.matricule} ?`}
                loading={vehForm.isSubmitting}
            />
        </>
    );
}
