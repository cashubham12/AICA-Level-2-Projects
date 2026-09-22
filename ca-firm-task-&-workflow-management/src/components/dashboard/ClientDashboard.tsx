import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import {
  Building2,
  FileText,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Download,
  FolderOpen,
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const {
    currentUser,
    assignments,
    documents,
    complianceItems,
    addDocument,
    setActiveTab,
  } = useCA();

  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('FY 2024-25 Audit');

  // Client assignments
  const clientAssignments = assignments.filter(
    (a) => a.clientName.includes('Bharat Power') || a.clientId === 'client-1'
  );

  const clientDocs = documents.filter(
    (d) => d.clientName.includes('Bharat Power') || d.clientId === 'client-1'
  );

  const clientCompliance = complianceItems.filter(
    (c) => c.clientName.includes('Bharat Power') || c.clientId === 'client-1'
  );

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;

    addDocument({
      clientName: 'Bharat Power Enterprises Ltd.',
      clientId: 'client-1',
      assignmentId: clientAssignments[0]?.id || 'asg-1',
      assignmentName: clientAssignments[0]?.description || 'Statutory Audit FY 2024-25',
      folderCategory: selectedFolder,
      fileName: uploadedFile,
      fileSize: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      fileType: uploadedFile.endsWith('.pdf') ? 'pdf' : 'xlsx',
      uploadedBy: `${currentUser.name} (Client CFO)`,
      status: 'Pending Verification',
      tags: ['Client Uploaded', selectedFolder],
      notes: 'Direct client portal upload response to auditor requisition.',
    });

    setUploadedFile('');
  };

  return (
    <div className="space-y-6">
      {/* Client Portal Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-800/40 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-500/30">
            Client Corporate Gateway & Audit Collaboration
          </span>
          <h2 className="text-2xl font-bold mt-1 text-slate-100">Bharat Power Enterprises Ltd.</h2>
          <p className="text-xs text-purple-200 mt-1">
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.designation}) | Partner In-Charge: <strong>CA Rajeshwar Singhania</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-purple-300 font-mono bg-purple-950 px-3 py-1.5 rounded-lg border border-purple-800">
            CIN: L40100MH2012PLC238910
          </span>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Audit Engagements</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{clientAssignments.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Statutory Audit & ASM active</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Documents Repository</span>
            <FolderOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">{clientDocs.length} Files</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Working papers & vouchers</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Compliance Filings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {clientCompliance.filter((c) => c.status === 'Filed').length} Filed
          </p>
          <p className="text-[11px] text-emerald-700 mt-0.5">GSTR-3B filed on time</p>
        </div>
      </div>

      {/* Grid: Active Audits and Upload Document */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Audit Progress (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Engagement Progress & Audit Milestones
          </h3>

          <div className="space-y-4">
            {clientAssignments.map((a) => (
              <div key={a.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                      {a.assignmentCode}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{a.assignmentType} - {a.financialYear}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{a.progressPercentage}% Complete</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${a.progressPercentage}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Partner: <strong className="text-slate-700">{a.partnerName}</strong></span>
                  <span>Target Sign-off: <strong className="text-slate-700">{a.dueDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Requisition Document Widget (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-3">
              <Upload className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-900">Upload Audit Requisitions</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Upload requested bank statements, fixed asset schedules, or tax ledgers for audit verification.
            </p>

            <form onSubmit={handleSimulatedUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Folder</label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="FY 2024-25 Audit">FY 2024-25 Statutory Audit</option>
                  <option value="Bank Statements & SWIFT">Bank Statements & SWIFT Confirmations</option>
                  <option value="GST Reconciliations">GST Reconciliations (GSTR-2B)</option>
                  <option value="Board Minutes & Agreements">Board Minutes & Agreements</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">File Name / Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Standard_Chartered_Escrow_Statement_July2025.pdf"
                  value={uploadedFile}
                  onChange={(e) => setUploadedFile(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="p-3 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-[11px] text-slate-600 font-medium">Drag and drop file or type above</p>
                <p className="text-[10px] text-slate-400">Supports PDF, XLSX, DOCX up to 50MB</p>
              </div>

              <button
                type="submit"
                disabled={!uploadedFile}
                className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-xs transition shadow-sm mt-2"
              >
                Transmit to Audit Team
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
