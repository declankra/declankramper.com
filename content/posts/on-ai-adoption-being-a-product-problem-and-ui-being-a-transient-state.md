---
title: "On AI adoption being a product problem and UI being a transient state"
date: "2026-10-18"
categories: ["AI", "Product"]
preview: "If the ideal end state of working with AI is an AI that can work in the background, then the user interface is a transient state that exists until the learnings have been encoded."
---

- I believe AI adoption for business work at this point is a product problem
- The level of general intelligence in a frontier model has passed the threshold of doing "today's work" 
- Backend infrastructure to power that intelligence is ready too (agents can use their own computer to complete long-running tasks autonomously in the cloud) 
- But people still struggle to use that intelligence in general business domains today because today's products, starting with their experiences/interfaces, have too much friction (setup, workflow/behavior change, and up-skilling)
- A services-lead approach is being used to supplement the ideal product in the meantime

## The ideal end state product

If the ideal end state of working with AI is an AI that can work in the background, then the user interface is a transient state that exists until the learnings have been encoded.

Which is why I’m very bullish on generative interfaces.[^1]

What doesn’t the system understand well enough yet such that it needs to prompt the user for that information?

And for that information (feedback) that it needs, what’s the best way to get it?

This can still include a text response to another text message. But maybe two buttons or a table with input fields or a canvas to move things around or a slider to adjust the level of input or a mock of two alternatives with the ability to point, cut, shift etc is better. The idea being that the generation is optimized for whatever needs to be expressed and collected (note: just because something isn’t collected in the moment doesn’t mean the feedback isn’t going to be collected later)

(the last example starting to describe more of a “generative experience” — “interface” seeming a bit stale to describe what could be)

Over time, as the system collects that feedback, it can encode it, learn from it, and eventually reach a point where it doesn’t need to ask for that information. So the UI goes away for that particular workflow in the meantime.

But the world changes.[^2]

So here’s where it’s relevant to mention what I think is the ideal end state of a company: a self-improving loop between (a) the world and (b) the company’s vision of the world.

Imagine this scenario exists. A state machine that gets feedback from the world (learnings, about customers, market, problem, etc) on one side, looks at the delta between that world (reality) and what the company understands about it and wants to see differently (the vision), then tries something to close the gap (interacts with the world) -> gets more feedback -> repeat.

So what I’m bringing up now is the system within that system — the one that connects (a) to (b). That's the employee's work: setting the vision with their judgement, executing on it, and bringing the world's response back into the company in the way they see fit (by experiencing it and [articulating it](https://declankramper.com/writes/articulation-of-intent)). I think that’s fascinating.

![Diagram: (a) the world and (b) the company's vision in a loop, with feedback flowing one way and attempts to close the gap flowing back; in the middle, tied to both, is the system within: the employee's work](/images/blog/on-ai-adoption-being-a-product-problem-and-ui-being-a-transient-state/ai-adoption-system-within.svg)

I've been doing a form of exactly this — working with companies to diffuse AI systems into their work — and it’s an interesting problem. What would make it work? Not just a system that does what’s needed correctly (that’s one part of making it work), but something that is adoptable. What would be the most ideal version of that adoptable process? This is the problem I’m solving.

As an FDE/applied AI consultant/whatever-you-want-to-call-it, I think my job is to ask good questions and know what good is. This is one of those questions.

I think it would look similar to what I’ve been describing along the way. A system that’s
- dynamic to current state, 
- generative to optimize for feedback needed,
- transient for only the current gap between (a) and (b)

with a process that’s adoptable.

The adoptable factor is why the ideal end state is an agent that works in the background. What’s easier to adopt than something you don’t even have to use? Nothin. **No one wants to change their behavior (workflow) to accomplish the same thing.** The best AI transformation companies I know will list out the selling points of integrating with your existing systems/data/tools, and not requiring migrations. 

But there needs to be a certain threshold of understanding before a background agent state exists (re: “ideal end state”). It’s an incremental process. So then how do you increment?

I think you do so through the process of
1. Mining existing data for learnings (systems of records, documents/artifacts, and people through interviews and observation)
2. Encoding those learnings into an agent system that does the understood work
3. Using a system with the three parts from before to answer anything that’s not (yet) understood

