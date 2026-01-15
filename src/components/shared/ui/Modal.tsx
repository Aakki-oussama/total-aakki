/**
 * MODAL COMPONENT
 * Modal responsive : bottom sheet sur mobile, centré sur desktop
 */

import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { iconConfig } from '@/config/icons';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'full';
}

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
    // Bloquer le scroll du body quand le modal est ouvert
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    // Fermer avec Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    if (!open) return null;

    // Tailles du modal (desktop)
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`
          relative w-full ${sizeClasses[size]}
          bg-surface border border-border
          rounded-t-3xl lg:rounded-3xl
          shadow-2xl
          max-h-[90vh] lg:max-h-[85vh]
          flex flex-col
          animate-slide-up lg:animate-fade-in
        `}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <h2 className="text-xl font-bold text-main">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-muted/10 text-muted hover:text-main transition-colors"
                            aria-label="Fermer"
                        >
                            <X className={iconConfig.sizes.action} strokeWidth={iconConfig.strokeWidth} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
