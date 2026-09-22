import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { TimesheetEntry } from '../../types';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Plus,
  DollarSign,
  Download,
  Filter,
  Search,
  User,
  FileSpreadsheet,
} from 'lucide-react';
import { exportTimesheetsExcel } from '../../lib/excelHelper';

export const TimesheetManager: React.FC = () => {
  const {
    timesheets,
    addTimesheetEntry,
    approveTimesheetEntry,
    assignments,
    currentUser,
    users,
  } = useCA();

  const [isLogOpen, setIsLogOpen] = useState<boolean>(false);
  const [selectedAsgId, setSelectedAsgId] = useState<string>(assignments[0]?.id || '');
  const [logHours, setLogHours] = useState<number>(8);
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [logDesc, setLogDesc] = useState<string>('');
  const [isBillable, setIsBillable] = useState<boolean>(true);
  const [filterUser, setFilterUser] = useState<string>('ALL');

  const filteredTimesheets = timesheets.filter((t) => {
    if (filterUser === 'ALL') return true;
    return t.employeeId === filterUser;
  });

  const totalHours = filteredTimesheets.reduce((acc, t) => acc + t.hours, 0);
  const billableHours = filteredTimesheets.filter((t) => t.billable).reduce((acc, t) => acc + t.hours, 0);
  const totalCost = filteredTimesheets.reduce((acc, t) => acc + t.hours * t.hourlyCostRate, 0);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logDesc) return;
    const asg = assignments.find((a) => a.id === selectedAsgId) || assignments[0];

    addTimesheetEntry({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeRole: currentUser.role,
      date: logDate,
      clientId: asg.clientId,
      clientName: asg.clientName,
      assignmentId: asg.id,
      assignmentName: `${asg.assignmentCode} - ${asg.assignmentType}`,
      hours: logHours,
      billable: isBillable,
      hourlyCostRate: currentUser.hourlyCostRate,
      billingRate: currentUser.hourlyBillingRate,
      activityDescription: logDesc,
    });

    setIsLogOpen(false);
    setLogDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900">Audit Timesheet & Resource Utilization</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standard hourly engagement logs, employee cost attribution, billable utilization, and partner approval workflow.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => exportTimesheetsExcel(timesheets)}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Timesheets</span>
          </button>

          <button
            onClick={() => setIsLogOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily Hours</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Hours Logged</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalHours.toFixed(1)} hrs</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across all audits</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Billable Ratio</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {totalHours > 0 ? ((billableHours / totalHours) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-[11px] text-emerald-700 mt-0.5">{billableHours.toFixed(1)} billable hrs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Labor Cost</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">₹ {(totalCost / 1000).toFixed(0)} k</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Incurred team payroll cost</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Submitted / Pending</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {timesheets.filter((t) => t.status === 'Submitted').length}
          </p>
          <p className="text-[11px] text-purple-700 mt-0.5">Awaiting partner sign-off</p>
        </div>
      </div>

      {/* Filter by Team Member */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filter Team Member:</span>
        </div>
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="border border-slate-200 rounded-lg p-2 text-xs w-64"
        >
          <option value="ALL">All Team Members</option>
          {users
            .filter((u) => u.role !== 'client')
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.designation})
              </option>
            ))}
        </select>
      </div>

      {/* Timesheet Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Auditor / Team Member</th>
                <th className="p-3.5">Client & Assignment</th>
                <th className="p-3.5">Activity Description</th>
                <th className="p-3.5">Hours</th>
                <th className="p-3.5">Billable</th>
                <th className="p-3.5">Cost (INR)</th>
                <th className="p-3.5">Approval Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTimesheets.map((ts) => {
                const isApproved = ts.status === 'Approved';
                return (
                  <tr key={ts.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-semibold text-slate-800">{ts.date}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{ts.employeeName}</p>
                      <span className="text-[10px] text-slate-400 capitalize">{ts.employeeRole}</span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800">{ts.clientName}</p>
                      <span className="text-[10px] text-slate-400">{ts.assignmentName}</span>
                    </td>
                    <td className="p-3.5 text-slate-700 max-w-sm leading-relaxed">{ts.activityDescription}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{ts.hours} hrs</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          ts.billable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ts.billable ? 'Billable' : 'Non-Billable'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">₹ {ts.hours * ts.hourlyCostRate}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ts.status}
                      </span>
                      {ts.approvedBy && (
                        <p className="text-[9px] text-slate-400 mt-0.5">by {ts.approvedBy}</p>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {!isApproved && (currentUser.role === 'partner' || currentUser.role === 'manager') && (
                        <button
                          onClick={() => approveTimesheetEntry(ts.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition shadow-xs"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Timesheet Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Log Audit Fieldwork Hours
            </h3>

            <form onSubmit={handleLogSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment / Client</label>
                <select
                  value={selectedAsgId}
                  onChange={(e) => setSelectedAsgId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.assignmentCode} - {a.clientName} ({a.assignmentType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hours Spent</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="16"
                    value={logHours}
                    onChange={(e) => setLogHours(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Activity Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Scrutinized 45 general ledger entries, recalculated depreciation on plant & machinery..."
                  value={logDesc}
                  onChange={(e) => setLogDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="billableCheck"
                  checked={isBillable}
                  onChange={(e) => setIsBillable(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="billableCheck" className="text-slate-700 font-medium">
                  Billable to Client Engagement
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold shadow-sm"
                >
                  Submit Timesheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
