export type UserRole = 'partner' | 'manager' | 'executive' | 'client';

export interface FirmProfile {
  id: string;
  firmName: string;
  shortName: string;
  tagline: string;
  firmRegistrationNumber: string; // ICAI FRN e.g. "104522W"
  constitution: 'Partnership Firm' | 'LLP' | 'Proprietorship' | 'Individual Practice';
  yearOfEstablishment: number;
  peerReviewCertNo: string;
  peerReviewValidity: string;
  pan: string;
  gstin: string;
  tan?: string;
  email: string;
  phone: string;
  website: string;
  headOfficeAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  branchOffices: string[];
  qualityControlPartner: string;
  defaultFinancialYear: string;
  defaultAssessmentYear: string;
  currencySymbol: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  avatarUrl: string;
  phone: string;
  membershipNo?: string;
  hourlyCostRate: number; // For assignment profitability calculation
  hourlyBillingRate: number;
  assignedClientsCount: number;
  activeTasksCount: number;
}

export type AssignmentType =
  | 'Statutory Audit'
  | 'Tax Audit'
  | 'GST Audit'
  | 'Internal Audit'
  | 'Bank Audit'
  | 'Stock Audit'
  | 'Concurrent Audit'
  | 'ASM'
  | 'Valuation'
  | 'IBC'
  | 'Liquidation'
  | 'Forensic Audit'
  | 'Compliance'
  | 'Virtual CFO';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type AssignmentStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Under Review'
  | 'Partner Approval'
  | 'Completed'
  | 'Delayed';

export interface Assignment {
  id: string;
  assignmentCode: string;
  clientName: string;
  clientCode: string;
  clientId: string;
  industry: string;
  assignmentType: AssignmentType;
  partnerResponsibleId: string;
  partnerName: string;
  managerResponsibleId: string;
  managerName: string;
  teamMembers: string[];
  startDate: string;
  dueDate: string;
  priority: PriorityLevel;
  estimatedHours: number;
  actualHours: number;
  billingAmount: number;
  recoveryAmount?: number;
  status: AssignmentStatus;
  progressPercentage: number;
  financialYear: string;
  description: string;
  udinNumber?: string;
  tags?: string[];
}

export type TaskStatus =
  | 'Not Started'
  | 'To Do'
  | 'In Progress'
  | 'Waiting for Client Data'
  | 'Submitted for Review'
  | 'Under Review'
  | 'Under Partner Review'
  | 'Correction Required'
  | 'Completed'
  | 'Closed';

export type WorkflowStage =
  | 'Preparation'
  | 'Fieldwork (Executive)'
  | 'Senior Review'
  | 'Manager Review'
  | 'Partner Approval'
  | 'Final Sign-off'
  | 'Completed';

export type TaskCategory =
  | 'Planning & Materiality'
  | 'Internal Controls (IFCoFR)'
  | 'Fixed Assets & Depreciation'
  | 'Trade Receivables & Bad Debts'
  | 'Inventory & Physical Verification'
  | 'Statutory Dues (TDS, GST, PF)'
  | 'CARO 2020 Compliance'
  | 'Section 43B(h) MSME'
  | 'Bank Reconciliation & SWIFT'
  | 'Tax Audit Schedules (3CD)'
  | 'General Vouching & Scrutiny'
  | 'Audit Vouching'
  | 'IFCoFR Testing'
  | 'Tax 3CD Verification'
  | 'GST Reconciliation'
  | 'Bank Audit Fieldwork'
  | 'Stock Count'
  | 'IBC Claim Verification'
  | 'Valuation Modeling'
  | 'CARO 2020 Reporting'
  | 'Partner Sign-off'
  | 'Compliance Filing';

export interface ReviewComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  stage: WorkflowStage;
  comment: string;
  timestamp: string;
  status: 'Open' | 'Resolved' | 'Action Required';
  resolutionNotes?: string;
}

export interface DocumentAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl?: string;
}

export interface Task {
  id: string;
  taskCode: string;
  assignmentId: string;
  assignmentName: string;
  clientName: string;
  clientId: string;
  taskDescription: string;
  category: string;
  assignedPersonId: string;
  assignedPersonName: string;
  reviewerId: string;
  reviewerName: string;
  priority: PriorityLevel;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  status: TaskStatus;
  workflowStage: WorkflowStage;
  remarks: string;
  reviewComments: ReviewComment[];
  attachments: DocumentAttachment[];
  completedAt?: string;
}

export interface Client {
  id: string;
  clientCode: string;
  name: string;
  tradeName?: string;
  industry: string;
  pan: string;
  gstin: string;
  cin?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  partnerInCharge: string;
  managerInCharge: string;
  status: 'Active' | 'On Hold' | 'Archived';
  annualTurnover?: string;
  activeAssignmentsCount: number;
}

export type ComplianceCategory =
  | 'GST'
  | 'Income Tax'
  | 'MCA / Companies Act'
  | 'IBC / NCLT'
  | 'RBI / Banking'
  | 'Labour Law / PF-ESIC';

export type ComplianceStatus =
  | 'Pending'
  | 'In Progress'
  | 'Filed'
  | 'Overdue'
  | 'Exempted';

export interface ComplianceItem {
  id: string;
  clientName: string;
  clientId: string;
  category: ComplianceCategory;
  complianceName: string;
  formNumber: string;
  period: string;
  dueDate: string;
  extendedDueDate?: string;
  status: ComplianceStatus;
  acknowledgmentNumber?: string;
  assignedTo: string;
  partnerInCharge: string;
  penaltyRiskAmount: number;
  escalationLevel: 0 | 1 | 2 | 3; // 0 = Normal, 1 = Executive, 2 = Manager, 3 = Partner
  lastReminderSent?: string;
  remarks?: string;
}

export interface DocumentItem {
  id: string;
  clientName: string;
  clientId: string;
  assignmentId: string;
  assignmentName: string;
  folderCategory: string; // e.g., 'FY 2024-25 Audit', 'GST Invoices', 'Tax Returns', 'Legal Agreements'
  fileName: string;
  fileSize: string;
  fileType: string;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'Pending Verification' | 'Verified' | 'Requires Clarification' | 'Rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  tags: string[];
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: UserRole;
  date: string;
  clientId: string;
  clientName: string;
  assignmentId: string;
  assignmentName: string;
  taskId?: string;
  taskName?: string;
  hours: number;
  billable: boolean;
  hourlyCostRate: number;
  billingRate: number;
  activityDescription: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export interface CommunicationLog {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  assignmentId?: string;
  communicationType?: 'Email' | 'Phone Call' | 'Physical Meeting' | 'Video Conference' | 'Written Memo';
  channel?: 'Physical Meeting' | 'Video Conference' | 'Phone Call' | 'Email / Memo' | 'Audit Requisition Letter';
  discussionSummary?: string;
  summary?: string;
  attendees?: string;
  participants?: string[];
  pendingAction?: string;
  actionItems?: string[];
  responsiblePerson?: string;
  loggedBy?: string;
  dueDate?: string;
  status?: 'Open' | 'In Progress' | 'Resolved';
  priority?: PriorityLevel;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'approval' | 'deadline' | 'system' | 'mention';
  linkTarget?: string;
  priority: PriorityLevel;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}
