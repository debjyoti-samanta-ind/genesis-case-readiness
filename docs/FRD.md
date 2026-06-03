# Functional Requirements Document
## Genesis Case Readiness Orchestration Agent

**Version:** 1.1  
**Date:** 3 Jun 2026  
**Status:** Demo prototype — Phases 1–5 complete  
**Audience:** Engineering team · QA · Future developers · Technical design partners

**Changelog v1.1:** Default view changed to Outcomes/vpsc for demo flow · COMPLETED status badge added · PPI escalation status indicator documented · 3rd Outcomes metric card corrected to Escalations Raised · bar chart updated to 3 series · sortable table now bidirectional · conversation starter banner content specified · button text colour confirmed as `#030303`

---

## 1. System Overview

### Architecture
- **Frontend:** React 19 + Vite 8 + Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Routing:** State-based navigation (`useState` in `App.jsx`) — no React Router
- **Data:** All mock data in `src/data/syntheticData.js` — no external API calls in prototype
- **Deployment:** GitHub Pages via `npm run deploy` (builds → pushes to `gh-pages` branch)
- **Live URL:** `https://debjyoti-samanta-ind.github.io/genesis-case-readiness/`

### Agent model (prototype)
The agent is represented as a completed overnight run. All agent actions, decisions, and log entries are pre-computed in `syntheticData.js`. There is no live agent executing in the prototype — the UI presents the output of a simulated 02:00am run as if it just happened.

### Role switcher
The sidebar contains a role toggle with two options:
- **Perioperative Leader** (`periop`) — shows: Dashboard, Today's OR, Agent Log
- **VP Supply Chain** (`vpsc`) — shows: Dashboard, Outcomes, Agent Log

Role-filtered nav items hide/show on toggle. Switching from `periop` to `vpsc` while on Today's OR or Post-Case Report redirects to Dashboard.

---

## 2. Navigation Structure

| State value | View | Persona | Access method |
|-------------|------|---------|---------------|
| `dashboard` | Dashboard | Both | Sidebar nav item |
| `todaysOR` | Today's OR | Perioperative Leader | Sidebar nav item (hidden for `vpsc`) |
| `outcomes` | Outcomes | VP Supply Chain | Sidebar nav item (hidden for `periop`) |
| `agentLog` | Agent Log | Both | Sidebar nav item |
| `postCase` | Post-Case Report | Perioperative Leader | Click "Recent · Completed" case in Today's OR left panel |

**Rules:**
- `postCase` is never shown as a sidebar nav item
- While on `postCase`, the sidebar highlights `todaysOR` as the active nav item (`activeNavId` logic in `App.jsx`)
- `navigate(view, caseId)` function in `App.jsx` handles all transitions; `selectedCaseId` is passed as a second argument where needed

**Default initial state:** `outcomes` view in `vpsc` role — the app opens directly on the Outcomes view in VP Supply Chain persona. This matches the demo flow sequence (board presentation starts with the business metrics view). The role switcher and nav remain fully functional to switch to any other view.

---

## 3. Design System Requirements

All screens must satisfy these requirements. Any screen failing these is a build defect.

### Colour tokens

| Token | Hex | Use |
|-------|-----|-----|
| Genesis Primary Green | `#81D24C` | **Required on every screen.** Primary CTA background, Yes indicators, auto-resolve accents |
| Genesis Blue | `#006FDD` | Links, secondary CTAs |
| Teal Dark | `#009999` | Auto-resolved items, CLEAR status, Agent Log timestamps |
| Teal Darkest | `#095256` | Active sidebar nav item, dark teal escalation buttons |
| Amber Base | `#F18F01` | AT RISK status, warnings, Agent Log DECISION lines, positive delta |
| Red Dark | `#CB4630` | HIGH risk, PPI flags, charge gaps |
| Grey Darker | `#2F2D2E` | Primary body text |
| Grey Base | `#909BA6` | Secondary / muted text |
| Sidebar background | `#1a1f2e` | Dark navy sidebar |
| Content area background | `#F5F3EF` | Warm off-white main area |
| Card background | `#FFFFFF` | All cards |
| Card border | `#E3E3E3` | All card borders |
| Agent Log background | `#0e1117` | Terminal view only |

