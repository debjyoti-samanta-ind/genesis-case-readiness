# Build Specification — Case Readiness Orchestration
## Genesis Automation Healthcare · Demo Prototype

---

## OVERVIEW

This document defines everything the prototype must build. Every data field listed here has been confirmed available in Genesis Core (or flagged as an MVP proxy). Nothing in this spec requires Kermit or Meperia data.

**Demo scenario:** Valley Regional Medical Center · Thursday OR list · Orthopaedic (Knee/Hip) · 3 cases  
**Agent persona:** Runs automatically. Last run: Today 02:00am. Next run: T-check intervals per case.  
**Primary user:** Perioperative Leader (Today's OR view) + VP Supply Chain (Outcomes view)

---

## NAVIGATION STRUCTURE

| Nav Item | View | Primary Persona | Purpose |
|----------|------|----------------|---------|
| Dashboard | Landing summary | Both | 30-second status read |
| Today's OR | TodaysOR.jsx | Perioperative Leader | Task-driven case readiness |
| Outcomes | Outcomes.jsx | VP Supply Chain | Weekly metrics + business case |
| Agent Log | AgentLog.jsx | Both (power users) | Agent reasoning transparency |

Post-Case Report is not a nav item — it is accessed by clicking a completed case row in Today's OR.

---

## VIEW 1 — DASHBOARD (LANDING)

The first screen any user sees. Answers one question: **"What happened overnight and what needs my attention today?"**

### Header section
- Greeting: "Good morning, [Name]" + role + hospital name + date
- Agent status pill (top right): "Agent ran at 02:00am · [N] cases monitored · [N] auto-handled"

### Summary cards (3 cards in a row)
| Card | Content |
|------|---------|
| Cases Today | Total scheduled cases + breakdown: CLEAR / AT RISK / NO-GO |
| Agent Actions | Auto-resolved overnight (count) + Pending human decisions (count) |
| OR Readiness | Highest-risk case name + checkpoint + primary gap |

### Escalation queue (below cards)
- Table showing all human-required decisions across all cases
- Columns: Case · Checkpoint · Item · Gap · Risk level · Action button
- Sorted by: checkpoint urgency first, then risk level
- Maximum 6 rows visible before scroll

### Data dependencies
- OR schedule (Genesis Core, Epic feed)
- Inventory levels (Genesis Inventory, real-time)
- Preference card items (Genesis Core, Epic/Cloverleaf feed)
- Vendor rep status (email sent timestamp, no structured response detection in MVP)
- PO Outstanding Orders status (proxy for loan kit physical receipt)

---

## VIEW 2 — TODAY'S OR (PERIOPERATIVE LEADER)

The daily operational view. Opened at 6am. Closed after rounds. Reopened at noon for T-4h check.

### Left panel — Case list
- One card per scheduled case
- Card content: procedure type · surgeon name · scheduled time · OR room
- Readiness score bar (0–100) with color: red <40, amber 40–74, green 75–100
- Status badge: NO-GO / AT RISK / WATCH / CLEAR
- Click to select → opens right panel

### Right panel — Case detail
Two sections:

**Section A — Checkpoint timeline**
Horizontal timeline showing T-72h → T-48h → T-24h → T-4h → Post-case
Each checkpoint node shows:
- Status: COMPLETED (teal) / ACTIVE (amber) / PENDING (grey)
- Auto-resolved actions (ticked, collapsed by default)
- Open gaps (expanded, with recommended action)
- Human decisions pending (highlighted with action button)

**Section B — Supply item detail**
For the selected gap item:
- Item name, SKU, category (PPI or standard)
- Stock on hand vs required
- Deficit + supplier lead time
- Vendor rep status (email sent at [time], no response detected)
- PO Outstanding Orders status (MVP proxy for physical receipt)
- Preference card version (last updated [date])
- Historical usage drift (surgeon's last 15 cases — actual vs preference card)

### Checkpoint logic — what the agent does at each stage

**T-72h**
| Action | Type | Output |
|--------|------|--------|
| Pull OR schedule — all cases in 72h window | Auto | Case list with surgeon, procedure, time, room |
| Pull preference card per surgeon+procedure | Auto | Item checklist baseline |
| Check inventory vs combined demand (schedule-level) | Auto | Gap list: item, units needed, units available, shortfall |
| Generate pick-list adjustment from historical usage drift | Auto | Drift report: items surgeon uses but not on card; items on card rarely used |
| Auto-trigger loan kit request to vendor rep (email) | Auto | Email sent log with timestamp |
| Surface unresolved gaps with recommended action | Human | Prioritised gap list with risk level |
| Flag PPI items at risk — escalate, never auto-substitute | Human | PPI alert: item, deficit, "requires SC Director approval" |

**T-48h**
| Action | Type | Output |
|--------|------|--------|
| Re-score all cases — verify T-72h gaps resolved | Auto | Updated readiness score per case |
| Check vendor rep confirmation (elapsed time only — no structured detection in MVP) | Auto | Hours since email sent; escalate if >24h no response |
| Detect preference card changes since T-72h (audit trail — v21.04.00) | Auto | Card change alert: what changed, items affected |
| Escalate T-72h gaps still unresolved with urgency uplift | Human | Updated gap list with urgency flag |
| Escalate vendor rep non-responses to charge nurse | Human | Rep non-response alert with suggested phone follow-up |

**T-24h**
| Action | Type | Output |
|--------|------|--------|
| Confirm loan kit PO Outstanding Orders status (MVP proxy for physical receipt) | Auto | PO status: Outstanding / Cleared — note: not a confirmed arrival event |
| Generate case-level go / at-risk / no-go signal per procedure | Auto | Readiness signal with reason for any non-green |
| Apply case-time prioritization if shared inventory short | Auto | Priority order: earlier case time = higher priority; ties broken alphabetically by patient ID |
| Check live patient census for cancellations (Epic/Redox, SIU+ADT HL7v2) | Auto | Census change alert if cancellation detected |

**T-4h**
| Action | Type | Output |
|--------|------|--------|
| Final re-score all cases | Auto | Final gap list: every unresolved item across all cases |
| Agent is information delivery only at this stage — no auto-resolutions | Auto | No actions taken autonomously |
| Escalate all unresolved items with full context | Human | Urgent gap briefing: case, item, gap, history of agent actions, time remaining, single recommended next action |

**Post-case (T+4h)**
| Action | Type | Output |
|--------|------|--------|
| Compare actual PoC scans vs preference card line items | Auto | Variance list: used not on card / on card not used / quantities / cost |
| Auto-generate usage-vs-preference-card variance report | Auto | Full variance report with charge capture gaps |

---

## VIEW 3 — OUTCOMES (VP SUPPLY CHAIN)

The business case view. Shows whether the agent is working. Updated weekly. Used in QBRs.

### Summary stat row (top — 4 large number cards)
| Metric | Definition | Source |
|--------|-----------|--------|
| Cases Cleared | Cases that reached T-0 with no unresolved gaps | Agent run log |
| Delay Minutes Avoided | Estimated delay minutes prevented by agent auto-resolution | Baseline: 45 min avg delay per supply gap × gaps resolved |
| Auto-Resolution Rate | % of agent-detected gaps resolved autonomously without human action | Agent action log |
| Variance Items Flagged | Post-case items on card not used + used not on card (week total) | Post-case reconciliation |

### Weekly trend charts
- Cases cleared vs at-risk per day (7-day bar chart)
- Auto-resolution rate trend (7-day line)
- Both charts use Genesis color system: teal for positive, amber for at-risk

### Surgeon variance table
- Columns: Surgeon · Procedure · Cases this week · Avg variance items · Top variance item
- Sortable by variance count
- Click row → opens that surgeon's preference card drift detail

### Outcome-based pricing anchor (bottom of view)
- Small banner: "At current resolution rate, estimated labor savings: $X/week · $Y annualised"
- Formula: (auto-resolved gaps × 45 min avg resolution time × $85/hr loaded cost) + (delay minutes avoided × OR minute cost $65)
- This is the pricing model evidence — it must be visible to the VP audience

---

## VIEW 4 — AGENT LOG (TERMINAL)

Matches Sentinel's existing terminal design exactly. Dark background, monospace font.

### Header
- Run title: "case-readiness-run-[date]-[time].log"
- Run status: COMPLETED · [N] seconds
- Timestamp format: [HH:MM:SS]

### Log entry structure
```
[02:00:01] Agent run started — [N] cases in 72h window
[02:00:02] Connecting to data sources...
           → Genesis OR Schedule: ✓ (3 cases, Thu 29 May)
           → Genesis Inventory: ✓ (real-time, [N] SKUs monitored)
           → Genesis Preference Cards: ✓ (Epic/Cloverleaf feed active)
           → Genesis PoC Scan Data: ✓ (last 30 days)
           → Vendor Directory: ✓ (rep contact data confirmed)
[02:00:03] Case 1: Total Knee Arthroplasty × 2 — Dr. Chen / Dr. Patel [08:00]
           → Preference card pulled: 14 line items
           → Inventory check: 11 items confirmed · 3 gaps detected
           → Tibial Component XR-7: Stock 4 · Required 6 · Deficit 2
           → PPI flag detected → ESCALATE (auto-reorder blocked)
           → Loan kit request sent to rep Sarah Mitchell (DePuy Synthes) at 02:00:04
           → Femoral Component FK-3: Stock 8 · Required 4 · CLEAR
           → Bone Cement BoneFix-2: Stock 2 · Required 4 · Deficit 2
           → Auto-reorder triggered (standard item, below $500 threshold) ✓
           → DECISION: 1 escalation (PPI) + 1 auto-resolved + 11 confirmed
```

### Colour coding
- Teal green: data source connections, auto-resolved items, CLEAR status
- Amber: ESCALATE decisions, AT RISK flags, warnings
- Red: NO-GO signals, critical gaps, no response alerts
- White/light grey: standard log text
- Dark grey: sub-entries (indented with →)

---

## VIEW 5 — POST-CASE REPORT

Accessed by clicking a completed case in Today's OR. Not a nav item.

### Header
- Case: [Procedure] · [Surgeon] · [Date] · OR [Room]
- Report generated: T+4h post-case (PoC scan propagation window)
- Overall variance: [N] items flagged

### Variance table
| Column | Content |
|--------|---------|
| Item | SKU + description |
| On Preference Card | Yes / No |
| Scanned at PoC | Yes / No |
| Qty on Card | Number |
| Qty Used | Number |
| Delta | +/- |
| Category | PPI / Standard / Consumable |
| Charge Captured | Yes / No / Gap |

### Summary cards (3 cards)
- Items matched (on card + scanned = same quantity)
- Variances (any delta > 0)
- Charge capture gaps (used but not billed)

### Preference card update recommendation
- If 3+ consecutive cases show the same drift pattern, surface: "Consider updating preference card — surgeon has used [item] in [N] of last [N] cases but item is not on current card"
- This is informational only — no auto-update action

---

## AUTHORITY BOUNDARY RULES
### What the agent does autonomously (AUTO-RESOLVE)

| Action | Condition |
|--------|-----------|
| Reorder routine consumable | Below par level · standard item · below $500/line threshold |
| Send loan kit request email to vendor rep | Consignment stock shortfall confirmed |
| Send vendor rep reminder email | >24h since initial request, no structured response detected |
| Generate go/at-risk/no-go signal per case | Informational — no action taken autonomously |
| Apply case-time prioritization | Shared inventory shortage — earlier time = higher priority |
| Generate post-case variance report | T+4h after case completion |

### What requires human confirmation (CONFIRM & PROCEED)

| Action | Condition |
|--------|-----------|
| Auto-reorder above baseline volume | Census-driven spike above standard forecast |
| Case-time prioritization tiebreaker | Director confirms or overrides the priority order |

### What is always human (NEVER AUTO)

| Action | Reason |
|--------|--------|
| Cancel or delay a surgical case | High clinical impact — patient safety boundary |
| Any action on a PPI item | Clinical governance — always requires SC Director approval |

---

## OUT-OF-SCOPE — DO NOT BUILD

| Feature | Why removed | What the agent does instead |
|---------|-------------|----------------------------|
| Substitute recommendation | No native substitute field in Genesis item master (CR-957, CR-649, CR-149 undelivered) | Agent flags item unavailable only |
| Sterilization cycle status | No sterile tray module in Genesis Core | Not shown — acknowledged as roadmap item |
| PPI substitute notification to surgeon | Depends on substitute data — chain impossible without it | PPI item flagged as at-risk to SC Director only |
| Surgeon approval chain | Depends on substitute data | Not built |
| Same-day OR schedule additions | Complex edge case — descoped for 6-week build | Acknowledged limitation in demo |
| Structured vendor rep response tracking | LKM mobile app prototype — not in production | MVP: elapsed time since email sent |
| Physical loan kit arrival confirmation | Manual post-procedure process in Genesis | MVP proxy: PO Outstanding Orders status |

---

## MVP PROXIES — LABEL THESE IN THE UI

These are confirmed limitations that must be visible (not hidden) in the prototype. Label them with a small "MVP" badge or footnote so Demo Day reviewers understand what is production-ready vs roadmap.

| Feature | MVP Proxy | Future State |
|---------|-----------|-------------|
| Vendor rep confirmation | Email sent + elapsed time counter | LKM app accept/decline (H2) |
| Loan kit physical receipt | PO Outstanding Orders status | LKM app tray declaration (H2) |
| Vendor rep response detection | None — charge nurse manual follow-up | LKM structured tracking (H2) |
| Substitute recommendations | Not available | IMCaaS V2 (no delivery date) |
