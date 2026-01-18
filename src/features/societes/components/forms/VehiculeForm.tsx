import { useState } from 'react';
import type { Vehicule } from '@/types/tables';
import { Button, Input } from '@/components/shared/ui';
import { sanitize } from '@/lib/utils/sanitizers';

interface VehiculeFormProps {
    initialData?: Partial<Vehicule>;
    onSubmit: (data: Omit<Vehicule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    societeId?: string;
}

export default function VehiculeForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
    societeId
}: VehiculeFormProps) {

    const [formData, setFormData] = useState(() => ({
        matricule: initialData?.matricule ?? '',
        societe_id: initialData?.societe_id ?? societeId ?? ''
    }));

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const cleanedValue = sanitize.alphanumeric(value).toUpperCase();
        setFormData(prev => ({ ...prev, [name]: cleanedValue }));

        if (errors[name]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        const trimmed = formData.matricule.trim();

        if (!trimmed) {
            newErrors.matricule = 'Le matricule est requis';
        } else if (trimmed.length < 3) {
            newErrors.matricule = 'Le matricule doit contenir au moins 3 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        await onSubmit({
            ...formData,
            matricule: formData.matricule.trim().toUpperCase()
        } as unknown as Omit<Vehicule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>);
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
