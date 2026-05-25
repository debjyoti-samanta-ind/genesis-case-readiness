# ICP Definition & Demo Script
## Genesis Case Readiness Orchestration Agent

Source: CaseReadiness_ICP_Slide_v1_Pre-Survey.pptx · Genesis call 19 May 2026 · Diversis AI Brief

---

## IDEAL CUSTOMER PROFILE

| Dimension | Definition | Why it matters | Status |
|-----------|-----------|----------------|--------|
| **Industry / Vertical** | Acute care hospitals · Active surgical programs · Orthopaedic focus (knee/hip) · US-based Genesis customer | Domain specificity = data moat. Orthopaedic: high item variability, best instrumented proof case. | CONFIRMED |
| **Company Size** | 300–800 bed hospitals · Single-site or small system (2–3 sites) · Active Genesis + Epic integration | Epic feed is a hard filter. Too small = no Genesis. Too large = long sales cycle. | CONFIRMED |
| **Buyer Persona** | Champion: Perioperative Leader / OR Manager · Economic buyer: VP Surgical Services or CNO | Champion owns daily pain. CNO or VP Surgical signs budget. Both must be won. | CONFIRMED |
| **Pain Intensity** | 4/5 — Painkiller · 50–70% of supply delays are preventable · Charge nurses on phones + spreadsheets daily | Score 4+ clears board threshold. Delay minutes + cancel rate are directly auditable. | VALIDATE IN SURVEY |
| **WTP Anchor** | Status quo: 2–4 FTE hrs/day @ ~$85/hr loaded = $170–340K/yr labor + delay cost · Pricing model: per-case outcome | $170K+/yr wasted labor + delays supports a $40–80K/yr ACV. Survey will surface raw numbers. | VALIDATE IN SURVEY |
| **Data Access** | Genesis Core · Epic/OpTime OR schedule feed · Preference cards in Genesis · PoC scan data (99%) · Vendor contacts | Hard dependency — no Epic feed, no agent. Validates design partner eligibility pre-build. | CONFIRMED (Epic feed TBD/site) |

**Champion quote:** *"If the right implant isn't in the room when the surgeon needs it, the whole list falls apart."*  
Source: Genesis call 19 May 2026 · FigJam Perioperative Leader persona

---

## DUAL PERSONA — WHO USES WHICH VIEW

### Primary Champion — Perioperative Leader / OR Manager

| Attribute | Detail |
|-----------|--------|
| View | Today's OR |
| Opens app | 6:00am before rounds; noon for T-4h check |
| Question | "What do I need to fix before 7:30am?" |
| Success | Every case starts on time with the right supplies in the room |
| Current pain | On the phone chasing vendor reps, checking spreadsheets the day before |
| Trust trigger | Seeing the agent's reasoning one level below the surface. Transparency earns trust. |

### Economic Buyer — VP Surgical Services / CNO

| Attribute | Detail |
|-----------|--------|
| View | Outcomes |
| Opens app | Monday weekly review; before board meetings; in QBR with Genesis |
| Question | "Is this agent paying for itself?" |
| Success | Measurable reduction in delays, cancellations, and supply waste |
| Current pain | No way to quantify how many delays were supply-driven vs other causes |
| Trust trigger | One clear number: delay minutes avoided × OR minute cost. This is the renewal justification. |

---

## DEMO DAY SCRIPT — 15 MINUTES

**Audience:** Russ Mann + Genesis board  
**Setting:** Live prototype walkthrough — laptop screen share  
**Goal:** Demonstrate the full agent loop from T-72h to post-case for one orthopaedic case, show the business case in numbers, and leave Russ with a fundable ask

---

### Opening (1 min) — Set the scene

> "Valley Regional Medical Center. Thursday morning. 08:00 — first Total Knee Arthroplasty on the list. The surgeon needs six tibial components. The OR has four. Yesterday, this would have been discovered at 7:45am by a charge nurse making phone calls. Today, the agent found it at 2am."

Open the app. The Outcomes view loads first.

---

### Act 1 — The business case (3 min) — VP Supply Chain view

**Screen: Outcomes**

Point to the four metric cards:
- "79% of this week's cases reached the OR with zero unresolved gaps."
- "73% of detected gaps were resolved automatically overnight — no human involved."
- "15 gaps auto-resolved this week. 6 escalated to the Perioperative Leader."
- "8 post-case variance items flagged — items used that weren't on the preference card, or on the card but not used."

Point to the surgeon variance table:
- "Dr. Chen has 2.1 average variance items per case. His preference card says 42mm tibial component. He's actually using 44mm in 8 of his last 12 cases. The agent surfaces this — the SC Director can now have an informed conversation with Dr. Chen about updating the card."

Point to the conversation starter banner:
- "We're not showing estimated savings numbers. We don't have a validated baseline yet — that comes from the design partner in Week 3. What we're showing is what the agent observably did: cases cleared, gaps resolved, variances caught. The VP applies their own cost figures. A number they calculate themselves is worth more than one we give them."

---

### Act 2 — The daily workflow (5 min) — Perioperative Leader view

**Switch to: Today's OR**

The case list loads. Three cases. One AT RISK.

