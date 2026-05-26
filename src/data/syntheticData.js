// Genesis Case Readiness — Synthetic Dataset
// Source: 05_SYNTHETIC_DATASET.md
// All data confirmed available in Genesis Core. Genesis-only data sources.

export const hospitalContext = {
  name: "Valley Regional Medical Center",
  location: "Charlotte, NC",
  beds: 520,
  activeSurgicalRooms: 8,
  genesisInstance: "VRMC-GENESIS-01",
  epicIntegration: true,
  cloverleafFeedActive: true,
  redoxFeedActive: true,
}

export const currentUser = {
  name: "Sarah Chen",
  role: "VP Supply Chain",
  initials: "SC",
  hospital: "Valley Regional Medical Center",
  date: "Thu 29 May 2026",
}

export const perioperativeLeader = {
  name: "Maria Santos",
  role: "OR Manager",
  initials: "MS",
  hospital: "Valley Regional Medical Center",
  date: "Thu 29 May 2026",
}

export const agentRun = {
  lastRun: "02:00am",
  date: "Thu 29 May 2026",
  totalSKUsMonitored: 847,
  runDurationSeconds: 21,
  autoHandledOvernight: 3,
  decisionsRequiringHuman: 2,
  status: "COMPLETED",
}

export const scheduledCases = [
  {
    id: "CASE-2026-0847",
    procedure: "Total Knee Arthroplasty",
    count: 2,
    surgeons: ["Dr. Michael Chen", "Dr. Anita Patel"],
    scheduledTime: "08:00",
    orRoom: "OR-3",
    procedureType: "Orthopaedic",
    subType: "Knee",
    estimatedDurationMins: 110,
    readinessScore: 42,
    status: "AT_RISK",
    patientIds: ["PT-8821", "PT-9034"],
  },
  {
    id: "CASE-2026-0848",
    procedure: "Hip Arthroplasty",
    count: 1,
    surgeons: ["Dr. James Rodriguez"],
    scheduledTime: "11:30",
    orRoom: "OR-5",
    procedureType: "Orthopaedic",
    subType: "Hip",
    estimatedDurationMins: 95,
    readinessScore: 68,
    status: "WATCH",
    patientIds: ["PT-7743"],
  },
  {
    id: "CASE-2026-0849",
    procedure: "Total Knee Arthroplasty",
    count: 1,
    surgeons: ["Dr. Anita Patel"],
    scheduledTime: "14:15",
    orRoom: "OR-3",
    procedureType: "Orthopaedic",
    subType: "Knee",
    estimatedDurationMins: 100,
    readinessScore: 91,
    status: "CLEAR",
    patientIds: ["PT-6612"],
  },
]

