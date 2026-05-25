# Genesis Design System — Implementation Reference
## For Claude Code · Case Readiness Orchestration

Source: Genesis Automation Digital Design Language (Kapa internal docs) + Sentinel prototype design language

---

## CRITICAL RULE

Genesis Primary Green `#81D24C` **must appear in every screen**. This is a hard brand rule from the Genesis design team. It cannot be absent from any view.

---

## COLOUR SYSTEM

### Primary brand colours
```
Primary Green:  #81D24C  — Must be present on every screen
Primary Blue:   #006FDD  — Interactive elements, links, secondary CTAs
```

### Full colour ramps (use these exact values)

**Grey**
```
Lightest:  #FCFCFC
Lighter:   #E3E3E3
Light:     #C5D6D8
Base:      #909BA6
Dark:      #545F66
Darker:    #2F2D2E
Darkest:   #030303
```

**Blue**
```
Lightest:  #e4f7ff
Lighter:   #a0e3ff
Light:     #00ADF5
Base:      #006FDD
Dark:      #2D4CC7
Darker:    #1d3282
Darkest:   #0e173c
```

**Green**
```
Lightest:  #daffd1
Lighter:   #bfffa4
Light:     #61FF7E
Base:      #81D24C
Dark:      #42A800
Darker:    #358600
Darkest:   #1A4200
```

**Teal** (used for auto-resolve, success states, Agent Log connections)
```
Lightest:  #EEFFFF
Lighter:   #CCFFFF
Light:     #8BFFFF
Base:      #00FFFF
Dark:      #00CCCC
Darker:    #009999
Darkest:   #095256
```

**Amber/Orange** (used for AT RISK, WATCH, warnings)
```
Lightest:  #FFFFD6
Lighter:   #FFF07C
Light:     #fab449
Base:      #F18F01
Dark:      #9D5D01
Darker:    #593500
Darkest:   #372100
```

**Red** (used for HIGH, NO-GO, ACTIVE alerts)
```
Lightest:  #F9EBEA
Lighter:   #EEC0C6
Light:     #E58C8A
Base:      #D97462
Dark:      #CB4630
Darker:    #76291C
Darkest:   #3F160F
```

### Semantic colour mapping for Case Readiness
```
Status: CLEAR / RESOLVED / AUTO-HANDLED  →  Green base #81D24C (text) or Teal dark #009999 (badge)
Status: WATCH / PENDING                  →  Amber base #F18F01
Status: AT RISK / HIGH                   →  Red dark #CB4630
Status: NO-GO / CRITICAL                 →  Red darkest #3F160F on Red lightest #F9EBEA
Status: PPI FLAG                         →  Red dark #CB4630 — always escalate, never auto
Background: main content area            →  Grey lightest #FCFCFC (warm off-white)
Background: cards                        →  White #FFFFFF with border Grey lighter #E3E3E3
Background: sidebar                      →  Darkest grey #030303 or near-black navy (preserve from Sentinel)
Text: primary                            →  Grey darker #2F2D2E
Text: secondary / muted                  →  Grey base #909BA6
Text: links / interactive                →  Blue base #006FDD
Agent Log background                     →  #0e1117 (near-black, preserve from Sentinel)
Agent Log teal timestamps                →  Teal dark #009999
Agent Log amber decisions                →  Amber base #F18F01
```

### Tailwind config — add to tailwind.config.js
```js
theme: {
  extend: {
    colors: {
      genesis: {
        green: '#81D24C',
        blue: '#006FDD',
        teal: '#009999',
        amber: '#F18F01',
        red: '#CB4630',
        navy: '#030303',
        'off-white': '#FCFCFC',
      }
    }
  }
}
```

---

## TYPOGRAPHY

### Primary typeface
**Plus Jakarta Sans** — import from Google Fonts

```html
<!-- Add to index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap" rel="stylesheet">
```

```css
/* Add to your global CSS */
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
```

**Secondary / fallback:** Lato (used in older Genesis materials — acceptable fallback)

### Type scale
| Use | Size | Weight | Tailwind class |
|-----|------|--------|---------------|
| Page title / h1 | 28–32px | 700 | `text-3xl font-bold` |
| Section header / h2 | 22–24px | 700 | `text-2xl font-bold` |
| Card title / h3 | 18–20px | 500 | `text-xl font-medium` |
| Body default | 15–16px | 400 | `text-base font-normal` |
| Label / badge | 12–13px | 500 | `text-sm font-medium` |
| Caption / helper | 11–12px | 400 | `text-xs font-normal` |
| Agent Log monospace | 13px | 400 | `font-mono text-sm` |

**Rules:**
- Use sentence case for all UI labels. No ALL CAPS in content (headers OK for section labels like "ESCALATED DECISIONS")
- Set line height explicitly — body text uses 1.5 line height
- Left-align body text and lists; centre only stat callout numbers

---

## SPACING

Base unit: 4px (Tailwind default). Never use ad-hoc values.

| Token | Value | Use |
|-------|-------|-----|
| `p-1` | 4px | Tight icon padding |
| `p-2` | 8px | Badge internal padding |
| `p-3` | 12px | Section inner padding |
| `p-4` | 16px | Standard gap between components |
| `p-6` | 24px | Card padding |
| `p-8` | 32px | Section gaps |
| `gap-4` | 16px | Grid/flex standard gap |
| `gap-6` | 24px | Card grid gap |

---

## BORDER RADIUS

| Context | Value | Tailwind |
|---------|-------|---------|
| Chips, badges, small tags | 4px | `rounded` |
| Buttons, inputs, cards | 8px | `rounded-lg` |
| Modals, large panels | 16px | `rounded-2xl` |

---

## SHADOWS

