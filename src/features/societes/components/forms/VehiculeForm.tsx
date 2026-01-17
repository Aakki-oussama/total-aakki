import { useState, useEffect } from 'react';
import type { Vehicule } from '@/types/tables';
import { Button, Input } from '@/components/shared/ui';
import { sanitize } from '@/lib/utils/sanitizers';

interface VehiculeFormProps {
    /** Données initiales pour la modification */
    initialData?: Partial<Vehicule>;
    /** Callback de soumission */
    onSubmit: (data: Omit<Vehicule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
    /** Callback d'annulation */
    onCancel: () => void;
    /** État de soumission global */
    isSubmitting: boolean;
    /** ID de la société (optionnel si utilisé dans le formulaire global) */
    societeId?: string;
}

/**
 * COMPONENT: VehiculeForm
 * Formulaire atomique pour la gestion d'un véhicule.
 * Utilise le sanitizer alphanumeric pour les matricules.
 */
export default function VehiculeForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
    societeId
}: VehiculeFormProps) {
    const [formData, setFormData] = useState({
        matricule: '',
        societe_id: societeId || ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Remplissage si modification
    useEffect(() => {
        if (initialData) {
            setFormData({
                matricule: initialData.matricule || '',
                societe_id: initialData.societe_id || societeId || ''
            });
        }
    }, [initialData, societeId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Nettoyage en temps réel : Lettres et Chiffres uniquement pour les plaques
        const cleanedValue = sanitize.alphanumeric(value).toUpperCase();

        setFormData(prev => ({ ...prev, [name]: cleanedValue }));

        // Clear error
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        const trimmedMatricule = formData.matricule.trim();

        if (!trimmedMatricule) {
            newErrors.matricule = 'Le matricule est requis';
        } else if (trimmedMatricule.length < 3) {
            newErrors.matricule = 'Le matricule doit contenir au moins 3 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await onSubmit({
                ...formData,
                matricule: formData.matricule.trim().toUpperCase()
            } as any);
        } catch (error) {
            console.error('VehiculeForm submission error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
                label="Matricule"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                placeholder="Ex: 12345A67"
                error={errors.matricule}
                required
                autoFocus
            />

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Annuler
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                >
                    {initialData?.id ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
            </div>
        </form>
    );
}