export const preferenceCards = {
  "CASE-2026-0847": {
    cardId: "PC-CHEN-TKA-001",
    surgeon: "Dr. Michael Chen",
    procedure: "Total Knee Arthroplasty",
    lastUpdated: "2026-04-14",
    updatedBy: "Dr. Chen",
    version: "v4.2",
    items: [
      // PPI items — always escalate, never auto-reorder
      { sku: "XR7-TIBIAL-42", description: "Tibial Component XR-7 (42mm)", qty: 3, category: "PPI", ppiFlag: true },
      { sku: "XR7-TIBIAL-44", description: "Tibial Component XR-7 (44mm)", qty: 3, category: "PPI", ppiFlag: true },
      { sku: "FK3-FEMORAL-M", description: "Femoral Component FK-3 Medium", qty: 2, category: "PPI", ppiFlag: true },
      { sku: "FK3-FEMORAL-L", description: "Femoral Component FK-3 Large", qty: 2, category: "PPI", ppiFlag: true },
      { sku: "POLY-INSERT-9", description: "Polyethylene Insert 9mm", qty: 4, category: "PPI", ppiFlag: true },
      // Standard items — eligible for auto-reorder below $500
      { sku: "BFIX-2-60ML", description: "BoneFix-2 Bone Cement 60ml", qty: 4, category: "STANDARD", ppiFlag: false },
      { sku: "DRAIN-HMV-16", description: "Hemovac Drain 16Fr", qty: 2, category: "STANDARD", ppiFlag: false },
      { sku: "TOURNIQUET-STD", description: "Pneumatic Tourniquet Cuff", qty: 2, category: "STANDARD", ppiFlag: false },
      { sku: "PULSE-LAVAGE", description: "Pulse Lavage System", qty: 2, category: "STANDARD", ppiFlag: false },
      { sku: "BOVIE-STD", description: "Electrocautery Pencil", qty: 2, category: "STANDARD", ppiFlag: false },
      { sku: "SKIN-STAPLES", description: "Skin Stapler 35W", qty: 4, category: "STANDARD", ppiFlag: false },
      { sku: "SUTURE-VICRYL-1", description: "Vicryl Suture 1-0", qty: 6, category: "STANDARD", ppiFlag: false },
      { sku: "SUTURE-NYLON-3", description: "Nylon Suture 3-0", qty: 4, category: "STANDARD", ppiFlag: false },
      { sku: "GLOVES-SZ8", description: "Sterile Gloves Size 8", qty: 6, category: "CONSUMABLE", ppiFlag: false },
    ]
  },
  "CASE-2026-0848": {
    cardId: "PC-RODRIGUEZ-THA-001",
    surgeon: "Dr. James Rodriguez",
    procedure: "Total Hip Arthroplasty",
    lastUpdated: "2026-03-22",
    updatedBy: "Dr. Rodriguez",
    version: "v3.1",
    items: [
      { sku: "ACET-CUP-52", description: "Acetabular Cup 52mm", qty: 2, category: "PPI", ppiFlag: true },
      { sku: "ACET-LINER-52", description: "Acetabular Liner 52mm", qty: 2, category: "PPI", ppiFlag: true },
      { sku: "FEMORAL-STEM-4", description: "Femoral Stem Size 4", qty: 1, category: "PPI", ppiFlag: true },
      { sku: "FEMORAL-HEAD-32", description: "Femoral Head 32mm", qty: 2, category: "PPI", ppiFlag: true },
      { sku: "BFIX-2-60ML", description: "BoneFix-2 Bone Cement 60ml", qty: 2, category: "STANDARD", ppiFlag: false },
      { sku: "DRAIN-HMV-16", description: "Hemovac Drain 16Fr", qty: 1, category: "STANDARD", ppiFlag: false },
      { sku: "PULSE-LAVAGE", description: "Pulse Lavage System", qty: 1, category: "STANDARD", ppiFlag: false },
      { sku: "SUTURE-VICRYL-1", description: "Vicryl Suture 1-0", qty: 4, category: "STANDARD", ppiFlag: false },
      { sku: "GLOVES-SZ7", description: "Sterile Gloves Size 7.5", qty: 4, category: "CONSUMABLE", ppiFlag: false },
    ]
  },
}

export const inventoryLevels = {
  "XR7-TIBIAL-42":    { onHand: 2, parLevel: 4, location: "OR Storeroom A", lastUpdated: "2026-05-29T01:45:00" },
  "XR7-TIBIAL-44":    { onHand: 2, parLevel: 4, location: "OR Storeroom A", lastUpdated: "2026-05-29T01:45:00" },
  "FK3-FEMORAL-M":    { onHand: 4, parLevel: 3, location: "OR Storeroom A", lastUpdated: "2026-05-29T01:45:00" },
  "FK3-FEMORAL-L":    { onHand: 4, parLevel: 3, location: "OR Storeroom A", lastUpdated: "2026-05-29T01:45:00" },
  "POLY-INSERT-9":    { onHand: 6, parLevel: 4, location: "OR Storeroom A", lastUpdated: "2026-05-29T01:45:00" },
  "BFIX-2-60ML":      { onHand: 3, parLevel: 6, location: "Pharmacy Store", lastUpdated: "2026-05-29T01:45:00" },
  "DRAIN-HMV-16":     { onHand: 8, parLevel: 4, location: "OR Storeroom B", lastUpdated: "2026-05-29T01:45:00" },
  "TOURNIQUET-STD":   { onHand: 4, parLevel: 2, location: "OR Storeroom B", lastUpdated: "2026-05-29T01:45:00" },
  "PULSE-LAVAGE":     { onHand: 3, parLevel: 2, location: "OR Storeroom B", lastUpdated: "2026-05-29T01:45:00" },
  "BOVIE-STD":        { onHand: 12, parLevel: 6, location: "OR Storeroom B", lastUpdated: "2026-05-29T01:45:00" },
  "SKIN-STAPLES":     { onHand: 10, parLevel: 6, location: "OR Storeroom B", lastUpdated: "2026-05-29T01:45:00" },
  "SUTURE-VICRYL-1":  { onHand: 24, parLevel: 12, location: "OR Storeroom C", lastUpdated: "2026-05-29T01:45:00" },
  "SUTURE-NYLON-3":   { onHand: 18, parLevel: 8, location: "OR Storeroom C", lastUpdated: "2026-05-29T01:45:00" },
  "GLOVES-SZ8":       { onHand: 30, parLevel: 12, location: "OR Storeroom C", lastUpdated: "2026-05-29T01:45:00" },
  "ACET-CUP-52":      { onHand: 3, parLevel: 2, location: "OR Storeroom A", lastUpdated: "2026-05-29T01:45:00" },
  "ACET-LINER-52":    { onHand: 3, parLevel: 2, location: "OR Storeroom A", lastUpdated: "2026-05-29T01:45:00" },
  "FEMORAL-STEM-4":   { onHand: 2, parLevel: 2, location: "OR Storeroom A", lastUpdated: "2026-05-29T01:45:00" },
  "FEMORAL-HEAD-32":  { onHand: 4, parLevel: 2, location: "OR Storeroom A", lastUpdated: "2026-05-29T01:45:00" },
  "GLOVES-SZ7":       { onHand: 24, parLevel: 10, location: "OR Storeroom C", lastUpdated: "2026-05-29T01:45:00" },
}

