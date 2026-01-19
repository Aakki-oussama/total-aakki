import { Modal, Button, Input, Select, SearchSelect } from '@/components/shared/ui';
import PaiementTypeSelector from './PaiementTypeSelector';
import type { Avance } from '@/types/tables';
import type { AvanceWithDetails } from '../services/avanceService';
import { Plus, Search } from 'lucide-react';
import { iconConfig } from '@/config/icons';
import { useAvanceForm } from '../hooks/useAvanceForm';

interface AvanceFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Avance, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
    onQuickCreateClient: (data: { nom: string; prenom: string; montant: number }) => Promise<void>;
    onQuickCreateSociete: (data: { nom_societe: string; montant: number }) => Promise<void>;
    initialData?: AvanceWithDetails | null;
    isSubmitting?: boolean;
}

/**
 * COMPONENT: AvanceForm
 * Handles creating and editing payments with an intelligent 'Quick Create' feature.
 * UI is kept clean by delegating logic to useAvanceForm hook.
 */
export default function AvanceForm({
    isOpen,
    onClose,
    onSubmit,
    onQuickCreateClient,
    onQuickCreateSociete,
    initialData,
    isSubmitting
}: AvanceFormProps) {
    const form = useAvanceForm({
        initialData,
        onClose,
        onSubmit,
        onQuickCreateClient,
        onQuickCreateSociete
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Modifier le paiement" : "Enregistrer un paiement"}
            size="md"
        >
            <form onSubmit={form.handleSubmit} className="space-y-4">
                {/* 1. Entity Type Toggle (Client vs Society) */}
                {!initialData && (
                    <PaiementTypeSelector
                        selectedType={form.type}
                        onTypeChange={(t) => { form.setType(t); form.setEntityId(''); }}
                    />
                )}

                {/* 2. Mode Toggle (Existing entity vs Quick Create) */}
                {!initialData && (
                    <div className="flex items-center gap-2 mb-2 p-1 bg-muted/5 rounded-lg border border-border/30">
                        <button
                            type="button"
                            onClick={() => form.setIsNewEntity(false)}
                            className={`flex-1 py-1.5 px-3 rounded-md text-[10px] md:text-xs font-bold transition-all ${!form.isNewEntity ? 'bg-white shadow-sm border border-border text-primary' : 'text-muted'}`}
                        >
                            <span className="flex items-center justify-center gap-1.5">
                                <Search className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} /> Existant
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => form.setIsNewEntity(true)}
                            className={`flex-1 py-1.5 px-3 rounded-md text-[10px] md:text-xs font-bold transition-all ${form.isNewEntity ? 'bg-white shadow-sm border border-border text-primary' : 'text-muted'}`}
                        >
                            <span className="flex items-center justify-center gap-1.5">
                                <Plus className={iconConfig.sizes.xs} strokeWidth={iconConfig.strokeWidth} /> Nouveau {form.type === 'CLIENT' ? 'Client' : 'Société'}
                            </span>
                        </button>
                    </div>
                )}

                {/* 3. Entity Selection / Name Fields */}
                <div className="bg-muted/5 p-3 rounded-xl border border-border/50">
                    {form.isNewEntity ? (
                        <div className="grid grid-cols-2 gap-3">
                            {form.type === 'CLIENT' ? (
                                <>
                                    <Input label="Nom" value={form.newNom} onChange={e => form.setNewNom(e.target.value)} required placeholder="Nom" />
                                    <Input label="Prénom" value={form.newPrenom} onChange={e => form.setNewPrenom(e.target.value)} required placeholder="Prénom" />
                                </>
                            ) : (
                                <div className="col-span-full">
                                    <Input label="Nom de la Société" value={form.newNomSociete} onChange={e => form.setNewNomSociete(e.target.value)} required placeholder="Ex: STCR Transport" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <SearchSelect
                            label={form.type === 'CLIENT' ? "Client" : "Société"}
                            options={form.entityOptions}
                            value={form.entityId}
                            onChange={form.setEntityId}
                            isLoading={form.loadingEntities}
                            placeholder="Sélectionner..."
                            required
                        />
                    )}
                </div>

                {/* 4. Payment Details (Amount, Date, Mode) */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Montant (DH)"
                        type="number"
                        value={form.montant}
                        onChange={e => form.setMontant(e.target.value)}
                        required
                        placeholder="500"
                        min="1"
                        step="1"
                    />
                    <Input label="Date" type="date" value={form.dateAvance} onChange={e => form.setDateAvance(e.target.value)} required />

                    <Select
                        label="Mode"
                        value={form.modePaiement}
                        onChange={e => form.setModePaiement(e.target.value as 'CASH' | 'CHEQUE')}
                        required
                        options={[
                            { value: 'CASH', label: 'CASH' },
                            { value: 'CHEQUE', label: 'Chèque' }
                        ]}
                    />

                    {form.modePaiement === 'CHEQUE' && (
                        <Input label="N° Chèque" value={form.numeroCheque} onChange={e => form.setNumeroCheque(e.target.value)} required placeholder="CH-XXXX" />
                    )}
                </div>

                {/* 5. Footer Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
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
                    >
                        {initialData ? 'Enregistrer les modifications' : 'Confirmer le paiement'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