> "This is what the Perioperative Leader sees at 6am. Three cases today. One at risk. Two confirmed. The agent has already handled three things overnight — they don't need to see those. They need to see what requires their decision."

Click on "Total Knee Arthroplasty ×2 — AT RISK"

The checkpoint timeline opens.

**T-72h node:**
> "72 hours ago, the agent pulled the OR schedule, matched it against Dr. Chen's preference card, checked inventory in real time. 11 items confirmed. Two problems found. Tibial Component XR-7 — PPI item, 2 units short. BoneFix-2 bone cement — standard item, 1 unit short."

Point to auto-resolve:
> "The bone cement was auto-reordered at 2am. $180. Below the $500 governance threshold. No human involved. Done."

Point to PPI escalation:
> "The tibial component is a Physician Preference Item. Dr. Chen's specific choice. The agent cannot substitute it — there's no substitute data in Genesis today, and clinical governance requires surgeon sign-off on any PPI change. So the agent did the only right thing: it emailed the vendor rep and escalated to the SC Director."

**T-48h node:**
> "48 hours out. The rep hasn't responded. Not because the agent failed — because the email confirmation tracking requires the LKM mobile app, which is on the H2 roadmap. In the MVP, the agent measures elapsed time. 26 hours. The escalation tells the Perioperative Leader: 'Call Sarah Mitchell directly.' One tap, her number is right there."

Pause.
> "That's the honest version. We're not pretending the MVP does everything. We're showing exactly what it does, what it doesn't do yet, and what the roadmap looks like."

**Demonstrate action:**
Click "Mark as actioned" on the vendor rep escalation.
> "The charge nurse calls the rep, confirms the tray is coming, marks it actioned. The case status updates to WATCH. One decision made. Two minutes."

---

### Act 3 — The agent's reasoning (3 min) — Agent Log

**Switch to: Agent Log**

The terminal loads. Timestamped entries scroll.

> "This is what the agent did at 2am. Every data source it connected to. Every gap it found. Every decision it made — and why. This is the transparency layer. A surgeon, a CFO, an auditor — anyone can read exactly what the agent did and why it didn't auto-resolve the PPI item."

Point to the amber DECISION line:
> "PPI flag detected. Auto-reorder blocked per clinical governance. That's not a bug — that's the agent doing the right thing. It knows the difference between a $180 consumable it can handle and a $8,800 surgeon preference implant it cannot."

---

### Act 4 — The post-case close (2 min) — Post-Case Report

**Switch to: Post-Case Report (completed case from Tue 26 May)**

> "After every case, at T+4h once PoC scans have propagated, the agent generates this. Actual usage versus preference card. Three variances found. One charge capture gap — Monocryl suture, used but not billed, $186 recovery opportunity."

Point to preference card recommendation:
> "Dr. Chen has used the 44mm tibial in 9 of his last 12 cases. His card says 42mm. The agent recommends updating the card. Not automatically — it surfaces the recommendation for SC Director review. The surgeon confirms it next time he's in. The preference card gets updated. The next time the agent runs a T-72h check for Dr. Chen, there's no tibial gap."

> "That's the flywheel. Each case makes the next case better."

---

### Close — The ask (1 min)

> "What you've seen today is a working prototype built entirely on Genesis Core data. No Kermit integration. No Meperia integration. No Epic feed beyond what VRMC already has active.

> The business case: $40–80K/yr ACV per hospital, priced per delay minute avoided. The TAM: 1,400+ US acute care hospitals running orthopaedic programs at 300–800 beds. The SAM: Genesis customers with active Epic feeds — roughly 200 sites today.

> Week 3 is customer discovery. We need one orthopaedic-heavy Genesis customer to validate the delay baseline. Shane and Charles are the path to that introduction.

> The ask: confirm the design partner introduction before end of this week so Week 3 interviews start on schedule."

---

## PRESSURE TEST — DEMO READINESS CHECKLIST

Run this the day before Demo Day. All boxes must be checked.

```
□ Outcomes view loads with correct weekly metrics (numbers match SYNTHETIC_DATASET.md)
□ Outcomes view shows NO dollar estimates, NO annualised savings, NO cost-per-minute figures
□ Outcomes conversation starter banner shows only factual operational metrics
□ Today's OR loads with 3 cases: 1 AT RISK, 1 WATCH, 1 CLEAR
□ Case 1 (TKA) checkpoint timeline shows T-72h COMPLETED, T-48h ACTIVE, T-24h/T-4h PENDING
□ PPI escalation is visible and correctly labelled — no substitute recommendation shown
□ BoneFix-2 auto-reorder shows as auto-resolved (NOT escalated)
□ Vendor rep elapsed time counter shows correctly (26h)
□ MVP PROXY badges visible on PO Outstanding Orders and vendor rep confirmation
□ Agent Log shows full timestamped run with amber DECISION lines
□ Post-Case Report shows variance table + charge capture gap + preference card recommendation
□ No Kermit or Meperia references anywhere in the app
□ No substitute recommendation UI anywhere in the app
□ Primary green #81D24C is visible on every screen
□ App loads at https://[username].github.io/genesis-case-readiness/ without errors
□ App works in Chrome and Safari
□ Demo can be completed in 15 minutes without scrolling past intended content
□ "Mark as actioned" button works and updates case status to WATCH
```
