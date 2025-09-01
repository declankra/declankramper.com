import { FinishedProject, CurrentlyBuildingProject } from '@/types/finished';

// TODO: Add the following projects:
// - interactive letter
// - kalo
// - meet or not
// - psprd
// - race time calculator
// - raspberry record player
// - screencam recorder
// - strava personality test
// - upwardly
// - validateidea
// - website blocker
// - melrose bagels
// - ppt-2-prd
// - sunlight sips chicago
// - 1kby2025
// - hackathon project
// - how to use ai guides
// - claude story writer
// - lawn care business

export const currentlyBuildingProjects: CurrentlyBuildingProject[] = [

    {
        id: 'garpple',
        title: 'Garpple',
        subtitle: 'Garmin analytics for Apple Watch runners (145+ waitlist signups)',
        link: 'https://www.garpple.com',
        visuals: [
            {
                type: 'image',
                src: '/finished/garpple/garpple-waitlist.png',
                alt: 'Garpple'
            }
        ]
    }
];

export const finishedProjects: FinishedProject[] = [
    {
        id: 'chitrack',
        title: 'Chitrack',
        subtitle: 'The most elegant way to track your Chicago morning commute',
        month: 5,
        year: 2025,
        link: 'https://www.chitrack.com/?utm_source=portfolio&utm_campaign=everything_i_finished',
        visuals: [
            {
                type: 'image',
                src: '/finished/chitrack/ChiTrack.webp',
                alt: 'Chitrack'
            },
            {
                type: 'image',
                src: '/finished/chitrack/caitlin_chitrack.png',
                alt: 'Chitrack'
            },
            {
                type: 'image',
                src: '/finished/chitrack/campbell_chitrack.png',
                alt: 'Chitrack'
            },
            {
                type: 'image',
                src: '/finished/chitrack/shoutout_chitrack.png',
                alt: 'Chitrack'
            },
            {
                type: 'video',
                src: '/finished/chitrack/ability_to_view_all_upcoming_arrivals.mp4',
                alt: 'Chitrack'
            },
            {
                type: 'video',
                src: '/finished/chitrack/improved_search_results_view.mp4',
                alt: 'Chitrack'
            }
        ]
    },
    {
        id: 'gradefinalboss',
        title: 'Grade Final Boss',
        subtitle: 'A better rogerhub with personality',
        month: 2,
        year: 2025,
        link: 'https://grade-final-boss-3lxl.vercel.app/',
        visuals: [
            {
                type: 'gif',
                src: '/finished/grade-final-boss.gif',
                alt: 'Grade Final Boss Demo'
            }
        ]
    },
    {
        id: 'meet-or-not',
        title: 'Meet or Not',
        subtitle: 'Gen-AI tool to ensure your next meeting is productive',
        month: 3,
        year: 2024,
    },
    {
        id: 'local-jarvis',
        title: 'Local Jarvis',
        subtitle: 'Personal AI assistant that runs entirely on my MacBook using Ollama\'s OS model as a privacy-first alternative to Claude Code. It automatically indexes and updates my notes/memory using local vector database for RAG-powered context.',
        month: 8,
        year: 2025,
        visuals: [
            {
                type: 'gif',
                src: '/finished/local-jarvis/local-jarvis.gif',
                alt: 'Local Jarvis Demo'
            },
            {
                type: 'image',
                src: '/finished/local-jarvis/local-jarvis-log.png',
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
                src: '/finished/rc-tank.mp4',
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
                src: '/finished/remote-windshield-defroster.mp4',
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
                pdfSrc: '/finished/Divvy-Bike-Business-Case-Review.pdf'
            }
        ]
    }
];