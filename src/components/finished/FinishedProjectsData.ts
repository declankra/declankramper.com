import { FinishedProject } from '@/types/finished';

export const finishedProjects: FinishedProject[] = [
    {
        id: 'sample-project-1',
        title: 'Sample Finished Project',
        subtitle: 'A project that was actually completed',
        month: 8,
        year: 2024,
        link: 'https://example.com',
        visuals: [
            {
                type: 'image',
                src: '/images/finished/sample-project-screenshot.webp',
                alt: 'Sample project screenshot'
            }
        ]
    },
    {
        id: 'sample-project-2',
        title: 'Another Completed Thing',
        subtitle: 'Something else that got done',
        month: 6,
        year: 2024
    },
    {
        id: 'sample-project-3',
        title: 'Old Finished Work',
        subtitle: 'Something from the past',
        month: 12,
        year: 2023,
        visuals: [
            {
                type: 'image',
                src: '/images/finished/old-project-1.webp',
                alt: 'Old project screenshot 1'
            },
            {
                type: 'video',
                src: '/videos/finished/old-project-demo.mp4',
                alt: 'Old project demo video'
            }
        ]
    }
];