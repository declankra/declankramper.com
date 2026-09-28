---
title: "ChatGPT or Build? What I Build for Clients and Why"
date: "2026-09-27"
categories: ["Business", "AI"]
preview: "when i build something custom, and when i tell a client to just use ChatGPT."
---

When does it make sense to build something custom vs just using the off-the-shelf tools from the AI labs?

Clients ask me this, and I ask it myself before I build anything. This post answers it from my seat: as an independent consultant, when do I build something for a business, and when do I tell them to just use ChatGPT? It's informed by work I've done helping SMBs to enterprises figure out what to build, and then building the things that have been used... and also not used (sad, but necessary).

By "build" I don't mean standing up an internal IT team. I mean someone who specializes in the problem building inside the systems the business already runs, and then keeping it maintained.

## The rule

Generally speaking, you'll want to build if these two things are both true:
1. it helps you understand your own business better (importantly, you own the learnings)
2. it directly helps deliver better work for your customers

Avoid it, and kill it if you've already started, if:
- you're spending more time on infra than on ontology (the business in its own terms: its vendors, its codes, its exceptions, the "are those the same thing?" calls only your people can make)
- the next model release will do the infra for you

There's only a handful of world-class companies that can spend time building more of the infrastructure. The Ramps, Coinbases, Shopifys, and Stripes, to name a few. Everyone else should let the labs build it.

## When I say "just use ChatGPT"

ChatGPT (or Claude, or Gemini) wins when:
- you don't know what you want yet and you're exploring
- the output doesn't require a strict format
- the work starts and ends in the chat
- it's one person's work, prose in and prose out
- the task is querying your own data, and you're not a company that specializes in helping other companies do that better

One of my first prospects, a fiber optics contractor, came to me with five asks after a "what can AI do" session. Four of them went straight to tools they already had:
1. making generic industry safety and quality policies their own → Gems / ChatGPT Projects
2. measuring cable runs from a map file → Google Earth / ChatGPT
3. Excel templates to track work by pay item → ChatGPT with Excel, Gemini with Sheets
4. finding job requirements and scopes in plans and specs → a Gem with instructions, NotebookLM, or a ChatGPT Project

The fifth, generating submittals, had too many steps for the existing tools. That one was a build.

What I wrote back to him is still how I think about it: "The key question is: what are your teams actually using ChatGPT for? If it's doing the job well enough, they (and others) will likely keep using it rather than switch to (i.e. pay for) a new platform."

## When I build

A couple of cases where building wins:
- **Repeating, consistent artifacts.** The same document, the same sheet, every week. You shouldn't have to ask for it. How do you even open it up? It should just be there.
- **When it's easier to click than to write English.** The person who knows the business best shouldn't have to become a prompt writer to do their job.
- **When the output has to land in a fixed format in a fixed place.** A bid sheet, a purchase order, the system of record the business already runs on.
- **When 90% right costs money.** If a wrong answer loses a bid, someone has to verify it, and the tool should make that fast.

I'm also bullish on systems of record. Managing and maintaining the large and exponentially increasing amount of generated stuff is hard. No one wants to do it. I don't even want to do it. I spend most of my day working inside only a handful of folders and even those are hard to maintain.

The build that met both halves of the rule for me is quote mapping for contractors. Every week, estimators retype vendor quotes into their bid sheet, matching each line by hand to their own codes. One PM tried ChatGPT on it and gave up: "It couldn't figure out. Is that the same thing? Are those two comparable numbers or not?" That question is the business's ontology. The tool learns each firm's answers (it remembers what you mapped that vendor's line to last time), and those learnings stay with the firm. And it helps them do better work for their customers: more bids with real prices behind them, fewer retyping errors.

## The scaffolding that dies

I previously wrote that ["fighting the scaffolding"](/writes/which-scaffolding-are-you-building) around a model was a losing battle. Now I want to make the nuance there clear: scaffolding that encodes your business knowledge is *the* battle, while scaffolding to account for model shortcomings (e.g. persistence, excessive context control, cost controls) *is* a losing battle. The investment balance on building with today's capability vs building for tomorrow's capability is your decision. There's no shortage of advice out there to "be more ambitious", but that doesn't excuse the deliverable that needs to be turned in this week (and next).

An example of something I built that's no longer used: back in summer 2025, models were good enough at synthesizing large amounts of information, but they were still really bad at following directions. This was an issue if you needed a consistent response format (e.g. for a recurring document). For a consulting team that had to churn out many structured documents in a short period, the unstructured chat interface from the AI labs wouldn't suffice for the speed they needed to operate. The solve was to build a tool that would force structured output of the synthesized information. It worked. Months later, after that project was over, a member of that team asked me if I could create that for his new engagement. I told him to just use ChatGPT. The technical scaffolding was no longer necessary; the raw model capability would now reliably follow the format you give it in chat. The failure mode was building technical scaffolding for model capability shortcomings.

Think of frontier models like a trojan horse for solving unsolved problems or exploring new possibilities. Frontier models, much like the best employees, require less direction, have more agency, and can deliver things better than the others. The play then is to use the frontier model to first get it working well enough to capture learnings on what makes it great, at the expense of higher initial cost. Once you have enough learnings (i.e. direction/ontology encoded in durable artifacts), you then provide that direction to a cheaper model with more structure... and wallah! Same quality for cheaper.

## How it shows up in a call

When someone asks me to build, a few questions do most of the sorting:
- Show me the last three times you did this. (If there aren't three, it's not a repeating artifact yet.)
- Could two of your people land on the same answer? And who breaks the tie? (That's the ontology, and it's the part worth building around.)
- What happens if it's 90% right? (If the answer is "nothing much", use ChatGPT.)

And the honest part. Even when something passes all of this, the most likely ways a build still doesn't get used are:
- the product isn't refined enough to use
- the problem isn't valuable enough, despite a usable product

## So, ChatGPT or build?

I think about AI systems in [three layers of intent](/writes/articulation-of-intent): articulating it, understanding it, and connecting it to action. The labs will own understanding intent and connecting it to action. What you build for a business is the layer that holds what only the business knows: its articulated intent and what it has learned from reality and its customers.

Everything else, teach them ChatGPT.
