
import {
    LayoutDashboard,
    Users,
    Settings,
    PieChart,
    Wallet,
    History,
    ShieldCheck,
    HelpCircle,
    UserCircle
} from 'lucide-react';
import type { NavItem } from '../types';

export const navItems: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Tableau de bord',
        icon: LayoutDashboard,
        path: '/'
    },
    {
        id: 'analytics',
        label: 'Statistiques',
        icon: PieChart,
        path: '/analytics'
    },
    {
        id: 'users',
        label: 'Clients',
        icon: Users,
        path: '/users'
    },
    {
        id: 'credits',
        label: 'Crédits',
        icon: Wallet,
        path: '/credits'
    },
    {
        id: 'history',
        label: 'Historique',
        icon: History,
        path: '/history'
    },
    {
        id: 'security',
        label: 'Sécurité',
        icon: ShieldCheck,
        path: '/security'
    },
    {
        id: 'profile',
        label: 'Mon Profil',
        icon: UserCircle,
        path: '/profile'
    },
    {
        id: 'settings',
        label: 'Paramètres',
        icon: Settings,
        path: '/settings'
    },
    {
        id: 'help',
        label: 'Aide',
        icon: HelpCircle,
        path: '/help'
    },
];
