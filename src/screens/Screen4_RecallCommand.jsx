import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { activeRecall, patients, agentActionsCompleted, escalationReason } from '../mockData/recallCommand';

const riskColors = {
  'HIGH':   'bg-[#FEE2E2] text-[#991B1B]',
  'MEDIUM': 'bg-[#FEF3C7] text-[#B45309]',
  'LOW':    'bg-[#DCFCE7] text-[#166534]',
};

export default function Screen4_RecallCommand({ navigate }) {
  const [notifiedIds, setNotifiedIds] = useState(['Pt. #8821']);
  const [reviewedIds, setReviewedIds] = useState([]);

  const notify = (id) => setNotifiedIds(prev => [...prev, id]);
  const markReviewed = (id) => setReviewedIds(prev => [...prev, id]);

  return (
    <div>
      <button
        onClick={() => navigate(1)}
        className="flex items-center gap-1 text-sm text-[#1B6B6B] hover:text-[#155555] mb-6 font-medium"
        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
      >
        <ArrowLeft size={16} /> Back to dashboard
      </button>

      {/* Alert banner */}
      <div className="bg-[#FEE2E2] border border-[#991B1B] border-opacity-30 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="text-[#991B1B] flex-shrink-0 mt-0.5" size={20} />
        <div>
          <div className="text-sm font-bold text-[#991B1B]" style={{fontFamily:'Syne,sans-serif'}}>
            ACTIVE RECALL — {activeRecall.device} · {activeRecall.fdaClass} · Lot {activeRecall.lot}
          </div>
          <div className="text-xs text-[#991B1B] opacity-80 mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
            Issued {activeRecall.issued}
          </div>
        </div>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-[#166534]" style={{fontFamily:'Syne,sans-serif'}}>
            {activeRecall.inventoryQuarantined} units
          </div>
          <div className="text-xs text-[#6B7280] mt-1 flex items-center justify-center gap-1">
            <CheckCircle size={10} className="text-[#166534]" /> Quarantined
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-[#991B1B]" style={{fontFamily:'Syne,sans-serif'}}>
            {activeRecall.patientsExposed}
          </div>
          <div className="text-xs text-[#6B7280] mt-1">Patients potentially exposed</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-[#B45309]" style={{fontFamily:'Syne,sans-serif'}}>
            {notifiedIds.length} of {activeRecall.notificationsRequired}
          </div>
          <div className="text-xs text-[#6B7280] mt-1">Notifications sent</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Patient exposure table */}
        <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E8E4DC]">
            <div className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
              Patient exposure — Lot {activeRecall.lot}
            </div>
          </div>
          {patients.map(patient => {
            const isNotified = notifiedIds.includes(patient.id);
            const isReviewed = reviewedIds.includes(patient.id);
            return (
              <div key={patient.id} className="p-4 border-b border-[#E8E4DC] last:border-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                      {patient.id}{' '}
                      <span className="text-[#6B7280] font-normal">({patient.demographics})</span>
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5">Procedure: {patient.procedureDate}</div>
                    <div className="text-xs mt-1">
                      {patient.lotConfirmed ? (
                        <span className="text-[#991B1B] font-medium">Lot {activeRecall.lot} confirmed in Genesis POC</span>
                      ) : (
                        <span className="text-[#B45309] font-medium">Lot unconfirmed — scan record review required</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${riskColors[patient.riskLevel]}`}>
                    {patient.riskLevel}
                  </span>
                </div>
                <div className="mt-3">
                  {isNotified ? (
                    <div className="flex items-center gap-1.5 text-xs text-[#166534] font-medium" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                      <CheckCircle size={12} /> Notified via Epic patient portal
                    </div>
                  ) : patient.status === 'review' ? (
                    isReviewed ? (
                      <div className="flex items-center gap-1.5 text-xs text-[#166534] font-medium" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                        <CheckCircle size={12} /> Scan record reviewed — no match confirmed
                      </div>
                    ) : (
                      <button
                        onClick={() => markReviewed(patient.id)}
                        className="text-xs font-semibold text-[#B45309] bg-[#FEF3C7] px-3 py-1.5 rounded-lg hover:bg-[#B45309] hover:text-white transition-colors"
                        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                      >
                        Review UDI scan record
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => notify(patient.id)}
                      className="text-xs font-semibold text-[#991B1B] bg-[#FEE2E2] px-3 py-1.5 rounded-lg hover:bg-[#991B1B] hover:text-white transition-colors"
                      style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                    >
                      Notify patient →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Agent actions */}
          <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
            <div className="text-sm font-semibold text-[#1A2F4A] mb-3" style={{fontFamily:'Syne,sans-serif'}}>
              Agent actions completed at 2:14am
            </div>
            <ul className="space-y-2">
              {agentActionsCompleted.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                  <CheckCircle size={14} className="text-[#166534] flex-shrink-0 mt-0.5" />
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {/* Why escalated */}
          <div className="bg-[#FEF3C7] rounded-xl border border-[#B45309] border-opacity-20 p-5">
            <div className="text-sm font-semibold text-[#B45309] mb-2" style={{fontFamily:'Syne,sans-serif'}}>
              Why individual notifications were escalated
            </div>
            <div className="text-sm text-[#92400E]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{escalationReason}</div>
          </div>

          {/* FDA class explanation */}
          <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
            <div className="text-sm font-semibold text-[#1A2F4A] mb-2" style={{fontFamily:'Syne,sans-serif'}}>
              FDA Class II — what it means
            </div>
            <div className="text-sm text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Class II recalls involve devices that may cause temporary health problems or where there is a remote chance of serious adverse health consequences. Requires documentation, patient notification, and regulatory reporting within 10 days.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
