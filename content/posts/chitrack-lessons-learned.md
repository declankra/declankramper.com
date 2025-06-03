---
title: "ChiTrack: why i built it and what i learned"
date: "2025-06-03"
categories: ["Product"]
preview: "simple is not easy"
---

## ChiTrack: Chicago CTA Transit Tracker | [Website](https://www.chitrack.com/?utm_source=blog) | [App Store](https://apps.apple.com/us/app/chitrack-chicago-l-tracker/id6745131685)

### Why build this?
Because I use the CTA train multiple times a week to go into the office and hated the existing options for tracking arrival times to know when I should leave the house or start running to make it. They were ugly, confusing, and cumbersome to use for what seemed like a simple need.

So, I made it simple.

(note: most things seem simple, until you get more specific and realize there’s a lot more decisions to make, but that’s when it becomes fun)

### Who are you building it for?
**Target audience**: Chicagoans who always take the CTA train to work every week

**ICP**: 22-35 yo, lives off train lines, rides the train >4/week, owns an iPhone, pays for convenience, values simplicity, professionalism and cleanliness

### What makes it different than other CTA trackers?
1.	**Track “direction-specific” trains:** A never-before-done (I checked!) technical implementation that combines static GTFS stations data with dynamic stop API Data which allows users to select direction specific train information, ignoring irrelevant train times.
2.	**Personalized & Delightful:** The ability to save your home and favorite stops, small animations (confetti), personalized greetings, and memorable moments (2 running emojis instead of 2 minutes) make this routine experience a little more enjoyable
3.	**Simple & Intuitive Design:** Although “more intuitive” isn’t enough to disrupt an industry, it is apparent in products you use every day (or week)


### The hypothesis: 
If there were a CTA tracker app that was intuitive, beautiful, and provided direction-specific train arrival times for 22–35-year-old Chicago commuters who ride the L >2/week, then >500 of them would open the app at least once per week.


### Some of the lessons learned (and reinforced):
-	Finishing on time is more important than being ‘right’ (and especially perfect)
-	Deciding when something is ‘finished’ to the point where it’s ready to be shared with the world is hard because it’s a personal decision
-	Be ruthlessly narrow on your ICP early on (if a feature doesn’t solve their core problem or on their main journey, don’t make it)
-	If it seems too complex for your first release, it probably is (I probably spent a month trying to implement a tri-layered caching approach optimized to reduce cost before the app had its first user – yikes)
-	Technical stuff: data caching strategies for web and mobile applications, handling static + dynamic data through API sources at the same time, React Native and Expo for development


### What will you do differently next time?
-	**Validate the idea:** I didn’t spend much time or energy here. Most people you asked would agree that current solutions “suck”, but why? And what do they care about? And do they care enough to switch?
-	**Validate the distribution methods:** My initial plan was to rank super high for ‘Ventra’ (uncompetitive keyword yet the Ventra app gets 40k downloads/mo), but it wasn’t until I submitted to the app store that I found out it was against Ventra’s policies. Now, I’m way too far down the results for anyone to see and need a new approach.
-	**Reduce complexity & release earlier:** I spent 3 months working on this app. Yes, I prioritized and completed other things during that time. But this was my main “side-project” during that time, and it was far too long. 


### Future things 
-	Fun, guerrilla-style marketing by placing flyers with QR codes and catchy questions at local train stations, since this is a location-specific app
-	Fight Apple on their unsubstantiated claims that I can’t use ‘CTA’ in the title of my app (it adheres to both CTA and App Store guidelines) so I can rank for that keyword in the app store
-	Napkin math reveals that 500 WAU riding the train to and from work (4k monthly impressions) = ~$150 in ads (leveraged due to high CTR on ads served by local, trustworthy developers)
-	Add a map. And bus tracking. (only after 500 WAU)


**But for now**, I’m excited to begin development on my next iOS app (Garpple), which has already amassed valuable insights from over 120+ interested customers through the sign up page and in-app feedback in the single-feature [Race Time Calculator app](https://apps.apple.com/us/app/race-time-calculator/id6478423515).
