import React, { useState, useEffect } from 'react';
import { useCA } from '../../context/CAContext';
import {
  Search,
  X,
  Briefcase,
  CheckSquare,
  Calendar,
  FolderLock,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    assignments,
    tasks,
    complianceItems,
    documents,
    clients,
    setActiveTab,
    setSelectedAssignmentId,
    setSelectedTaskId,
  } = useCA();

  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // handled in parent
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const matchAssignments = assignments.filter(
    (a) =>
      a.clientName.toLowerCase().includes(query.toLowerCase()) ||
      a.assignmentCode.toLowerCase().includes(query.toLowerCase()) ||
      a.assignmentType.toLowerCase().includes(query.toLowerCase())
  );

  const matchTasks = tasks.filter(
    (t) =>
      t.taskDescription.toLowerCase().includes(query.toLowerCase()) ||
      t.taskCode.toLowerCase().includes(query.toLowerCase()) ||
      t.clientName.toLowerCase().includes(query.toLowerCase())
  );

  const matchCompliance = complianceItems.filter(
    (c) =>
      c.complianceName.toLowerCase().includes(query.toLowerCase()) ||
      c.formNumber.toLowerCase().includes(query.toLowerCase()) ||
      c.clientName.toLowerCase().includes(query.toLowerCase())
  );

  const matchDocs = documents.filter(
    (d) =>
      d.fileName.toLowerCase().includes(query.toLowerCase()) ||
      d.clientName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search assignments, tasks, statutory forms, clients, documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm focus:outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1 divide-y divide-slate-100">
          {!query ? (
            <div className="p-8 text-center text-slate-400">
              Type keywords like client name, assignment code, form number (e.g. 3CD, GSTR-3B), or auditor name...
            </div>
          ) : (
            <>
              {/* Assignments */}
              {matchAssignments.length > 0 && (
                <div className="pt-2 first:pt-0 space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Assignments & Audits</p>
                  <div className="space-y-1">
                    {matchAssignments.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setSelectedAssignmentId(a.id);
                          setActiveTab('assignments');
                          onClose();
                        }}
                        className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-amber-600" />
                          <div>
                            <p className="font-bold text-slate-900">{a.clientName}</p>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {a.assignmentCode} | {a.assignmentType}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {matchTasks.length > 0 && (
                <div className="pt-2 space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Tasks & Working Papers</p>
                  <div className="space-y-1">
                    {matchTasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTaskId(t.id);
                          setActiveTab('tasks');
                          onClose();
                        }}
                        className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="font-bold text-slate-900">{t.taskDescription}</p>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {t.taskCode} | {t.clientName}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance */}
              {matchCompliance.length > 0 && (
                <div className="pt-2 space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Statutory Compliance Forms</p>
                  <div className="space-y-1">
                    {matchCompliance.slice(0, 3).map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveTab('compliance');
                          onClose();
                        }}
                        className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="font-bold text-slate-900">{c.complianceName} ({c.formNumber})</p>
                            <span className="text-[10px] text-slate-500">
                              {c.clientName} | Due: {c.dueDate}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {matchDocs.length > 0 && (
                <div className="pt-2 space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Working Papers & Documents</p>
                  <div className="space-y-1">
                    {matchDocs.slice(0, 3).map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setActiveTab('documents');
                          onClose();
                        }}
                        className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-center space-x-2">
                          <FolderLock className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="font-bold text-slate-900">{d.fileName}</p>
                            <span className="text-[10px] text-slate-500">
                              {d.clientName} | {d.folderCategory}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
