import { useState } from 'react';
import { Button, Input } from '@/components/shared/ui';
import type { Societe } from '@/types/tables';
import { sanitize } from '@/lib/utils/sanitizers';

interface SocieteFormProps {
    initialData?: Societe | null;
    isSubmitting: boolean;
    onSubmit: (data: { nom_societe: string }) => Promise<void>;
    onCancel: () => void;
}

/**
 * COMPONENT: SocieteForm
 * Formulaire pour créer ou modifier une société.
 */
export default function SocieteForm({ initialData, isSubmitting, onSubmit, onCancel }: SocieteFormProps) {
    const [nomSociete, setNomSociete] = useState(() => initialData?.nom_societe ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNameChange = (val: string) => {
        setNomSociete(sanitize.alphanumeric(val));
        if (errors.nom_societe) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.nom_societe;
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        const trimmedName = nomSociete.trim();
        if (!trimmedName) {
            newErrors.nom_societe = 'Le nom de la société est requis';
        } else if (trimmedName.length < 2) {
            newErrors.nom_societe = 'Le nom doit contenir au moins 2 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        await onSubmit({
            nom_societe: nomSociete.trim()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Input
                label="Nom de la Société"
                value={nomSociete}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Entreprise Transport Aakki"
                error={errors.nom_societe}
                required
                autoFocus
            />

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-border">
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
                    {initialData ? 'Enregistrer les modifications' : 'Créer la Société'}
                </Button>
            </div>
        </form>
    );
}
