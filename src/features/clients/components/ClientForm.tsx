import { useState, useEffect } from 'react';
import type { Client } from '@/types/tables';
import { Button, Input } from '@/components/shared/ui';

interface ClientFormProps {
    initialData?: Client | null;
    onSubmit: (data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

/**
 * COMPONENT: ClientForm
 * Shared form for Creating and Editing clients.
 */
export default function ClientForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting
}: ClientFormProps) {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset or Fill form when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                nom: initialData.nom,
                prenom: initialData.prenom
            });
        } else {
            setFormData({ nom: '', prenom: '' });
        }
        setErrors({});
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
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
        if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
        if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Form submission error:', error);
            // Error handling is usually managed by the parent/hook (e.g., Toast)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex: Aakki"
                    error={errors.nom}
                    required
                    autoFocus
                />
                <Input
                    label="Prénom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Ex: Oussama"
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
                    {initialData ? 'Enregistrer les modifications' : 'Créer le client'}
                </Button>
            </div>
        </form>
    );
}
