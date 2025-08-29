import { FinishedProject } from '@/types/finished';

export const finishedProjects: FinishedProject[] = [
    {
        id: 'gradefinalboss',
        title: 'Grade Final Boss',
        subtitle: 'a better rogerhub with personality',
        month: 2,
        year: 2025,
        link: 'https://grade-final-boss-3lxl.vercel.app/',
        visuals: [
            {
                type: 'gif',
                src: '/videos/finished/grade-final-boss.gif',
                alt: 'Grade Final Boss Demo'
            }
        ]
    },
    {
        id: 'local-jarvis',
        title: 'Local Jarvis',
        subtitle: '**Personal AI assistant that runs entirely on my MacBook using Ollama\'s OS model as a privacy-first alternative to Claude Code. It automatically indexes and updates my my notes using local vector database for RAG-powered context.**',
        month: 8,
        year: 2025,
        visuals: [
            {
                type: 'gif',
                src: '/images/local-jarvis/local-jarvis.gif',
                alt: 'Local Jarvis Demo'
            },
            {
                type: 'image',
                src: '/images/local-jarvis/local-jarvis-log.png',
                alt: 'Local Jarvis Log'
            }
        ]
    },
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
        id: 'divvy-bike-business-case',
        title: 'Divvy Bike Business Case Review',
        subtitle: 'Which divvy bike station in Chicago needs another rack?',
        month: 6,
        year: 2025,
        link: 'https://divvy-live.vercel.app/',
        visuals: [
            {
                type: 'image',
                src: '/images/buildsTimeline/divvy-bottom.webp',
                alt: 'Divvy Bike Business Case Preview',
                pdfSrc: '/pdfs/finished/Divvy-Bike-Business-Case-Review.pdf'
            }
        ]
    }
];