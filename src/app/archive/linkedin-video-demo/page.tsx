import { Metadata } from 'next';
import { OptimizedVideoPlayer } from '@/components/video/OptimizedVideoPlayer';

export const metadata: Metadata = {
    title: 'LinkedIn Video Demo - Declan Kramper',
    description: 'Race Time Calculator demo video for LinkedIn',
    openGraph: {
        title: 'LinkedIn Video Demo - Declan Kramper',
        description: 'Race Time Calculator demo video for LinkedIn',
        type: 'video.other',
    },
};

export default function LinkedInVideoDemoPage() {
    return (
        <div className="min-h-screen bg-white">
            <OptimizedVideoPlayer 
                src="/videos/race-time-calculator-demo-full.mp4"
                title="Race Time Calculator Demo"
            />
            
            {/* Content below video can be added here */}
        </div>
    );
}