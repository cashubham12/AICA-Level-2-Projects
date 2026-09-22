import React from 'react';
import { useCA } from '../../context/CAContext';
import {
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck,
  Calendar,
  DollarSign,
  UserCheck,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { exportAssignmentsExcel } from '../../lib/excelHelper';

interface PartnerDashboardProps {
  onOpenAI: (mode?: string, context?: any) => void;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ onOpenAI }) => {
  const {
    assignments,
    tasks,
    complianceItems,
    users,
    timesheets,
    setActiveTab,
    setSelectedAssignmentId,
    advanceTaskWorkflow,
  } = useCA();

  // Metrics calculation
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === 'Completed').length;
  const inProgressAssignments = assignments.filter((a) => a.status === 'In Progress').length;
  const delayedAssignments = assignments.filter((a) => a.status === 'Delayed').length;
  const criticalAssignments = assignments.filter((a) => a.priority === 'Critical').length;

  const totalBillingAmount = assignments.reduce((acc, a) => acc + a.billingAmount, 0);

  // Profitability calculations
  const totalHoursLogged = timesheets.reduce((acc, t) => acc + t.hours, 0);
  const totalLaborCost = timesheets.reduce((acc, t) => acc + t.hours * t.hourlyCostRate, 0);
  const grossMargin = totalBillingAmount > 0 ? ((totalBillingAmount - totalLaborCost) / totalBillingAmount) * 100 : 0;

  // Pending Partner Approvals
  const partnerApprovals = tasks.filter((t) => t.workflowStage === 'Partner Approval');

  // Critical / Overdue Deadlines
  const criticalCompliance = complianceItems.filter(
    (c) => c.status === 'Overdue' || (c.status === 'Pending' && new Date(c.dueDate) <= new Date())
  );

  // Recharts Data: Assignment Types Distribution
  const typeCounts: Record<string, number> = {};
  assignments.forEach((a) => {
    typeCounts[a.assignmentType] = (typeCounts[a.assignmentType] || 0) + 1;
  });
  const assignmentTypeData = Object.keys(typeCounts).map((key) => ({
    name: key,
    value: typeCounts[key],
  }));

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

  // Recharts Data: Employee Productivity
  const employeeStats = users
    .filter((u) => u.role !== 'client')
    .map((u) => {
      const userTasks = tasks.filter((t) => t.assignedPersonId === u.id);
      const completedUserTasks = userTasks.filter((t) => t.status === 'Completed' || t.status === 'Closed').length;
      const userTimesheetHours = timesheets
        .filter((ts) => ts.employeeId === u.id)
        .reduce((sum, ts) => sum + ts.hours, 0);
      return {
        name: u.name.split(' ')[0] + ' ' + (u.name.split(' ')[1] || ''),
        assigned: userTasks.length,
        completed: completedUserTasks,
        hours: userTimesheetHours,
        designation: u.designation,
      };
    });

  return (
    <div className="space-y-6">
      {/* Top Banner with CA Firm Overview & Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Executive Partner Dashboard
            </span>
            <span className="text-xs text-slate-400">Firm Governance & Realization Matrix</span>
          </div>
          <h2 className="text-2xl font-bold mt-1 text-slate-100 tracking-tight">
            Apex & Associates, Chartered Accountants
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consolidated oversight of Statutory Audits, IBC CIRP proceedings, Corporate Tax Compliance (Sec 44AB), ASM Engagements, and Partner Sign-offs.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => exportAssignmentsExcel(assignments)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3.5 py-2 rounded-xl text-xs font-medium transition shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Assignments</span>
          </button>
          <button
            onClick={() => onOpenAI('risk-detection', { assignments, complianceItems })}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Risk Assessment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Audits</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalAssignments}</p>
          <div className="flex items-center text-[10px] text-slate-500 mt-1">
            <span className="text-emerald-600 font-semibold">{completedAssignments} finalized</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{inProgressAssignments}</p>
          <div className="text-[10px] text-slate-500 mt-1">Active fieldwork</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Delayed / SLA</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">{delayedAssignments}</p>
          <div className="text-[10px] text-rose-600 font-semibold mt-1">Immediate Partner Attention</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Partner Sign-Off</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">{partnerApprovals.length}</p>
          <div className="text-[10px] text-slate-500 mt-1">Pending approval</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Firm Realization</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">₹ {(totalBillingAmount / 100000).toFixed(1)} L</p>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Total Fee Mandates</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Gross Margin</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-2">{grossMargin.toFixed(0)}%</p>
          <div className="text-[10px] text-slate-500 mt-1">Labor Cost: ₹ {(totalLaborCost / 100000).toFixed(1)} L</div>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & Critical Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Partner Approvals Queue (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
              <h3 className="font-bold text-sm text-slate-900">
                Pending Partner Audit Sign-Off Queue ({partnerApprovals.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('workflow')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              Open Workflow Center <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[380px]">
            {partnerApprovals.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs">No pending tasks waiting for Partner Approval</p>
              </div>
            ) : (
              partnerApprovals.map((task) => (
                <div key={task.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold font-mono bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded">
                        {task.taskCode}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">{task.clientName}</span>
                      <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-medium">
                        {task.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 leading-snug">{task.taskDescription}</p>
                    <p className="text-[11px] text-slate-500">
                      Prepared by: <strong className="text-slate-700">{task.assignedPersonName}</strong> | Reviewer:{' '}
                      <strong className="text-slate-700">{task.reviewerName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => advanceTaskWorkflow(task.id, 'Completed', 'Completed', 'Approved and signed off by Partner.')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sign-Off</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('workflow')}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Critical Statutory Compliance Countdown (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-sm text-slate-900">Critical Compliance Tracker</h3>
            </div>
            <button
              onClick={() => setActiveTab('compliance')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              View Calendar
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[380px]">
            {complianceItems.slice(0, 5).map((comp) => {
              const isOverdue = comp.status === 'Overdue';
              const isFiled = comp.status === 'Filed';
              return (
                <div key={comp.id} className="py-2.5 flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {comp.formNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isFiled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isOverdue
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {comp.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{comp.clientName}</p>
                    <p className="text-[10px] text-slate-500">
                      Due Date: <strong className={isOverdue ? 'text-rose-600' : 'text-slate-700'}>{comp.dueDate}</strong> ({comp.period})
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    Risk: ₹{(comp.penaltyRiskAmount / 1000).toFixed(0)}k
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts: Recharts Practice Distribution & Employee Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Area Breakdown Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Assignments by Practice Area</h3>
              <p className="text-[11px] text-slate-500">Portfolio distribution across service verticals</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assignmentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {assignmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Workload & Hours Logged */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Audit Team Workload & Logged Hours</h3>
              <p className="text-[11px] text-slate-500">Assigned work papers vs logged billable hours</p>
            </div>
            <button
              onClick={() => setActiveTab('timesheet')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Timesheet Details
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeStats}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="assigned" name="Assigned Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hours" name="Hours Logged" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Delayed Assignments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Delayed & High-Risk Engagements Monitoring
            </h3>
            <p className="text-[11px] text-slate-500">Root-cause breakdown and partner escalation triggers</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Assignment Code</th>
                <th className="p-3">Client & Industry</th>
                <th className="p-3">Type</th>
                <th className="p-3">Manager In-Charge</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Est. vs Actual Hrs</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments
                .filter((a) => a.status === 'Delayed' || a.priority === 'Critical')
                .map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-800">{a.assignmentCode}</td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">{a.clientName}</p>
                      <span className="text-[10px] text-slate-500">{a.industry}</span>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                        {a.assignmentType}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{a.managerName}</td>
                    <td className="p-3 font-semibold text-rose-600">{a.dueDate}</td>
                    <td className="p-3 font-mono text-slate-600">
                      {a.actualHours} / {a.estimatedHours} hrs ({((a.actualHours / a.estimatedHours) * 100).toFixed(0)}%)
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          a.status === 'Delayed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedAssignmentId(a.id);
                          setActiveTab('assignments');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1 ml-auto"
                      >
                        Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