### Typography
- Font family: `Plus Jakarta Sans` (weights 400, 500, 700)
- Page title: `text-3xl font-bold`
- Section header: `text-2xl font-bold`
- Card title: `text-xl font-medium`
- Body: `text-base font-normal` with `leading-relaxed`
- Label / badge: `text-xs font-semibold uppercase tracking-widest`
- Agent Log: `font-mono text-sm`

### Button rules
- **Primary CTA:** Background `#81D24C`, text `#030303` (not white — required for AAA contrast), `rounded-lg` — **maximum one per screen**
- **Inline action button (green):** e.g. "Mark as actioned" in CheckpointTimeline — uses same `#81D24C` background and `#030303` text. These are inline row-level actions, not screen-level CTAs; the one-per-screen rule applies to standalone header/footer CTAs only.
- **Secondary CTA:** Background `#006FDD`, text white, `rounded-lg`
- **Tertiary CTA:** Transparent background, border `#E3E3E3`, text `#2F2D2E`, `rounded-lg`
- **Dark teal escalation:** Background `#095256`, text white (used for "Review & approve" in escalation queue)

### Status badge colour mapping

| Status | Background | Text |
|--------|-----------|------|
| CLEAR | `bg-green-100` | `text-green-800` |
| WATCH | `bg-amber-100` | `text-amber-800` |
| AT RISK | `bg-red-100` | `text-red-700` |
| NO-GO | `bg-red-900` | `text-white` |
| AUTO-HANDLED | `bg-teal-100` | `text-teal-800` |
| ESCALATED | `bg-orange-100` | `text-orange-800` |
| PPI — ESCALATE | `bg-red-100` | `text-red-700` |
| MVP PROXY | `bg-gray-100` | `text-gray-500` |
| CONFIRMED | `bg-green-50` | `text-green-700` |
| PENDING | `bg-gray-100` | `text-gray-600` |
| COMPLETED | `bg-teal-50` | `text-teal-700` |

---

## 4. View Functional Specifications

### VIEW 1 — Dashboard

**Purpose:** 30-second status read. Answers: "What happened overnight and what needs my attention today?"

#### Header section
- Greeting: "Good morning, [Name]" + role label + hospital name + date
- Agent status pill (top right): "Agent ran at [time] · [N] cases monitored · [N] auto-handled"

#### Summary cards (3 cards in a row)
| Card | Content |
|------|---------|
| Cases Today | Total scheduled cases + breakdown: CLEAR count / AT RISK count / NO-GO count |
| Agent Actions | Auto-resolved overnight (count) + Pending human decisions (count) |
| OR Readiness | Highest-risk case name + active checkpoint label + primary gap description |

#### Escalation queue table
- Displays all human-required decisions across all cases
- Sort order: checkpoint urgency first (T-4h before T-48h), then risk level (HIGH before MEDIUM)
- Maximum 6 rows visible before scroll
- Columns: Case · Checkpoint · Item · Gap description · Risk badge · Action button (one per row)
- Action button: primary action only (e.g., "Call rep", "Approve reorder")

#### Data source
`scheduledCases`, `checkpointStates`, `detectedGaps`, `agentRun`, `currentUser` / `perioperativeLeader` from `syntheticData.js`

---

### VIEW 2 — Today's OR

**Purpose:** Task-driven case readiness. Opened at 6am; revisited at noon for T-4h check.

#### Left panel — Case list
- One `CaseCard` per entry in `scheduledCases`
- Card displays: procedure type · surgeon name(s) · scheduled time · OR room
- Readiness score bar (0–100): red if score < 40, amber if 40–74, green if 75–100
- Status badge: derived from `scheduledCases[n].status` with live override via `getLiveStatus()`
- Live status override: if all HIGH-risk escalations with `mvpNote` are marked actioned → status upgrades AT_RISK → WATCH
- Click → sets `selectedCaseId` state → loads right panel for that case
- **"Recent · Completed" section** at bottom of left panel:
  - Shows one hardcoded entry: Total Knee Arthroplasty · Dr. Michael Chen · Tue 26 May · OR-3
  - Status badge: `<StatusBadge status="COMPLETED" />` — renders teal-50 background with teal-700 text
  - Clicking calls `navigate('postCase')`

