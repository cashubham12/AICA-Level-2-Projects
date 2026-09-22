import React from 'react';
import { useCA } from '../../context/CAContext';
import {
  FileSpreadsheet,
  Download,
  Upload,
  BarChart2,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  exportAssignmentsExcel,
  exportComplianceExcel,
  exportTimesheetsExcel,
  exportProfitabilityExcel,
  downloadImportTemplate,
} from '../../lib/excelHelper';

interface ReportsCenterProps {
  onOpenAI: (mode?: string, context?: any) => void;
}

export const ReportsCenter: React.FC<ReportsCenterProps> = ({ onOpenAI }) => {
  const { assignments, complianceItems, timesheets } = useCA();

  // Profitability data
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

  const reports = [
    {
      title: 'Master Assignments Register',
      description: 'Comprehensive export of all active, completed, and delayed audit engagements with partner allocation and fee structure.',
      icon: Briefcase,
      count: `${assignments.length} Records`,
      action: () => exportAssignmentsExcel(assignments),
      btnText: 'Download XLSX',
    },
    {
      title: 'Statutory Compliance Calendar',
      description: 'Tax and corporate compliance deadlines (GST, TDS, MCA, Income Tax) with ARN acknowledgments and penalty risks.',
      icon: Calendar,
      count: `${complianceItems.length} Forms`,
      action: () => exportComplianceExcel(complianceItems),
      btnText: 'Download Calendar XLSX',
    },
    {
      title: 'Audit Timesheet & Labor Register',
      description: 'Detailed activity logs, billable vs non-billable hours, hourly rates, and manager approval timestamps.',
      icon: Clock,
      count: `${timesheets.length} Logged Entries`,
      action: () => exportTimesheetsExcel(timesheets),
      btnText: 'Download Timesheets XLSX',
    },
    {
      title: 'Engagement Profitability & Realization',
      description: 'Client-wise gross margin matrix calculating fee billing minus direct employee labor costs and realization %.',
      icon: DollarSign,
      count: `${assignmentProfitability.length} Portfolios`,
      action: () => exportProfitabilityExcel(assignmentProfitability),
      btnText: 'Download Profitability XLSX',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Audit Data & Compliance Exports
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-1 text-slate-100">Reporting & Excel Analytics Center</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Generate standardized Excel spreadsheets for Peer Review, Audit Committee presentations, Tax filings, and Partner Billing summaries.
          </p>
        </div>

        <button
          onClick={() => downloadImportTemplate()}
          className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
        >
          <Upload className="w-4 h-4" />
          <span>Download Client Import Template</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {report.count}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">{report.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{report.description}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Format: .xlsx (Excel)</span>
                <button
                  onClick={report.action}
                  className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{report.btnText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
