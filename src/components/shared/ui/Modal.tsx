import { type ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { iconConfig } from '../../../config/icons';
import Button from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnClickOutside?: boolean;
}

/**
 * MODAL COMPONENT
 * A premium, responsive modal that follows native patterns:
 * - Desktop: Centered dialog with backdrop blur.
 * - Mobile/Tablet: Slid-up bottom sheet or full-screen native feel.
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    closeOnClickOutside = true
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw]'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop with premium blur */}
            <div
                className="absolute inset-0 bg-main/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={closeOnClickOutside ? onClose : undefined}
            />

            {/* Modal Content */}
            <div
                ref={modalRef}
                className={`
                    relative w-full ${sizeClasses[size]} 
                    bg-surface border-t sm:border border-border 
                    rounded-t-[2.5rem] sm:rounded-[2rem] 
                    shadow-2xl shadow-indigo-500/10 
                    flex flex-col max-h-[92vh] sm:max-h-[90vh]
                    animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 ease-out
                `}
            >
                {/* Drag Handle for Mobile (Native look) */}
                <div className="sm:hidden flex justify-center py-3">
                    <div className="w-12 h-1.5 bg-muted/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 sm:px-8 pt-2 sm:pt-8 pb-4 flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        {title && (
                            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-main">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-muted text-sm sm:text-base font-medium leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-10 w-10 p-0 rounded-full bg-muted/5 hover:bg-muted/10 flex items-center justify-center"
                    >
                        <X className={iconConfig.sizes.header} strokeWidth={iconConfig.strokeWidth} />
                    </Button>
                </div>

                {/* Body - Scrollable */}
                <div className="px-6 sm:px-8 py-4 overflow-y-auto custom-scrollbar flex-1 text-main text-sm sm:text-base">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 sm:px-8 py-6 sm:py-8 border-t border-border bg-muted/5 sm:bg-transparent rounded-b-[2rem] flex flex-col sm:flex-row justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
