---
title: "Which Scaffolding Are You Building?"
date: "2026-02-18"
categories: ["Product", "AI"]
preview: "fighting the technical scaffolding is a losing battle. so what do we actually build now?"
---

*This connects to ideas on building agentic architecture in AI products, building AI products broadly, and how to think about building in the post-AI world. Where AI moves so fast and the capabilities compound so fast that the products we build have to be adaptive to that, this is an exploration into how to think about what we should be building at that point in time.*

Oddly enough that point in time happens to be *right now*. I do think we are in some sort of singularity. It just depends on how far you zoom out on the time axis but we are here and it is happening and knowledge work is changing really fast.

From my direct experience when trying to build applied AI products, I have come across challenges trying to build the right *technical* architecture, meaning the scaffolding around the AI capabilities. It's a question of:
- How much autonomy do I give the agents?
- How do I manage the context and memory of these agents? and the instructions and tools for doing work?
- How do I avoid programming a product too rigid -- where it fails to reap the benefits of the next model release that has exponential capability increases -- and is instead easy to change, but not all-time consuming to continually keep changing? (because they will get better and you have to plan for that)

I found myself spending time setting up vector databases, pipelines for getting models to explicitly ground their answers in linked pages, managing context through advanced hybrid keyword and semantic pre-processing to avoid hallucinations and long inference times, and making deterministic rules for when the AI should run and when the AI should stop for human review. But it felt wrong. Yes, a really great agentic architecture should know how to handle all of this and a great product would therefore be a result of it. So right now it's necessary. And I'm sure of those decisions will always be necessary (i.e. autonomy slider). But I'm cautious of how long it'll be necessary and just how necessary it is right now to begin with - I don't want to be wasting my time over-optimizing on something that will be replaced in the near future (i learned my lesson spending two months building components for this [SaaS starter-kit](https://landing-page-dkbuilds.vercel.app/) while you could spend 6 hours with any coding model today to replicate that).

When building something you don't understand, a deterministic, human-orchestrated LLM workflow makes sense. Now that I'm 2 months in with a better understanding of the business and how it works, continuing with this approach is going against the wind. One of the benefits of an agentic system is emergent capabilities that you don't have to code for (e.g. a model can compare prices because it can fetch all prices you've already coded the capability for), but in the current approach I need to build that price comparison feature. That's a technical scaffolding tax. If the product was truly agentic (atomic, composable, human-agent parity, with compounding beneficial context), it could do those things on its own. I'm (in more ways than just this) blocking it.

It seems that right now fighting the technical scaffolding is a losing battle.

 But then for those building it becomes a question of what battle do we fight now - where do we spend our time? What do we actually *build* now?

 I am coming to the conclusion that right now (emphasis on *right now*, thoughts change w new information) it's important to build two things:
   1. the tools to extract a deep understanding of the end user -- what they need, the problems they're having, and how they think about their work (human or agent, likely both)
   2. the tools to translate that into software, codify it, and be able to update it continually as the understanding extracted from (1) is updated

The first thing is extracting the ontology. The second thing is maintaining the ability to quickly turn that understanding into working software.

### On the first thing: extracting the ontology

 How to go about this likely depends on your situation. For example if you are a larger company, it would make sense to adopt a written company policy so all of your business knowledge is in writing and therefore useful for AI as long as you continually update that and find a way to create a source of truth (like Linear does). If you're a one-person consulting shop, like [me](https://www.dkbuilds.co), who is trying to work with experts in niche domains to apply AI to [solve their problems](https://gravelbox.xyz/case-study), it makes sense to build tools to get higher-fidelity feedback quickly. Those tools will be personalized to your use case and different from others. e.g., with one client we are limited in synchronous feedback time due to the nature of his job and me still working full time, so I created a tool to get asynchronous feedback on high-fidelity prototypes with limited dev effort on my end before following-up with the full-stack implementation - it's helped numerous times. It also makes sense to build tools that can do the first pass on extracting this ontology autonomously. This is what I'm exploring with [ontology-xtract](https://ontology-xtract.vercel.app/). I think tools like that can be used in the beginning of the process to get initial direction and also for in-flight projects to investigate their digital footprint.

 As anyone that builds products knows, we'll never fully understand what the B2C user wants to hire our product for and we won't know exactly how the business works in B2B. This is why we have ongoing product discovery sessions, parallel development with continuous learning, ship fast, learn fast mentalities etc.

 That's also why I'll continue to spend my time on *this type of scaffolding*  - around the product discovery work instead of the technical scaffolding - because the latter is exponentially improving regardless of what I do and the former still requires a lot of human interaction, making it more scarce. I'm excited to see where those tools go.

### On the second thing: continually translating to and maintaining software

 Emphasis on maintaining. Take it from the [creator of openclaw](https://x.com/steipete/status/2023426112978829693), "creating isn't the hard part, maintaining is". Apparently it's always been this way - in consulting they'll tell you that the money is made in the retainer/maintenance. Today, that retainer is the ability to maintain an agent and stay on the bleeding edge of innovation because the bleeding edge of capabilities make last year's tech look like wasted work. Some say speed of innovation is the only moat when capabilities are improving at an unpredictable rate ([amplitude ceo](https://x.com/tbpn/status/2023923987223638368)). I personally don't think it's enough to be the sole moat (assume there's someone working as hard/harder or is as far/farther), but we can all agree if you're not moving fast, you're not staying around much longer ([claire vo](https://x.com/clairevo/status/2023908375084617729)).

I believe it really comes down to constant iteration. In software, in life. Learning a physical skill or growing a relationship. Both benefit from time-to-feedback. I've talked about what I'm doing to shortening the feedback loop from intent/need/problem to experience/outcome/solution. But that process is never-ending, it's an entire process in itself to continually do that - the constant maintenance of already deployed systems - because, if one thing is certain, it's that change itself is certain.

### Where's the value

Therefore, with this thinking, I believe a majority (if not all) of the value of building today's (i.e. tomorrow's) software will be found at the tail ends of the product development process.
- the continual understanding of what needs to be built and why
- the continual maintaining of whichever system has been deployed

Previously, there was a lot of value in the middle. Resources there were scarcer, engineering was expensive. Not anymore.

If I had to pick one end over the other as being *more* valuable, I think it would be the beginning because novelty always disrupts and then the latter has to change reactively... but it's hard to come up with novelty. So then maybe the more reliable bet is on the maintenance/agility to keep up since you always have work to respond to, regardless of whoever comes up with the novelty that changes your work. I'm not totally sure. But the scaffolding on both of those ends are a better bet than the middle. That's where I'll be spending my time. [^1]

Either way, ideas and learnings arise from outputs of work, not the inputs. I'm gonna keep building to see where these thoughts go. Maybe one day the text on this page could be [all it takes](https://hils.substack.com/p/writing-is-building-now) to build such a scaffolding.


---

[^1]: In some ways and contexts, what I'd be doing to help businesses apply AI is in competition with OpenAI's enterprise-grade agents-as-a-service platform, [Frontier](https://openai.com/index/introducing-openai-frontier/). Now we know from Peter Thiel that competition is for losers so I want to avoid it. I think the cheap route here is to say I'm building "for smaller businesses that can't afford such a solution". Another approach would be to go deeper on a smaller area since there's always levels to understanding, and therefore utility. Either way I think a lot of the principles of being forward deployed, focusing on the ontology, getting close, adapting quickly, and continuously update your understandings is where the future is going. How automated this will be will likely surprise me in two years' time.
