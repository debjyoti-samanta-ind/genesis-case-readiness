# UX & Workflow Specification
## Genesis Case Readiness Orchestration · Prototype

Sources: Shane's UX principles (Genesis internal call) · Genesis hospital site visit feedback (Plymouth, Bath, Salisbury, Royal Free) · Kermit savings dashboard revamp research · Genesis Digital Design Language

---

## CORE UX PRINCIPLE: PROGRESSIVE DISCLOSURE

Every screen in this prototype follows a single rule: **show the minimum information needed to make a decision, with full detail one click away.**

This comes directly from Genesis's own research:
- Plymouth, Bath, Salisbury hospital visits: *"Too much info and too busy. A task-driven dashboard per persona with a cleaner UI is needed."*
- Kermit dashboard revamp (4/4 internal users): *"Dashboard is too busy for clients — nobody presents the default view directly."*
- Shane (Genesis internal): *"Too much information displayed simultaneously. Consider user needs: do they need all information immediately?"*

**The three levels of information density:**

| Level | View | Time to consume | Data shown |
|-------|------|----------------|------------|
| 1 — Briefing | Dashboard landing | 30 seconds | What happened + how many decisions pending |
| 2 — Decision | Today's OR / Outcomes | 2 minutes | What needs my action + why |
| 3 — Evidence | Case detail + Agent Log | 5 minutes | Full reasoning, all data fields |

Never mix levels on the same screen. The landing is always Level 1. Drilling in always goes to Level 2, then Level 3.

---

## DUAL PERSONA DESIGN

This prototype serves two distinct users who have different information needs, different time horizons, and different definitions of "a good day."

### Persona 1 — Perioperative Leader / OR Manager
**Today's OR view is built for this person.**

| Attribute | Detail |
|-----------|--------|
| Job | Runs day-to-day OR operations. Owns case readiness. |
| Time horizon | Today. The next 72 hours. |
| Opens app | 6:00am before rounds. Again at noon for T-4h check. |
| Success metric | Every case that starts on time with the right supplies in the room. |
| Pain | Currently on the phone chasing vendor reps and checking inventory manually. Charge nurses using spreadsheets the day before cases. |
| Question when opening app | "What do I need to fix before 7:30am?" |
| Trust threshold | Moderate. Will not trust an auto-resolved action unless they can see the agent's reasoning one click away. |

**UX design decisions for this persona:**
- Landing view shows escalations first, not all cases. Filter the noise.
- Auto-resolved actions are visible but collapsed by default — they do not need attention.
- Every escalation card has one clear recommended action and one CTA button.
- The checkpoint timeline is always visible in the case detail — never hidden behind a tab.
- MVP proxy labels (PO Outstanding Orders, email elapsed time) are shown honestly. This persona respects transparency over polish.

### Persona 2 — VP Supply Chain / VP Surgical Services
**Outcomes view is built for this person.**

| Attribute | Detail |
|-----------|--------|
| Job | Owns the P&L for surgical supply chain. Justifies the technology investment. |
| Time horizon | This week. This quarter. Year over year. |
| Opens app | Monday morning weekly review. Before a board meeting. In a QBR with Genesis. |
| Success metric | Fewer delays. Lower supply costs. Measurable labour reduction. |
| Pain | Cannot currently quantify how many delays were caused by supply issues vs other factors. No baseline to measure improvement against. |
| Question when opening app | "Is this agent paying for itself?" |
| Trust threshold | Low patience for complexity. Needs one number that tells the story. |

**UX design decisions for this persona:**
- Lead with outcome metrics, not operational detail.
- The most important number (delay minutes avoided, or estimated cost savings) must be the biggest element on screen.
- Surgeon variance table is collapsed by default — visible on scroll, not above the fold.
- The pricing anchor ("estimated labour savings: $X/week") is always visible at the bottom of Outcomes. This is the renewal justification.
- No jargon: "T-72h check" becomes "72-hour advance check" in the Outcomes view copy.

---

## DAILY HABIT LOOP — PERIOPERATIVE LEADER

This is the interaction pattern the prototype must enable. Build every interaction to serve this loop.

```
6:00am  → Open app → Dashboard landing
           "Agent ran at 02:00am · 3 cases today · 2 decisions pending"
           
6:01am  → Click "Today's OR"
           Case list: TKA ×2 AT RISK · Hip Arthroplasty WATCH · TKA ×1 CLEAR
           
6:02am  → Click "Total Knee Arthroplasty ×2" (AT RISK case)
           Checkpoint timeline opens
           T-72h: 1 gap still open (Tibial Component XR-7 — PPI)
           T-48h: Vendor rep email sent 26h ago — no response detected
           
6:03am  → Read escalation: "PPI item at deficit. Loan kit requested via email.
           Rep Sarah Mitchell — no response in 26h. 
           Recommended action: Call rep directly."
           Click "Mark as actioned" after calling rep
           
6:04am  → Case 2: Hip Arthroplasty WATCH
           T-72h: Bone Cement BoneFix-2 auto-reordered ✓
           T-48h: All items confirmed ✓
           No action required — dismiss
           
6:05am  → Close app. Return at noon for T-4h check.
```

**This is the 5-minute daily routine that earns adoption.** Every UX decision must protect this loop. If any step takes longer than 60 seconds, simplify it.

---

## SCREEN MAP

