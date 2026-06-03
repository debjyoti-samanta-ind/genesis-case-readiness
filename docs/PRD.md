# Product Requirements Document
## Genesis Case Readiness Orchestration Agent

**Version:** 1.1  
**Date:** 3 Jun 2026  
**Status:** Demo prototype — Phases 1–5 complete  
**Audience:** Genesis board · Russ Mann · VP Supply Chain · Design partners · Future PM

**Changelog v1.1:** Success metrics table updated — Escalations Raised replaces Gaps Auto-Resolved as the 3rd Outcomes metric card (constraint compliance: delay minutes and savings figures remain excluded). Demo scenario updated to note app opens on Outcomes view in VP Supply Chain role.

---

## 1. Product Vision

An AI agent that watches every scheduled surgical case from 72 hours out and coordinates supply readiness across preference cards, inventory, loan kits, and vendor reps — so that the right supplies are confirmed in the room before the surgeon walks in.

> *"If the right implant isn't in the room when the surgeon needs it, the whole list falls apart."*  
> — Perioperative Leader, Genesis site visit

---

## 2. Problem Statement

### Current state
- Charge nurses spend 2–4 FTE hours per day manually checking inventory, calling vendor reps, and cross-referencing preference cards against spreadsheets
- Supply gaps are typically discovered at 7:45am — 15 minutes before the first case begins
- 50–70% of supply-related delays are preventable if identified 24–72 hours in advance

### Cost of inaction
- 2–4 FTE hrs/day at ~$85/hr loaded = **$170–340K/yr per hospital in avoidable labour**
- Each delayed OR start ripples into subsequent cases on the same list
- No current mechanism to quantify how many delays are supply-driven vs other causes — making improvement invisible

### Root cause
The data to predict and prevent supply gaps already exists in Genesis Core, Epic, and vendor systems. It is not connected, not monitored continuously, and not acted on early enough.

---

## 3. Target Users

### Persona 1 — Perioperative Leader / OR Manager

| Attribute | Detail |
|-----------|--------|
| Primary view | Today's OR |
| Opens app | 6:00am before rounds; noon for T-4h check |
| Core question | "What do I need to fix before 7:30am?" |
| Success | Every case starts on time with the right supplies confirmed |
| Current pain | On the phone chasing vendor reps; charge nurses on spreadsheets the day before |
| Trust trigger | Seeing the agent's reasoning one level below the surface — transparency earns trust |

### Persona 2 — VP Supply Chain / VP Surgical Services

| Attribute | Detail |
|-----------|--------|
| Primary view | Outcomes |
| Opens app | Monday weekly review; before board meetings; in QBRs with Genesis |
| Core question | "Is this agent paying for itself?" |
| Success | Measurable reduction in delays, cancellations, and supply waste |
| Current pain | Cannot currently quantify how many delays were supply-driven vs other factors |
| Trust trigger | One clear outcome number — operational metrics they can audit and own |

---

## 4. Business Requirements

### Pricing model
- **Outcome-based pricing:** per-case or per delay-minute-avoided
- Target ACV: **$40–80K/yr per hospital**
- Rationale: status quo cost ($170–340K/yr avoidable labour) supports this ACV comfortably

### Market sizing
| Segment | Definition | Size |
|---------|-----------|------|
| TAM | US acute care hospitals with active orthopaedic programs, 300–800 beds | ~1,400 sites |
| SAM | Genesis customers with active Epic feeds | ~200 sites today |
| ICP | 300–800 bed hospital · single-site or small system · Genesis + Epic integration active · orthopaedic focus (knee/hip) | Validate in survey |

### Design partner requirement
A validated delay baseline is required before surfacing dollar savings figures to buyers. This requires one design partner (orthopaedic-heavy Genesis customer) in **Week 3** to run structured discovery interviews and capture delay frequency and duration data.

**Path to design partner:** Shane and Charles (Genesis) — introduction required before end of this week.

---

## 5. Features

### 5.1 72-hour advance readiness check (T-72h)
The agent pulls the OR schedule, matches it against each surgeon's preference card, checks inventory levels in real time, and generates a gap list 72 hours before each case. Loan kit requests are emailed to vendor reps automatically. PPI gaps are escalated to the SC Director immediately — auto-reorder is blocked for PPI items by clinical governance.

### 5.2 Continuous monitoring (T-48h → T-24h → T-4h)
At each checkpoint the agent re-scores all cases, checks whether T-72h gaps have been resolved, detects preference card changes, and escalates any outstanding items with increasing urgency. At T-4h the agent is information-delivery only — no autonomous actions.

### 5.3 PPI escalation (always human — no auto-substitute)
Physician Preference Items require SC Director approval for any procurement action. The agent flags PPI items as at-risk and surfaces them with full context (deficit, vendor rep status, recommended next action). It does not recommend substitutes — no substitute data exists in Genesis item master today.

### 5.4 Vendor rep coordination (MVP: email + elapsed time)
The agent sends loan kit request emails to vendor reps at T-72h and re-escalates to the charge nurse if no structured response is detected within 24 hours. In the MVP, detection is elapsed-time only (no structured confirmation). Structured tracking via LKM mobile app is an H2 roadmap item.

