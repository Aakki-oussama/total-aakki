import { Plus, Trash2, Users } from 'lucide-react';
import { Button, Input } from '@/components/shared/ui';
import { sanitize } from '@/lib/utils/sanitizers';
import { iconConfig } from '@/config/icons';

interface EmployeSectionProps {
    employes: { nom: string; prenom: string }[];
    onChange: (employes: { nom: string; prenom: string }[]) => void;
}

export default function EmployeSection({ employes, onChange }: EmployeSectionProps) {
    const addRow = () => onChange([...employes, { nom: '', prenom: '' }]);

    const removeRow = (index: number) => {
        if (employes.length > 1) {
            onChange(employes.filter((_, i) => i !== index));
        }
    };

    const updateRow = (index: number, field: 'nom' | 'prenom', value: string) => {
        const newRows = [...employes];
        newRows[index][field] = sanitize.alpha(value);
        onChange(newRows);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2 text-primary font-semibold">
                    <Users size={20} />
                    <span>Équipe (Chauffeurs)</span>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={addRow}
                    icon={<Plus size={18} strokeWidth={2.5} />}
                    className={`${iconConfig.sizes.square} lg:w-auto p-0 lg:px-4 flex items-center justify-center border-primary/30 text-primary hover:bg-primary/5 shadow-sm`}
                >
                    <span className="hidden lg:inline text-xs font-bold">Ajouter un chauffeur</span>
                </Button>
            </div>

            <div className="space-y-3">
                {employes.map((emp, index) => (
                    <div key={index} className="flex gap-3 items-start group animate-in fade-in slide-in-from-top-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                            <Input
                                label={index === 0 ? "Nom" : ""}
                                value={emp.nom}
                                onChange={(e) => updateRow(index, 'nom', e.target.value)}
                                placeholder="Nom"
                            />
                            <Input
                                label={index === 0 ? "Prénom" : ""}
                                value={emp.prenom}
                                onChange={(e) => updateRow(index, 'prenom', e.target.value)}
                                placeholder="Prénom"
                            />
                        </div>
                        {employes.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                className={`text-red-500 hover:text-red-600 p-2 ${index === 0 ? 'mt-8' : 'mt-1'}`}
                                onClick={() => removeRow(index)}
                            >
                                <Trash2 size={18} />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
