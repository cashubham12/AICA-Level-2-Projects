import React, { useState } from 'react';
import {
  BookOpen,
  Database,
  Server,
  Terminal,
  ShieldCheck,
  Code,
  CheckCircle2,
  FileCode,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SystemDocumentationModal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'schema' | 'api' | 'sop' | 'deploy' | 'roadmap'>('schema');

  const sqlDDL = `-- =========================================================================
-- APEX & ASSOCIATES | ENTERPRISE CA FIRM WORKFLOW MANAGEMENT SCHEMA
-- Target Database: PostgreSQL 15+ / Supabase / Cloud SQL
-- =========================================================================

-- 1. USERS & ACCESS CONTROL (PARTNER, MANAGER, EXECUTIVE, CLIENT)
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('partner', 'manager', 'executive', 'client')),
    designation VARCHAR(128) NOT NULL,
    membership_no VARCHAR(64),
    department VARCHAR(128),
    hourly_cost_rate NUMERIC(10, 2) DEFAULT 0.00,
    hourly_billing_rate NUMERIC(10, 2) DEFAULT 0.00,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CLIENT MASTER
CREATE TABLE clients (
    id VARCHAR(64) PRIMARY KEY,
    client_code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    pan VARCHAR(10) NOT NULL,
    gstin VARCHAR(15),
    cin VARCHAR(21),
    industry VARCHAR(128) NOT NULL,
    partner_in_charge_id VARCHAR(64) REFERENCES users(id),
    primary_contact_person VARCHAR(128),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ASSIGNMENT / ENGAGEMENT MASTER
CREATE TABLE assignments (
    id VARCHAR(64) PRIMARY KEY,
    assignment_code VARCHAR(64) UNIQUE NOT NULL,
    client_id VARCHAR(64) REFERENCES clients(id) ON DELETE CASCADE,
    assignment_type VARCHAR(64) NOT NULL,
    partner_responsible_id VARCHAR(64) REFERENCES users(id),
    manager_responsible_id VARCHAR(64) REFERENCES users(id),
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    priority VARCHAR(32) CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    estimated_hours INT DEFAULT 0,
    actual_hours NUMERIC(10, 2) DEFAULT 0.00,
    billing_amount NUMERIC(12, 2) NOT NULL,
    recovery_amount NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(32) NOT NULL,
    progress_percentage INT DEFAULT 0,
    financial_year VARCHAR(32) NOT NULL,
    udin_number VARCHAR(64),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ASSIGNMENT TEAM ALLOCATION (MANY-TO-MANY)
CREATE TABLE assignment_team_members (
    assignment_id VARCHAR(64) REFERENCES assignments(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    allocated_role VARCHAR(64),
    PRIMARY KEY (assignment_id, user_id)
);

-- 5. TASKS / WORKING PAPERS DELIVERABLES
CREATE TABLE tasks (
    id VARCHAR(64) PRIMARY KEY,
    task_code VARCHAR(64) UNIQUE NOT NULL,
    assignment_id VARCHAR(64) REFERENCES assignments(id) ON DELETE CASCADE,
    task_description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    assigned_person_id VARCHAR(64) REFERENCES users(id),
    reviewer_id VARCHAR(64) REFERENCES users(id),
    start_date DATE,
    due_date DATE NOT NULL,
    priority VARCHAR(32) CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    status VARCHAR(32) NOT NULL,
    workflow_stage VARCHAR(64) NOT NULL,
    estimated_hours INT DEFAULT 0,
    actual_hours NUMERIC(10, 2) DEFAULT 0.00,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MULTI-TIER REVIEW COMMENTS & AUDIT TRAIL
CREATE TABLE review_comments (
    id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) REFERENCES tasks(id) ON DELETE CASCADE,
    author_id VARCHAR(64) REFERENCES users(id),
    stage VARCHAR(64) NOT NULL,
    comment TEXT NOT NULL,
    status VARCHAR(32) CHECK (status IN ('Open', 'Resolved', 'Action Required')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. STATUTORY COMPLIANCE CALENDAR
CREATE TABLE compliance_calendar (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) REFERENCES clients(id) ON DELETE CASCADE,
    compliance_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    statutory_act VARCHAR(128) NOT NULL,
    form_number VARCHAR(64) NOT NULL,
    period VARCHAR(64) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(32) CHECK (status IN ('Pending', 'Filed', 'Overdue', 'Exempt')),
    acknowledgment_number VARCHAR(128),
    responsible_person_id VARCHAR(64) REFERENCES users(id),
    escalation_level INT DEFAULT 0,
    penalty_risk_amount NUMERIC(12, 2) DEFAULT 0.00,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. AUDIT WORKING PAPER DOCUMENTS REPOSITORY
CREATE TABLE documents (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) REFERENCES clients(id) ON DELETE CASCADE,
    assignment_id VARCHAR(64) REFERENCES assignments(id),
    folder_category VARCHAR(128) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(32),
    file_type VARCHAR(32),
    version VARCHAR(32) DEFAULT 'v1.0',
    uploaded_by VARCHAR(128),
    status VARCHAR(64) CHECK (status IN ('Pending Verification', 'Verified', 'Rejected')),
    verified_by VARCHAR(128),
    verified_at DATE,
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. EMPLOYEE TIMESHEETS & UTILIZATION
CREATE TABLE timesheets (
    id VARCHAR(64) PRIMARY KEY,
    employee_id VARCHAR(64) REFERENCES users(id),
    date DATE NOT NULL,
    assignment_id VARCHAR(64) REFERENCES assignments(id),
    task_id VARCHAR(64) REFERENCES tasks(id),
    hours NUMERIC(4, 2) NOT NULL,
    billable BOOLEAN DEFAULT TRUE,
    hourly_cost_rate NUMERIC(10, 2) NOT NULL,
    billing_rate NUMERIC(10, 2) NOT NULL,
    activity_description TEXT NOT NULL,
    status VARCHAR(32) CHECK (status IN ('Submitted', 'Approved', 'Rejected')),
    approved_by VARCHAR(128),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. CLIENT INTERACTIONS & CRM LOGS
CREATE TABLE communication_logs (
    id VARCHAR(64) PRIMARY KEY,
    client_id VARCHAR(64) REFERENCES clients(id) ON DELETE CASCADE,
    assignment_id VARCHAR(64) REFERENCES assignments(id),
    date DATE NOT NULL,
    channel VARCHAR(64) NOT NULL,
    participants TEXT[],
    summary TEXT NOT NULL,
    action_items TEXT[],
    logged_by VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. IMMUTABLE AUDIT LOG & COMPLIANCE LOGS
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    action VARCHAR(64) NOT NULL,
    module VARCHAR(64) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. PERFORMANCE INDEXES
CREATE INDEX idx_assignments_client ON assignments(client_id);
CREATE INDEX idx_tasks_assignment ON tasks(assignment_id);
CREATE INDEX idx_compliance_due_date ON compliance_calendar(due_date);
CREATE INDEX idx_timesheets_employee ON timesheets(employee_id);
CREATE INDEX idx_documents_assignment ON documents(assignment_id);
`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              System Architecture & Developer Reference
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-1 text-slate-100">CA Firm Enterprise Platform Documentation</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Full technical specifications including PostgreSQL relational schema, REST endpoints, ICAI SQC 1 compliance workflows, and Cloud Run deployment guide.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSection('schema')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeSection === 'schema'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>1. SQL Database Schema (12 Tables)</span>
        </button>

        <button
          onClick={() => setActiveSection('api')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeSection === 'api'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>2. REST API Documentation</span>
        </button>

        <button
          onClick={() => setActiveSection('sop')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeSection === 'sop'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>3. CA Firm SOP & User Manual</span>
        </button>

        <button
          onClick={() => setActiveSection('deploy')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeSection === 'deploy'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>4. Cloud Deployment Guide</span>
        </button>

        <button
          onClick={() => setActiveSection('roadmap')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeSection === 'roadmap'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>5. Future AI Roadmap</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs leading-relaxed space-y-4">
        {activeSection === 'schema' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">PostgreSQL Relational Schema DDL</h3>
              <p className="text-slate-500 mt-0.5">
                Complete normalization with 12 core tables covering Clients, Engagements, 4-Tier Tasks, Compliance, Documents, Timesheets, and Immutable Audit Trails.
              </p>
            </div>
            <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-[600px] border border-slate-800">
              <code>{sqlDDL}</code>
            </pre>
          </div>
        )}

        {activeSection === 'api' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">REST API Endpoints Specification</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">POST</span>
                  <span className="font-mono font-bold text-slate-900">/api/ai/task-summary</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Generates an executive briefing for partners analyzing working paper bottlenecks and referencing ICAI Standards on Auditing (SA 230 / SA 500).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">POST</span>
                  <span className="font-mono font-bold text-slate-900">/api/ai/email-draft</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Drafts formal auditor requisition emails and client follow-up memos requesting pending tax schedules and bank statements.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">POST</span>
                  <span className="font-mono font-bold text-slate-900">/api/ai/risk-detection</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Synthesizes delayed assignments and pending statutory compliance items to provide an early warning risk score.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">POST</span>
                  <span className="font-mono font-bold text-slate-900">/api/ai/sop-generator</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Generates structured standard operating procedures (SOP) and vouching checklists for Article Assistants.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'sop' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">CA Firm Operational Workflow SOP</h3>
            <div className="space-y-2.5 text-slate-700">
              <p>
                <strong>1. Engagement Onboarding:</strong> Partner initializes the assignment with client details, agreed billing amount, SLA due date, and assigns the Audit Manager.
              </p>
              <p>
                <strong>2. 4-Tier Review Hierarchy:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li><strong>Tier 1 (Executive / Article):</strong> Performs substantive vouching, uploads working paper schedules, and marks task as "Submitted for Review".</li>
                <li><strong>Tier 2 (Senior Associate):</strong> Cross-verifies trial balance cross-referencing, TDS deductions, and CARO requirements.</li>
                <li><strong>Tier 3 (Audit Manager):</strong> Validates accounting standards (Ind AS / AS) compliance and internal financial controls (IFCoFR).</li>
                <li><strong>Tier 4 (Signing Partner):</strong> Evaluates audit evidence sufficiency, conducts final quality review, generates ICAI UDIN, and issues the signed report.</li>
              </ul>
              <p>
                <strong>3. Automated Statutory Compliance:</strong> Continuous tracking of GST returns, Advance Tax, TDS, and MCA filings with automated partner escalation if an item remains unfiled 7 days prior to deadline.
              </p>
            </div>
          </div>
        )}

        {activeSection === 'deploy' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">Cloud Run & Production Deployment</h3>
            <div className="space-y-2 text-slate-700">
              <p><strong>Environment Variables:</strong></p>
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px]">
GEMINI_API_KEY="your-google-ai-studio-gemini-key"
PORT=3000
NODE_ENV=production
              </pre>
              <p><strong>Build & Start Command:</strong></p>
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px]">
npm run build
npm start
              </pre>
            </div>
          </div>
        )}

        {activeSection === 'roadmap' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">Future AI Roadmap & Automated Extensibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">1. Automated Bank OCR & Tally Integration</h4>
                <p className="text-slate-600 mt-1">Direct XML sync with Tally Prime / SAP and OCR parsing of bank statements for automated reconciliation.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">2. Real-Time GST Portal Auto-Pull (GSP API)</h4>
                <p className="text-slate-600 mt-1">Automated fetching of GSTR-2B vs Books reconciliation with automated notice generation to defaulting vendors.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">3. WhatsApp Business Bot for Client Document Reminders</h4>
                <p className="text-slate-600 mt-1">Automated WhatsApp notifications to client CFOs with secure one-time upload links for requested audit vouchers.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">4. Automated CARO 2020 & 3CD Clause Generator</h4>
                <p className="text-slate-600 mt-1">AI-powered drafting of CARO clause remarks and Form 3CD tax audit disallowance schedules based on verified ledgers.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
