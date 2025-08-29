import { Metadata } from 'next';
import { FinishedProjectsList } from '@/components/finished/FinishedProjectsList';

export const metadata: Metadata = {
    title: 'Everything I Finished - Declan Kramper',
    description: 'A collection of projects that were actually completed. Finishing is hard.',
    openGraph: {
        title: 'Everything I Finished - Declan Kramper',
        description: 'A collection of projects that were actually completed. Finishing is hard.',
        type: 'website',
    },
};

export default function EverythingIFinishedPage() {
    return <FinishedProjectsList />;
}