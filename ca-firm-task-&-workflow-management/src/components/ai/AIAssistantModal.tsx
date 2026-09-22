import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import {
  Sparkles,
  X,
  FileText,
  Mail,
  ShieldAlert,
  BookOpen,
  Send,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: string;
  initialContext?: any;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'task-summary',
  initialContext,
}) => {
  const { assignments, tasks, complianceItems, currentUser } = useCA();

  const [mode, setMode] = useState<string>(initialMode);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Form Inputs
  const [selectedAsgId, setSelectedAsgId] = useState<string>(
    initialContext?.assignment?.id || assignments[0]?.id || ''
  );
  const [clientName, setClientName] = useState<string>(
    initialContext?.clientName || assignments[0]?.clientName || ''
  );
  const [assignmentTitle, setAssignmentTitle] = useState<string>(
    initialContext?.assignmentTitle || 'Statutory Audit FY 2024-25'
  );
  const [customPrompt, setCustomPrompt] = useState<string>(
    initialContext?.prompt || 'Standard Substantive Vouching and Physical Inventory Verification under SA 501'
  );

  if (!isOpen) return null;

  const currentAsg = assignments.find((a) => a.id === selectedAsgId) || assignments[0];
  const asgTasks = tasks.filter((t) => t.assignmentId === selectedAsgId);

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');

    try {
      let endpoint = '/api/ai/task-summary';
      let payload: any = {};

      if (mode === 'task-summary') {
        endpoint = '/api/ai/task-summary';
        payload = {
          assignmentTitle: `${currentAsg.assignmentCode} - ${currentAsg.clientName} (${currentAsg.assignmentType})`,
          tasks: asgTasks.map((t) => ({
            code: t.taskCode,
            desc: t.taskDescription,
            stage: t.workflowStage,
            status: t.status,
            assignee: t.assignedPersonName,
            dueDate: t.dueDate,
          })),
        };
      } else if (mode === 'email-draft') {
        endpoint = '/api/ai/email-draft';
        payload = {
          clientName: clientName || currentAsg.clientName,
          assignmentTitle: assignmentTitle || currentAsg.description,
          pendingItems: [
            'Direct Bank Balance Confirmation for all Current & Escrow accounts',
            'MSME Supplier Aging Schedule & payment proofs for Section 43B(h) compliance',
            'Fixed Asset Register with physical verification reconciliation certificate',
            'Board Meeting Minutes for Q1-Q4 FY 2024-25',
          ],
        };
      } else if (mode === 'risk-detection') {
        endpoint = '/api/ai/risk-detection';
        payload = {
          delayedAssignments: assignments
            .filter((a) => a.status === 'Delayed' || a.priority === 'Critical')
            .map((a) => ({
              code: a.assignmentCode,
              client: a.clientName,
              type: a.assignmentType,
              due: a.dueDate,
              hours: `${a.actualHours}/${a.estimatedHours}`,
            })),
          criticalCompliance: complianceItems
            .filter((c) => c.status === 'Overdue' || c.status === 'Pending')
            .map((c) => ({
              client: c.clientName,
              form: c.formNumber,
              act: c.statutoryAct,
              due: c.dueDate,
              penaltyRisk: c.penaltyRiskAmount,
            })),
        };
      } else if (mode === 'sop-generator') {
        endpoint = '/api/ai/sop-generator';
        payload = {
          assignmentType: currentAsg.assignmentType,
          specificScope: customPrompt,
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`AI API failed with status ${response.status}`);
      }

      const data = await response.json();
      setResult(data.summary || data.email || data.riskReport || data.sop || 'No output generated.');
    } catch (err: any) {
      setResult(`AI Service Error: ${err.message || 'Please check your GEMINI_API_KEY settings.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                Gemini CA Intelligence Suite <span className="text-xs font-normal text-amber-400">| Server-side AI</span>
              </h3>
              <p className="text-xs text-slate-400">
                Grounded in ICAI Standards on Auditing (SA), Companies Act 2013, CARO 2020 & Income Tax regulations
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-100 p-1.5 border-b border-slate-200 gap-1 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('task-summary');
              setResult('');
            }}
            className={`p-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mode === 'task-summary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Audit Bottleneck Summary</span>
          </button>

          <button
            onClick={() => {
              setMode('email-draft');
              setResult('');
            }}
            className={`p-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mode === 'email-draft' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Client Requisition Drafter</span>
          </button>

          <button
            onClick={() => {
              setMode('risk-detection');
              setResult('');
            }}
            className={`p-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mode === 'risk-detection' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Practice Risk Detector</span>
          </button>

          <button
            onClick={() => {
              setMode('sop-generator');
              setResult('');
            }}
            className={`p-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mode === 'sop-generator' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Audit SOP & Quality Checklist</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Context Options */}
          {mode === 'task-summary' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-800">Select Audit Assignment to Analyze</label>
              <select
                value={selectedAsgId}
                onChange={(e) => setSelectedAsgId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold"
              >
                {assignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.assignmentCode} - {a.clientName} ({a.assignmentType} | {a.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'email-draft' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Client Entity Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Engagement Subject</label>
                <input
                  type="text"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          )}

          {mode === 'sop-generator' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-800">Audit Scope / Area for Checklist</label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs"
              />
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              Model: <strong className="text-slate-700">Gemini 2.5 Flash</strong> (Latency & Reasoning Optimized)
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Synthesizing Audit Intelligence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Execute AI Assistant</span>
                </>
              )}
            </button>
          </div>

          {/* AI Result Card */}
          {result && (
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Generated Professional Output
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded text-[11px] transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-xs leading-relaxed font-sans whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
