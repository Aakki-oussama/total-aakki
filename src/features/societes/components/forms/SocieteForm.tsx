import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Button, Input } from '@/components/shared/ui';
import type { Societe } from '@/types/tables';
import { sanitize } from '@/lib/utils/sanitizers';

// Import des sous-sections
import EmployeSection from './parts/EmployeSection';
import VehiculeSection from './parts/VehiculeSection';

interface SocieteFormProps {
    initialData?: Societe | null;
    isSubmitting: boolean;
    onSubmit: (data: {
        nom_societe: string;
        employes: { nom: string; prenom: string }[];
        vehicules: { matricule: string }[];
    }) => Promise<void>;
    onCancel: () => void;
}

export default function SocieteForm({ initialData, isSubmitting, onSubmit, onCancel }: SocieteFormProps) {
    // Lazy initialization
    const [nomSociete, setNomSociete] = useState(() => initialData?.nom_societe ?? '');

    // Arrays: If editing (initialData exists), we start empty (since we don't edit details here usually).
    // If creating, we start with 1 empty row.
    const [employes, setEmployes] = useState<{ nom: string; prenom: string }[]>(() =>
        initialData ? [] : [{ nom: '', prenom: '' }]
    );
    const [vehicules, setVehicules] = useState<{ matricule: string }[]>(() =>
        initialData ? [] : [{ matricule: '' }]
    );

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

        // On ne garde que les lignes qui ont des données
        const finalData = {
            nom_societe: nomSociete.trim(),
            employes: employes.filter(emp => emp.nom.trim() || emp.prenom.trim()),
            vehicules: vehicules.filter(veh => veh.matricule.trim())
        };

        await onSubmit(finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* 1. Informations Société */}
            <div className="bg-muted/5 p-5 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                    <Building2 size={20} />
                    <span>Informations de la Société</span>
                </div>
                <Input
                    label="Nom de la Société"
                    value={nomSociete}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Entreprise Transport Aakki"
                    error={errors.nom_societe}
                    required
                    autoFocus
                />
            </div>

            {/* 2. Sections Dynamiques (Seulement en création pour le bulk) */}
            {!initialData && (
                <div className="space-y-10">
                    <EmployeSection
                        employes={employes}
                        onChange={setEmployes}
                    />

                    <VehiculeSection
                        vehicules={vehicules}
                        onChange={setVehicules}
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-border">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Annuler
                </Button>
                <Button type="submit" variant="primary" loading={isSubmitting}>
                    {initialData ? 'Enregistrer les modifications' : 'Créer la Société et son Équipe'}
                </Button>
            </div>
        </form>
    );
}
