export const activeRecall = {
  device: 'Medtronic MiniMed Infusion Pump',
  fdaClass: 'Class II',
  lot: '#MX-4421',
  issued: '27 April 2026',
  inventoryQuarantined: 2,
  patientsExposed: 3,
  notificationsSent: 1,
  notificationsRequired: 3,
};

export const patients = [
  {
    id: 'Pt. #8821',
    demographics: 'M/67',
    procedureDate: '14 Mar 2026',
    lotConfirmed: true,
    riskLevel: 'HIGH',
    status: 'notified',
  },
  {
    id: 'Pt. #9034',
    demographics: 'F/54',
    procedureDate: '2 Apr 2026',
    lotConfirmed: true,
    riskLevel: 'HIGH',
    status: 'pending',
  },
  {
    id: 'Pt. #7743',
    demographics: 'M/71',
    procedureDate: '8 Apr 2026',
    lotConfirmed: false,
    riskLevel: 'MEDIUM',
    status: 'review',
  },
];

export const agentActionsCompleted = [
  'Quarantine: 2 units removed from active inventory at 02:14am',
  'Dept heads notified: ICU, Cardiac at 02:14am',
  'Patient #8821 notification sent via Epic patient portal at 02:14am',
];

export const escalationReason =
  'Class II recall with confirmed patient exposure. Inventory quarantine and department notification were executed autonomously. Individual patient notifications require clinical review before sending.';
