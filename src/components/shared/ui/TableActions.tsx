import { Eye, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import Button from './Button';
import { useState, useRef, useEffect } from 'react';
import { iconConfig } from '../../../config/icons';

interface TableActionsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    viewLabel?: string;
    editLabel?: string;
    deleteLabel?: string;
}

/**
 * TABLE ACTIONS COMPONENT
 * A premium, responsive action group for table rows.
 * Shows direct buttons on desktop and a menu on mobile.
 */
export default function TableActions({
    onView,
    onEdit,
    onDelete,
    viewLabel = "Voir",
    editLabel = "Modifier",
    deleteLabel = "Supprimer"
}: TableActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent scroll when menu is open on mobile
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className="flex items-center justify-end gap-2">
            {/* Desktop View: Horizontal Buttons */}
            <div className="hidden lg:flex items-center gap-2">
                {onView && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onView}
                        className={`${iconConfig.sizes.actionButton} p-0 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20`}
                        title={viewLabel}
                    >
                        <Eye className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                    </Button>
                )}
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className={`${iconConfig.sizes.actionButton} p-0 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20`}
                        title={editLabel}
                    >
                        <Edit2 className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                    </Button>
                )}
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className={`${iconConfig.sizes.actionButton} p-0 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
                        title={deleteLabel}
                    >
                        <Trash2 className={iconConfig.sizes.breadcrumb} strokeWidth={iconConfig.strokeWidth} />
                    </Button>
                )}
            </div>

            {/* Mobile/Tablet View: Native Action Sheet */}
            <div className="lg:hidden">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                    className={`${iconConfig.sizes.actionButton} p-0`}
                >
                    <MoreHorizontal className={iconConfig.sizes.header} strokeWidth={iconConfig.strokeWidth} />
                </Button>

                {isOpen && (
                    <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Action Sheet Content */}
                        <div
                            ref={menuRef}
                            className="relative w-full sm:max-w-xs bg-surface border-t sm:border border-border rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl p-4 sm:p-2 pb-10 sm:pb-2 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 ease-out"
                        >
                            {/* Drag Handle (Mobile only) */}
                            <div className="flex justify-center mb-6 sm:hidden">
                                <div className="w-12 h-1.5 bg-muted/20 rounded-full" />
                            </div>

                            <div className="flex flex-col gap-1">
                                {onView && (
                                    <button
                                        onClick={() => { onView(); setIsOpen(false); }}
                                        className="flex items-center gap-4 w-full px-4 py-4 sm:py-2.5 text-base sm:text-sm font-bold text-main hover:bg-muted/5 rounded-2xl transition-colors group"
                                    >
                                        <div className="p-2 sm:p-0 bg-indigo-50 sm:bg-transparent rounded-xl">
                                            <Eye className={`${iconConfig.sizes.breadcrumb} text-indigo-600 sm:text-muted sm:group-hover:text-indigo-600`} strokeWidth={iconConfig.strokeWidth} />
                                        </div>
                                        {viewLabel}
                                    </button>
                                )}
                                {onEdit && (
                                    <button
                                        onClick={() => { onEdit(); setIsOpen(false); }}
                                        className="flex items-center gap-4 w-full px-4 py-4 sm:py-2.5 text-base sm:text-sm font-bold text-main hover:bg-muted/5 rounded-2xl transition-colors group"
                                    >
                                        <div className="p-2 sm:p-0 bg-amber-50 sm:bg-transparent rounded-xl">
                                            <Edit2 className={`${iconConfig.sizes.breadcrumb} text-amber-600 sm:text-muted sm:group-hover:text-amber-600`} strokeWidth={iconConfig.strokeWidth} />
                                        </div>
                                        {editLabel}
                                    </button>
                                )}
                                {onDelete && (
                                    <div className="mt-2 pt-2 border-t border-border sm:border-none sm:pt-0 sm:mt-0">
                                        <button
                                            onClick={() => { onDelete(); setIsOpen(false); }}
                                            className="flex items-center gap-4 w-full px-4 py-4 sm:py-2.5 text-base sm:text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors group"
                                        >
                                            <div className="p-2 sm:p-0 bg-red-50 sm:bg-transparent rounded-xl">
                                                <Trash2 className={`${iconConfig.sizes.breadcrumb} group-hover:text-red-700`} strokeWidth={iconConfig.strokeWidth} />
                                            </div>
                                            {deleteLabel}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
