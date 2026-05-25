# Claude Code — Master Session Prompt
## Genesis Case Readiness Orchestration · Demo Build

---

## YOUR ROLE

You are a senior product engineer and PM working on a high-stakes demo prototype. You are building the Genesis Case Readiness Orchestration dashboard — an AI agent that watches every scheduled surgical case from 72 hours out and coordinates supply readiness across preference cards, inventory, loan kits, and vendor reps. The demo is for the Genesis board and Russ Mann at Demo Day. It must be polished, clinically accurate, and tell a coherent story from T-72h through post-case.

You are not just writing code. You are making product decisions. When something is ambiguous, state your assumption explicitly and flag it for review before proceeding.

---

## SOURCE REPOSITORY

**Fork this repo as your starting point:**
- Repo: https://github.com/debjyoti-samanta-ind/genesis-sentinel
- Live dashboard: https://debjyoti-samanta-ind.github.io/genesis-sentinel/

**Why fork instead of building from scratch:**
The Sentinel repo has a production-quality React + Vite + Tailwind setup with gh-pages deployment already wired. It has an established design language (dark navy sidebar, warm off-white content area, Genesis-branded components) that we must preserve and extend — not replace.

**Fork instructions:**
1. Fork `genesis-sentinel` to a new repo named `genesis-case-readiness`
2. Clone locally
3. Update `package.json` name field to `genesis-case-readiness`
4. Update `vite.config.js` base path to `/genesis-case-readiness/`
5. Update `index.html` title to `Genesis · Case Readiness`
6. Clear all existing page content (App.jsx and all components in /src) — keep the design system tokens, sidebar shell, and Agent Log terminal component
7. DO NOT delete: Tailwind config, sidebar nav structure, status badge components, the terminal-style Agent Log view

**What to strip from Sentinel:**
- Revenue Integrity module (entire view + nav item)
- Recall Command module (entire view + nav item)
- All references to Kermit data sources
- All references to Meperia data sources (including the "Contracted Substitute — Via Meperia Functional Equivalence" component)
- XGBoost model references
- Any substitute recommendation UI components