Here’s a video to conceptually visual what that process and system at the end looks like:

<video src="/images/blog/on-ai-adoption-being-a-product-problem-and-ui-being-a-transient-state/ai-adoption-transient-ui.mp4" controls autoplay loop muted playsinline></video>

## Reactions

Now you might be countering by claiming that this is a new tool they’d have to learn. Didn’t we say before that the best transformations don’t require you to log into a new tool?

Well if (1) is done well, then the old “work” is already done and the new tool is shaped to gather any remaining feedback in a way that’s already understood/recognize-able through the previous way of doing things. Until it’s no longer needed.

The difference between this and a system that just records everything you do on a screen (yes [some startups](https://www.ycombinator.com/launches/RTT-screenpipe-record-how-you-work-and-turn-that-into-agents) are building that), is that this would move up with you into the higher levels of abstraction that becomes your new work. An example being the procurement tool I built that asks the operator to review the exceptions of quote comparisons, instead of manually mapping each line themselves.

By using this tool, you’d have already up-skilled and taught the employee to work with AI. That’s part of the change management process also important to a successful AI transformation.

Why couldn’t a lab just do this with their products? They already can handle encoding of learnings (via “memory”, project folders, skills) and background work (cloud, scheduling) and are increasing their capability to integrate with your existing tools, and have dynamic, generative UI (e.g. intelligent UI or artifacts) that works in a platform that uses a frontier model RL’d with their own harness. I’m still working through what would draw the line here, I think the answer is definitely that they could (and they probably want to/are working towards it), but two pieces that are at least preventing today’s products from being this ideal end state are
1. the initial discovery to mine for an understanding of today’s work (this is hard and manual today, enter their service arms — [DeployCo](https://openai.com/index/openai-launches-the-deployment-company/) and [Ode](https://ode.com))
2. focus (comparative advantage applies, a company can only do so much — although increasingly much — and some effort is better spent elsewhere, hence the [recent](https://openai.com/index/introducing-the-rosalind-academic-plan/) [focuses](https://www.anthropic.com/news/claude-discovers-novel-enzyme-system) on biotech because breakthroughs there like universal cures for diseases are worth a lot)

A cool thought experiment would be to think about these dynamic, generative interface systems as literally capable of copying the current legacy systems 1:1 to solve for initial usage problem and then stripping things back, and transforming, as the user + system is up-skilled. I mean [everything is technically open source](https://github.com/morluto/rea) today anyways right?

Since problems don’t exist in a vacuum — if one person/company has a problem, then another person has a similar problem — the product shown in the video should then generalize learnings from one instance for the next. Make the starting point for customer 2 even better than customer 1’s starting point. And then any learning from customer 2 can then come back and help customer 1, too.

Interestingly I think the only two things between this envisioned product replacing the things I do now are:
1. Judgement - taste in discovery and knowing what questions to ask
2. Relationship - the trust, accountability, and joy of a shared connection

Technology is quickly advancing in the judgment capability required, but the relationship-building is less of a technological one. It then seems reasonable to assert then that relationships, and those human qualities to build that, will matter more.

## Why write this

I write all this because I’m thinking about how to do the best for my current and future customers. I see a middle-aged man’s face drop and the dreadful sighs enter his breath when explaining how he has to spend a whole day on data entry. Soul sucking. He doesn’t want to do that. I don't want him to do that, either. The notion of what work is is changing fast. I just want it to be more enjoyable, like he does too.

[^1]: generally defined as an artifact that is produced in (relatively) real-time in response to current information. It can also be referred to as "on-demand software". [Used to get bagel orders for St. Patrick's day](https://declankramper.com/writes/on-demand-software). Or in Siri to [deliver weather forecasts](https://www.cultofmac.com/wp-content/uploads/2012/09/Siri-Weather.jpg). And now seeing it in ChatGPT — what they call [Intelligent UI](https://openai.com/index/gpt-6-for-everyone/) — that's rolling out to the 1.2B+ people who use ChatGPT each week. 

[^2]: The world itself is dynamic (preferences, needs, what’s available and accessible) and generative (what's possible, technology, opportunities, evolution, accidents causing innovation)
