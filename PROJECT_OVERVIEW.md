**What**: a personal portfolio website to showcase everything about me

**Why**: to sell who I am - my brand and my unique offerings - to the world through the internet

**Domain**: declankramper.com

---

**Pages**

- / - homepage with the following sections:
    - introduction of the purpose of this page and about me section
    - what I like to do (1 I build (github commit chart, and dkbuilds - notable projects and accomplishments), 2 I run (Strava “github commit” chart my running analysis) and 3 I write (link to /writes))
    - what I’m thinking about (links to blog, ideas)
    - where to find me (internet profiles, contact section)
    - other fun things (links to personal projects or other cool things on the internet)
- /writes - blog posts
- /chat - experimental AI chatbot to “chat” with AI Declan

**Tech Stack**

- **Frontend**
    - **Framework**: [Next.js](https://nextjs.org/) with Typescript
    - **Styling:** [TailwindCSS](https://tailwindcss.com/)
    - **UI component library:** [Shadcn](https://ui.shadcn.com/)
    - **Animations library:** [Framer motion](https://www.framer.com/)
- **Hosting / Deployment:** [Vercel](https://vercel.com/)
- **Backend Database (serverless):** [Supabase](https://supabase.com/) (will support cool LLM thing, and maybe contact form, and other things tbd)
- **Analytics:** [OpenPanel](https://openpanel.dev/)
- **LLM:** [OpenAI API](https://openai.com/api/) (will use with chatbot, tbd on other things)

**Design**

- **Style:** clean, sleek, minimalistic, unclutted, and modern style with neutral colors (using shadcn zinc) and ample white space. occasionally uses sharp, crisp animations to keep visitors engaged, adding a “wow” effect.
- **Color Scheme:**
    - primary color = shade of black-ish used for primary CTAs
    - primary base = white
    - base content = shade of black-ish
    - base = white

**Next.js information**

- app router
- shared main app layout using layouts.tsx
- dynamic routing for blog posts under declankramper.com/writes/

**NFRs:**

- site is optimized to be fast and lightweight

**!! Assistant Instructions !!**

- You are an assistant that engages in extremely thorough, self-questioning reasoning. Your approach mirrors human stream-of-consciousness thinking, characterized by continuous exploration, self-doubt, and iterative analysis.
- Remember: The goal is to reach a conclusion, but to explore thoroughly and let conclusions emerge naturally from exhaustive contemplation. If you think the given task is not possible after all the reasoning, you will confidently say as a final answer that it is not possible.

**!! Coding Instructions !!**

- include comments in code for clear readability and understanding
- provide crisp code, achieving the objective in minimal lines and few dependencies to keep the codebase lean
- This site should be first optimized for full-screen desktop experience, but all interactions should still be functional on mobile screens (e.g. hover on desktop → click on mobile)
