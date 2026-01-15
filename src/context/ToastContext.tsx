/**
 * TOAST CONTEXT
 * Système de notifications toast (success, error, info, warning)
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { iconConfig } from '@/config/icons';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast: Toast = { id, type, message, duration };

        setToasts((prev) => [...prev, toast]);

        // Auto-remove après la durée spécifiée
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback((message: string, duration?: number) => {
        addToast('success', message, duration);
    }, [addToast]);

    const error = useCallback((message: string, duration?: number) => {
        addToast('error', message, duration);
    }, [addToast]);

    const info = useCallback((message: string, duration?: number) => {
        addToast('info', message, duration);
    }, [addToast]);

    const warning = useCallback((message: string, duration?: number) => {
        addToast('warning', message, duration);
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, success, error, info, warning, remove }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={remove} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

// Composant Toast individuel
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
        warning: AlertTriangle,
    };

    const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white',
    };

    const Icon = icons[toast.type];

    return (
        <div
            className={`
        ${styles[toast.type]}
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
        min-w-[300px] max-w-md
        animate-slide-in-right
      `}
        >
            <Icon className={iconConfig.sizes.action} strokeWidth={iconConfig.strokeWidth} />
            <p className="flex-1 font-medium text-sm">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Fermer"
            >
                <X className="w-4 h-4" strokeWidth={iconConfig.strokeWidth} />
            </button>
        </div>
    );
}

// Container des toasts
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onRemove={onRemove} />
                </div>
            ))}
        </div>
    );
}
