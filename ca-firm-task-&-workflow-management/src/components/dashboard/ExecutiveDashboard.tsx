import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import {
  CheckSquare,
  Clock,
  Upload,
  AlertCircle,
  FileCheck,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';

interface ExecutiveDashboardProps {
  onOpenAI: (mode?: string, context?: any) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onOpenAI }) => {
  const {
    currentUser,
    tasks,
    timesheets,
    addTimesheetEntry,
    setActiveTab,
    setSelectedTaskId,
    advanceTaskWorkflow,
  } = useCA();

  const [quickHours, setQuickHours] = useState<number>(8);
  const [quickDesc, setQuickDesc] = useState<string>('');
  const [quickTask, setQuickTask] = useState<string>('');

  const myTasks = tasks.filter(
    (t) => t.assignedPersonId === currentUser.id || t.assignedPersonName.includes(currentUser.name.split(' ')[0] || '')
  );

  const pendingTasks = myTasks.filter((t) => t.status !== 'Completed' && t.status !== 'Closed');
  const correctionRequired = myTasks.filter((t) => t.status === 'Correction Required');

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDesc) return;
    const taskObj = myTasks.find((t) => t.id === quickTask) || myTasks[0];
    if (!taskObj) return;

    addTimesheetEntry({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeRole: currentUser.role,
      date: new Date().toISOString().split('T')[0],
      clientId: taskObj.clientId,
      clientName: taskObj.clientName,
      assignmentId: taskObj.assignmentId,
      assignmentName: taskObj.assignmentName,
      taskId: taskObj.id,
      taskName: taskObj.taskDescription.substring(0, 30),
      hours: quickHours,
      billable: true,
      hourlyCostRate: currentUser.hourlyCostRate,
      billingRate: currentUser.hourlyBillingRate,
      activityDescription: quickDesc,
    });
    setQuickDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/40 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Article & Audit Executive Desk
          </span>
          <h2 className="text-2xl font-bold mt-1 text-slate-100">{currentUser.name}</h2>
          <p className="text-xs text-slate-300 mt-1">
            {currentUser.designation} | {currentUser.department}
          </p>
        </div>

        <button
          onClick={() => onOpenAI('sop-generator', { prompt: 'Substantive Vouching and Working Paper Documentation' })}
          className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
        >
          <Sparkles className="w-4 h-4" />
          <span>Audit SOP Assistant</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">My Active Tasks</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{pendingTasks.length}</p>
          <p className="text-[10px] text-slate-400">Assigned audit modules</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Correction / Rework</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">{correctionRequired.length}</p>
          <p className="text-[10px] text-rose-500 font-semibold">Review queries open</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Hours Logged Today</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {timesheets
              .filter((ts) => ts.employeeId === currentUser.id && ts.date === new Date().toISOString().split('T')[0])
              .reduce((sum, ts) => sum + ts.hours, 0)}{' '}
            hrs
          </p>
          <p className="text-[10px] text-slate-400">Daily target: 8.0 hrs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Submitted for Review</span>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {myTasks.filter((t) => t.status === 'Submitted for Review').length}
          </p>
          <p className="text-[10px] text-slate-400">With Senior / Manager</p>
        </div>
      </div>

      {/* Grid: My Tasks & Quick Timesheet Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Assigned Tasks (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              My Audit Fieldwork & Tasks ({pendingTasks.length})
            </h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Full Task Board
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-96">
            {pendingTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">All assigned audit tasks are up to date!</p>
            ) : (
              pendingTasks.map((t) => (
                <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {t.taskCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{t.clientName}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          t.status === 'Correction Required'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{t.taskDescription}</p>
                    <p className="text-[10px] text-slate-400">
                      Reviewer: <strong>{t.reviewerName}</strong> | Due: <strong className="text-slate-600">{t.dueDate}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => advanceTaskWorkflow(t.id, 'Manager Review', 'Submitted for Review', 'Working paper uploaded and submitted for review.')}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Submit</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTaskId(t.id);
                        setActiveTab('tasks');
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Daily Timesheet Widget (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-100">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Today's Timesheet Logger</h3>
          </div>

          <form onSubmit={handleQuickLog} className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Task / Client</label>
                <select
                  value={quickTask}
                  onChange={(e) => setQuickTask(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500"
                >
                  {myTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.clientName.substring(0, 22)} - {t.taskDescription.substring(0, 25)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Hours Spent</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="16"
                  value={quickHours}
                  onChange={(e) => setQuickHours(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Activity Log Details</label>
                <textarea
                  rows={3}
                  value={quickDesc}
                  onChange={(e) => setQuickDesc(e.target.value)}
                  placeholder="e.g. Scrutinized 40 bank payment vouchers, verified TDS deductions..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!quickDesc}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-xs transition mt-2 shadow-sm"
            >
              Record Timesheet Entry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
