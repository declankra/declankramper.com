---
title: "On Coding with AI"
date: "2026-02-09"
categories: ["AI"]
preview: "a few things I learned using AI to code"
---

This is part 1 of "Things I learned building an AI product with AI". This is not comprehensive because technology moves fast, I'm learning new things everyday, and recency bias. Although, many of these thoughts are principles that may last a little longer than the next model release happening tomorrow [^1]

*i tightened the title to just coding, instead of building, because im using AI beyond coding in the 'building process' but these are coding-specific.*


on coding with AI:
- 'fix context/access', not 'fix code'
	- anytime an AI coding model isn't able to do something that I want, I think about why it wasn't able to do it
	- this could be due to a lack of clear instructions or domain-specific knowledge (context) or it could be due to not having the right tools, controls, permissions (access)
	- fix *that* instead of "fix this code/error"
	- and if i don't know why, i ask it why! this will usually give you a good answer
- self-verification is huge
	- save yourself time/headaches and improve code quality by providing the tools and instructions for the model to self-verify it's output after completing a task
	- most newer models already do a decent job at running builds as tests, but you should be doing more
	- telling the model to write lint tests are good deterministic checks, but what i've found to be even more helpful is having it verify the change directly in the UI (browser or app simulator)
	- for web applications, i use a skill that instructs it how to use the playwright MCP to access/control the browser UI and take screenshots/read browser logs anytime there's a UI or functionality change
	- additionally providing it with real testing documents (protected from git ofc) makes the automated tests even better (although it was cool/freaky to see it write code/python to create PDFs/CSVs to test an upload feature - don't doubt its urge to help)
	- i'm still testing most things myself ofc, but it catches things before i do
	- in the meta sense: this is why AI so good at coding in the first place. coding is an inherently verifiable process - it compiles or it doesn't - which is one of the reasons why models got so good at it so quickly. so, close the loop and give your model the ability to verify it's own output in the necessary ways.
- compound coding learnings within projects
	- give the model a structure to learn from past mistakes and self-improve itself
	- i currently do this through an AGENTS-LEARNING.md file where "do not do again" typa things life.
	- i've found current models are a little too eager to add learnings to this doc for my liking, so it's only upon manual instruction right now
	- ([every](https://every.to/guides/compound-engineering?source=post_button&ph_email=declankramper@gmail.com) calls this 'compound engineering' and they have a plugin to formalize this, but i don't think it needs to be basis for every new command nor as complex/structured - one doc works for me)
- compound learnings across projects
	- within individual codebases is great, across codebases feels even better
	- if you've already solved something in one project, just tell the agent to go look at that other project and implement it
	- i've even done this for calling my own APIs i built in another project - that felt cool
- codify specific product/design/architectural principles
	- models do code well, but they don't know the product your building
	- codify those principles - what product decisions you'd make, how you think about architectural tradeoffs (how much do i care about cost? speed?) in that light and also how you want you product to feel
	- i enjoy doing this by pulling external information in that i wouldn't have time to fully dig around the internet for myself
	- "perform research on {this topic i've heard about and think applies but don't have to the time to} and then write a report/guide on learnings w/actionable principles that apply to this project" -> "using that guide, rank top areas in this product/codebase for implementing those principles"
	- this way i can learn it immediately in a practical sense
	- e.g. web animations by emil or product delight by Lenny's podcast guest or agent architecture principles by every
	- the next time i'm touching a new feature, you can just @ those principles for it to follow
- create something to react to (fast prototyping)
	- sometimes we are limited by our own imagination, so spin the lottery wheel and have the model create variants / different approaches -> compare them -> pick the best parts of each
	- tools like codex web and cursor both have the ability to send the same prompt in multiple worktrees, try it if you're stuck or want to explore the possibility space
	- i love doing this for design/UI work or when exploring possible different UX approaches as this is an area im not great at intuitively and i find its faster/better to pick and choose ([trusting i know what good looks like](https://www.declankramper.com/writes/how-im-improving-my-design-sense))
		- hint: this in a visual way too - tell the model to create an interactive HTML canvas with the various options
- specs & plans are still foundational
	- reducing ambiguities. have it interview you. read the entire plan yourself. make your own edits. try multiple models. use different perspectives. have it interview you again until the questions are redundant.
	- the goal is to understand what you want and how it will work first, then code. spending time in the planning step pays off big time.
	- a pro tip is to create different plans for the product and the technical implementation. don't overlap the two - have the former inform the latter.
	- e.g. i had a 90 min client interview that fundamentally changed my understanding of the workflow. after quickly shooting out a follow-up email before EOD with further questions, i then spent a solid 5 hours reviewing the change. all in markdown. before writing a single line of code. the next few days were then just verifying each implementation phase against the original plan
- /review
	- have ai do a second review on the code before pushing.
	- major ROI on doing one more review pass even if you think it's already passed all tests. i'm often surprised on what's missed.
- be scientific
	- when testing or proposing changes, speak in in terms of experiments to run and hypothesis to disprove.
	- i find that coding against auditable "experiments" help both me and the model understand the decisions we are making so we aren't flying blind
- extra note: on what im using to code:
	- claude code in the terminal for UI/UX exploration and supporting research.
	- codex in the terminal for everything else.
- extra extra note: use STT (tools like wisprflow) for talking instead of typing
	- the codex product lead infamously said that typing was the limiting factor in building speed, and he's not far off
	-  i find it most helpful for when i have a bunch of thoughts and want to have AI help me structure some of these thoughts and research requests - so i just talk about everything and then work backwards from the end goal based off everything that I'm thinking about
	- (it's already unimaginable to think i used to have to type everything)

This is how I've been using AI lately to code. I enjoy making architectural decisions instead of hand writing the code and worrying about type errors.


[^1]: jokes. but we do live in crazy, hyper competitive and fast-moving times.
