import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { DocumentItem } from '../../types';
import {
  FolderLock,
  Search,
  Filter,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  FolderOpen,
  Eye,
  Trash2,
  FileSpreadsheet,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export const DocumentRepository: React.FC = () => {
  const {
    documents,
    clients,
    assignments,
    addDocument,
    updateDocumentStatus,
    currentUser,
  } = useCA();

  const [search, setSearch] = useState<string>('');
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('ALL');
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Upload Form State
  const [uploadClient, setUploadClient] = useState<string>(clients[0]?.id || '');
  const [uploadFolder, setUploadFolder] = useState<string>('FY 2024-25 Audit');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadTags, setUploadTags] = useState<string>('Audit Evidence, Working Paper');
  const [uploadNotes, setUploadNotes] = useState<string>('');

  const folders = [
    'ALL',
    'FY 2024-25 Audit',
    'Bank Statements & SWIFT',
    'Tax 3CD Schedules',
    'GST Reconciliations',
    'Board Minutes & Agreements',
    'Valuation Working Model',
    'IBC Claim Vouchers',
  ];

  const filteredDocs = documents.filter((d) => {
    const matchSearch =
      d.fileName.toLowerCase().includes(search.toLowerCase()) ||
      d.clientName.toLowerCase().includes(search.toLowerCase()) ||
      d.folderCategory.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchClient = selectedClientFilter === 'ALL' || d.clientId === selectedClientFilter || d.clientName.includes(selectedClientFilter);
    const matchFolder = selectedFolderFilter === 'ALL' || d.folderCategory === selectedFolderFilter;

    return matchSearch && matchClient && matchFolder;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName) return;
    const cl = clients.find((c) => c.id === uploadClient) || clients[0];
    const asg = assignments.find((a) => a.clientId === cl.id) || assignments[0];

    addDocument({
      clientName: cl.name,
      clientId: cl.id,
      assignmentId: asg?.id || 'asg-1',
      assignmentName: asg?.description || 'Statutory Audit',
      folderCategory: uploadFolder,
      fileName: uploadFileName,
      fileSize: `${(Math.random() * 6 + 1.2).toFixed(1)} MB`,
      fileType: uploadFileName.endsWith('.xlsx') || uploadFileName.endsWith('.xls') ? 'xlsx' : 'pdf',
      uploadedBy: currentUser.name,
      status: 'Pending Verification',
      tags: uploadTags.split(',').map((t) => t.trim()),
      notes: uploadNotes,
    });

    setIsUploadModalOpen(false);
    setUploadFileName('');
    setUploadNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <FolderLock className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900">Audit Working Paper & Evidence Repository</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized SA 230 working paper archive with role-based document verification, versioning, and client upload portal.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Working Paper</span>
        </button>
      </div>

      {/* Folder Categories Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {folders.map((folder) => {
          const isSelected = selectedFolderFilter === folder;
          const count = folder === 'ALL' ? documents.length : documents.filter((d) => d.folderCategory === folder).length;
          return (
            <button
              key={folder}
              onClick={() => setSelectedFolderFilter(folder)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <FolderOpen className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-[10px] font-mono font-bold opacity-70">{count}</span>
              </div>
              <p className="text-xs font-semibold mt-2 truncate w-full">{folder === 'ALL' ? 'All Folders' : folder}</p>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by file name, client entity, tags, uploaded by..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="w-full md:w-60">
          <select
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-xs"
          >
            <option value="ALL">All Client Entities</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">File Name & Type</th>
                <th className="p-3.5">Client & Assignment</th>
                <th className="p-3.5">Folder Category</th>
                <th className="p-3.5">Version & Size</th>
                <th className="p-3.5">Uploaded By / Date</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => {
                const isVerified = doc.status === 'Verified';
                return (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2">
                        {doc.fileType === 'pdf' ? (
                          <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                        ) : (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{doc.fileName}</p>
                          <div className="flex items-center space-x-1 mt-0.5">
                            {doc.tags.map((tag, idx) => (
                              <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800">{doc.clientName}</p>
                      <span className="text-[10px] text-slate-400">{doc.assignmentName}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                        {doc.folderCategory}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {doc.version} ({doc.fileSize})
                    </td>
                    <td className="p-3.5 text-slate-600">
                      <p className="font-medium text-slate-800">{doc.uploadedBy}</p>
                      <span className="text-[10px] text-slate-400">{doc.uploadedAt}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                      {doc.verifiedBy && (
                        <p className="text-[9px] text-slate-400 mt-0.5">by {doc.verifiedBy}</p>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {!isVerified && (currentUser.role === 'partner' || currentUser.role === 'manager') && (
                          <button
                            onClick={() => updateDocumentStatus(doc.id, 'Verified', 'Auditor vouching completed.')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold transition"
                            title="Verify Working Paper"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => alert(`Simulated Download of ${doc.fileName} (${doc.fileSize})`)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Download Working Paper"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-amber-600" />
              Upload Audit Working Paper / Evidence
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Entity</label>
                <select
                  value={uploadClient}
                  onChange={(e) => setUploadClient(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Folder Category</label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                >
                  {folders
                    .filter((f) => f !== 'ALL')
                    .map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FY2425_SBI_Loan_Sanction_Letter.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Auditor Verification Remarks / Scope</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Verified interest rate clauses, collateral charge registered with ROC..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold shadow-sm"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
