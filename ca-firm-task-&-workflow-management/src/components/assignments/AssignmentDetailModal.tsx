import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { Assignment, Task, DocumentItem, AssignmentStatus } from '../../types';
import {
  X,
  Briefcase,
  User,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Plus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AssignmentDetailModalProps {
  assignmentId: string;
  onClose: () => void;
  onOpenAI: (mode?: string, context?: any) => void;
}

export const AssignmentDetailModal: React.FC<AssignmentDetailModalProps> = ({
  assignmentId,
  onClose,
  onOpenAI,
}) => {
  const {
    assignments,
    tasks,
    documents,
    timesheets,
    updateAssignment,
    setSelectedTaskId,
    setActiveTab,
  } = useCA();

  const [status, setStatus] = useState<AssignmentStatus>('In Progress');

  const assignment = assignments.find((a) => a.id === assignmentId);
  if (!assignment) return null;

  const linkedTasks = tasks.filter((t) => t.assignmentId === assignmentId);
  const linkedDocs = documents.filter((d) => d.assignmentId === assignmentId || d.clientName === assignment.clientName);
  const linkedTimesheets = timesheets.filter((ts) => ts.assignmentId === assignmentId);

  const hoursLogged = linkedTimesheets.reduce((acc, t) => acc + t.hours, 0);
  const totalCost = linkedTimesheets.reduce((acc, t) => acc + t.hours * t.hourlyCostRate, 0);
  const grossProfit = assignment.billingAmount - totalCost;
  const marginPercent = assignment.billingAmount > 0 ? (grossProfit / assignment.billingAmount) * 100 : 0;

  const handleStatusChange = (newStatus: AssignmentStatus) => {
    setStatus(newStatus);
    updateAssignment(assignment.id, {
      status: newStatus,
      progressPercentage: newStatus === 'Completed' ? 100 : assignment.progressPercentage,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                {assignment.assignmentCode}
              </span>
              <span className="text-xs text-amber-300 font-semibold">{assignment.assignmentType}</span>
              <span className="text-xs text-slate-400">({assignment.financialYear})</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">{assignment.clientName}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{assignment.industry}</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenAI('task-summary', { assignment, tasks: linkedTasks })}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Audit Summary</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500">Billing Mandate</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">₹ {(assignment.billingAmount / 100000).toFixed(2)} Lakhs</p>
              <span className="text-[10px] text-slate-400">Fixed engagement fee</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500">Hours Incurred</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {hoursLogged.toFixed(1)} / {assignment.estimatedHours} hrs
              </p>
              <span className="text-[10px] text-slate-400">
                {((hoursLogged / assignment.estimatedHours) * 100).toFixed(0)}% utilized
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500">Gross Margin</span>
              <p className="text-base font-bold text-emerald-600 mt-0.5">{marginPercent.toFixed(1)}%</p>
              <span className="text-[10px] text-slate-500">Cost: ₹ {(totalCost / 1000).toFixed(0)}k</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500">SLA Due Date</span>
              <p className="text-base font-bold text-rose-600 mt-0.5">{assignment.dueDate}</p>
              <span className="text-[10px] text-slate-400">Priority: {assignment.priority}</span>
            </div>
          </div>

          {/* Audit Governance & Hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Audit Governance & Responsibility
              </h4>
              <div className="space-y-1 text-slate-600">
                <p>
                  <strong>Partner In-Charge:</strong> {assignment.partnerName}
                </p>
                <p>
                  <strong>Audit Manager:</strong> {assignment.managerName}
                </p>
                <p>
                  <strong>Article Field Team:</strong> {assignment.teamMembers.join(', ')}
                </p>
                {assignment.udinNumber && (
                  <p className="font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded inline-block">
                    UDIN: {assignment.udinNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Status & Progress Control
              </h4>
              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Update Status</label>
                <select
                  value={assignment.status}
                  onChange={(e) => handleStatusChange(e.target.value as AssignmentStatus)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress (Fieldwork)</option>
                  <option value="Under Review">Under Review (Manager Review)</option>
                  <option value="Partner Approval">Partner Approval (Final Sign-off)</option>
                  <option value="Completed">Completed (Final Report Issued)</option>
                  <option value="Delayed">Delayed (SLA Crossed)</option>
                </select>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <span>Audit Progress</span>
                  <span>{assignment.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${assignment.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Tasks / Working Papers */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">
                Audit Modules & Working Papers ({linkedTasks.length})
              </h4>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('tasks');
                }}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Go to Task Kanban
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {linkedTasks.length === 0 ? (
                <p className="p-4 text-slate-400 text-center">No specific tasks logged under this assignment.</p>
              ) : (
                linkedTasks.map((t) => (
                  <div key={t.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-700">{t.taskCode}</span>
                        <span className="font-bold text-slate-900">{t.category}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{t.taskDescription}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Assigned: <strong>{t.assignedPersonName}</strong> | Est. {t.estimatedHours} hrs | Due: {t.dueDate}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
