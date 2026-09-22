import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { AssignmentType, PriorityLevel, AssignmentStatus } from '../../types';
import { X, Sparkles, Check, Plus, ShieldCheck } from 'lucide-react';

interface AssignmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssignmentCreateModal: React.FC<AssignmentCreateModalProps> = ({ isOpen, onClose }) => {
  const { clients, users, addAssignment, addTask } = useCA();

  const [clientId, setClientId] = useState<string>(clients[0]?.id || '');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('Statutory Audit');
  const [partnerId, setPartnerId] = useState<string>('user-partner-1');
  const [managerId, setManagerId] = useState<string>('user-manager-1');
  const [teamMembers, setTeamMembers] = useState<string[]>(['Rohan Verma', 'Neha Gupta']);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>('2025-09-30');
  const [priority, setPriority] = useState<PriorityLevel>('Critical');
  const [estimatedHours, setEstimatedHours] = useState<number>(180);
  const [billingAmount, setBillingAmount] = useState<number>(650000);
  const [financialYear, setFinancialYear] = useState<string>('FY 2024-25');
  const [description, setDescription] = useState<string>(
    'Comprehensive Statutory Audit under Section 139 of Companies Act 2013 and CARO 2020 reporting.'
  );
  const [autoGenerateChecklist, setAutoGenerateChecklist] = useState<boolean>(true);

  if (!isOpen) return null;

  const selectedClient = clients.find((c) => c.id === clientId) || clients[0];
  const selectedPartner = users.find((u) => u.id === partnerId) || users[0];
  const selectedManager = users.find((u) => u.id === managerId) || users[2];

  const assignmentTypes: AssignmentType[] = [
    'Statutory Audit',
    'Tax Audit',
    'GST Audit',
    'Internal Audit',
    'Bank Audit',
    'Stock Audit',
    'Concurrent Audit',
    'ASM',
    'Valuation',
    'IBC',
    'Liquidation',
    'Forensic Audit',
    'Compliance',
    'Virtual CFO',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addAssignment({
      clientName: selectedClient.name,
      clientCode: selectedClient.clientCode,
      clientId: selectedClient.id,
      industry: selectedClient.industry,
      assignmentType,
      partnerResponsibleId: selectedPartner.id,
      partnerName: selectedPartner.name,
      managerResponsibleId: selectedManager.id,
      managerName: selectedManager.name,
      teamMembers,
      startDate,
      dueDate,
      priority,
      estimatedHours,
      billingAmount,
      recoveryAmount: billingAmount,
      status: 'Not Started',
      financialYear,
      description,
      tags: [assignmentType, financialYear],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Create New Audit / Advisory Assignment</h3>
              <p className="text-xs text-slate-400">Initialize engagement terms, team hierarchy, and standard checklist</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Client Entity</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.clientCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assignment Type (Practice Area)</label>
              <select
                value={assignmentType}
                onChange={(e) => {
                  const val = e.target.value as AssignmentType;
                  setAssignmentType(val);
                  if (val === 'Tax Audit') {
                    setDescription('Tax Audit under Section 44AB and Form 3CD Clauses 21, 22 (MSME Sec 43Bh).');
                  } else if (val === 'IBC') {
                    setDescription('CIRP process management, claims admission, and Section 43/45/66 PUFE avoidance filing.');
                  } else if (val === 'ASM') {
                    setDescription('Agency for Specialized Monitoring (ASM) tracking end-use of bank loan funds & escrow accounts.');
                  } else if (val === 'Valuation') {
                    setDescription('Registered Valuer DCF Equity Valuation under Rule 11UA and FEMA FDI regulations.');
                  }
                }}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500"
              >
                {assignmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Partner In-Charge</label>
              <select
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                {users
                  .filter((u) => u.role === 'partner')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Manager In-Charge</label>
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                {users
                  .filter((u) => u.role === 'manager')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Financial Year / Period</label>
              <input
                type="text"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold text-rose-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value="Critical">Critical (Immediate)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Hours</label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Agreed Billing Fee (INR)</label>
              <input
                type="number"
                value={billingAmount}
                onChange={(e) => setBillingAmount(parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Article Team</label>
              <input
                type="text"
                value={teamMembers.join(', ')}
                onChange={(e) => setTeamMembers(e.target.value.split(',').map((s) => s.trim()))}
                placeholder="e.g. Rohan Verma, Neha Gupta"
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Scope & Audit Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <div>
                <p className="font-bold text-amber-900 text-xs">Standard Working Paper Checklist</p>
                <p className="text-[10px] text-amber-700">
                  Automatically populates SA-compliant audit modules (Planning, IFCoFR, Substantive Testing, Sign-off).
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoGenerateChecklist}
              onChange={(e) => setAutoGenerateChecklist(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md"
            >
              Confirm & Launch Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
