---
title: "Loss Leaders of Innovation"
date: "2026-10-04"
categories: ["AI", "Product"]
preview: "pay for expensive intelligence to solve a problem you don't fully understand yet, then encode what you learn into something cheaper and faster."
---

Like a loss leader in business, which is an upfront investment designed to ultimately achieve/do another thing later (win more business), I see the use of frontier models on non-frontier problems serving a similar purpose for innovation.

The idea is to pay for more expensive intelligence to solve an under-defined problem, accepting the higher upfront cost and latency, then encode what you learn into a better approach that's cheaper and faster.

The method is newly possible given we can simply pay for intelligence now (wild). It allows you to solve for problems faster that you might otherwise have never even solved to begin with because you would've needed a better upfront understanding (read: resources) to meet some minimum launch expectation threshold.

These frontier models (frontier loosely meaning the best ones with the most reasoning) operate best in ambiguity = a problem space you don't fully understand. These 'expert generalists' can figure things out in these spaces where an under-resourced specialist (without the proper tools or guidance) could not.

The process generally looks like this:
1. know there's a problem you can solve, but only partly understand it
2. deploy a frontier model into the problem with guidance from the little you do know (examples, rules, etc.) & make sure users can revise its work (!!)
3. collect learnings from solving the customer's problem: production traces, completed artifacts, corrections
4. turn those learnings into more reliable, durable infrastructure/tools: code for the rules, skills for the judgment, or a smaller, faster model that fits the job better
5. benchmark alternate/new approaches against the current one and switch when they win

Now you use less intelligence and less cost to serve the same capability.

![Animation: a dot crosses a bumpy path; pieces from each bump harden into blocks that smooth the path, so each run is faster](/images/blog/loss-leaders-of-innovation/loss-leaders-loop.svg)

It's analogically similar to subsidizing the startup cost of a network. Once that network is formed, you can then claim efficiencies from it and grow faster + cheaper. You serve a few at a high cost, then spread what you learned to everyone at a lower one. It's the services-led product approach that takes learnings back into the product/platform and makes the experience better for the next one.

Or like practice: a hard task that at first takes maximum focus, effort, and preparation becomes second nature, and is performed in a calm/flows state, after enough repetitions.

## A product example

One of the first steps in a workflow I built is uploading a worksheet. The format changes within a team and between teams, but the workflow always needs the same data columns. Instead of hard-coding scripts that would break on an unrecognized format, an LLM instructed to find the columns we needed was easier and quicker to build.

It got the job done, but it was slow and expensive for what is really a classification task. Now that production has given us wide-ranging formats and examples, we moved to a tool better fit for the job: [Jev](https://typesafe.ai), a classification model.

The read is now 8.6 times faster and about 90% cheaper. Customers see a near-instant read instead of a 12-second wait, which is important because it's the first step and sets a better impression for the rest of the experience.

![Chart: reading a sheet takes 3.2 s with the LLM call and 0.37 s with Jev, at about 11% of the cost](/images/blog/loss-leaders-of-innovation/loss-leaders-sheet-read-chart.svg)

The quality improved too. That came from iterating on the learnings independently from a better-fitting tool.

## The other direction works too

On another product I built, I went the other way: code to model. I started with code because I didn't understand the workflow as well, and code gave me more rigid feedback in the gray areas. Then I abstracted that infrastructure away and handed the job to a model with skills, and it did the job better.

Doesn't matter which way as long as the method can turn learnings into a better product. Starting with a model can be faster: code is rigid to set up and can be wrong and block the user from moving forward, whereas a model is flexible, and when it's wrong, the user can tell you.

Either way, intelligence is now available to help make innovation (learning) happen in areas that weren't as available before.
