import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Lock,
  CheckCircle2,
  AlertCircle,
  Key,
  Shield,
} from 'lucide-react';
import { UserRole } from '../../types';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INVITED';
  lastActive: string;
}

export const AdminPanel: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'usr-1',
      name: 'Alex Rivera',
      email: 'alex@dropos.internal',
      role: 'OWNER',
      status: 'ACTIVE',
      lastActive: 'Just now',
    },
    {
      id: 'usr-2',
      name: 'Sarah Chen',
      email: 'sarah.c@dropos.internal',
      role: 'MANAGER',
      status: 'ACTIVE',
      lastActive: '2h ago',
    },
    {
      id: 'usr-3',
      name: 'Marcus Vance',
      email: 'marcus.v@dropos.internal',
      role: 'SUPPORT_OPERATOR',
      status: 'ACTIVE',
      lastActive: 'Yesterday',
    },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('MANAGER');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    setTeamMembers((prev) => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        status: 'INVITED',
        lastActive: 'Pending accept',
      },
    ]);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div id="admin-panel-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Role-Based Access Control (RBAC) & Team
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Granular permission matrix governing pricing authority, refund thresholds, and AI orchestration.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-semibold text-xs flex items-center space-x-2 transition-all shadow-md shadow-[#D97706]/10 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Operator</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1F1F21] text-[#64748B] font-mono text-[10px] uppercase bg-[#151517]">
                <th className="p-4">Team Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Security PIN Required</th>
                <th className="p-4 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F21] text-[#94A3B8]">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[#151517]/50 transition-colors">
                  <td className="p-4">
                    <div className="font-serif font-bold text-white">{member.name}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">{member.email}</div>
                  </td>
                  <td className="p-4 font-mono">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        member.role === 'OWNER'
                          ? 'bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30'
                          : member.role === 'MANAGER'
                          ? 'bg-[#151517] text-[#E2E8F0] border border-[#2D2D30]'
                          : 'bg-[#151517] text-[#94A3B8] border border-[#2D2D30]'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-emerald-400">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{member.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-[#94A3B8]">
                    {member.role === 'OWNER' || member.role === 'MANAGER' ? (
                      <span className="text-[#D97706] flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Enforced on &gt;$100</span>
                      </span>
                    ) : (
                      <span className="text-[#64748B]">Not Permitted</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-mono text-[#64748B] text-xs">
                    {member.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
        <h3 className="text-sm font-serif font-bold text-white">Permission Matrix</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
            <span className="font-mono text-[#D97706] font-bold">OWNER</span>
            <ul className="text-[#94A3B8] space-y-1 text-[11px] list-disc pl-4">
              <li>Full root governance</li>
              <li>Payment gateways & payouts</li>
              <li>PIN reconfiguration</li>
              <li>Autonomous AI orchestrator</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
            <span className="font-mono text-white font-bold">MANAGER</span>
            <ul className="text-[#94A3B8] space-y-1 text-[11px] list-disc pl-4">
              <li>Product publishing & research</li>
              <li>Supplier routing adjustments</li>
              <li>Refund approvals &lt; $100</li>
              <li>AI Copywriter generation</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
            <span className="font-mono text-[#94A3B8] font-bold">SUPPORT_OPERATOR</span>
            <ul className="text-[#94A3B8] space-y-1 text-[11px] list-disc pl-4">
              <li>Customer CRM lookups</li>
              <li>Carrier tracking queries</li>
              <li>Support copilot responses</li>
              <li>No financial disbursement</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
            <span className="font-mono text-[#64748B] font-bold">AUDITOR</span>
            <ul className="text-[#94A3B8] space-y-1 text-[11px] list-disc pl-4">
              <li>Read-only financial ledger</li>
              <li>Export CSV reports</li>
              <li>View system audit trails</li>
              <li>No write capabilities</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F1F21] pb-3">
              <h3 className="text-base font-serif font-bold text-white">Invite Team Operator</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#64748B] hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#94A3B8] font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] focus:border-[#D97706] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#94A3B8] font-medium">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] font-mono focus:border-[#D97706] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#94A3B8] font-medium">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e: any) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] font-mono focus:border-[#D97706] outline-none"
                >
                  <option value="MANAGER">MANAGER</option>
                  <option value="SUPPORT_OPERATOR">SUPPORT_OPERATOR</option>
                  <option value="READ_ONLY_AUDITOR">READ_ONLY_AUDITOR</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#1F1F21]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#151517] text-[#94A3B8] border border-[#2D2D30] cursor-pointer hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-semibold cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
