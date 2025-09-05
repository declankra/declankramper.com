---
title: "Which Divvy bike station needs another rack?"
date: "2025-06-03"
categories: ["Product", "Business"]
preview: a curious question leads to a fun data investigation
---

[View the live report here!](https://divvy-live.vercel.app/)

## Business Problem Overview

### Problem statement

How can we determine which Divvy bike station would benefit from another rack?

### Hypothesis / assumption to test

There exists **at least one** Chicago station where adding a rack would relieve user pain *or* cut Divvy costs.

*Initial hunch:* docks near high-traffic leisure spots (lakefront, bar clusters) will top the list.


### Divvy strategy to keep in mind

City + Lyft are still in **“expand-everywhere” mode**: 250 new stations and thousands of e-bikes are being rolled out by 2025, with an explicit focus on underserved South- and West-side neighborhoods and on reducing re-balancing van mileage. ([chicago.gov](https://www.chicago.gov/city/en/depts/cdot/provdrs/bike/news/2023/october/new-divvy-stations-and-bikes-coming-to-chicago-as-part-of-contin.html?utm_source=chatgpt.com), [divvybikes.com](https://divvybikes.com/explore-chicago/expansion-temp?utm_source=chatgpt.com))


### Benefits to track

- **Customer pain** ⇒ difficulty docking when a station is full.
- **Divvy profit** ⇒ cost of truck runs to rebalance bikes.


### Success metrics

| **Stake-holder** | **Metric we can calculate** | **Why it works** |
| --- | --- | --- |
| Riders | **% Time Full** (station effectively full) | Directly measures “can’t dock” pain |
| Divvy Ops | **Net Accumulation per Dock** = (Ends − Starts) ⁄ Dock Count | Positive number ⇒ trucks must clear bikes |


### Format for our answer

1. **Dock-Pressure Index (DPI)** – a single score
    
    ```
    DPI = (Ends − Starts) / Dock_Count  ×  %Time_Full
    ```
    
2. Either
    - the station with the highest DPI, or
    - a threshold list of stations whose DPI exceeds that cutoff.

Higher DPI → stronger business case for more racks.


## Data Findings

### Results

- **Initial reaction:** Two stations (West Loop and Chinatown) show the top DPI by a ~50% margin
- **Interesting findings**
    - West- & South-side docks rank highest; likely due to fewer re-balancing visits (this is against my initial hunch)
    - Event-centric docks (Lakefront path, Southport shopping, Wrigley Field) show the **highest overflow (**Divvy is popular for one-off trips to events).
    - Two Wells St stations by a strip of bars show **lowest overflow (**people ride home drunk but start elsewhere)
    - 56% of stations were never full in the two weeks before 6/3/25.
    - A handful sit > 90% full but have near-zero overflow – high churn but balanced flows.
    - System median overflow is just 0.07, so overall placement is solid of stations by Divvy.

### Synthesis

The handful of high-DPI docks represent structural pain points inside an otherwise balanced network (median overflow is .07 and most stations are never full). They create both rider dissatisfaction and avoidable van trips – prime targets for extra racks.


### Recommendation – what Divvy should do now

| **Priority** | **Action** | **Impact** |
| --- | --- | --- |
| High | Install 1-2 racks at the top-DPI station(s). | Immediate customer relief + reduced van miles. |
| Medium | Re-route balancing vans toward high-DPI quadrants, away from low-utilization docks. | Cuts fuel and labor costs. |
| Low | Monitor post-install DPI to validate improvement; iterate threshold. | Confirms ROI. |


### Looking ahead – where Divvy should focus next

1. **Peak-weighted % Time Full** – weight the metric by demand hours to filter out overnight false positives.
2. **Capture “failed dock” attempts** in the app to move from proxy pain to actual pain.
3. **Revenue lens** – model upside from longer ride minutes or membership retention, not just cost savings.
4. **E-bike stray distance** – another proxy for docking friction, especially where charging docks are scarce. ([planetizen.com](https://www.planetizen.com/news/2024/05/128815-e-bikes-contributing-bike-share-growth?utm_source=chatgpt.com))



### Main Critique (MOO) of the current approach

1. **% Time Full isn’t demand-weighted.** A dock that’s full at 3 a.m. shouldn’t count the same as 5 p.m. rush.
2. **We only see successful docks.** Attempted/diverted docks are invisible, so pain is understated.
3. **Focuses on cost avoidance, not revenue growth.** Divvy may already be tracking re-balancing costs; the model should also test revenue-positive scenarios.


### What I’d change next time

- Build a peak-hour weighting for % Time Full.
- Instrument the app to log failed dock attempts for ground-truth pain.
- Attach dollar values (lost rides, truck cost per mile) to each DPI point for a clearer go / no-go threshold.
- Get more creative in how to determine the benefit metrics for reducing user pain and increasing Divvy profits.