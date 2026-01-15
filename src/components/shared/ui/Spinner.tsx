/**
 * SPINNER COMPONENT
 * Indicateur de chargement avec variantes
 */

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'white' | 'current';
    fullScreen?: boolean;
}

export default function Spinner({ size = 'md', variant = 'primary', fullScreen = false }: SpinnerProps) {
    // Tailles
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    // Couleurs
    const variantClasses = {
        primary: 'text-primary',
        white: 'text-white',
        current: 'text-current',
    };

    const spinner = (
        <svg
            className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return spinner;
}
