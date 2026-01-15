import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    path: string;
}

export interface BreadcrumbItem {
    label: string;
    path: string;
}

export type LayoutVariant = 'dashboard' | 'content';

export interface PageProps {
    title: string;
    description?: string;
    onAdd?: () => void;
    variant?: LayoutVariant;
    children?: ReactNode;
}

export type Theme = 'light' | 'dark';
