import { useState, useEffect } from 'react';
import type { Employe } from '@/types/tables';
import { Button, Input } from '@/components/shared/ui';
import { sanitize } from '@/lib/utils/sanitizers';

interface EmployeFormProps {
    /** Données initiales pour la modification */
    initialData?: Partial<Employe>;
    /** Callback de soumission */
    onSubmit: (data: Omit<Employe, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
    /** Callback d'annulation */
    onCancel: () => void;
    /** État de soumission global */
    isSubmitting: boolean;
    /** ID de la société (optionnel si utilisé dans le formulaire global) */
    societeId?: string;
}

/**
 * COMPONENT: EmployeForm
 * Formulaire atomique pour la gestion d'un employé.
 * Réutilisable dans le formulaire global Société ou dans un modal d'ajout rapide.
 */
export default function EmployeForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
    societeId
}: EmployeFormProps) {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        societe_id: societeId || ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Remplissage si modification
    useEffect(() => {
        if (initialData) {
            setFormData({
                nom: initialData.nom || '',
                prenom: initialData.prenom || '',
                societe_id: initialData.societe_id || societeId || ''
            });
        }
    }, [initialData, societeId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Nettoyage en temps réel via l'utilitaire global
        const cleanedValue = sanitize.alpha(value);

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
        const trimmedNom = formData.nom.trim();
        const trimmedPrenom = formData.prenom.trim();

        if (!trimmedNom) {
            newErrors.nom = 'Le nom est requis';
        } else if (trimmedNom.length < 2) {
            newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!trimmedPrenom) {
            newErrors.prenom = 'Le prénom est requis';
        } else if (trimmedPrenom.length < 2) {
            newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
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
                nom: formData.nom.trim(),
                prenom: formData.prenom.trim()
            } as any);
        } catch (error) {
            console.error('EmployeForm submission error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex: Alami"
                    error={errors.nom}
                    required
                    autoFocus
                />
                <Input
                    label="Prénom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Ex: Ahmed"
                    error={errors.prenom}
                    required
                />
            </div>

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