### 5.5 Post-case variance reconciliation
At T+4h after case completion, the agent compares actual PoC scan data against the preference card line items and generates a variance report: items used but not on card (charge capture gaps), items on card but not used, and quantity deltas. Dollar recovery opportunity is surfaced for charge capture gaps.

### 5.6 Preference card drift surfacing
Where a surgeon's actual usage differs from their preference card across 3+ consecutive cases, the agent surfaces a recommendation to update the card. This is informational only — no auto-update action. SC Director review and surgeon confirmation are required.

---

## 6. Success Metrics

These are the metrics the product must demonstrate to the Genesis board. All are observable from agent run logs — no baseline validation required.

| Metric | Definition | Where shown |
|--------|-----------|-------------|
| Cases cleared | Cases that reached T-0 with no unresolved gaps | Outcomes view |
| Auto-resolution rate | % of detected gaps resolved without human action | Outcomes view |
| Escalations raised | Human-required decisions surfaced by the agent (week total) | Outcomes view |
| Variance items flagged | Post-case items with quantity delta or missing scan | Outcomes view |

**Not shown until baseline is validated:**
- Delay minutes avoided (requires design partner delay frequency data)
- Dollar savings (requires validated cost-per-minute methodology from design partner)

> Rationale: A number the VP Supply Chain calculates themselves using their own cost assumptions carries more credibility than one we provide. The Outcomes view shows raw operational facts; the buyer applies their own cost figures.

---

## 7. Hard Constraints

These are non-negotiable. If any feature conflicts with a constraint, the feature is removed.

| # | Constraint | Reason |
|---|-----------|--------|
| 1 | **Genesis-only data.** No Kermit data. No Meperia data. | Demo shown to Genesis board — any external data reference invalidates the demo |
| 2 | **No substitute / functional equivalence recommendations.** | No native substitute field in Genesis item master (CR-957, CR-649, CR-149 undelivered) |
| 3 | **No PPI auto-reorder or surgeon approval chain.** | Clinical governance — PPI actions always require SC Director approval |
| 4 | **No sterilisation cycle data.** | No sterile tray module in Genesis Core — roadmap only |
| 5 | **No dollar metrics in the Outcomes view.** | No validated baseline methodology — premature figures will be challenged by VP or CFO |
| 6 | **PPS Agent (Procedure Product Standardization) is off-limits.** | IP conflict with AHRMM 2026 build (Artium/Genesis) |
| 7 | **No same-day OR schedule additions.** | Complex edge case — descoped for this build |

---

## 8. MVP Scope vs Roadmap

| Feature | MVP (Prototype — Now) | H2 Roadmap |
|---------|----------------------|-----------|
| Vendor rep confirmation | Email sent + elapsed time counter · labelled "MVP PROXY" in UI | LKM mobile app accept/decline |
| Loan kit physical receipt | PO Outstanding Orders status · labelled "MVP PROXY" in UI | LKM app tray declaration |
| Vendor rep response detection | None — charge nurse manual follow-up | LKM structured tracking |
| Substitute recommendations | Not available | IMCaaS V2 (no delivery date) |
| Same-day schedule additions | Not built | Acknowledged future scope |
| Structured surgeon approval chain | Not built (depends on substitute data) | Depends on IMCaaS V2 |

MVP proxy labels are displayed visibly in the UI — they are not hidden. This is intentional: the demo is honest about what is production-ready vs roadmap.

---

## 9. Data & Integration Dependencies

| Data source | Integration | MVP status |
|------------|------------|-----------|
| Genesis Core — OR schedule | Epic/Cloverleaf feed (SIU HL7v2) | Active at VRMC |
| Genesis Core — Preference cards | Epic/Cloverleaf feed | Active at VRMC |
| Genesis Inventory — Real-time stock levels | Genesis Inventory module | Active at VRMC |
| Genesis PoC Scan Data — UDI scans | Genesis PoC module | Active at VRMC (last 30 days) |
| Vendor directory — Rep contacts | Genesis vendor master | Active at VRMC |
| Patient census / cancellations | Redox (Epic SIU+ADT HL7v2) | Active at VRMC |

**Hard dependency:** Active Epic feed is a filter for design partner eligibility. Sites without Epic/Cloverleaf integration cannot use this product in its current form.

---

## 10. Demo Scenario

**Hospital:** Valley Regional Medical Center, Charlotte NC  
**Date:** Thursday 29 May 2026  
**Cases:** 3 orthopaedic cases (TKA ×2 AT RISK · Hip Arthroplasty WATCH · TKA ×1 CLEAR)  
**Agent persona:** Last run 02:00am · 3 cases monitored · 3 auto-handled · 2 pending human decisions

**Opening state:** App launches directly on Outcomes view in VP Supply Chain role — no navigation required to reach the board-facing view.

**Demo flow (15 minutes):**
1. Outcomes view — VP Supply Chain perspective: weekly metrics, auto-resolution rate, surgeon variance
2. Today's OR — Perioperative Leader perspective: AT RISK case, PPI escalation, mark as actioned
3. Agent Log — transparency layer: full timestamped reasoning run
4. Post-Case Report — completed Tuesday case: variance table, charge capture gap, preference card recommendation

**The ask:** Design partner introduction from Shane and Charles before end of this week, so Week 3 customer discovery interviews start on schedule.
