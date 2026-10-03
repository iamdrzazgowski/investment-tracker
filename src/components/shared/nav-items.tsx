import {
    ArrowLeftRight,
    BarChart3,
    Eye,
    LayoutDashboard,
    Settings as SettingsIcon,
    Wallet,
} from 'lucide-react';

export const NAV = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/portfolio', label: 'Portfolio', icon: Wallet },
    { href: '/watchlist', label: 'Watchlist', icon: Eye },
    { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
];
