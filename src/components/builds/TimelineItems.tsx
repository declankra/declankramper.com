import { TimelineItem } from './BuildsTimeline';

export const timelineItems: TimelineItem[] = [
    {
        type: 'work',
        id: 'personal-portfolio',
        title: 'Modern Personal Portfolio',
        date: '2025-01',
        year: 2025,
        media: '/images/buildsTimeline/PersonalPortfolio.webp',
        preview: 'A website to showcase my work and thoughts',
        description: 'Designed on my runs and built using a modern stack - nextjs, tailwind, framer motion, and vercel. I hope you enjoy using it. I certainly enjoyed making it.',
    },
    {
        type: 'work',
        id: 'meet-or-not',
        title: 'Meet or Not | Web App',
        date: '2024-03',
        year: 2024,
        media: '/images/buildsTimeline/MeetOrNot.webp',
        preview: 'Generative AI tool to ensure your next meeting is effective',
        description: "I was sick of wasting time in meetings that werent setup for success. So, I built a tool to help you (1) determine if your meeting is necessary and (2) ensure it was effective. It was my first full-stack web app, utilizing Google Cloud's Firestore database and the OpenAI API to generate a meeting agenda based on custom templates and instructions. To date, 191+ people have used the application and 60+ meeting agendas have been generated - saving at least as many hours in preparation time and unproductive meetings!",
        link: 'https://meetornot.io'
    },
    {
        type: 'work',
        id: 'race-time-calculator',
        title: 'Race Time Calculator | IOS App',
        date: '2024-03',
        year: 2024,
        media: '/images/buildsTimeline/RTCpreview.webp',
        preview: 'Calculate your race time using apple health data',
        description: 'coming soon',
        link: 'https://apps.apple.com/us/app/race-time-calculator/id6478423515?ppid=1dcc2c47-705e-4e5f-a97e-711ecd9089db'
    },
    {
        type: 'work',
        id: 'validate-idea',
        title: 'Validate Idea | Web App',
        date: '2024-11',
        year: 2024,
        media: '/images/buildsTimeline/ValidateIdea.webp',
        preview: 'Quickly validate your idea before building',
        description: 'coming soon',
        link: 'https://www.validateidea.now'
    },
    {
        type: 'work',
        id: 'magic-record-player',
        title: 'Magic Record Player',
        date: '2024-11',
        year: 2024,
        media: '/images/buildsTimeline/RecordPlayer.webp',
        preview: 'play the soundtrack of your memories',
        description: 'a raspberry pi running a python script to interact with NFC tagged photos in order to create a special gift for the special people in my life while learning how to build an idea inspired by Harry Potter',
        link: 'https://declankramper.notion.site/NFC-Record-Player-Build-bf95a606cc474c11a626b50821fb12d4?pvs=4'
    },
    {
        type: 'feedback',
        id: 'tyler-feedback-1',
        date: '2024-02',
        year: 2024,
        text: '"Given he is a self-starter, we often just counted on him figuring things out (which he did)." - Director of Product Management, retail client'
    },
    {
        type: 'feedback',
        id: 'tyler-feedback-2',
        date: '2024-02',
        year: 2024,
        text: '"Declan was self-motivated to get to an outcome, which is perhaps the GREATEST skill a product person can have" - Director of Product Management, retail client'
    },
];