import { TimelineItem } from './BuildsTimeline';

export const timelineItems: TimelineItem[] = [
    {
        type: 'work',
        id: 'aspire-hackathon',
        title: 'Aspire Hackathon - Global Finalists',
        date: '2025-03',
        year: 2025,
        media: '/images/buildsTimeline/AspireHackathon.webp',
        preview: 'Selected as one of 3 global finalists out of ~100 teams',
        description: 'Every year, Publicis Sapient provides the opportunity for early-career associates to showcase their innovative skills over the course of a weekend by building a solution to one of three possible problem statements.\n\n Our team decided to solve the employee engagement issue. But instead of focusing on the obvious definition of engagement inferred by the problem statement—where increased social engagement meant “fixing” employee engagement and relying on traditional platforms and tools to facilitate that engagement—we used a user-centric and first-principled approach to arrive at a unique perspective: that solving employee engagement at PS meant addressing the staffing problem. We looked at employees as human beings that require foundational support and satisfaction before they are ready to engage socially. After analyzing user personas across the company, we identified a common pain point around staffing. We believe that the inefficiencies and disconnect in staffing—project allocation, candidate-to-hiring manager connection, role matching, and overall visibility into projects and talent/candidates—are at the heart of a poor employee sense of belonging and engagement.\n\n The solution we built focused on two key personas: the employee candidate and the hiring manager. Our goal was to alleviate this disconnect by providing an easy and intuitive experience to find and match opportunities with talent, utilizing generative AI.\n\n The winners are announced this coming week. If chosen, we hope to continue this conversation with company leaders at Necker Island.',
    },
    {
        type: 'work',
        id: 'chitrack',
        title: 'ChiTrack | Chicago Transit Tracker',
        date: '2025-03',
        year: 2025,
        media: '/images/buildsTimeline/chitrack-preview.webp',
        preview: 'The best CTA train tracker in the city of chicago - it just makes sense',
        description: "I use the CTA train multiple times a week to go into the office. So do many others. Ask any of these people about the current \"best\" option for tracking train arrival times to get to/from work and they'll tell you that it sucks.\n\n Why not build something that doesn't suck? Although the idea is simple, there's a lot to consider. That's the fun of it.\n\n Launching soon.",
        link: 'https://www.chitrack.com/?utm_source=portfolio'
    },
    {
        type: 'work',
        id: 'athlete-personality-test',
        title: 'Athlete Personality Test | Web App',
        date: '2025-01',
        year: 2025,
        media: '/images/buildsTimeline/AthletePersonalityTest.webp',
        preview: 'Discover your unique athlete personality based on your Strava activity titles',
        description: "A fun personality test app that reads your Strava activity titles and matches you with one of six distinct athlete personalities, from the 'Data Enthusiast' to the 'Storyteller', unlocking a new way to analyze your acivities and engage with the Strava community. Complete with custom avatar generation and viral sharing features. \n\nBorn from my obserations (as a Strava DAU) that people knowingly (or unknowingly) pour their uniqueness into their Strava activity titiles, Strava encourages users to write custom activity titles because it boosts engagement, and my own use of commemorating my running thoughts into my Strava posts. \n\nIt's my most complex build yet. As of this writing, it is under review by Strava's developer program for extended use approval. You can [view the demo here](https://www.loom.com/share/203fc26c1d5e407bb5a43ad64fbefae0?sid=7d7b2db6-4d7c-4adc-bc83-9ff44aca0a1c).",
        link: 'https://www.athletepersonalitytest.com/?utm_source=portfolio'

    },
    {
        type: 'feedback',
        id: 'sheldon-presentation-feedback',
        date: '2025-01',
        year: 2025,
        text: '"+1 really appreciate you putting yourself out there Declan" - EVP, Product Management'
    },
    {
        type: 'work',
        id: 'ai-presentation-guide',
        title: 'How PMs Can Best Leverage AI',
        date: '2025-01',
        year: 2025,
        media: '/images/buildsTimeline/AIPresentationGuide.webp',
        preview: 'A POV on the future of PM and a simple, step-by-step workflow to go from idea to your first working prototype using AI tools',
        description: 'I gave a presentation at work on AI, my POV on PMs in the AI world, and what I think PMs should focus on going forward. \n\n The goal was not only to encourage everyone to explore AI more in their daily work, but to embrace their uniqueness and lean into it. \n\n Upon recieving positive feedback, I wrote a guide to help my coworkers build their first full-code prototype using AI.',
        link: 'https://declankramper.notion.site/how-to-build-a-full-code-prototype-as-a-pm'

    },
    {
        type: 'feedback',
        id: 'martha-presentation-feedback',
        date: '2025-01',
        year: 2025,
        text: '"During your presentation, you mentioned being young and naive, but let me tell you—that doesn’t stop you from already being a rockstar." - Senior Product Manager'
    },
    {
        type: 'work',
        id: 'personal-portfolio',
        title: 'Modern Personal Portfolio',
        date: '2025-01',
        year: 2025,
        media: '/images/buildsTimeline/PersonalPortfolio.webp',
        preview: 'I never liked making resumes anyways',
        description: "Designed on my runs and built using a modern stack - nextjs, tailwind, framer motion, and vercel.\n\nIt's a place on the internet to showcase my work and thoughts.\n\nI hope you enjoy using it. I certainly enjoyed making it.",
    },
    {
        type: 'work',
        id: 'meet-or-not',
        title: 'Meet or Not | Web App',
        date: '2024-03',
        year: 2024,
        media: '/images/buildsTimeline/MeetOrNot.webp',
        preview: 'Generative AI tool to ensure your next meeting is effective',
        description: "I was sick of wasting time in meetings that weren't setup for success. So, I built a tool to help:\n\n1. Determine if your meeting is necessary\n2. Ensure it is effective\n\nIt was my first full-stack web app, utilizing:\n- Google Cloud's Firestore database\n- OpenAI API to generate meeting agendas\n- Custom templates and instructions for the LLM\n\n**Impact to date:**\n- 191+ users\n- **60+ meeting agendas generated**\n- Saving as many hours in preparation time",
        link: 'https://meetornot.io/?utm_source=portfolio'
    },
    {
        type: 'work',
        id: 'race-time-calculator',
        title: 'Race Time Calculator | IOS App',
        date: '2024-03',
        year: 2024,
        media: '/images/buildsTimeline/RTCpreview.webp',
        preview: 'The only IOS app that can predict your race time based on your apple health running data',
        description: "From never having seen a single line of Swift code to launching on the app store in 5 days. This was my first IOS app and a reminder to just do cool things without the pressure of trying to predict where it will go.\n\nI never expected this app to be anything more than a fun one-trick pony that my friends and I used for a week. After forgetting about it for 5 months, I randomly checked the analytics to see an (at the time) astounding 200 downloads.\n\nAfter fixing the in-app feedback section, listening to users, and releasing 6+ iterations on the app store, it now sees ~10 new downloads a day. As of Jan 13th 2025, it has been **downloaded more than 1200 times**!\n\nFor more cool insights on how people are using the app, [click here](https://declankramper.notion.site/Race-Time-Predictor-App-6a485fdb13d84d07ab26e2aa7c3b2de0).",
        link: 'https://apps.apple.com/us/app/race-time-calculator/id6478423515?ppid=1dcc2c47-705e-4e5f-a97e-711ecd9089db'
    },

    {   
        type: 'work',
        id: 'validate-idea',
        title: 'Validate Idea | Web App',
        date: '2024-11',
        year: 2024,
        media: '/images/buildsTimeline/ValidateIdea.webp',
        preview: 'Starter-kit landing page to validate your SaaS idea while building it',
        description: "Like many of you, I struggle with decision paralysis from having too many ideas and *no clear way to know which idea I should go all-in on*. I wanted a faster way to figure out if people cared about my ideas *before* investing months into building.\n\nSo I built ValidateIdea to solve this problem - a full-stack starter kit landing page that focuses on understanding user needs before needing to get deep into lines of code.\n\nLaunched on ProductHunt to a measly 7 upvotes, it's a reminder that if you're not using your products, no one else will either. And whatever you're going to say, use less words.\n\nDespite only **3 people signing up** and **4 github repo clones**, I learned a tremendous amount - both technical (how to build web apps) and ever-growing product skills (positioning and marketing).",
        link: 'https://www.validateidea.now/?utm_source=portfolio'
    },

    {
        type: 'work',
        id: 'magic-record-player',
        title: 'Magic Record Player',
        date: '2023-12',
        year: 2023,
        media: '/images/buildsTimeline/RecordPlayer.webp',
        preview: 'Play the soundtrack of your memories',
        description: "The Magic Record Player allows you to 'listen' to your memories by placing memorable photos on top of the device, broadcasting the song or playlist attached with the memory through a nearby speaker.\n\nIt works by using a raspberry PI to run a python script that calls the Spotify API to play the song/playlist tagged to an NFC chip that is attached to the photo.\n\nAdvanced logic makes it similar to a record player:\n- Remove the photo to stop the song\n- Place it back on to continue\n\nOnly two were made as special gifts for the special people in my life.",
        link: 'https://declankramper.notion.site/NFC-Record-Player-Build-bf95a606cc474c11a626b50821fb12d4?pvs=4'
    },

    {
        type: 'feedback',
        id: 'tyler-feedback-1',
        date: '2023-11',
        year: 2023,
        text: '"Given he is a self-starter, we often just counted on him figuring things out (which he did)." - Director of Product Management, client'
    },
    {
        type: 'feedback',
        id: 'tyler-feedback-2',
        date: '2023-09',
        year: 2023,
        text: '"Declan was self-motivated to get to an outcome, which is perhaps the GREATEST skill a product person can have" - Director of Product Management, client'
    },
    {
        type: 'work',
        id: 'sunbelt',
        title: 'Locations Map Redesign & Scalable Systems for Retail Client',
        date: '2023-10',
        year: 2023,
        media: '/images/buildsTimeline/SunbeltRentals.webp',
        preview: 'Elevating digital user experience and driving innovation for a B2B eCommerce leader seeing 400k weekly sessions',
        description: "As a product consultant for a leading B2B eCommerce client, I led the development of a locations map redesign and built scalable solutions to enhance both user experience and internal efficiency. Key achievements:\n\n**Product Leadership:**\n- Led a 12-person cross-functional team delivering end-to-end software development\n- Shipped 27 new features in 15 months\n- Achieved #1 usability score across the entire platform with our locations page redesign\n- Bi-weekly presentations to VP-level stakeholders showcasing new features\n\n**Technical Innovation:**\n- Architected and implemented a scalable design system serving 400k weekly sessions\n- Built an intelligent location finder that became the benchmark for competitor analysis\n- Developed automated workflows reducing customer support overhead\n- Created new marketing and data management tools enabling client self-service\n\nThe project showcased how technical excellence and user-focused design can transform a traditional industry. From reimagining the homepage to building sophisticated mapping solutions, every feature focused on making equipment rental easier for thousands of daily users."
    },

    {
        type: 'work',
        id: 'next-level',
        title: 'Next Level Lawn Care',
        date: '2013-02',
        year: 2013,
        media: '/images/buildsTimeline/NextLevelLawnCare.webp',
        preview: 'Grew a lawn care business to service 60+ customers and generate $30k+ in revenue',
        description: "I started it when I was 12. **During it's peak, I managed 22 weekly customers.** It was hard. But I figured it out and made it work.\n\nThe interpersonal and soft skills I learned here are some of my most enduring assets. To first market the business, I went door to door and sold myself with a pitch I practiced in front of the mirror and some flyers made in Microsoft word. Like all great products, word of mouth soon became my biggest marketing channel.\n\nI owned my work, cared about my customers, and was obsessed with doing the right thing. **This obsession, helping others in the best way possible, has stuck with me.**\n\nPictured here is the trailer I made with my dad before I got my license."
    },

    {
        type: 'feedback',
        id: 'next-level-feedback',
        date: '2013-02',
        year: 2013,
        text: '"Dec, for the past several years you have been providing lawn mowing services for our front yard in a timely and quality manner, and have received many compliments regarding our yard. My neighbor to the south appreciates the little extra you do to not only make it easier for him, but how it makes both of our yards look good. We look forward to your continuing this service in the future when the weather breaks..." - first customer, Next Level Lawn Care'
    },

];