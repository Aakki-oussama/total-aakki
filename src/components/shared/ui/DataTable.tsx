import type { ReactNode } from 'react';
import Spinner from './Spinner';

export interface Column<T> {
    header: string;
    render: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyState?: ReactNode;
}

export default function DataTable<T>({
    data,
    columns,
    loading,
    emptyState
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Spinner size="lg" variant="primary" />
            </div>
        );
    }

    if (data.length === 0 && emptyState) {
        return <>{emptyState}</>;
    }

    return (
        <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border bg-muted/5">
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className={`px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted/70 whitespace-nowrap ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map((item, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="group hover:bg-muted/5 transition-colors duration-200"
                        >
                            {columns.map((col, colIndex) => {
                                const isRightAligned = col.className?.includes('text-right');
                                return (
                                    <td
                                        key={colIndex}
                                        className={`px-4 sm:px-6 py-4 text-xs sm:text-[13px] font-medium text-main ${col.className || ''}`}
                                    >
                                        <div className={`flex items-center ${isRightAligned ? 'justify-end' : ''}`}>
                                            {col.render(item)}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
