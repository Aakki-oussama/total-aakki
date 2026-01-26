import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    public render(): ReactNode {
        if (this.state.hasError) {
            // If a custom fallback is provided, use it
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default Premium Fallback UI
            return (
                <div className="flex flex-col items-center justify-center p-8 min-h-[200px] w-full bg-white dark:bg-gray-900 rounded-3xl border border-red-50 dark:border-red-900/10 shadow-xl overflow-hidden relative group">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-900/20 text-red-500 mb-4 ring-8 ring-red-50/20 dark:ring-red-900/10 transition-transform group-hover:scale-110 duration-500">
                            <AlertCircle className="w-8 h-8" />
                        </div>

                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
                            Oups ! Quelque chose a coincé
                        </h3>

                        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest leading-relaxed max-w-xs mb-6 px-4">
                            Nous n'avons pas pu charger cette partie du tableau de bord.
                        </p>

                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-gray-900/20 dark:hover:shadow-white/20"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Réessayer
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
