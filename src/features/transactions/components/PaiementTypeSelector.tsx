import { User, Building2 } from 'lucide-react';
import { iconConfig } from '@/config/icons';

interface PaiementTypeSelectorProps {
    selectedType: 'CLIENT' | 'SOCIETE';
    onTypeChange: (type: 'CLIENT' | 'SOCIETE') => void;
}

/**
 * COMPONENT: PaiementTypeSelector (V4 - Ultra Clean & Slim)
 * A lightweight, horizontal segmented control with a small gap.
 * Designed to be fast, responsive, and minimalist.
 */
export default function PaiementTypeSelector({
    selectedType,
    onTypeChange
}: PaiementTypeSelectorProps) {
    return (
        <div className="flex gap-2 w-full mb-4">
            {/* Option: CLIENT */}
            <button
                type="button"
                onClick={() => onTypeChange('CLIENT')}
                className={`
                    flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all duration-200
                    ${selectedType === 'CLIENT'
                        ? 'bg-primary border-primary text-white shadow-md'
                        : 'bg-surface border-border text-muted hover:border-primary/50 hover:text-main'
                    }
                `}
            >
                <User
                    className={iconConfig.sizes.breadcrumb}
                    strokeWidth={2}
                />
                <span className="text-xs font-bold whitespace-nowrap">Client</span>
            </button>

            {/* Option: SOCIETE */}
            <button
                type="button"
                onClick={() => onTypeChange('SOCIETE')}
                className={`
                    flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all duration-200
                    ${selectedType === 'SOCIETE'
                        ? 'bg-primary border-primary text-white shadow-md'
                        : 'bg-surface border-border text-muted hover:border-primary/50 hover:text-main'
                    }
                `}
            >
                <Building2
                    className={iconConfig.sizes.breadcrumb}
                    strokeWidth={2}
                />
                <span className="text-xs font-bold whitespace-nowrap">Société</span>
            </button>
        </div>
    );
}
