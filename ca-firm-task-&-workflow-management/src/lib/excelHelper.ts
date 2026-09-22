import * as XLSX from 'xlsx';
import { Assignment, Task, TimesheetEntry, ComplianceItem, Client } from '../types';

export function exportToExcel(data: any[], fileName: string, sheetName: string = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportAssignmentsExcel(assignments: Assignment[]) {
  const exportData = assignments.map((a) => ({
    'Assignment Code': a.assignmentCode,
    'Client Name': a.clientName,
    'Client Code': a.clientCode,
    'Industry': a.industry,
    'Assignment Type': a.assignmentType,
    'Partner In-Charge': a.partnerName,
    'Manager In-Charge': a.managerName,
    'Team Members': a.teamMembers.join(', '),
    'Financial Year': a.financialYear,
    'Start Date': a.startDate,
    'Due Date': a.dueDate,
    'Priority': a.priority,
    'Status': a.status,
    'Progress (%)': `${a.progressPercentage}%`,
    'Estimated Hours': a.estimatedHours,
    'Actual Hours': a.actualHours,
    'Billing Fee (INR)': a.billingAmount,
    'UDIN Number': a.udinNumber || 'N/A',
  }));

  exportToExcel(exportData, 'CA_Firm_Assignments_Master', 'Assignments');
}

export function exportTasksExcel(tasks: Task[]) {
  const exportData = tasks.map((t) => ({
    'Task Code': t.taskCode,
    'Assignment': t.assignmentName,
    'Client': t.clientName,
    'Task Description': t.taskDescription,
    'Category': t.category,
    'Assigned To': t.assignedPersonName,
    'Reviewer': t.reviewerName,
    'Priority': t.priority,
    'Status': t.status,
    'Workflow Stage': t.workflowStage,
    'Start Date': t.startDate,
    'Due Date': t.dueDate,
    'Est Hours': t.estimatedHours,
    'Actual Hours': t.actualHours,
    'Remarks': t.remarks || '',
    'Comments Count': t.reviewComments.length,
  }));

  exportToExcel(exportData, 'CA_Firm_Tasks_Audit_Log', 'Audit_Tasks');
}

export function exportTimesheetExcel(timesheets: TimesheetEntry[]) {
  const exportData = timesheets.map((ts) => ({
    'Timesheet ID': ts.id,
    'Date': ts.date,
    'Employee Name': ts.employeeName,
    'Role': ts.employeeRole,
    'Client Name': ts.clientName,
    'Assignment': ts.assignmentName,
    'Task / Module': ts.taskName || 'General Audit & Review',
    'Hours Logged': ts.hours,
    'Billable': ts.billable ? 'Yes' : 'No',
    'Cost Rate (INR/hr)': ts.hourlyCostRate,
    'Total Cost (INR)': ts.hours * ts.hourlyCostRate,
    'Billing Rate (INR/hr)': ts.billingRate,
    'Billable Value (INR)': ts.hours * ts.billingRate,
    'Activity Description': ts.activityDescription,
    'Approval Status': ts.status,
    'Approved By': ts.approvedBy || 'Pending',
  }));

  exportToExcel(exportData, 'CA_Firm_Timesheets_Productivity', 'Timesheets');
}

export function exportComplianceExcel(compliance: ComplianceItem[]) {
  const exportData = compliance.map((c) => ({
    'Client Name': c.clientName,
    'Category': c.category,
    'Compliance Form': c.formNumber,
    'Title': c.complianceName,
    'Period': c.period,
    'Due Date': c.dueDate,
    'Status': c.status,
    'Ack Number': c.acknowledgmentNumber || 'N/A',
    'Assigned Executive': c.assignedTo,
    'Partner In-Charge': c.partnerInCharge,
    'Penalty Risk Exposure': c.penaltyRiskAmount,
    'Escalation Level': c.escalationLevel === 3 ? 'Partner Level' : c.escalationLevel === 2 ? 'Manager Level' : c.escalationLevel === 1 ? 'Executive Level' : 'Normal',
    'Remarks': c.remarks || '',
  }));

  exportToExcel(exportData, 'CA_Firm_Compliance_Calendar', 'Compliance');
}

export const exportTimesheetsExcel = exportTimesheetExcel;

export function exportProfitabilityExcel(profitabilityData: any[]) {
  const exportData = profitabilityData.map((p) => ({
    'Assignment Code': p.code,
    'Client Name': p.clientName,
    'Assignment Type': p.type,
    'Partner In-Charge': p.partner,
    'Billing Fee (INR)': p.billingFee,
    'Actual Hours Logged': p.hoursLogged,
    'Estimated Hours': p.estimatedHours,
    'Direct Labor Cost (INR)': p.directLaborCost,
    'Gross Profit (INR)': p.grossProfit,
    'Gross Margin (%)': `${p.profitMargin.toFixed(1)}%`,
    'Realization Rate (%)': `${p.realization.toFixed(1)}%`,
  }));

  exportToExcel(exportData, 'CA_Firm_Engagement_Profitability', 'Profitability');
}

export function downloadImportTemplate(type: 'assignments' | 'tasks' | 'timesheet' = 'assignments') {
  if (type === 'assignments') {
    const template = [
      {
        'Client Name': 'Acme Manufacturing Ltd',
        'Client Code': 'ACM-101',
        'Industry': 'Automotive & Heavy Engg',
        'Assignment Type': 'Statutory Audit',
        'Partner Name': 'CA Rajeshwar Singhania',
        'Manager Name': 'CA Priya Mehta',
        'Start Date': '2025-08-01',
        'Due Date': '2025-09-30',
        'Priority': 'Critical',
        'Estimated Hours': 200,
        'Billing Amount': 600000,
        'Financial Year': 'FY 2024-25',
        'Description': 'Yearly Statutory Audit under Companies Act 2013 and CARO 2020.',
      },
    ];
    exportToExcel(template, 'Template_Assignments_Bulk_Import', 'AssignmentsTemplate');
  } else if (type === 'tasks') {
    const template = [
      {
        'Assignment Name': 'Statutory Audit FY 2024-25',
        'Client Name': 'Acme Manufacturing Ltd',
        'Task Description': 'Vouching of Fixed Asset Register and physical verification tagging',
        'Category': 'Fixed Assets & Depreciation',
        'Assigned Person': 'Rohan Verma',
        'Reviewer': 'CA Priya Mehta',
        'Priority': 'High',
        'Start Date': '2025-08-15',
        'Due Date': '2025-08-30',
        'Estimated Hours': 25,
      },
    ];
    exportToExcel(template, 'Template_Tasks_Bulk_Import', 'TasksTemplate');
  } else {
    const template = [
      {
        'Date': '2025-08-22',
        'Client Name': 'Acme Manufacturing Ltd',
        'Assignment Name': 'Statutory Audit FY 2024-25',
        'Hours': 8,
        'Activity Description': 'Ledger scrutiny of Trade Payables and verification of MSME status',
        'Billable': 'Yes',
      },
    ];
    exportToExcel(template, 'Template_Timesheet_Bulk_Import', 'TimesheetTemplate');
  }
}
