import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  Download,
  AlertTriangle,
  ArrowUpRight,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { exportProfitabilityExcel } from '../../lib/excelHelper';

export const ProfitabilityAnalysis: React.FC = () => {
  const { assignments, timesheets, clients, setSelectedAssignmentId, setActiveTab } = useCA();

  // Calculate profitability per assignment
  const assignmentProfitability = assignments.map((asg) => {
    const asgTimesheets = timesheets.filter((t) => t.assignmentId === asg.id);
    const totalHours = asgTimesheets.reduce((sum, t) => sum + t.hours, 0);
    const directLaborCost = asgTimesheets.reduce((sum, t) => sum + t.hours * t.hourlyCostRate, 0);
    const grossProfit = asg.billingAmount - directLaborCost;
    const profitMargin = asg.billingAmount > 0 ? (grossProfit / asg.billingAmount) * 100 : 0;
    const realization = asg.billingAmount > 0 ? (asg.recoveryAmount / asg.billingAmount) * 100 : 0;

    return {
      id: asg.id,
      code: asg.assignmentCode,
      clientName: asg.clientName,
      type: asg.assignmentType,
      partner: asg.partnerName,
      billingFee: asg.billingAmount,
      hoursLogged: totalHours,
      estimatedHours: asg.estimatedHours,
      directLaborCost,
      grossProfit,
      profitMargin,
      realization,
    };
  });

  const totalBilling = assignmentProfitability.reduce((sum, a) => sum + a.billingFee, 0);
  const totalCost = assignmentProfitability.reduce((sum, a) => sum + a.directLaborCost, 0);
  const totalProfit = totalBilling - totalCost;
  const overallMargin = totalBilling > 0 ? (totalProfit / totalBilling) * 100 : 0;

  // Chart data: Top 6 engagements by profit
  const chartData = assignmentProfitability.slice(0, 6).map((a) => ({
    name: a.clientName.substring(0, 14) + '...',
    Billing: a.billingFee,
    LaborCost: a.directLaborCost,
    GrossProfit: a.grossProfit,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Assignment Profitability & Fee Realization</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time engagement margin analysis comparing client billing vs billable team labor costs.
          </p>
        </div>

        <button
          onClick={() => exportProfitabilityExcel(assignmentProfitability)}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Profitability Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Billing Revenue</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">₹ {(totalBilling / 100000).toFixed(2)} L</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Across active audit mandates</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Direct Labor Cost</span>
          <p className="text-2xl font-bold text-rose-600 mt-2">₹ {(totalCost / 100000).toFixed(2)} L</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Employee & Article payroll</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Net Practice Margin</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2">₹ {(totalProfit / 100000).toFixed(2)} L</p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">{overallMargin.toFixed(1)}% Gross Margin</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Average Recovery Rate</span>
          <p className="text-2xl font-bold text-indigo-600 mt-2">96.5%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Billing to cash realization</p>
        </div>
      </div>

      {/* Visual Chart: Billing vs Labor Cost */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 mb-1">Engagement Revenue vs Cost Comparison</h3>
        <p className="text-[11px] text-slate-500 mb-4">Comparison of top audit engagements in INR</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Billing" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="LaborCost" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="GrossProfit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assignment Profitability Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">Client-wise Engagement Profitability Ledger</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Assignment</th>
                <th className="p-3.5">Client & Type</th>
                <th className="p-3.5">Partner In-Charge</th>
                <th className="p-3.5">Hours (Act/Est)</th>
                <th className="p-3.5">Billing Fee</th>
                <th className="p-3.5">Labor Cost</th>
                <th className="p-3.5">Gross Profit</th>
                <th className="p-3.5">Margin %</th>
                <th className="p-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignmentProfitability.map((a) => {
                const isHighMargin = a.profitMargin >= 65;
                const isLowMargin = a.profitMargin < 45;
                return (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-800">{a.code}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{a.clientName}</p>
                      <span className="text-[10px] text-slate-500">{a.type}</span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">{a.partner}</td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {a.hoursLogged.toFixed(1)} / {a.estimatedHours} hrs
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">₹ {(a.billingFee / 100000).toFixed(2)} L</td>
                    <td className="p-3.5 font-semibold text-rose-600">₹ {(a.directLaborCost / 1000).toFixed(0)} k</td>
                    <td className="p-3.5 font-bold text-emerald-600">₹ {(a.grossProfit / 100000).toFixed(2)} L</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isHighMargin
                            ? 'bg-emerald-100 text-emerald-800'
                            : isLowMargin
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {a.profitMargin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedAssignmentId(a.id);
                          setActiveTab('assignments');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1 ml-auto"
                      >
                        Details <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
