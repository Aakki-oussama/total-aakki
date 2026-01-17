import { Plus, Trash2, Truck } from 'lucide-react';
import { Button, Input } from '@/components/shared/ui';
import { sanitize } from '@/lib/utils/sanitizers';
import { iconConfig } from '@/config/icons';

interface VehiculeSectionProps {
    vehicules: { matricule: string }[];
    onChange: (vehicules: { matricule: string }[]) => void;
}

export default function VehiculeSection({ vehicules, onChange }: VehiculeSectionProps) {
    const addRow = () => onChange([...vehicules, { matricule: '' }]);

    const removeRow = (index: number) => {
        if (vehicules.length > 1) {
            onChange(vehicules.filter((_, i) => i !== index));
        }
    };

    const updateRow = (index: number, value: string) => {
        const newRows = [...vehicules];
        newRows[index].matricule = sanitize.alphanumeric(value).toUpperCase();
        onChange(newRows);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2 text-primary font-semibold">
                    <Truck size={20} />
                    <span>Flotte (Véhicules)</span>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={addRow}
                    icon={<Plus size={18} strokeWidth={2.5} />}
                    className={`${iconConfig.sizes.square} lg:w-auto p-0 lg:px-4 flex items-center justify-center border-primary/30 text-primary hover:bg-primary/5 shadow-sm`}
                >
                    <span className="hidden lg:inline text-xs font-bold">Ajouter un véhicule</span>
                </Button>
            </div>

            <div className="space-y-3">
                {vehicules.map((veh, index) => (
                    <div key={index} className="flex gap-3 items-end animate-in fade-in slide-in-from-top-1">
                        <div className="flex-1">
                            <Input
                                label={index === 0 ? "Matricule" : ""}
                                value={veh.matricule}
                                onChange={(e) => updateRow(index, e.target.value)}
                                placeholder="Ex: 12345A67"
                            />
                        </div>
                        {vehicules.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 p-2 mb-0.5"
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