| Context | Use |
|---------|-----|
| `shadow-sm` | Subtle card elevation, input focus |
| `shadow-md` | Cards, dropdowns, hover states |
| `shadow-lg` | Modals, overlays, drawers |

---

## BUTTON SYSTEM

Genesis has three CTA types. **Only one Primary CTA per screen — no exceptions.**

### Primary CTA
```
Background: Genesis Green #81D24C
Text: Grey darkest #030303 (passes AAA contrast)
Border radius: 8px
Height: 40–48px
Font: 15–18px medium
Hover: darken to #42A800 (Green dark)
Use: The single most important action on the screen
Example: "Confirm & proceed" · "Approve loan kit" · "Resolve gap"
```

### Secondary CTA
```
Background: Blue base #006FDD
Text: White #FFFFFF
Border radius: 8px
Height: 40–48px
Font: 15–18px medium
Hover: darken to #2D4CC7 (Blue dark)
Use: Secondary actions — "Review detail" · "View case" · "Export"
```

### Tertiary CTA
```
Background: Transparent
Text: Grey darker #2F2D2E
Border: 1.5px solid Grey lighter #E3E3E3
Border radius: 8px
Height: 40–48px
Font: 15–18px medium
Hover: Grey lightest #FCFCFC background
Use: Cancel, dismiss, secondary options alongside Primary
Example: "Dismiss" · "Back" · "View later"
```

### Sentinel-style dark teal CTA (preserve from existing prototype)
The Sentinel prototype uses dark teal filled buttons for "Review & approve" actions. Preserve this for high-action escalation buttons in the escalation queue. Color: `#095256` (Teal darkest) with white text.

---

## STATUS BADGE SYSTEM

Use consistent badge patterns across all views.

```jsx
// Badge component — StatusBadge.jsx
const statusConfig = {
  'CLEAR':       { bg: 'bg-green-100',  text: 'text-green-800',  label: 'CLEAR' },
  'WATCH':       { bg: 'bg-amber-100',  text: 'text-amber-800',  label: 'WATCH' },
  'AT RISK':     { bg: 'bg-red-100',    text: 'text-red-700',    label: 'AT RISK' },
  'NO-GO':       { bg: 'bg-red-900',    text: 'text-white',      label: 'NO-GO' },
  'AUTO':        { bg: 'bg-teal-100',   text: 'text-teal-800',   label: 'AUTO-HANDLED' },
  'ESCALATED':   { bg: 'bg-orange-100', text: 'text-orange-800', label: 'ESCALATED' },
  'PPI':         { bg: 'bg-red-100',    text: 'text-red-700',    label: 'PPI — ESCALATE' },
  'MVP':         { bg: 'bg-gray-100',   text: 'text-gray-500',   label: 'MVP PROXY' },
  'CONFIRMED':   { bg: 'bg-green-50',   text: 'text-green-700',  label: 'CONFIRMED' },
  'PENDING':     { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'PENDING' },
}
```

---

## ICONS

Genesis uses **Font Awesome Pro (light/stroke version)** internally. For the prototype, use **Lucide React** — it's already installed in the Sentinel repo and has visual equivalents for all icons needed.

### Icon mapping for Case Readiness
| Feature | Lucide icon | 
|---------|-------------|
| OR Schedule / Calendar | `Calendar` |
| Inventory / Stock | `Package` |
| Vendor Rep | `User` |
| Alert / Gap | `AlertTriangle` |
| Auto-resolved | `CheckCircle` |
| Escalation needed | `ArrowUpCircle` |
| PPI Flag | `ShieldAlert` |
| Agent run | `Zap` |
| Case readiness score | `Activity` |
| Loan kit | `Truck` |
| Preference card | `ClipboardList` |
| Historical usage | `TrendingUp` |
| Post-case variance | `GitCompare` |
| Timer / checkpoint | `Clock` |
| Export | `Download` |
| Dashboard | `LayoutDashboard` |

Icon size default: 20px. Use 16px for inline / badge icons.

---

## SENTINEL DESIGN ELEMENTS — PRESERVE EXACTLY

These elements from the existing Sentinel prototype must not be changed. They are already on-brand and recognised by the Genesis team.

### Sidebar
- Background: near-black `#1a1f2e` (dark navy)
- Genesis logo + "Case Readiness" subtitle (replace "Sentinel")
- Nav items: icon + label, teal active state pill `#095256`
- "Last agent run" status box at bottom of nav
- User avatar + name + role at very bottom

### Agent Log terminal
- Background: `#0e1117`
- Font: monospace (Courier, Consolas, or `font-mono`)
- Timestamps: teal `#009999`
- Decision lines: amber `#F18F01`
- Connection confirmed: teal with checkmark
- File header bar: dark grey with three coloured circles (red, amber, green — macOS style)

### Content area
- Background: `#F5F3EF` (warm off-white — matches Sentinel)
- Cards: white with `rounded-xl shadow-sm border border-gray-100`
- Section label caps: `text-xs font-semibold tracking-widest text-gray-400 uppercase`

---

## COLOUR COMBINATIONS APPROVED FOR CASE READINESS

Use these combinations. Do not mix outside these pairings.

| Context | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| Dashboard header | Navy #030303 | Off-white #FCFCFC | Green #81D24C |
| Card backgrounds | White #FFFFFF | Border #E3E3E3 | — |
| Auto-resolve indicators | Teal dark #009999 | Teal lightest #EEFFFF | Green #81D24C |
| At-risk indicators | Amber base #F18F01 | Amber lightest #FFFFD6 | — |
| Critical/PPI indicators | Red dark #CB4630 | Red lightest #F9EBEA | — |
| Outcomes charts | Teal dark #009999 | Amber base #F18F01 | Green #81D24C |
| Agent Log | Near-black #0e1117 | Teal #009999 | Amber #F18F01 |