#### Right panel — Checkpoint timeline
Rendered by `CheckpointTimeline` component. Data from `checkpointStates[selectedCaseId]`.

**Checkpoint nodes (T-72h → T-48h → T-24h → T-4h → Post-case):**

| Node state | Visual | Behaviour |
|-----------|--------|-----------|
| COMPLETED | Filled teal circle | Auto-resolved items collapsed with tick; escalations shown if unresolved |
| ACTIVE | Filled amber circle | Fully expanded; open gaps visible; action buttons present |
| PENDING | Empty grey circle outline | Label only; no content |

**Auto-resolved items (inside each checkpoint):**
- Collapsed by default — click to expand (accordion)
- Each item shows: action label + detail string
- Icon: teal checkmark

**Escalation items (inside each checkpoint):**
- Shown expanded when checkpoint is ACTIVE
- Content: item name · reason · recommended action text · risk badge
- `mvpNote` field: if present, render an "MVP PROXY" badge with the note text
- Escalation items split into two types based on presence of `mvpNote` field:
  - **With `mvpNote`** (vendor-contactable escalations, e.g. ESC-002): renders supply detail block + loan kit / PO status + vendor contact, then "Mark as actioned" button (green `#81D24C`, text `#030303`). Once actioned: button replaced with "Actioned ✓" indicator in teal.
  - **Without `mvpNote`** (PPI escalations, e.g. ESC-001): no action button. Shows a red dot status indicator: "Pending SC Director review — auto-reorder blocked per clinical governance". This communicates active escalation without implying the Periop Leader can take action.
- If escalation `id === 'ESC-002'` is actioned: AT RISK case upgrades to WATCH in left panel

#### Data source
`scheduledCases`, `checkpointStates`, `detectedGaps`, `vendorReps`, `preferenceCards` from `syntheticData.js`

---

### VIEW 3 — Outcomes

**Purpose:** Weekly business case view. Answers: "Is this agent paying for itself?"

#### Summary stat row — 4 metric cards
| Card | Value | Delta source |
|------|-------|-------------|
| Cases Cleared | `weeklyOutcomes.summary.casesCleared` / `totalCasesScheduled` | `clearanceRate − 71` pp vs prior week |
| Auto-Resolution Rate | `weeklyOutcomes.summary.autoResolutionRate`% | `autoResolutionRate − autoResolutionRatePriorWeek` pp |
| Escalations Raised | `weeklyOutcomes.summary.escalationsRaised` | `escalationsRaisedPriorWeek − escalationsRaised` vs prior week |
| Variance Items Flagged | `weeklyOutcomes.summary.varianceItemsFlagged` | Static label: "across all surgeons this week" |

**MUST NOT show:** `estimatedLaborSavingsWeek`, `estimatedAnnualisedSavings`, `delayMinutesAvoided`, or any dollar figure in this view. These fields are absent from `syntheticData.js` by design — no validated baseline methodology exists yet.

#### Weekly breakdown bar chart (Recharts)
- **Bar chart — 3 series per day, 7-day range:**
  - Cleared (teal `#009999`, dataKey `casesCleared`)
  - At-Risk (red `#CB4630`, dataKey `atRisk`)
  - Auto-Resolved (Genesis Green `#81D24C`, dataKey `autoResolved`)
- Data source: `weeklyOutcomes.dailyBreakdown`
- Custom tooltip renders each series with its colour swatch

