import { Metadata } from 'next';
import { FinishedProjectsList } from '@/components/finished/FinishedProjectsList';

export const metadata: Metadata = {
    title: 'Builds - Declan Kramper',
    description: 'A list of everything I\'ve built.',
    openGraph: {
        title: 'Builds - Declan Kramper',
        description: 'A list of everything I\'ve built.',
        type: 'website',
    },
};

export default function BuildsPage() {
    return <FinishedProjectsList />;
}