export const detectedGaps = [
  {
    caseId: "CASE-2026-0847",
    sku: "XR7-TIBIAL-42",
    description: "Tibial Component XR-7 (42mm)",
    required: 3,
    onHand: 2,
    deficit: 1,
    category: "PPI",
    ppiFlag: true,
    governance: "ESCALATE",
    agentAction: "Loan kit request email sent to DePuy Synthes rep",
    escalationReason: "PPI item — auto-reorder blocked per clinical governance",
    detectedAt: "T-72h",
  },
  {
    caseId: "CASE-2026-0847",
    sku: "XR7-TIBIAL-44",
    description: "Tibial Component XR-7 (44mm)",
    required: 3,
    onHand: 2,
    deficit: 1,
    category: "PPI",
    ppiFlag: true,
    governance: "ESCALATE",
    agentAction: "Included in same loan kit request email to DePuy Synthes",
    escalationReason: "PPI item — auto-reorder blocked per clinical governance",
    detectedAt: "T-72h",
  },
  {
    caseId: "CASE-2026-0847",
    sku: "BFIX-2-60ML",
    description: "BoneFix-2 Bone Cement 60ml",
    required: 4,
    onHand: 3,
    deficit: 1,
    category: "STANDARD",
    ppiFlag: false,
    governance: "AUTO_RESOLVE",
    agentAction: "Auto-reorder triggered at 02:00:08 — 1 unit · $180 · below $500 threshold",
    resolvedAt: "T-72h",
    status: "RESOLVED",
  },
]

export const vendorReps = [
  {
    id: "REP-001",
    name: "Sarah Mitchell",
    company: "DePuy Synthes",
    phone: "704-555-0147",
    email: "s.mitchell@depuysynthes.com",
    linkedSkus: ["XR7-TIBIAL-42", "XR7-TIBIAL-44", "FK3-FEMORAL-M", "FK3-FEMORAL-L", "POLY-INSERT-9"],
    linkedSurgeons: ["Dr. Michael Chen", "Dr. Anita Patel"],
    contactChannel: "EMAIL",
    loanKitRequest: {
      sentAt: "2026-05-27T02:00:04",
      requestedItems: ["XR7-TIBIAL-42 ×2", "XR7-TIBIAL-44 ×2"],
      responseReceived: false,
      hoursElapsed: 26,
      status: "NO_RESPONSE_DETECTED",
      mvpProxy: true,
    },
    poOutstandingOrders: {
      status: "OUTSTANDING",
      poNumber: "PO-2026-4421",
      orderedAt: "2026-05-27T02:00:05",
      mvpProxy: true,
    }
  },
  {
    id: "REP-002",
    name: "Tom Fitzgerald",
    company: "Stryker Orthopaedics",
    phone: "704-555-0283",
    email: "t.fitzgerald@stryker.com",
    linkedSkus: ["ACET-CUP-52", "ACET-LINER-52", "FEMORAL-STEM-4", "FEMORAL-HEAD-32"],
    linkedSurgeons: ["Dr. James Rodriguez"],
    contactChannel: "EMAIL",
    loanKitRequest: null,
  },
]

