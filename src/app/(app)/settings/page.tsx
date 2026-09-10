import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';

const ROWS = [
    { label: 'Display currency', value: 'EUR (€)' },
    { label: 'Language', value: 'English' },
    { label: 'Price alerts', value: 'Enabled' },
    { label: 'Two-factor authentication', value: 'Enabled' },
    { label: 'Statements', value: 'Monthly, via email' },
];

export default function SettingsPage() {
    return (
        <>
            <PageHeader eyebrow='Preferences' title='Settings' />
            <Card>
                <CardContent className='pt-5'>
                    <ul className='divide-y divide-border'>
                        {ROWS.map((r) => (
                            <li
                                key={r.label}
                                className='flex items-center justify-between py-3.5 text-[13.5px] first:pt-0 last:pb-0'>
                                <span>{r.label}</span>
                                <span className='flex items-center gap-1 text-[13px] text-muted-foreground'>
                                    {r.value}
                                    <ChevronDown
                                        size={14}
                                        className='-rotate-90 opacity-50'
                                    />
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </>
    );
}
