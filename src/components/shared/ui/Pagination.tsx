import { ChevronLeft, ChevronRight } from 'lucide-react';
import { iconConfig } from '../../../config/icons';
import Button from './Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

/**
 * PAGINATION COMPONENT
 * A premium pagination system with smart page numbering and high-end aesthetics.
 */
export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = ""
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Logic to calculate which page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push('...');
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
            {/* Previous Button */}
            <Button
                variant="secondary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${iconConfig.sizes.square} sm:${iconConfig.sizes.squareDesktop} p-0 rounded-lg sm:rounded-xl border-border shadow-sm bg-surface`}
                icon={
                    <ChevronLeft
                        className={`text-primary sm:${iconConfig.sizes.header} ${iconConfig.sizes.breadcrumb}`}
                        strokeWidth={iconConfig.strokeWidth + 0.5}
                    />
                }
            >
                {/* No children needed when using icon prop for centered icons */}
                {null}
            </Button>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`dots-${index}`} className="px-1 text-muted/50 font-medium">
                            ...
                        </span>
                    ) : (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'primary' : 'ghost'}
                            onClick={() => onPageChange(Number(page))}
                            className={`
                                ${iconConfig.sizes.square} sm:${iconConfig.sizes.squareDesktop} p-0 rounded-lg sm:rounded-xl transition-all duration-300
                                ${currentPage === page
                                    ? 'shadow-lg shadow-primary/20 scale-105 z-10'
                                    : 'text-muted hover:text-main border-transparent'
                                }
                            `}
                        >
                            <span className="text-sm font-bold">{page}</span>
                        </Button>
                    )
                ))}
            </div>

            {/* Mobile simplification (more compact) */}
            <div className="sm:hidden px-3 py-1.5 text-xs font-bold text-main bg-surface/50 rounded-lg border border-border/50">
                {currentPage} / {totalPages}
            </div>

            {/* Next Button */}
            <Button
                variant="secondary"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${iconConfig.sizes.square} sm:${iconConfig.sizes.squareDesktop} p-0 rounded-lg sm:rounded-xl border-border shadow-sm bg-surface`}
                icon={
                    <ChevronRight
                        className={`text-primary sm:${iconConfig.sizes.header} ${iconConfig.sizes.breadcrumb}`}
                        strokeWidth={iconConfig.strokeWidth + 0.5}
                    />
                }
            >
                {/* No children needed */}
                {null}
            </Button>
        </div>
    );
}