export const checkpointStates = {
  "CASE-2026-0847": {
    "T72h": {
      status: "COMPLETED",
      completedAt: "2026-05-27T02:00:00",
      autoResolved: [
        { action: "OR schedule pulled", detail: "3 cases confirmed for Thu 29 May" },
        { action: "Preference card pulled", detail: "PC-CHEN-TKA-001 v4.2 — 14 items" },
        { action: "Inventory check completed", detail: "11 items confirmed · 3 gaps detected" },
        { action: "BoneFix-2 auto-reordered", detail: "1 unit · $180 · PO-2026-4422 raised" },
        { action: "Loan kit request sent", detail: "Email to Sarah Mitchell (DePuy Synthes) at 02:00:04" },
        { action: "Pick-list drift check", detail: "Dr. Chen has used Tibial 44mm in 8/15 recent cases — 42mm on card" },
      ],
      escalations: [
        {
          id: "ESC-001",
          item: "Tibial Component XR-7 (42mm + 44mm)",
          reason: "PPI deficit — 2 units short across both sizes. Auto-reorder blocked.",
          recommendedAction: "Confirm loan kit with Sarah Mitchell (DePuy Synthes). Call if no response by T-48h.",
          riskLevel: "HIGH",
          resolved: false,
        }
      ]
    },
    "T48h": {
      status: "ACTIVE",
      completedAt: null,
      autoResolved: [
        { action: "Preference card change check", detail: "No changes since T-72h — v4.2 current" },
        { action: "Re-score completed", detail: "Readiness 42/100 — PPI gap still open" },
      ],
      escalations: [
        {
          id: "ESC-002",
          item: "Vendor rep no response — Sarah Mitchell",
          reason: "26 hours since loan kit request email. No structured confirmation possible (MVP).",
          recommendedAction: "Call Sarah Mitchell directly: 704-555-0147. Confirm tray delivery by Tue 28 May.",
          riskLevel: "HIGH",
          resolved: false,
          mvpNote: "Confirmation tracking requires LKM mobile app (H2 roadmap). Current detection: elapsed time only.",
        }
      ]
    },
    "T24h": { status: "PENDING", completedAt: null, autoResolved: [], escalations: [] },
    "T4h":  { status: "PENDING", completedAt: null, autoResolved: [], escalations: [] },
    "PostCase": { status: "PENDING", completedAt: null, autoResolved: [], escalations: [] },
  },
  "CASE-2026-0848": {
    "T72h": {
      status: "COMPLETED",
      completedAt: "2026-05-27T02:00:00",
      autoResolved: [
        { action: "OR schedule pulled", detail: "Hip Arthroplasty confirmed" },
        { action: "Preference card pulled", detail: "PC-RODRIGUEZ-THA-001 v3.1 — 9 items" },
        { action: "Inventory check", detail: "All items at or above required levels" },
        { action: "Pick-list drift check", detail: "Dr. Rodriguez — no significant drift detected" },
      ],
      escalations: []
    },
    "T48h": {
      status: "COMPLETED",
      completedAt: "2026-05-28T02:00:00",
      autoResolved: [
        { action: "Re-score completed", detail: "Readiness 68/100 — Femoral Head 32mm borderline" },
        { action: "Preference card change", detail: "ALERT: Dr. Rodriguez added Femoral Head 36mm option at 14:23 on 28 May" },
      ],
      escalations: [
        {
          id: "ESC-003",
          item: "Femoral Head 36mm — added to preference card at T-48h",
          reason: "Card change detected. Item not in current inventory. Standard item — eligible for auto-reorder.",
          recommendedAction: "Auto-reorder staged for approval — 2 units · $340 total. Approve to proceed.",
          riskLevel: "MEDIUM",
          resolved: false,
        }
      ]
    },
    "T24h": { status: "PENDING", completedAt: null, autoResolved: [], escalations: [] },
    "T4h":  { status: "PENDING", completedAt: null, autoResolved: [], escalations: [] },
    "PostCase": { status: "PENDING", completedAt: null, autoResolved: [], escalations: [] },
  },
  "CASE-2026-0849": {
    "T72h": {
      status: "COMPLETED",
      completedAt: "2026-05-27T02:00:00",
      autoResolved: [
        { action: "OR schedule pulled", detail: "TKA confirmed — Dr. Patel" },
        { action: "Preference card pulled", detail: "PC-PATEL-TKA-001 v2.8 — 13 items" },
        { action: "Inventory check", detail: "All 13 items confirmed" },
      ],
      escalations: []
    },
    "T48h": {
      status: "COMPLETED",
      completedAt: "2026-05-28T02:00:00",
      autoResolved: [
        { action: "Re-score completed", detail: "Readiness 91/100 — fully confirmed" },
        { action: "All items confirmed", detail: "No gaps detected" },
      ],
      escalations: []
    },
    "T24h": { status: "PENDING", completedAt: null, autoResolved: [], escalations: [] },
    "T4h":  { status: "PENDING", completedAt: null, autoResolved: [], escalations: [] },
    "PostCase": { status: "PENDING", completedAt: null, autoResolved: [], escalations: [] },
  }
}

