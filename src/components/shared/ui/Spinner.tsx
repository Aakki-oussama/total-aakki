/**
 * COMPOSANT: Spinner
 * Un indicateur de chargement animé et premium.
 */

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'white' | 'muted';
    label?: string;
    className?: string;
    fullScreen?: boolean;
}

export default function Spinner({
    size = 'md',
    variant = 'primary',
    label = 'Synchronisation des données...',
    className = '',
    fullScreen = false
}: SpinnerProps) {

    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    const variantClasses = {
        primary: 'border-primary/20 border-t-primary',
        white: 'border-white/20 border-t-white',
        muted: 'border-muted/20 border-t-muted/60'
    };

    const content = (
        <div className="flex flex-col items-center gap-4">
            <div
                className={`
                    rounded-full animate-spin 
                    ${sizeClasses[size]} 
                    ${variantClasses[variant]} 
                    ${className}
                `}
                role="status"
            />
            {label && (
                <p className="text-[10px] md:text-xs font-black text-muted uppercase tracking-widest animate-pulse">
                    {label}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/60 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return content;
}
