import {
    ArrowLeftRight,
    ChartNoAxesCombined,
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
    { href: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

/** Destinations pinned to the mobile tab bar; the rest live under "More". */
const MOBILE_TAB_HREFS = ['/dashboard', '/portfolio', '/watchlist'];

export const MOBILE_TABS = NAV.filter((n) => MOBILE_TAB_HREFS.includes(n.href));
export const MOBILE_MORE = NAV.filter((n) => !MOBILE_TAB_HREFS.includes(n.href));

export function isNavActive(pathname: string, href: string) {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
}