export const weeklyOutcomes = {
  period: "Mon 25 May – Thu 29 May 2026",
  summary: {
    totalCasesScheduled: 14,
    casesCleared: 11,
    casesClearedPct: 79,
    autoResolutionRate: 73,
    autoResolutionRatePriorWeek: 67,
    delayMinutesAvoided: 185,
    delayMinutesAvoidedPriorWeek: 140,
    estimatedLaborSavingsWeek: 4420,
    estimatedAnnualisedSavings: 229840,
    varianceItemsFlagged: 8,
  },
  dailyBreakdown: [
    { day: "Mon 25", casesScheduled: 3, casesCleared: 3, atRisk: 0, autoResolved: 4, escalated: 0 },
    { day: "Tue 26", casesScheduled: 4, casesCleared: 3, atRisk: 1, autoResolved: 5, escalated: 2 },
    { day: "Wed 27", casesScheduled: 3, casesCleared: 2, atRisk: 1, autoResolved: 3, escalated: 1 },
    { day: "Thu 28", casesScheduled: 4, casesCleared: 3, atRisk: 1, autoResolved: 6, escalated: 2 },
    { day: "Fri 29", casesScheduled: 3, casesCleared: 2, atRisk: 1, autoResolved: 3, escalated: 2 },
  ],
  surgeonVariance: [
    { surgeon: "Dr. Michael Chen",    procedure: "TKA", casesThisWeek: 4, avgVarianceItems: 2.1, topVarianceItem: "Tibial XR-7 (44mm)" },
    { surgeon: "Dr. Anita Patel",     procedure: "TKA", casesThisWeek: 3, avgVarianceItems: 0.7, topVarianceItem: "Skin Stapler 35W" },
    { surgeon: "Dr. James Rodriguez", procedure: "THA", casesThisWeek: 2, avgVarianceItems: 1.5, topVarianceItem: "Femoral Head 36mm" },
    { surgeon: "Dr. Lisa Kim",        procedure: "TKA", casesThisWeek: 3, avgVarianceItems: 0.3, topVarianceItem: "None" },
    { surgeon: "Dr. Omar Hassan",     procedure: "THA", casesThisWeek: 2, avgVarianceItems: 0.5, topVarianceItem: "Drain 16Fr" },
  ]
}

export const samplePostCaseReport = {
  caseId: "CASE-2026-0831",
  procedure: "Total Knee Arthroplasty",
  surgeon: "Dr. Michael Chen",
  date: "Tue 26 May 2026",
  orRoom: "OR-3",
  reportGeneratedAt: "15:22",
  preferenceCardVersion: "v4.1",
  totalLineItems: 14,
  matched: 11,
  variances: 3,
  chargeGaps: 1,
  varianceItems: [
    {
      sku: "XR7-TIBIAL-44",
      description: "Tibial Component XR-7 (44mm)",
      onCard: true,
      scannedAtPoC: true,
      qtyOnCard: 1,
      qtyUsed: 2,
      delta: +1,
      category: "PPI",
      chargeCaptured: "YES",
      note: "Surgeon used additional unit intraoperatively",
    },
    {
      sku: "SUTURE-MONOCRYL-2",
      description: "Monocryl Suture 2-0",
      onCard: false,
      scannedAtPoC: true,
      qtyOnCard: 0,
      qtyUsed: 2,
      delta: "+2 (not on card)",
      category: "STANDARD",
      chargeCaptured: "GAP",
      note: "Used but not on preference card and not billed — charge capture gap",
    },
    {
      sku: "DRAIN-HMV-16",
      description: "Hemovac Drain 16Fr",
      onCard: true,
      scannedAtPoC: false,
      qtyOnCard: 2,
      qtyUsed: 1,
      delta: -1,
      category: "STANDARD",
      chargeCaptured: "YES",
      note: "1 unit on card not used — normal variation",
    },
  ],
  chargeCaptureSummary: {
    gapsDetected: 1,
    estimatedRecoveryValue: 186,
    confidence: "HIGH",
  },
  preferenceCardUpdateRecommendation: {
    triggered: true,
    reason: "Dr. Chen has used Tibial XR-7 44mm in 9 of last 12 cases (stated 42mm on card). Monocryl 2-0 used in 7 of last 12 cases (not on card).",
    suggestedUpdate: "Add Monocryl Suture 2-0 ×2 to card. Consider updating primary Tibial size to 44mm.",
    actionRequired: "SC Director review — preference card update requires surgeon confirmation",
  }
}

