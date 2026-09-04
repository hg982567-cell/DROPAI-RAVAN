import React, { useState } from 'react';
import {
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  DollarSign,
  Image as ImageIcon,
  User,
  Check,
  X,
} from 'lucide-react';
import { ReturnRefundTicket } from '../../types';
import { api } from '../../services/api';

interface ReturnsRefundsProps {
  returns: ReturnRefundTicket[];
  onRefreshData?: () => void;
  onRequirePin: (actionDesc: string, onAuthorized: () => void) => void;
}

export const ReturnsRefunds: React.FC<ReturnsRefundsProps> = ({
  returns: initialReturns,
  onRefreshData,
  onRequirePin,
}) => {
  const [tickets, setTickets] = useState<ReturnRefundTicket[]>(initialReturns);
  const [selectedTicket, setSelectedTicket] = useState<ReturnRefundTicket | null>(null);

  const handleApproveRefund = async (ticket: ReturnRefundTicket) => {
    if (ticket.itemValue >= 100) {
      // High-risk action: Enforce Security PIN
      onRequirePin(`Approve high-value refund of $${ticket.itemValue} for Order #${ticket.orderNumber}`, async () => {
        try {
          const res = await api.approveRefund(ticket.id, '1234');
          if (res.success) {
            setTickets((prev) =>
              prev.map((t) => (t.id === ticket.id ? { ...t, status: 'REFUNDED_VIA_GATEWAY' } : t))
            );
            if (onRefreshData) onRefreshData();
          }
        } catch (err) {
          console.error('Refund approval failed', err);
        }
      });
    } else {
      // Low value refund
      try {
        const res = await api.approveRefund(ticket.id);
        if (res.success) {
          setTickets((prev) =>
            prev.map((t) => (t.id === ticket.id ? { ...t, status: 'REFUNDED_VIA_GATEWAY' } : t))
          );
          if (onRefreshData) onRefreshData();
        }
      } catch (err) {
        console.error('Refund failed', err);
      }
    }
  };

  return (
    <div id="returns-refunds-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Returns, Disputes & Gateway Refunds
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Automated customer return verification with PIN-enforced financial governance.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#D97706] bg-[#D97706]/10 border border-[#D97706]/30 px-3 py-1.5 rounded-lg">
          <Lock className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Refunds &gt; $100 require Security PIN</span>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((ticket) => {
          const isRefunded = ticket.status === 'REFUNDED_VIA_GATEWAY';
          return (
            <div
              key={ticket.id}
              className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#D97706]">
                        #{ticket.orderNumber}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B]">{ticket.createdAt}</span>
                    </div>
                    <div className="text-sm font-bold text-[#E2E8F0]">{ticket.customerName}</div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold ${
                      isRefunded
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {ticket.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-[#94A3B8]">Dispute Reason:</span>
                    <span className="text-rose-300 font-semibold">{ticket.reason}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-[#94A3B8]">Disputed Item Value:</span>
                    <span className="text-[#E2E8F0] font-bold">${ticket.itemValue.toFixed(2)}</span>
                  </div>
                  <p className="text-[#94A3B8] pt-1 leading-relaxed italic">
                    "{ticket.customerNote}"
                  </p>
                </div>

                {ticket.proofImages && ticket.proofImages.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-1 text-[11px] font-mono text-[#94A3B8]">
                      <ImageIcon className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Carrier Damage Evidence</span>
                    </div>
                    <div className="flex space-x-2">
                      {ticket.proofImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Dispute proof"
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover border border-[#1F1F21]"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-[#1F1F21] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#64748B]">
                  Gateway: Stripe Direct
                </span>

                {isRefunded ? (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Refund Committed</span>
                  </div>
                ) : (
                  <button
                    id={`approve-refund-${ticket.id}`}
                    onClick={() => handleApproveRefund(ticket)}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-rose-900/20 cursor-pointer"
                  >
                    {ticket.itemValue >= 100 && <Lock className="w-3.5 h-3.5" />}
                    <span>
                      {ticket.itemValue >= 100 ? 'PIN Approve Refund' : 'Approve Refund'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
