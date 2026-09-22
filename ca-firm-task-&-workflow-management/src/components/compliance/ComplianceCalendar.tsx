import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { ComplianceItem, ComplianceStatus, ComplianceCategory } from '../../types';
import {
  CalendarDays,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Download,
  Building,
} from 'lucide-react';
import { exportComplianceExcel } from '../../lib/excelHelper';

interface ComplianceCalendarProps {
  onOpenAI: (mode?: string, context?: any) => void;
}

export const ComplianceCalendar: React.FC<ComplianceCalendarProps> = ({ onOpenAI }) => {
  const {
    complianceItems,
    updateComplianceStatus,
    addComplianceItem,
    escalateCompliance,
    clients,
    currentUser,
  } = useCA();

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [filingAckModalId, setFilingAckModalId] = useState<string | null>(null);
  const [ackNumberInput, setAckNumberInput] = useState<string>('');

  // Add Item State
  const [newClientId, setNewClientId] = useState<string>(clients[0]?.id || '');
  const [newComplianceName, setNewComplianceName] = useState<string>('GSTR-3B Monthly Return Filing');
  const [newCategory, setNewCategory] = useState<ComplianceCategory>('GST');
  const [newFormNumber, setNewFormNumber] = useState<string>('GSTR-3B');
  const [newPeriod, setNewPeriod] = useState<string>('August 2025');
  const [newDueDate, setNewDueDate] = useState<string>('2025-09-20');
  const [newPenaltyRisk, setNewPenaltyRisk] = useState<number>(50000);

  const filteredItems = complianceItems.filter((c) => {
    const matchSearch =
      c.complianceName.toLowerCase().includes(search.toLowerCase()) ||
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.formNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.responsiblePersonName.toLowerCase().includes(search.toLowerCase());

    const matchCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  const categories: string[] = ['ALL', 'GST', 'Income Tax', 'MCA', 'TDS', 'PF/ESI', 'RBI / FEMA', 'IBC'];

  const handleMarkFiled = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filingAckModalId) return;
    updateComplianceStatus(
      filingAckModalId,
      'Filed',
      ackNumberInput || `ACK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      'Verified with portal challan / ARN.'
    );
    setFilingAckModalId(null);
    setAckNumberInput('');
  };

  const handleAddCompliance = (e: React.FormEvent) => {
    e.preventDefault();
    const cl = clients.find((c) => c.id === newClientId) || clients[0];

    addComplianceItem({
      clientId: cl.id,
      clientName: cl.name,
      complianceName: newComplianceName,
      category: newCategory,
      formNumber: newFormNumber,
      period: newPeriod,
      dueDate: newDueDate,
      status: 'Pending',
      responsiblePersonId: currentUser.id,
      responsiblePersonName: currentUser.name,
      penaltyRiskAmount: newPenaltyRisk,
      statutoryAct: newCategory === 'GST' ? 'CGST Act 2017' : newCategory === 'Income Tax' ? 'Income Tax Act 1961' : 'Companies Act 2013',
    });

    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900">Statutory Compliance Calendar & Tracker</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated statutory deadline tracking with multi-tier partner escalation, portal acknowledgment, and penalty risk assessment.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap">
          <button
            onClick={() => exportComplianceExcel(complianceItems)}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Calendar</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Compliance</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Filings</span>
            <CalendarDays className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{complianceItems.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Statutory forms scheduled</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Filed / Complied</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {complianceItems.filter((c) => c.status === 'Filed').length}
          </p>
          <p className="text-[11px] text-emerald-700 mt-0.5">ARN / Ack verified</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Overdue Filings</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">
            {complianceItems.filter((c) => c.status === 'Overdue').length}
          </p>
          <p className="text-[11px] text-rose-600 font-semibold mt-0.5">Partner Escalated</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Potential Penalty Risk</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            ₹{' '}
            {(
              complianceItems
                .filter((c) => c.status !== 'Filed')
                .reduce((sum, c) => sum + c.penaltyRiskAmount, 0) / 1000
            ).toFixed(0)}{' '}
            k
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Calculated statutory interest & fee</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by client entity, form (GSTR-3B, 3CD, ITR-6), in-charge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-xs"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Tax Authorities' : c}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-36">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Filed">Filed</option>
            <option value="Overdue">Overdue</option>
            <option value="Exempt">Exempt</option>
          </select>
        </div>
      </div>

      {/* Compliance Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Statutory Act & Authority</th>
                <th className="p-3.5">Form & Return Name</th>
                <th className="p-3.5">Client Entity</th>
                <th className="p-3.5">Tax Period</th>
                <th className="p-3.5">Due Date & SLA</th>
                <th className="p-3.5">Responsible</th>
                <th className="p-3.5">Escalation Tier</th>
                <th className="p-3.5">Status / ARN</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((c) => {
                const isOverdue = c.status === 'Overdue';
                const isFiled = c.status === 'Filed';
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800">{c.category}</span>
                      <p className="text-[10px] text-slate-400">{c.statutoryAct}</p>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                          {c.formNumber}
                        </span>
                        <span className="font-semibold text-slate-900">{c.complianceName}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">{c.clientName}</td>
                    <td className="p-3.5 text-slate-600">{c.period}</td>
                    <td className="p-3.5">
                      <p className={`font-semibold ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                        {c.dueDate}
                      </p>
                      <span className="text-[10px] text-slate-400">Risk: ₹{(c.penaltyRiskAmount / 1000).toFixed(0)}k</span>
                    </td>
                    <td className="p-3.5 text-slate-700">{c.responsiblePersonName}</td>
                    <td className="p-3.5">
                      {c.escalationLevel > 0 ? (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Level {c.escalationLevel}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Normal</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isFiled
                            ? 'bg-emerald-100 text-emerald-800'
                            : isOverdue
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                      {c.acknowledgmentNumber && (
                        <p className="text-[9px] font-mono text-emerald-700 font-semibold mt-0.5">
                          ARN: {c.acknowledgmentNumber}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {!isFiled && (
                          <>
                            <button
                              onClick={() => escalateCompliance(c.id)}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-[11px] font-medium transition"
                              title="Escalate to Partner"
                            >
                              Escalate
                            </button>
                            <button
                              onClick={() => {
                                setFilingAckModalId(c.id);
                                setAckNumberInput(`ARN-${Math.floor(10000000 + Math.random() * 90000000)}`);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Mark Filed</span>
                            </button>
                          </>
                        )}
                        {isFiled && (
                          <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Complied
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Filed Modal */}
      {filingAckModalId && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              Record Statutory Filing Acknowledgment
            </h3>
            <p className="text-slate-600">
              Enter the portal generated ARN (Application Reference Number) or Acknowledgement Receipt number.
            </p>
            <form onSubmit={handleMarkFiled} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Acknowledgement / ARN Number</label>
                <input
                  type="text"
                  required
                  value={ackNumberInput}
                  onChange={(e) => setAckNumberInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFilingAckModalId(null)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Confirm Compliance Filed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule New Compliance Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Schedule Statutory Compliance Obligation</h3>
            <form onSubmit={handleAddCompliance} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Entity</label>
                <select
                  value={newClientId}
                  onChange={(e) => setNewClientId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.clientCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statutory Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ComplianceCategory)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value="GST">GST Return</option>
                    <option value="Income Tax">Income Tax / ITR</option>
                    <option value="MCA">MCA / ROC Filing</option>
                    <option value="TDS">TDS / 26Q / 24Q</option>
                    <option value="PF/ESI">PF / ESIC Challan</option>
                    <option value="RBI / FEMA">RBI / FEMA Return</option>
                    <option value="IBC">IBC / NCLT Filing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Form / Return Code</label>
                  <input
                    type="text"
                    required
                    value={newFormNumber}
                    onChange={(e) => setNewFormNumber(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Compliance Name / Title</label>
                <input
                  type="text"
                  required
                  value={newComplianceName}
                  onChange={(e) => setNewComplianceName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Period</label>
                  <input
                    type="text"
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statutory Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs text-rose-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penalty Risk (INR)</label>
                  <input
                    type="number"
                    value={newPenaltyRisk}
                    onChange={(e) => setNewPenaltyRisk(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold shadow-sm"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