```
App
├── Sidebar (always visible)
│   ├── Genesis logo + "Case Readiness"
│   ├── Dashboard (nav)
│   ├── Today's OR (nav)
│   ├── Outcomes (nav)
│   ├── Agent Log (nav)
│   ├── Last agent run (status)
│   └── User (name + role)
│
├── Dashboard (landing)
│   ├── Header (greeting + agent status pill)
│   ├── Summary cards row (Cases Today · Agent Actions · OR Readiness)
│   └── Escalation queue (table)
│
├── Today's OR
│   ├── Left panel: Case list (one card per case)
│   │   ├── Case card (procedure · surgeon · time · readiness bar · status badge)
│   │   └── Click → loads right panel
│   └── Right panel: Case detail
│       ├── Checkpoint timeline (T-72h → T-48h → T-24h → T-4h → Post-case)
│       │   ├── Auto-resolved actions (collapsed, ticked)
│       │   └── Open gaps (expanded, with action button)
│       └── Supply item detail (selected gap)
│           ├── Item name · SKU · category (PPI or standard)
│           ├── Stock on hand vs required · deficit
│           ├── Vendor rep status (email sent [time] · [N]h since sent)
│           ├── PO Outstanding Orders status [MVP PROXY badge]
│           ├── Preference card version + last updated
│           └── Historical usage drift (last 15 cases sparkline)
│
├── Outcomes
│   ├── Summary stat row (4 large number cards)
│   ├── Weekly trend charts (cases cleared / auto-resolution rate)
│   ├── Surgeon variance table
│   └── Pricing anchor banner
│
├── Agent Log
│   └── Terminal view (dark background, timestamped entries)
│
└── Post-Case Report (accessed from Today's OR — completed case)
    ├── Header (case info + report generated time)
    ├── Variance table
    ├── Summary cards (matched / variances / charge gaps)
    └── Preference card update recommendation
```

---

## INTERACTION PATTERNS

### Pattern 1 — Escalation card
Every escalation in the queue follows this structure:

```
┌─────────────────────────────────────────────────────┐
│ [MODULE BADGE]  Item Name — Short summary           │
│ Context line: case name · surgeon · gap description │
│                                          [RISK BADGE]│
│                               [PRIMARY ACTION CTA →]│
└─────────────────────────────────────────────────────┘
```

- One CTA per card. Primary action only.
- Risk badge: HIGH / MEDIUM / LOW
- Click anywhere on card → expands to show agent reasoning

### Pattern 2 — Checkpoint timeline node
```
  ● T-72h  [COMPLETED]
  │  ✓ Inventory check — 11 items confirmed
  │  ✓ Loan kit request sent — DePuy Synthes (Sarah Mitchell)
  │  ⚠ Tibial Component XR-7 — PPI deficit — ESCALATED
  │
  ● T-48h  [ACTIVE]
  │  ✓ Card change check — no changes detected
  │  ⚠ Vendor rep no response — 26h since email
  │    → Recommended: call rep directly
  │    [Mark actioned]
  │
  ◯ T-24h  [PENDING]
  ◯ T-4h   [PENDING]
  ◯ Post-case [PENDING]
```

- Completed nodes: filled teal circle
- Active nodes: filled amber circle
- Pending nodes: empty grey circle
- Auto-resolved items: ticked, collapsed
- Open gaps: expanded, with recommended action text
- Human decisions: bold text + action button

### Pattern 3 — Outcomes metric card
```
┌──────────────────────┐
│ 94%                  │
│ Auto-Resolution Rate │
│ ↑ 6pts vs last week  │
└──────────────────────┘
```
- Large number (text-4xl bold) in Genesis green or teal
- Metric name in small caps below
- Delta vs prior period in small text
- Click → expands to show weekly breakdown

---

## WHAT NOT TO BUILD — UX ANTI-PATTERNS

Based on Genesis internal feedback, these patterns actively harm adoption:

| Anti-pattern | Why it fails | What to do instead |
|-------------|-------------|-------------------|
| All 14 preference card line items visible by default | Information overload — user stops reading | Show gap items only; full card behind "View all items" link |
| Historical usage data visible on default case view | Not relevant at T-72h check unless there's drift | Show only if drift detected; collapsed otherwise |
| Every agent action logged in the main view | Creates noise that hides real escalations | Auto-resolved actions collapsed by default |
| Status percentages without context | "87% readiness" means nothing without knowing what the 13% is | Always show the reason alongside the score |
| Same view for all users | Hospital site feedback: users want role-locked content | Today's OR for Perioperative Leader; Outcomes for VP Supply Chain |
| More than 7 distinct data points above the fold | Shane's principle: too much simultaneously | Enforce 3-card summary row maximum above the fold |
| Jargon like "T-72h" without explanation | VP Supply Chain doesn't speak checkpoint language | Use "72-hour advance check" in Outcomes; "T-72h" fine in Today's OR |

---

## DEMO DAY UX CONSIDERATIONS

The prototype will be demoed live to Russ Mann + Genesis board. Design for demo conditions, not just daily use.

- **Start with Outcomes view** — show the VP Supply Chain the business case first (cost impact, delays avoided). This is the board's language.
- **Then switch to Today's OR** — drill into the at-risk case to show the agent reasoning. This is the Perioperative Leader's language.
- **End with Agent Log** — show the terminal for one case. This demonstrates transparency and AI reasoning depth to a technical audience.
- **Always have a case at AT RISK status** — never demo with all cases CLEAR. A problem being solved is more compelling than no problem.
- **The PPI escalation must be visible** — this is the highest-stakes scenario (surgeon preference item short, auto-reorder blocked, requires SC Director decision). Demo audiences respond to this because they understand the clinical stakes.
