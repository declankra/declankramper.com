import { FinishedProject } from '@/types/finished';

export const finishedProjects: FinishedProject[] = [
    {
        id: 'rc-tank',
        title: 'RC Tank',
        subtitle: 'Senior Design Toy Project - Arduino with 3D printed parts',
        month: 4,
        year: 2022,
        visuals: [
            {
                type: 'video',
                src: '/videos/finished/rc-tank.mp4',
                alt: 'RC Tank'
            }
        ]
    },
    {
        id: 'remote-windshield-defroster',
        title: 'Remote Windshield Defroster',
        subtitle: 'Senior Design Project - Bent metal portable housing with portable, remote control',
        month: 10,
        year: 2021,
        visuals: [
            {
                type: 'video',
                src: '/videos/finished/remote-windshield-defroster.mp4',
                alt: 'Remote Windshield Defroster'
            }
        ]
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