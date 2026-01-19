
import {
    LayoutDashboard,
    Users,
    Building2,
    Wallet
} from 'lucide-react';
import type { NavItem } from '../types';

export const navItems: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/'
    },

    {
        id: 'clients',
        label: 'Clients',
        icon: Users,
        path: '/clients'
    },
    {
        id: 'societes',
        label: 'Sociétés',
        icon: Building2,
        path: '/societes'
    },
    {
        id: 'paiements',
        label: 'Paiements',
        icon: Wallet,
        path: '/paiements'
    }
];
