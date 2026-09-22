import React from 'react';
import { useCA } from '../../context/CAContext';
import {
  Users,
  CheckSquare,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Send,
} from 'lucide-react';

interface ManagerDashboardProps {
  onOpenAI: (mode?: string, context?: any) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onOpenAI }) => {
  const {
    currentUser,
    assignments,
    tasks,
    complianceItems,
    setActiveTab,
    setSelectedTaskId,
  } = useCA();

  // Filter manager-specific items
  const myAssignments = assignments.filter(
    (a) => a.managerResponsibleId === currentUser.id || a.managerName.includes(currentUser.name.split(' ')[1] || '')
  );

  const myTeamTasks = tasks.filter(
    (t) => t.reviewerId === currentUser.id || t.reviewerName.includes(currentUser.name.split(' ')[1] || '')
  );

  const pendingReviews = myTeamTasks.filter(
    (t) => t.workflowStage === 'Manager Review' || t.workflowStage === 'Senior Review'
  );

  const waitingClientData = myTeamTasks.filter((t) => t.status === 'Waiting for Client Data');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/30">
            Manager Fieldwork & Review Cockpit
          </span>
          <h2 className="text-2xl font-bold mt-1 text-slate-100">{currentUser.name}</h2>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            {currentUser.designation} | Overseeing team execution, working paper reviews, client follow-ups, and partner submissions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenAI('email-draft', { clientName: 'Client Management', assignmentTitle: 'Statutory Fieldwork Audit' })}
            className="flex items-center space-x-1.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Draft Client Follow-up</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Managed Engagements</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{myAssignments.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active client audits</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Review Queue</span>
            <CheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{pendingReviews.length}</p>
          <p className="text-[11px] text-amber-700 mt-0.5">Working papers to verify</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Awaiting Client Info</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-2">{waitingClientData.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Bottlenecks identified</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Article Team Count</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">4 Executives</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Audit field team</p>
        </div>
      </div>

      {/* Grid: Pending Reviews and Team Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Working Papers Review Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              Manager Review Queue ({pendingReviews.length})
            </h3>
            <button
              onClick={() => setActiveTab('workflow')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Open Workflow
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-80">
            {pendingReviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No working papers currently awaiting manager review</p>
            ) : (
              pendingReviews.map((task) => (
                <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                        {task.taskCode}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{task.clientName}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{task.taskDescription}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Executive: <strong>{task.assignedPersonName}</strong> | Est. {task.estimatedHours} hrs
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setActiveTab('tasks');
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 shrink-0"
                  >
                    Examine
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Managed Assignments Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-sm text-slate-900">Active Managed Engagements</h3>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              All Assignments
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-80 space-y-3">
            {myAssignments.map((a) => (
              <div key={a.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">{a.clientName}</span>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {a.assignmentType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Due: {a.dueDate}</span>
                  <span className="font-bold text-slate-700">{a.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${a.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