#### Surgeon variance table
- Columns: Surgeon · Procedure · Cases this week · Avg variance items · Top variance item
- "Avg variance items" column header is clickable (ArrowUpDown icon, blue `#006FDD`): toggles sort ascending ↔ descending; default is descending (highest variance first)
- Avg variance pill colour: red if ≥ 1.5, amber if ≥ 0.7, green if < 0.7
- Data source: `weeklyOutcomes.surgeonVariance`

#### Conversation starter banner (bottom)
- Background: `#EEFFFF` · Border: `#C5D6D8` · Icon: `Info` in teal `#009999`
- Label: "This week · confirmed operational metrics only" (teal, uppercase, tracking-widest)
- Primary text (exact): "[casesCleared] of [totalCasesScheduled] cases reached the OR with no unresolved gaps · [autoResolutionRate]% of detected gaps resolved autonomously · [varianceItemsFlagged] post-case variance items flagged across all surgeons"
- Sub-text (exact): "Estimated savings not shown — no validated cost baseline established with design partner yet. Apply your own OR minute cost to calculate value."
- No dollar estimates. No annualised savings. No cost-per-minute figures.

---

### VIEW 4 — Agent Log

**Purpose:** Transparency layer. Shows full agent reasoning for the overnight run.

#### Terminal header bar
- macOS-style three coloured circles (red, amber, green) — decorative
- Filename: `case-readiness-run-[date]-[time].log`
- Run status: `COMPLETED · 21 seconds`

#### Log entry rendering
Data source: `agentLogEntries` from `syntheticData.js`

| Entry type | Colour |
|-----------|--------|
| `INFO` | White / light grey `#C5D6D8` |
| `SUCCESS` | Teal `#009999` |
| `WARNING` | Amber `#F18F01` |
| `DECISION` | Amber `#F18F01` — bold |
| `CASE` | White bold (case header lines) |

- Sub-entries (lines starting with `→`) are indented and slightly dimmer
- Font: monospace (`font-mono text-sm`)
- Background: `#0e1117`
- Timestamps: teal `#009999`, format `[HH:MM:SS]`

---

### VIEW 5 — Post-Case Report

**Purpose:** Variance reconciliation after case completion. Accessed from Today's OR completed case entry.

#### Header
- Back link: "← Back to Today's OR" — calls `navigate('todaysOR')`
- Icon: `GitCompare` in green tint box
- Title: "Post-Case Report"
- Sub-line: `{procedure} · {surgeon} · {date} · {orRoom}`
- Meta: `Report generated at {reportGeneratedAt} (T+4h) · Preference card {preferenceCardVersion} · {totalLineItems} total line items`
- Variance pill badge (amber): "{variances} variances flagged"
- **Primary CTA:** "Export Report" button in Genesis Green `#81D24C` — UI affordance only (no actual file download in prototype)

#### Summary cards (3)
| Card | Metric | Colour |
|------|--------|--------|
| Items Matched | `matched` of `totalLineItems` | Teal `#009999` |
| Variances | `variances` | Amber `#F18F01` |
| Charge Capture Gap | `chargeGaps` + `$chargeCaptureSummary.estimatedRecoveryValue` recovery | Red `#CB4630` |

Note: the dollar recovery figure IS shown here — it is a confirmed PoC scan fact, not an estimate. This is distinct from the estimated savings prohibition in the Outcomes view.

#### Variance detail table
Columns: Item · On Card · Scanned · Qty Card · Qty Used · Delta · Category · Charge

| Column | Content | Notes |
|--------|---------|-------|
| Item | Description + SKU (sub-text) + note (italic sub-text) | `item.description`, `item.sku`, `item.note` |
| On Card | "Yes" (green `#81D24C`) / "No" (red `#CB4630`) | `item.onCard` |
| Scanned | "Yes" (green) / "No" (grey) | `item.scannedAtPoC` |
| Qty Card | Number | `item.qtyOnCard` |
| Qty Used | Number | `item.qtyUsed` |
| Delta | Number or string; positive = amber, negative = grey, string = red | `item.delta` |
| Category | Badge: PPI (red tint), STANDARD (grey), CONSUMABLE (blue tint) | `item.category` |
| Charge | "Yes" (teal) / "Gap" badge (red with icon) | `item.chargeCaptured` |

