import { FinishedProject, CurrentlyBuildingProject } from '@/types/finished';


// Left out
// - psprd
// - melrose bagels
// - bud light euchre bracket
// - 1kby2025

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
    },
    {
        id: 'construction-industry-agent',
        title: 'Construction Industry Agent',
        subtitle: 'Partnering with a Chicago-based fiber optics construction company to build an AI agent to automate the submittal package workflow (and beyond)',
    }
];

export const finishedProjects: FinishedProject[] = [
    {
        id: 'local-jarvis',
        title: 'Local Jarvis',
        subtitle: 'Personal AI assistant that runs entirely on my MacBook using Ollama\'s OS model as a privacy-first alternative to Claude Code. It automatically indexes and updates my notes/memory using a local vector database for RAG-powered context.',
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
        id: 'interactive-letter',
        title: 'Interactive Personalized Digital Letter',
        subtitle: 'HR couldn\'t give me addresses for the real thing, so I made the next best thing',
        month: 7,
        year: 2025,
        link: 'https://interactive-letter-gift.vercel.app/',
        visuals: [
            {
                type: 'video',
                src: '/finished/interactive-letter-demo.mp4',
                alt: 'Interactive Letter Demo'
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
    },
    {
        id: 'screen-cam-recorder',
        title: 'Mac ScreenCam Recorder',
        subtitle: 'I wanted to record my product demos and store them locally (alt to Screen Studio)',
        month: 5,
        year: 2025,
        visuals: [
            {
                type: 'video',
                src: '/finished/screencam-recorder-demo.mp4',
                alt: 'PS Connect'
            }
        ]
    },
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
        id: 'website-blocker',
        title: 'Website Blocker',
        subtitle: 'A chrome extension that blocks websites on your Mac without tracking your browsing activity (because I spent too much time on X)',
        month: 4,
        year: 2025,
        link: 'https://chromewebstore.google.com/detail/minimal-site-blocker/nfopkomkibpdjhgfcnokaeoghbfomacf',
        visuals: [
            {
                type: 'image',
                src: '/finished/website-blocker/website-blocker.png',
                alt: 'Website Blocker'
            },
            {
                type: 'video',
                src: '/finished/website-blocker/website-blocker-demo.mov',
                alt: 'Website Blocker Demo'
            }
        ]
    },
    {
        id: 'sunlit-sips-chicago',
        title: 'Sunlit Sips Chicago',
        subtitle: 'Find the outdoor spaces at Chicago bars & cafes that are currently under sunlight',
        month: 4,
        year: 2025,
        link: 'https://v0-sunlit-sips-chi-implementation.vercel.app/',
        visuals: [
            {
                type: 'image',
                src: '/finished/sunlit-sips/sunlit-sips-chicago.png',
                alt: 'Sunlit Sips Chicago'
            },
            {
                type: 'video',
                src: '/finished/sunlit-sips/sunlit-sips-chicago-demo.mp4',
                alt: 'Sunlit Sips Chicago'
            }
        ]
    },
    {
        id: 'aspire-hackathon',
        title: 'PS Connect',
        subtitle: 'GenAI staffing tool that redefined employee engagement to win firm\'s global hackathon',
        month: 2,
        year: 2025,
        visuals: [
            {
                type: 'image',
                src: '/images/buildsTimeline/AspireHackathon.webp',
                alt: 'PS Connect'
            },
            {
                type: 'image',
                src: '/finished/hackathon/hackathon-in-action.png',
                alt: 'PS Connect'
            }
        ]
    },
    {
        id: 'claude-story-creator',
        title: 'Claude Story Creator',
        subtitle: 'Create users stories in 20 minutes instead of 2.5 hours using Claude MCPs (internal tool v3)',
        month: 8,
        year: 2025,
        visuals: [
            {
                type: 'video',
                src: '/finished/claude-story-creator.mp4',
                alt: 'Claude Story Creator'
            }
        ]
    },
    {
        id: 'psprd',
        title: 'psPRD.ai',
        subtitle: 'Prototype for our firm\'s missing internal AI tool for product management (internal tool v2)',
        month: 2,
        year: 2025,
        link: 'https://www.testing-new.site/',
        visuals: [
            {
                type: 'image',
                src: '/finished/psprd/psprd.png',
                alt: 'PS PRD.ai'
            },
            {
                type: 'video',
                src: '/finished/psprd/psprd-demo.mp4',
                alt: 'PS PRD.ai'
            }
        ]
    },
    {
    id: 'ppt-2-prd',
    title: 'Automated PRD Generator',
    subtitle: 'Convert unstructured PowerPoint slides into a structured PRD (internal tool v1)',
    month: 2,
    year: 2025,
    link: 'https://ppt-2-prd.vercel.app/',
    visuals: [
        {
            type: 'video',
            src: '/finished/ppt-2-prd.mp4',
            alt: 'Automated PRD Generator'
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
                src: '/finished/grade-final-boss/grade-final-boss.gif',
                alt: 'Grade Final Boss Demo'
            },
            {
                type: 'image',
                src: '/finished/grade-final-boss/monster.png',
                alt: 'Grade Final Boss Screenshot'
            }
        ]
    },
    {
        id: 'Strava Personality Test',
        title: 'Strava Personality Test',
        subtitle: 'What do your Strava posts say about you?',
        month: 1,
        year: 2025,
        link: 'https://www.athletepersonalitytest.com/?utm_source=portfolio',
        visuals: [
            {
                type: 'image',
                src: '/images/buildsTimeline/AthletePersonalityTest.webp',
                alt: 'Athlete Personality Test'
            },
            {
                type: 'image',
                src: '/finished/strava-personality-test/personality_result.png',
                alt: 'Strava Personality Test Demo'
            }
        ]
    },
    {
        id: 'validate-idea',
        title: 'Validate Idea',
        subtitle: 'Validate your idea before building it using a starter-kit based on product principles',
        month: 11,
        year: 2024,
        link: 'https://www.validateidea.now/?utm_source=portfolio',
        visuals: [
            {
                type: 'image',
                src: '/images/buildsTimeline/ValidateIdea.webp',
                alt: 'Validate Idea'
            }
        ]
    },
    {
        id: 'race-time-calculator',
        title: 'Race Time Calculator',
        subtitle: 'The only IOS app that can predict your race time based on your apple health running data',
        month: 3,
        year: 2024,
        link: 'https://apps.apple.com/us/app/race-time-calculator/id6478423515?ppid=1dcc2c47-705e-4e5f-a97e-711ecd9089db',
        learnMoreUrl: 'https://declankramper.notion.site/Race-Time-Predictor-App-6a485fdb13d84d07ab26e2aa7c3b2de0',
        visuals: [
            {
                type: 'image',
                src: '/images/buildsTimeline/RTCpreview.webp',
                alt: 'Race Time Calculator'
            },
            {
                type: 'image',
                src: '/finished/race-time-calculator/metrics.png',
                alt: 'Race Time Calculator Metrics'
            },
            {
                type: 'image',
                src: '/finished/race-time-calculator/process-chart.png',
                alt: 'Race Time Calculator Process Chart'
            },
            {
                type: 'image',
                src: '/finished/race-time-calculator/Results.png',
                alt: 'Race Time Calculator Results'
            },
            {
                type: 'image',
                src: '/finished/race-time-calculator/rate-it.png',
                alt: 'Race Time Calculator Rate It'
            },
            {
                type: 'image',
                src: '/finished/race-time-calculator/Feedback.png',
                alt: 'Race Time Calculator Feedback'
            },
            {
                type: 'image',
                src: '/finished/race-time-calculator/feedback-iteration.png',
                alt: 'Race Time Calculator Feedback Iteration'
            }
        ]
    },
    {
        id: 'meet-or-not',
        title: 'Meet or Not',
        subtitle: 'Generative AI tool to ensure your next meeting is productive',
        month: 3,
        year: 2024,
        link: 'https://meet-or-not.web.app/?utm_source=portfolio',
        visuals: [
            {
                type: 'image',
                src: '/images/buildsTimeline/MeetOrNot.webp',
                alt: 'Meet or Not'
            },
            {
                type: 'image',
                src: '/finished/meet-or-not/flowchart-screenshot.png',
                alt: 'Meet or Not Flowchart'
            },
            {
                type: 'image',
                src: '/finished/meet-or-not/results.jpeg',
                alt: 'Meet or Not Meeting Summary'
            }
        ]
    },
    {
        id: 'magic-record-player',
        title: 'Magic Record Player',
        subtitle: 'Play the soundtrack of your photo memories',
        month: 11,
        year: 2023,
        link: 'https://declankramper.notion.site/NFC-Record-Player-Build-bf95a606cc474c11a626b50821fb12d4?pvs=4',
        visuals: [
            {
                type: 'image',
                src: '/images/buildsTimeline/RecordPlayer.webp',
                alt: 'Magic Record Player'
            },

        ]
    },
    {
        id: 'kalo-website ',
        title: 'Recruiting Company Website Redesign',
        subtitle: 'Increased website traffic by 88% and converted 12% more visitors into leads',
        month: 8,
        year: 2022,
        visuals: [
            {
                type: 'image',
                src: '/finished/kalo-solutions.png',
                alt: 'Kalo Website'
            }
        ]
    },

    {
        id: 'rc-tank',
        title: 'RC Tank',
        subtitle: 'Arduino controller with 3D printed parts for fun',
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
        id: 'next-level-lawn-care',
        title: 'Next Level Lawn Care',
        subtitle: 'Started my first business when I was 12. Made 60+ new friends and $30k.',
        month: 1,
        year: 2013,
        visuals: [
            {
                type: 'image',
                src: '/images/buildsTimeline/NextLevelLawnCare.webp',
                alt: 'Next Level Lawn Care'
            }
        ]
    }
];


//BACKLOG:
/*{
    id: 'remote-windshield-defroster',
    title: 'Remote Windshield Defroster',
    subtitle: 'Bent metal portable housing with portable, remote control',
    month: 10,
    year: 2021,
    visuals: [
        {
            type: 'video',
            src: '/finished/remote-windshield-defroster.mp4',
            alt: 'Remote Windshield Defroster'
        }
    ]
}

*/
