import { Modal, Button, Input, SearchSelect } from '@/components/shared/ui';
import PaiementTypeSelector from './PaiementTypeSelector';
import type { Gasoil } from '@/types/tables';
import type { GasoilWithDetails } from '../services/gasoilService';
import { useGasoilForm } from '../hooks/useGasoilForm';
import { iconConfig } from '@/config/icons';
import { Truck, UserCircle } from 'lucide-react';

interface GasoilFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Gasoil, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
    initialData?: GasoilWithDetails | null;
    isSubmitting?: boolean;
}

/**
 * COMPONENT: GasoilForm
 * Formulaire dynamique pour enregistrer les consommations de carburant.
 * S'adapte selon que le bénéficiaire est un Client ou une Société.
 */
export default function GasoilForm({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isSubmitting
}: GasoilFormProps) {
    const form = useGasoilForm({ initialData, onClose, onSubmit });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Modifier la consommation" : "Enregistrer du Gasoil"}
            size="md"
        >
            <form onSubmit={form.handleSubmit} className="space-y-4">
                {/* 1. Sélecteur Type (Client vs Société) */}
                {!initialData && (
                    <PaiementTypeSelector
                        selectedType={form.type}
                        onTypeChange={(t) => { form.setType(t); form.setEntityId(''); }}
                    />
                )}

                {/* 2. Sélection du Bénéficiaire */}
                <div className="bg-muted/5 p-3 rounded-xl border border-border/50">
                    <SearchSelect
                        label={form.type === 'CLIENT' ? "Client" : "Société"}
                        options={form.entityOptions}
                        value={form.entityId}
                        onChange={form.setEntityId}
                        isLoading={form.loadingEntities}
                        placeholder={`Chercher un ${form.type === 'CLIENT' ? 'client' : 'société'}...`}
                        required
                    />
                </div>

                {/* 3. Détails spécifiques si c'est une Société (Visible uniquement si une société est sélectionnée) */}
                {form.type === 'SOCIETE' && form.entityId && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/30 rounded-xl border border-blue-100/50 animate-in fade-in zoom-in duration-300">
                        <SearchSelect
                            label={
                                <span className="inline-flex items-center gap-1.5 text-blue-700">
                                    <UserCircle className={iconConfig.sizes.xs} /> Chauffeur
                                </span>
                            }
                            options={form.employeOptions}
                            value={form.employeId}
                            onChange={form.setEmployeId}
                            isLoading={form.loadingDetails}
                            placeholder="Chauffeur..."
                            required
                        />
                        <SearchSelect
                            label={
                                <span className="inline-flex items-center gap-1.5 text-blue-700">
                                    <Truck className={iconConfig.sizes.xs} /> Véhicule
                                </span>
                            }
                            options={form.vehiculeOptions}
                            value={form.vehiculeId}
                            onChange={form.setVehiculeId}
                            isLoading={form.loadingDetails}
                            placeholder="Immatriculation..."
                            required
                        />
                    </div>
                )}

                {/* 4. Détails Financiers & Date */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Montant (DH)"
                        type="number"
                        value={form.montant}
                        onChange={e => form.setMontant(e.target.value)}
                        required
                        placeholder="100"
                        min="1"
                        step="1"
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={form.dateGasoil}
                        onChange={e => form.setDateGasoil(e.target.value)}
                        required
                    />
                </div>

                {/* 5. Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border mt-6">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        loading={isSubmitting}
                        disabled={form.type === 'SOCIETE' && (!form.employeId || !form.vehiculeId)}
                    >
                        {initialData ? 'Mettre à jour' : 'Enregistrer Gasoil'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