**Row styling:** Rows where `chargeCaptured === 'GAP'` receive a red-tinted background (`#FEF6F5`).

**Table footer:** "✓ {matched} of {totalLineItems} items matched — on card, scanned, and correct quantity"

#### Preference card update recommendation
Conditional: only rendered when `preferenceCardUpdateRecommendation.triggered === true`

- Background: teal lightest `#EEFFFF`, border teal light `#8BFFFF`
- Icon: `ClipboardList` in teal
- Badge: "Informational only — no auto-update action"
- Content: `reason` · `suggestedUpdate` (bold) · `actionRequired` (small, muted)
- **No action button** — this is read-only surfacing only

#### Data source
`samplePostCaseReport` from `syntheticData.js` (CASE-2026-0831, Tue 26 May 2026)

---

## 5. Agent Authority Boundary Rules

The agent's decision-making authority is strictly bounded. These rules must be visible in the UI — not hidden in documentation only.

### Autonomous actions (AUTO-RESOLVE)
The agent takes these without human input:

| Action | Condition |
|--------|-----------|
| Reorder routine consumable | Below par level · standard item · below $500/line threshold |
| Send loan kit request email to vendor rep | Consignment stock shortfall confirmed |
| Send vendor rep reminder email | >24h since initial request, no structured response detected |
| Generate go / at-risk / no-go signal per case | Informational — no action taken |
| Apply case-time prioritisation | Shared inventory shortage — earlier case time = higher priority |
| Generate post-case variance report | T+4h after case completion |

### Human confirmation required (CONFIRM & PROCEED)
The agent stages these and waits for a human decision:

| Action | Condition |
|--------|-----------|
| Auto-reorder above baseline volume | Census-driven spike above standard forecast |
| Case-time prioritisation tiebreaker | Director confirms or overrides the priority order |

### Always human — never autonomous

| Action | Reason |
|--------|--------|
| Cancel or delay a surgical case | High clinical impact — patient safety boundary |
| Any action on a PPI item | Clinical governance — always requires SC Director approval |

---

## 6. Data Architecture

### Source file
`src/data/syntheticData.js` — single source of truth for all prototype data.

### Named exports and their consumers

| Export | Type | Consumer views |
|--------|------|---------------|
| `hospitalContext` | Object | Dashboard, sidebar |
| `currentUser` | Object | Sidebar (vpsc role) |
| `perioperativeLeader` | Object | Sidebar (periop role) |
| `agentRun` | Object | Dashboard, sidebar footer |
| `scheduledCases` | Array | Dashboard, Today's OR |
| `preferenceCards` | Object (keyed by caseId) | Today's OR |
| `inventoryLevels` | Object (keyed by SKU) | Today's OR (via CheckpointTimeline) |
| `detectedGaps` | Array | Dashboard, Today's OR |
| `vendorReps` | Array | Today's OR (via CheckpointTimeline) |
| `checkpointStates` | Object (keyed by caseId) | Today's OR |
| `weeklyOutcomes` | Object | Outcomes |
| `samplePostCaseReport` | Object | Post-Case Report |
| `agentLogEntries` | Array | Agent Log |

### Field naming conventions
- `caseId`: string, format `CASE-YYYY-NNNN`
- `sku`: string, format `DESCRIPTOR-SUFFIX`
- `status`: string enum — `AT_RISK` | `WATCH` | `CLEAR` | `NO_GO` (underscore in data, hyphen in UI labels)
- `governance`: string enum — `ESCALATE` | `AUTO_RESOLVE`
- `chargeCaptured`: string enum — `YES` | `NO` | `GAP`
- `mvpProxy`: boolean — when true, UI must display "MVP PROXY" badge

---

## 7. MVP Proxy Register

These limitations are confirmed and must remain visibly labelled in the UI. Do not remove or downgrade the labels.

