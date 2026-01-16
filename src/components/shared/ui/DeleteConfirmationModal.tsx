import { AlertTriangle } from 'lucide-react';
import { iconConfig } from '../../../config/icons';
import Modal from './Modal';
import Button from './Button';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    loading?: boolean;
}

/**
 * DELETE CONFIRMATION MODAL
 * A specialized version of the Modal component for destructive actions.
 * Follows the same native responsive patterns.
 */
export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmer la suppression",
    description = "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
    itemName,
    loading = false
}: DeleteConfirmationModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="sm:flex-1"
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        loading={loading}
                        className="sm:flex-1"
                    >
                        Supprimer
                    </Button>
                </>
            }
        >
            <div className="flex flex-row items-start gap-4 sm:gap-6">
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl shrink-0">
                    <AlertTriangle
                        className="w-8 h-8 text-red-500"
                        strokeWidth={iconConfig.strokeWidth}
                    />
                </div>

                <div className="flex flex-col gap-3 text-left">
                    <p className="text-main font-medium text-lg leading-tight">
                        {description}
                    </p>
                    {itemName && (
                        <div className="inline-flex">
                            <p className="px-4 py-1.5 bg-red-500/5 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 font-bold text-sm">
                                {itemName}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