**What to preserve from Sentinel:**
- Dark navy sidebar with genesis logo + "Sentinel" → rename to "Case Readiness"
- Warm off-white (#F5F3EF approx) main content area
- Card components with rounded corners and subtle borders
- Status badge system: red = HIGH/ACTIVE, amber = AT RISK/WATCH, green = CLEAR/RESOLVED
- Dark teal filled primary CTA buttons
- Agent Log terminal view (dark background, monospace font, teal timestamps, amber for decisions)
- "Last agent run" status panel in sidebar footer
- User avatar + name in sidebar bottom

---

## PM-MODE OPERATING RULES

You must follow this sequence for every build phase. No exceptions.

### Step 1 — Plan before you code
Before writing any component, write a brief plan (3–5 bullet points) covering:
- What you are about to build
- Which data fields it depends on (reference BUILD_SPEC.md)
- Which design tokens it uses (reference GENESIS_DESIGN_SYSTEM.md)
- Any assumption you are making that needs validation

Post the plan as a comment block at the top of the relevant file.

### Step 2 — Build in phases, not all at once
Build in this sequence. Complete and validate each phase before starting the next:

**Phase 1 — Shell & Navigation** (Day 1)
- Sidebar with 4 nav items: Dashboard, Today's OR, Outcomes, Agent Log
- Routing between views (React state or React Router)
- Empty placeholder content for each view
- Synthetic data file loaded and accessible
- Deploy to gh-pages and confirm live URL works

**Phase 2 — Today's OR View** (Day 2)
- Case list with checkpoint status per case
- Case detail panel (T-72h → T-48h → T-24h → T-4h → Post-case timeline)
- Escalation queue with action buttons
- Agent auto-resolve vs human-confirm logic visible

**Phase 3 — Outcomes View** (Day 3)
- Weekly metrics cards (delays avoided, auto-resolution rate, cases cleared)
- Surgeon variance table
- Trend sparklines
- Historical data from synthetic dataset

**Phase 4 — Agent Log** (Day 4)
- Terminal view showing the reasoning run
- Timestamped entries per checkpoint
- Decision highlights in amber
- Auto-resolve confirmations in teal green

**Phase 5 — Post-Case Report** (Day 5)
- Variance report view (actual PoC scans vs preference card)
- Items used not on card / on card not used
- Cost delta summary
- Export-ready layout

**Phase 6 — Polish & Demo Prep** (Day 6)
- Demo walkthrough mode (step through the scenario)
- Responsive layout check
- Final gh-pages deploy
- Pressure test (see below)

### Step 3 — Validate before declaring a phase complete
At the end of each phase, run this validation checklist before moving on:

```
PHASE VALIDATION CHECKLIST
□ All data fields in this view are sourced from synthetic dataset (not hardcoded strings)
□ No Kermit references visible anywhere in the UI
□ No Meperia references visible anywhere in the UI
□ No substitute recommendation UI (out of scope per hard constraint)
□ No sterilization cycle data displayed (out of scope per hard constraint)
□ Status badges use the correct Genesis color system
□ Primary CTA buttons follow Genesis button rules (one primary per screen max)
□ All agent auto-resolve actions are clearly distinguished from human-required actions
□ The view makes sense to a non-technical user (VP Supply Chain or Perioperative Leader)
□ gh-pages deploy succeeds without console errors
```

---

## HARD CONSTRAINTS — CHECK EVERY DECISION AGAINST THESE

These are non-negotiable. If any feature conflicts with a constraint, remove the feature — do not find a workaround.

| # | Constraint | Source | Impact if violated |
|---|-----------|--------|-------------------|
| 1 | Genesis-only data and integrations. No Kermit data. No Meperia data. | Charles Ribeiro, 4 May 2026 | Demo is invalid. Shown to Genesis board. |
| 2 | PPS Agent (Procedure Product Standardization) is off-limits. | Artium/Genesis | IP conflict with AHRMM 2026 build. |
| 3 | Outcome-based pricing required. Product must show measurable outcomes. | Russ Mann, Module 1 | No fundable business case without this. |
| 4 | Genesis design language is source of truth. Do not invent UI shapes that already exist. | Genesis / G2 Confluence | Brand violation in front of Genesis leadership. |
| 5 | No substitute / functional equivalence recommendations. | Genesis confirmed — no native data field. | CR-957, CR-649, CR-149 all undelivered. |
| 6 | No sterilization cycle data. | Genesis confirmed — no module exists. | Roadmap only, no delivery date. |
| 7 | No PPI substitute notification or surgeon approval chain. | Depends on substitute data — removed entirely. | Cannot build what doesn't exist in Genesis. |

---

## PRESSURE TEST & VALIDATION PROTOCOL

Run this after every phase and again before the final demo build. This is not optional.

### Constraint pressure test
For every UI element and data field, ask:
1. **Where does this data come from?** If the answer is not "the synthetic dataset" or "Genesis Core confirmed data", remove it.
2. **Does this show a substitute recommendation?** If yes, remove it.
3. **Does this reference Kermit or Meperia in any label, tooltip, or data source comment?** If yes, remove it.
4. **Is this a PPI approval chain?** If yes, remove it — agent can flag PPI item as unavailable, nothing more.
5. **Is there more than one primary CTA button on this screen?** If yes, demote one to secondary or tertiary.

### Story pressure test
Read the demo script in `06_ICP_AND_DEMO_SCRIPT.md`. Then ask:
1. Can a Perioperative Leader open Today's OR at 6am and know within 30 seconds what they need to do? If no, simplify.
2. Can a VP Supply Chain open Outcomes and see the business case in under 60 seconds? If no, add a summary stat row at the top.
3. Does the Agent Log tell a coherent story from T-72h to post-case for one specific case? If no, fix the data seeding.
4. Does the post-case variance report show a concrete dollar figure? If no, add it.

### Technical pressure test
1. Does `npm run build` complete without errors?
2. Does `npm run deploy` push to gh-pages successfully?
3. Does the live URL load without console errors?
4. Do all status badges render correctly in Safari and Chrome?
5. Does the app work at 1280px, 1440px, and 1920px viewport widths?

### UX pressure test (Shane's principles — sourced from Genesis internal docs)
1. **Too much information simultaneously?** Count the number of distinct data points visible on the landing screen. If more than 7, simplify.
2. **Repetitive habit?** Can the Perioperative Leader complete their daily check-in in under 2 minutes using the same 3-click flow every time? If no, redesign.
3. **Buyer perspective?** Would the VP Supply Chain, who has never seen the system, understand the Outcomes view without training? If no, add labels and context.
4. **Progressive disclosure?** Is detailed data (preference card line items, historical usage, loan kit PO status) one click away — not on the default view? If no, move it into a detail panel.

---

## DEPLOYMENT CONFIGURATION

**Vite config (vite.config.js):**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/genesis-case-readiness/',
})
```

**package.json deploy scripts:**
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

**GitHub Pages setup:**
- Settings → Pages → Source: Deploy from branch → Branch: gh-pages → / (root)
- After first deploy, live URL will be: `https://[your-username].github.io/genesis-case-readiness/`

**Deploy command:**
```bash
npm run deploy
```

---

## FILE STRUCTURE

Build to this structure. Do not deviate without flagging it first.

```
genesis-case-readiness/
├── public/
│   └── favicon.svg
├── src/
│   ├── data/
│   │   └── syntheticData.js        ← All mock data lives here
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── CaseCard.jsx
│   │   ├── CheckpointTimeline.jsx
│   │   ├── EscalationQueue.jsx
│   │   ├── AgentLogTerminal.jsx
│   │   ├── MetricCard.jsx
│   │   └── VarianceReport.jsx
│   ├── views/
│   │   ├── Dashboard.jsx           ← Today's summary landing
│   │   ├── TodaysOR.jsx            ← Perioperative Leader view
│   │   ├── Outcomes.jsx            ← VP Supply Chain view
│   │   ├── AgentLog.jsx            ← Terminal reasoning view
│   │   └── PostCaseReport.jsx      ← Variance report view
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## REFERENCE DOCUMENTS

Read all of these before starting Phase 1. They are the source of truth.

- `02_BUILD_SPEC.md` — Product spec, agent logic, all views
- `03_GENESIS_DESIGN_SYSTEM.md` — Colors, typography, components
- `04_UX_AND_WORKFLOW.md` — Screen map, interaction patterns, persona flows
- `05_SYNTHETIC_DATASET.md` — All data to seed the app
- `06_ICP_AND_DEMO_SCRIPT.md` — Who uses this and the demo story

Do not start coding until you have read all five.
