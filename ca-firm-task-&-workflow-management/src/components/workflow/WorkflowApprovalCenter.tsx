import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { Task, WorkflowStage, TaskStatus } from '../../types';
import {
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Award,
  UserCheck,
  FileCheck,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkflowApprovalCenterProps {
  onOpenAI: (mode?: string, context?: any) => void;
}

export const WorkflowApprovalCenter: React.FC<WorkflowApprovalCenterProps> = ({ onOpenAI }) => {
  const {
    tasks,
    currentUser,
    advanceTaskWorkflow,
    addReviewComment,
    updateAssignment,
    assignments,
    setSelectedTaskId,
    setActiveTab,
  } = useCA();

  const [activeStageFilter, setActiveStageFilter] = useState<WorkflowStage | 'ALL'>('ALL');
  const [rejectionModalTaskId, setRejectionModalTaskId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [signOffModalTaskId, setSignOffModalTaskId] = useState<string | null>(null);
  const [udinGenerated, setUdinGenerated] = useState<string>('');

  const stages: WorkflowStage[] = [
    'Fieldwork (Executive)',
    'Senior Review',
    'Manager Review',
    'Partner Approval',
    'Completed',
  ];

  const filteredTasks = tasks.filter((t) => {
    if (activeStageFilter === 'ALL') return true;
    return t.workflowStage === activeStageFilter;
  });

  const partnerQueue = tasks.filter((t) => t.workflowStage === 'Partner Approval');
  const managerQueue = tasks.filter((t) => t.workflowStage === 'Manager Review');
  const seniorQueue = tasks.filter((t) => t.workflowStage === 'Senior Review');

  const handleApprove = (task: Task) => {
    if (task.workflowStage === 'Senior Review') {
      advanceTaskWorkflow(task.id, 'Manager Review', 'Under Review', 'Verified by Senior Reviewer. Forwarded to Audit Manager.');
    } else if (task.workflowStage === 'Manager Review') {
      advanceTaskWorkflow(task.id, 'Partner Approval', 'Under Partner Review', 'Manager review completed. Forwarded for Partner Sign-off.');
    } else if (task.workflowStage === 'Partner Approval') {
      const generatedUdin = `25${Math.floor(100000 + Math.random() * 900000)}AAAA${Math.floor(1000 + Math.random() * 9000)}`;
      setUdinGenerated(generatedUdin);
      setSignOffModalTaskId(task.id);
    }
  };

  const handleConfirmPartnerSignOff = () => {
    if (!signOffModalTaskId) return;
    const task = tasks.find((t) => t.id === signOffModalTaskId);
    if (task) {
      advanceTaskWorkflow(
        task.id,
        'Completed',
        'Completed',
        `Final Partner Sign-off granted by ${currentUser.name}. Generated UDIN: ${udinGenerated}`
      );
      // Also update parent assignment UDIN if needed
      const parentAsg = assignments.find((a) => a.id === task.assignmentId);
      if (parentAsg) {
        updateAssignment(parentAsg.id, { udinNumber: udinGenerated });
      }
    }
    setSignOffModalTaskId(null);
  };

  const handleConfirmRejection = () => {
    if (!rejectionModalTaskId || !rejectionReason.trim()) return;
    advanceTaskWorkflow(
      rejectionModalTaskId,
      'Fieldwork (Executive)',
      'Correction Required',
      `Audit Review Finding / Action Required: ${rejectionReason}`
    );
    setRejectionModalTaskId(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border border-slate-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              ICAI Quality Control & Peer Review Standard (SQC 1)
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-1 text-slate-100">Audit Workflow & Partner Approval Center</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Strict 4-Tier sign-off governance ensuring Standard on Auditing (SA 220 / SQC 1) compliance before final statutory report issuance and UDIN generation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Pending Partner Approval</p>
            <p className="text-xl font-bold text-amber-400">{partnerQueue.length}</p>
          </div>
        </div>
      </div>

      {/* 4-Tier Hierarchy Visual Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveStageFilter('Fieldwork (Executive)')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            activeStageFilter === 'Fieldwork (Executive)'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase opacity-70">Tier 1</span>
          <h4 className="font-bold text-sm mt-0.5">Fieldwork (Executive)</h4>
          <p className={`text-[11px] mt-1 ${activeStageFilter === 'Fieldwork (Executive)' ? 'text-slate-300' : 'text-slate-500'}`}>
            Article Assistants prepare working papers & vouchers
          </p>
        </div>

        <div
          onClick={() => setActiveStageFilter('Senior Review')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            activeStageFilter === 'Senior Review'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase opacity-70">Tier 2</span>
            {seniorQueue.length > 0 && (
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                {seniorQueue.length}
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm mt-0.5">Senior Review</h4>
          <p className={`text-[11px] mt-1 ${activeStageFilter === 'Senior Review' ? 'text-slate-300' : 'text-slate-500'}`}>
            Senior Associates verify cross-references & schedules
          </p>
        </div>

        <div
          onClick={() => setActiveStageFilter('Manager Review')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            activeStageFilter === 'Manager Review'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase opacity-70">Tier 3</span>
            {managerQueue.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                {managerQueue.length}
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm mt-0.5">Manager Review</h4>
          <p className={`text-[11px] mt-1 ${activeStageFilter === 'Manager Review' ? 'text-slate-300' : 'text-slate-500'}`}>
            Audit Managers review accounting treatments & CARO
          </p>
        </div>

        <div
          onClick={() => setActiveStageFilter('Partner Approval')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            activeStageFilter === 'Partner Approval'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase opacity-70">Tier 4 (Final)</span>
            {partnerQueue.length > 0 && (
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded animate-pulse">
                {partnerQueue.length}
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm mt-0.5">Partner Sign-off</h4>
          <p className={`text-[11px] mt-1 ${activeStageFilter === 'Partner Approval' ? 'text-slate-300' : 'text-slate-500'}`}>
            Signing Partner final review, opinion & UDIN generation
          </p>
        </div>
      </div>

      {/* Filter Toggle Reset */}
      {activeStageFilter !== 'ALL' && (
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Filtered by: <strong>{activeStageFilter}</strong></span>
          <button
            onClick={() => setActiveStageFilter('ALL')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Show All Stages
          </button>
        </div>
      )}

      {/* Active Workflow Queue Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Sign-Off Queue Deliverables ({filteredTasks.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No tasks currently pending review in this stage.
            </div>
          ) : (
            filteredTasks.map((t) => {
              const isPartnerStage = t.workflowStage === 'Partner Approval';
              const isCompleted = t.workflowStage === 'Completed';
              return (
                <div key={t.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {t.taskCode}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{t.clientName}</span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                        {t.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isPartnerStage
                            ? 'bg-purple-100 text-purple-800'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.workflowStage}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 leading-snug">{t.taskDescription}</p>

                    <div className="flex items-center space-x-4 text-[11px] text-slate-500">
                      <span>Prepared by: <strong className="text-slate-700">{t.assignedPersonName}</strong></span>
                      <span>Reviewer: <strong className="text-slate-700">{t.reviewerName}</strong></span>
                      <span>Due: <strong className="text-rose-600">{t.dueDate}</strong></span>
                      <span>Hours: <strong className="text-slate-700">{t.actualHours}/{t.estimatedHours} hrs</strong></span>
                    </div>

                    {t.reviewComments.length > 0 && (
                      <div className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200/80 text-slate-600">
                        <strong className="text-slate-800">Latest Review Note:</strong> {t.reviewComments[t.reviewComments.length - 1].comment}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {!isCompleted && (
                      <>
                        <button
                          onClick={() => {
                            setRejectionModalTaskId(t.id);
                          }}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Rework</span>
                        </button>

                        <button
                          onClick={() => handleApprove(t)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {isPartnerStage
                              ? 'Grant Final Sign-Off & UDIN'
                              : 'Approve & Advance Stage'}
                          </span>
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Signed Off & Sealed</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Rework / Correction Request Modal */}
      {rejectionModalTaskId && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 text-rose-600">
              <AlertCircle className="w-4 h-4" />
              Request Fieldwork Rework / Clarification
            </h3>
            <p className="text-xs text-slate-600">
              Specify the audit finding or deficiency requiring additional vouching, documentation, or confirmation before approval.
            </p>
            <textarea
              rows={3}
              required
              placeholder="e.g. Please obtain balance confirmation certificate from State Bank of India directly via email..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setRejectionModalTaskId(null);
                  setRejectionReason('');
                }}
                className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim()}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold"
              >
                Send for Correction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Final Sign-Off & UDIN Stamp Modal */}
      {signOffModalTaskId && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-emerald-700 pb-2 border-b border-slate-100">
              <Award className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-base text-slate-900">Partner Audit Sign-Off Certificate</h3>
                <p className="text-[11px] text-slate-500">ICAI SQC 1 Engagement Quality Verification</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Signing Partner:</span>
                <span className="font-bold text-slate-900">{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Membership No:</span>
                <span className="font-bold text-slate-900">{currentUser.membershipNo || 'FCA-084920'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Firm Reg. No:</span>
                <span className="font-bold text-slate-900">104522W</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-amber-700 font-bold">Generated UDIN:</span>
                <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-sm">
                  {udinGenerated}
                </span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-[11px]">
              I confirm that the audit evidence obtained is sufficient and appropriate (SA 500), the working papers have undergone multi-tier supervisory review, and the statutory audit report can be formally issued.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setSignOffModalTaskId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPartnerSignOff}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Issue Audit Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