export const agentLogEntries = [
  { time: "02:00:01", type: "INFO",     text: "Agent run started — 3 cases in 72h window · Valley Regional Medical Center" },
  { time: "02:00:02", type: "INFO",     text: "Connecting to data sources..." },
  { time: "02:00:02", type: "SUCCESS",  text: "→ Genesis OR Schedule: ✓ (3 cases, Thu 29 May — via Epic/Cloverleaf)" },
  { time: "02:00:02", type: "SUCCESS",  text: "→ Genesis Inventory: ✓ (real-time · 847 SKUs monitored)" },
  { time: "02:00:02", type: "SUCCESS",  text: "→ Genesis Preference Cards: ✓ (Epic/Cloverleaf feed active)" },
  { time: "02:00:02", type: "SUCCESS",  text: "→ Genesis PoC Scan Data: ✓ (UDI scans · last 30 days)" },
  { time: "02:00:02", type: "SUCCESS",  text: "→ Vendor Directory: ✓ (rep contact data confirmed)" },
  { time: "02:00:03", type: "CASE",     text: "Case 1: Total Knee Arthroplasty ×2 — Dr. Chen / Dr. Patel [OR-3, 08:00]" },
  { time: "02:00:03", type: "INFO",     text: "→ Preference card pulled: PC-CHEN-TKA-001 v4.2 — 14 line items" },
  { time: "02:00:04", type: "INFO",     text: "→ Inventory check: 11 items confirmed · 3 gaps detected" },
  { time: "02:00:04", type: "WARNING",  text: "→ Tibial Component XR-7 (42mm): Stock 2 · Required 3 · Deficit 1" },
  { time: "02:00:04", type: "WARNING",  text: "→ Tibial Component XR-7 (44mm): Stock 2 · Required 3 · Deficit 1" },
  { time: "02:00:04", type: "DECISION", text: "→ PPI flag detected on both items → ESCALATE (auto-reorder blocked per clinical governance)" },
  { time: "02:00:04", type: "SUCCESS",  text: "→ Loan kit request emailed to Sarah Mitchell (DePuy Synthes) — XR-7 ×4 units across both sizes" },
  { time: "02:00:05", type: "WARNING",  text: "→ BoneFix-2 Bone Cement: Stock 3 · Required 4 · Deficit 1" },
  { time: "02:00:05", type: "SUCCESS",  text: "→ Standard item · $180 · below $500 threshold → AUTO-REORDER triggered · PO-2026-4422 raised" },
  { time: "02:00:06", type: "INFO",     text: "→ Pick-list drift check: Dr. Chen used Tibial 44mm in 8/15 recent cases · 42mm on current card" },
  { time: "02:00:06", type: "WARNING",  text: "→ Drift detected — surfaced to SC Director for preference card review" },
  { time: "02:00:07", type: "CASE",     text: "Case 2: Hip Arthroplasty ×1 — Dr. Rodriguez [OR-5, 11:30]" },
  { time: "02:00:07", type: "INFO",     text: "→ Preference card pulled: PC-RODRIGUEZ-THA-001 v3.1 — 9 items" },
  { time: "02:00:08", type: "SUCCESS",  text: "→ Inventory check: all 9 items confirmed at or above required levels" },
  { time: "02:00:08", type: "INFO",     text: "→ Pick-list drift: no significant drift detected" },
  { time: "02:00:09", type: "CASE",     text: "Case 3: Total Knee Arthroplasty ×1 — Dr. Patel [OR-3, 14:15]" },
  { time: "02:00:09", type: "SUCCESS",  text: "→ Preference card pulled: PC-PATEL-TKA-001 v2.8 — 13 items" },
  { time: "02:00:09", type: "SUCCESS",  text: "→ Inventory check: all 13 items confirmed" },
  { time: "02:00:10", type: "INFO",     text: "Run complete: 3 cases processed · 1 auto-reorder · 1 loan kit request · 2 escalations pending" },
  { time: "02:00:21", type: "SUCCESS",  text: "COMPLETED — 21 seconds" },
]