| Feature | MVP Proxy (shown in UI) | Future State |
|---------|------------------------|-------------|
| Vendor rep confirmation | Email sent timestamp + hours elapsed counter; no structured detection | LKM mobile app accept/decline (H2) |
| Loan kit physical receipt | PO Outstanding Orders status; not a physical arrival event | LKM app tray declaration (H2) |
| Vendor rep response detection | Not available — charge nurse manual follow-up required | LKM structured tracking (H2) |
| Substitute recommendations | Not available — no native field in Genesis item master | IMCaaS V2 (no delivery date) |

**UI label format:** Small `MVP PROXY` badge in grey (`bg-gray-100 text-gray-500`) adjacent to the affected field. Tooltip or footnote text explains the limitation.

---

## 8. Out of Scope — Do Not Build

| Feature | Why removed |
|---------|-------------|
| Substitute / functional equivalence recommendations | No native substitute field in Genesis item master (CR-957, CR-649, CR-149 undelivered) |
| Sterilisation cycle status | No sterile tray module in Genesis Core |
| PPI substitute notification to surgeon | Depends on substitute data — chain impossible without it |
| Surgeon approval chain | Depends on substitute data |
| Same-day OR schedule additions | Complex edge case — descoped for 6-week build |
| Structured vendor rep response tracking | LKM mobile app prototype — not in production |
| Physical loan kit arrival confirmation | Manual post-procedure process in Genesis |
| Dollar metrics in Outcomes view | No validated baseline methodology from design partner yet |
| PPS Agent (Procedure Product Standardization) | IP conflict with AHRMM 2026 build |

---

## 9. File Structure Reference

```
genesis-case-readiness/
├── docs/
│   ├── PRD.md                          ← Product Requirements Document
│   └── FRD.md                          ← This document
├── public/
│   └── favicon.svg
├── src/
│   ├── data/
│   │   └── syntheticData.js            ← All mock data — single source of truth
│   ├── components/
│   │   ├── Sidebar.jsx                 ← Dark navy sidebar with role switcher
│   │   ├── StatusBadge.jsx             ← Shared badge component
│   │   ├── CaseCard.jsx                ← Left panel case list card
│   │   ├── CheckpointTimeline.jsx      ← T-72h → Post-case timeline
│   │   └── [others]
│   ├── views/
│   │   ├── Dashboard.jsx               ← VIEW 1 — Landing summary
│   │   ├── TodaysOR.jsx                ← VIEW 2 — Perioperative Leader
│   │   ├── Outcomes.jsx                ← VIEW 3 — VP Supply Chain
│   │   ├── AgentLog.jsx                ← VIEW 4 — Terminal reasoning view
│   │   └── PostCaseReport.jsx          ← VIEW 5 — Variance report
│   ├── App.jsx                         ← Root: routing state + sidebar shell
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js                      ← base: /genesis-case-readiness/, -p3 cache suffix
└── tailwind.config.js
```

---

## 10. Build & Deployment

### Local development
```bash
npm install
npm run dev        # starts at localhost:5173/genesis-case-readiness/
```

### Production build
```bash
npm run build      # outputs to dist/
```

Build must complete without errors. The chunk size warning (>500KB) is expected and non-blocking — the app is a prototype, not a production bundle.

### Deploy to GitHub Pages
```bash
npm run deploy     # runs build then gh-pages -d dist
```

**Live URL:** `https://debjyoti-samanta-ind.github.io/genesis-case-readiness/`

### Vite config notes
- `base: '/genesis-case-readiness/'` — required for gh-pages sub-path routing
- `entryFileNames: 'assets/[name]-[hash]-p3.js'` — `-p3` suffix for cache-busting; do not remove

### Build validation checklist
```
□ npm run build completes without errors
□ All 5 views render without console errors
□ Genesis Primary Green #81D24C visible on every screen
□ No Kermit or Meperia references in any rendered UI
□ No substitute recommendation UI anywhere
□ No dollar figures in Outcomes view
□ MVP PROXY badges visible where required
□ One primary CTA max per screen
□ Status badges render correctly in Chrome and Safari
□ App works at 1280px, 1440px, and 1920px viewport widths
```
