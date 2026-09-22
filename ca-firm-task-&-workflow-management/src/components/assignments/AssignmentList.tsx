import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { Assignment, AssignmentType, AssignmentStatus, PriorityLevel } from '../../types';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Download,
  Trash2,
  Eye,
  Sparkles,
  Calendar,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { exportAssignmentsExcel } from '../../lib/excelHelper';
import { AssignmentCreateModal } from './AssignmentCreateModal';
import { AssignmentDetailModal } from './AssignmentDetailModal';

interface AssignmentListProps {
  onOpenAI: (mode?: string, context?: any) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({ onOpenAI }) => {
  const {
    assignments,
    deleteAssignment,
    selectedAssignmentId,
    setSelectedAssignmentId,
    currentUser,
  } = useCA();

  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [detailModalId, setDetailModalId] = useState<string | null>(null);

  // If coming from another tab with preselected assignment
  React.useEffect(() => {
    if (selectedAssignmentId) {
      setDetailModalId(selectedAssignmentId);
      setSelectedAssignmentId(null);
    }
  }, [selectedAssignmentId]);

  // Filter assignments
  const filteredAssignments = assignments.filter((a) => {
    const matchSearch =
      a.clientName.toLowerCase().includes(search.toLowerCase()) ||
      a.assignmentCode.toLowerCase().includes(search.toLowerCase()) ||
      a.assignmentType.toLowerCase().includes(search.toLowerCase()) ||
      a.partnerName.toLowerCase().includes(search.toLowerCase()) ||
      a.managerName.toLowerCase().includes(search.toLowerCase());

    const matchType = selectedType === 'ALL' || a.assignmentType === selectedType;
    const matchStatus = selectedStatus === 'ALL' || a.status === selectedStatus;
    const matchPriority = selectedPriority === 'ALL' || a.priority === selectedPriority;

    return matchSearch && matchType && matchStatus && matchPriority;
  });

  const assignmentTypes: string[] = [
    'ALL',
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

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900">Practice Assignments & Audit Portfolio</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking {assignments.length} client engagements across Statutory, Tax, IBC, Banking, and Advisory practices.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap">
          <button
            onClick={() => exportAssignmentsExcel(filteredAssignments)}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Excel</span>
          </button>

          {(currentUser.role === 'partner' || currentUser.role === 'manager') && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by client name, code, partner, manager..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Type Dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs"
            >
              {assignmentTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Practice Areas' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="w-full lg:w-36">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Partner Approval">Partner Approval</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="w-full lg:w-32">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Client & Industry</th>
                <th className="p-3.5">Practice Type</th>
                <th className="p-3.5">Hierarchy (Partner / Manager)</th>
                <th className="p-3.5">Timeline & Due Date</th>
                <th className="p-3.5">Progress</th>
                <th className="p-3.5">Fee (INR)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No assignments found matching the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((a) => {
                  const isDelayed = a.status === 'Delayed';
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-800">{a.assignmentCode}</td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{a.clientName}</p>
                        <span className="text-[10px] text-slate-500">{a.industry}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded text-[10px] border border-slate-200 inline-block">
                          {a.assignmentType}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{a.financialYear}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-slate-800">{a.partnerName}</p>
                        <span className="text-[10px] text-slate-500">Mgr: {a.managerName}</span>
                      </td>
                      <td className="p-3.5">
                        <p className={`font-semibold ${isDelayed ? 'text-rose-600' : 'text-slate-700'}`}>
                          Due: {a.dueDate}
                        </p>
                        <span className="text-[10px] text-slate-400">Start: {a.startDate}</span>
                      </td>
                      <td className="p-3.5 min-w-[120px]">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1">
                          <span>{a.progressPercentage}%</span>
                          <span className="text-slate-400">
                            {a.actualHours}/{a.estimatedHours}h
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              a.status === 'Completed'
                                ? 'bg-emerald-500'
                                : isDelayed
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${a.progressPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        ₹ {(a.billingAmount / 100000).toFixed(2)} L
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            a.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.status === 'Delayed'
                              ? 'bg-rose-100 text-rose-800 animate-pulse'
                              : a.status === 'Partner Approval'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {a.status}
                        </span>
                        {a.udinNumber && (
                          <div className="text-[9px] font-mono text-emerald-700 font-bold mt-1">
                            UDIN Generated
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setDetailModalId(a.id)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="View Full Engagement Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenAI('task-summary', { assignment: a })}
                            className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition"
                            title="Generate AI Audit Summary"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          {currentUser.role === 'partner' && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete assignment ${a.assignmentCode}?`)) {
                                  deleteAssignment(a.id);
                                }
                              }}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              title="Delete Assignment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Create Modal */}
      <AssignmentCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* Assignment Detail Modal */}
      {detailModalId && (
        <AssignmentDetailModal
          assignmentId={detailModalId}
          onClose={() => setDetailModalId(null)}
          onOpenAI={onOpenAI}
        />
      )}
    </div>
  );
};
