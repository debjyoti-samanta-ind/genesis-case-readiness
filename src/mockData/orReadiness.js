export const procedures = [
  { id: 1, name: 'Total Knee Arthroplasty (×6)', date: 'Thu 1 May', surgeon: 'Dr. Chen / Dr. Patel', score: 87, status: 'AT RISK' },
  { id: 2, name: 'Lumbar Spinal Fusion', date: 'Wed 30 Apr', surgeon: 'Dr. Kim', score: 62, status: 'WATCH' },
  { id: 3, name: 'Hip Arthroplasty', date: 'Tue 29 Apr', surgeon: 'Dr. Rodriguez', score: 41, status: 'WATCH' },
  { id: 4, name: 'Laparoscopic Cholecystectomy', date: 'Tue 29 Apr', surgeon: 'Dr. Okonkwo', score: 12, status: 'CLEAR' },
];

export const selectedCase = {
  item: 'Tibial Component XR-7',
  department: 'Orthopedic OR',
  classification: 'Physician Preference Item (PPI)',
  statusBadge: 'STOCKOUT IN 5 DAYS',
  stats: {
    stockOnHand: 4,
    proceduresThursday: 6,
    required: 6,
    deficit: 2,
    supplierLead: 4,
    confidence: 'High',
  },
  sparklineData: [25, 30, 28, 35, 100, 90, 30, 28, 32, 25, 30, 28, 22, 30],
  riskScore: 87,
  riskFactors: [
    'Stock coverage ratio: CRITICAL (4 units / 6 required = 0.67)',
    'Lead time gap: −1 day (procedure Thu, supplier lead = 4 days)',
    'Surgeon substitution history: LOW (Dr. Chen: 12% historical acceptance)',
  ],
  governanceNote: 'XR-7 is a Physician Preference Item (PPI). Dr. Chen and Dr. Patel both have this item on their preference cards. Any reorder or substitution requires SC Director approval per clinical governance rules.',
  substitute: {
    name: 'BioKnee Tibial System T-22',
    source: 'Meperia Functional Equivalence',
    contractPrice: 7470,
    originalPrice: 8820,
    savingPerCase: 1350,
    totalSaving: 8100,
    annualisedSaving: 70200,
    surgeons: ['Dr. Chen', 'Dr. Patel'],
  },
};
