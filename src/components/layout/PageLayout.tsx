import { type PageProps } from '../../types';
import { Plus } from 'lucide-react';
import { iconConfig } from '../../config/icons';

const PageLayout = ({ title, description, onAdd, variant = 'dashboard', children }: PageProps) => {
    return (
        <div className="max-w-7xl mx-auto w-full">
            {/* Compact Native-style Header */}
            <div className="flex flex-col gap-1 mb-6 lg:mb-8">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl md:text-2xl lg:text-4xl font-extrabold tracking-tight text-main">
                        {title}
                    </h1>

                    {variant === 'content' && onAdd && (
                        <button
                            onClick={onAdd}
                            className="flex items-center justify-center gap-2 p-2 md:px-4 md:py-2 bg-primary hover:bg-opacity-90 text-primary-foreground font-bold rounded-xl md:rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-200"
                            aria-label="Ajouter un élément"
                        >
                            <Plus className={iconConfig.sizes.action} strokeWidth={iconConfig.strokeWidth} />
                            <span className="hidden md:inline text-sm">Ajouter</span>
                        </button>
                    )}
                </div>

                {variant === 'content' && description && (
                    <p className="text-muted max-w-2xl text-xs md:text-sm lg:text-lg leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

export default PageLayout;
