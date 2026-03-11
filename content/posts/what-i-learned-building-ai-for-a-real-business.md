---
title: "What I Learned Building AI for a Real Business"
date: "2026-03-07"
categories: ["Business", "Product", "AI"]
preview: "reflections on the last two months building so I can learn"
---
noted date: mar 7, 2026 <br />
*because things change and i’ll learn more later*

## why taking so long?

That's the first question I asked myself after waking up groggy, having just been up till 1:30a on a Friday night fixing deployment issues (durability for long running tasks, agent-state + thread management, and client-database write persistence, to name the excitement). 

It’s been 2 months of heads down dedicated to building a platform product for a real business. This comes after ~2 months of passive work here and there to build a foundational prototype before aligning on the partnership + opportunity. These lessons are from the past two months, which is effectively the journey of trying to take it from prototype with potential to production-ready with measured business impact.

so, why’s it taking so long? (since there's been no measurable business impact, yet)

imo it comes down to three things on why it’s taking so long:
1. Lack of verifiable digital data
	1. e.g. it's not clear how the first phase is 'finished'/'correct'; currently relying on implicit knowledge which takes time vs artifacts to run benchmarks/experiments against
	2. since most of the work is fragmented (a problem the product would solve), there aren't many historical "good" examples of this work being done well
2. Too much at once
	1. went from a prototype of a small slice to the full E2E management immediately before the small slice was production-ready
3. Sloppy codebase making progress slow
	1. due to the top two reasons + me not being a software engineer + building on cutting edge

In the beginning, the original slice (the prototype) was only what is now a single screen at the end of a very long process. And I fell into the trap of thinking “oh yeah that’s close” was good enough feedback given the ratio of time spent to hearing “pretty close”. How fast I moved when it was just one screen!

I thought that “okay it’s go time” meant it’s time to do the whole beast - the whole back office project management workflow. Holy shit. Just think about that. So much. 

In doing so, I can no longer simply articulate the exact problem being solved by the full E2E platform…
- tracking pay items from bid to procurement throughout a project?
- time spent managing documentation throughout project lifecycle?
- automatically preparing and managing purchase decisions?

But what would subcontractors do if they didn’t have this? Just keep spending more time, fine. Cost of inaction? More time. Maybe some headaches from missing a scope item, but is there a real dollar cost from not using the tool? It’s the time the tool would save you. Key word being would; we’d all like things, if it *would* work.

Red flags. <br />
*edit: the full scope of the platform (being E2E) would solve a handful of very direct issues, i think the problem with this approach --- at least starting out --- is that since it's doing too much, it therefore loses clear sight into any one, singular benefit*

The difference between what works and what doesn’t work is verification. Refer back to point number one: we didn’t have the most important part of the puzzle (or, I thought what I saw initially was enough, but it wasn’t. It made sense to me after being told, but I wouldn’t be able to explain all the reasons behind the decisions still. That’s a practical test to see if you truly have enough data to make something that works with AI - can you explain the *reasoning* behind each decision? This is another way at understanding why deep domain expertise is a differentiator in building successful AI products.)

## so what do now?

address each of the three problems:
1. Lack of verifiable digital data -> get verifiable data for a part of the process
2. Too much at once -> work on a smaller slice, ideally with high ROI + verifiable data
3. Sloppy codebase making progress slow -> remove all old junk besides new agent experience + invest in agentic harness

for this particular product, there's two courses of action:
1. focus solely on the first phase in the E2E process, scoping, since it's foundational to the rest of the data in the process
	- what will it uniquely require? examples of "correct scope", full project artifacts of spec books + bid books, understanding the implicit knowledge that goes into "correct scope"
2. focus solely on the quotes phase since it's had the most positive stakeholder feedback
	1. what will it uniquely require? understanding what exactly is valuable ("exciting" to the stakeholders) regarding this phase, more detailed understanding of the phase mechanics, more examples of each artifact in this process (including a 'decision' artifact)

must haves regardless:
- cleaner codebase (rid of legacy product bloat)
- agentic harness
- verifiable data for what "good looks like" to test against

The quote problem is probably intuitively exciting because it translates to a real dollar value for every instance and it can be clearly articulated.

“Catch mispriced invoices to save money”

In my growing research + understanding into validating opportunities for AI's business impact / building AI products, I've landed on 6 criteria. The quotes phase checks all 6.
1. data already digital - quotes and invoices are digital PDFs
2. verifiable - comparing quote prices leads to a Y/N decision
3. solves for an existing loss - they lose money if something is misquoted
4. existing workflow - it can monitor their emails where they already handle quotes/POs (but the decision process follows the same flow)
5. each notification translates directly to saved $ - "this quote is cheaper by $x", "this invoice is mis-priced by $x"
6. recurring - quoting + invoicing happens on every project, up to hundreds of times each project

More notes on verifiability since I believe it's important: it means the decision can be repeated because there's an objective ground truth. the decision is enforced by a binary rule - correct/incorrect, yes/no. often, it's backed by a number, but it doesn't have to be. can two people look at the same inputs and reliably/repeatably agree on the same decision? if yes -> verifiable.

The issue with option 1, focusing on the scope phase, is that the results aren’t well documented (only loose tables of pay items and their products) and the decisions are made offline with no documentation, relying on implicit knowledge (e.g. when there’s an ancillary product, communicating with GCs on partial ownership). This makes verifiability difficult. In order to do so, we'd need to create our own digital documentation (where none currently exists) that captures each condition and can lead to a well-defined decisioning process from the implicit knowledge. Possible, but much harder than the quotes process.

The product is currently getting hung up on the scoping phase since the outputs of that phase are what drive/inform the remaining phases. There is lots of relational data in the E2E process, which is great for making software helpful, but the first phase outputs are difficult to extract.

So, we decided to focus on the quotes phase for the reasons discussed. I'm sure I'll write more later on what I learn from this next part of the process.

## what would I do differently if i redid this engagement from the start?

I think the six criteria I outlined earlier are a great place to start. There's definitely a balance to find between doing too much diligence (that will convince any person out of an opportunity because you can always find reasons not to do it) and just enough (to rule out the biggest risks/barriers + acknowledge the remaining challenges to test). So then the skill is understanding what area your opportunity is in and mapping that to the critical criteria that must be considered. For building/selling an AI product for/to midsized companies, those six criteria are what I would consider next time.

---

p.s. to read more on the story behind the motivation of this product and initial learnings while building my first agentic product: [Case Study](https://gravelbox.xyz/case-study)
