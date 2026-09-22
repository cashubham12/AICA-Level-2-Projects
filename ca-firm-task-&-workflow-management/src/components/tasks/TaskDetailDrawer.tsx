import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { Task, WorkflowStage, TaskStatus } from '../../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  ShieldCheck,
  MessageSquare,
  Send,
  Sparkles,
  Paperclip,
  ArrowRight,
  RotateCcw,
  Check,
} from 'lucide-react';

interface TaskDetailDrawerProps {
  taskId: string;
  onClose: () => void;
  onOpenAI: (mode?: string, context?: any) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ taskId, onClose, onOpenAI }) => {
  const {
    tasks,
    currentUser,
    advanceTaskWorkflow,
    addReviewComment,
    updateTask,
  } = useCA();

  const [newComment, setNewComment] = useState<string>('');
  const [commentStatus, setCommentStatus] = useState<'Open' | 'Resolved' | 'Action Required'>('Open');

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  const stages: WorkflowStage[] = [
    'Fieldwork (Executive)',
    'Senior Review',
    'Manager Review',
    'Partner Approval',
    'Completed',
  ];

  const currentStageIndex = stages.indexOf(task.workflowStage);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReviewComment(task.id, newComment, commentStatus);
    setNewComment('');
  };

  const handleAdvance = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1];
      const nextStatus: TaskStatus =
        nextStage === 'Completed'
          ? 'Completed'
          : nextStage === 'Partner Approval'
          ? 'Under Partner Review'
          : 'Under Review';
      advanceTaskWorkflow(task.id, nextStage, nextStatus, `Approved and advanced to ${nextStage}`);
    }
  };

  const handleRejectOrRework = () => {
    advanceTaskWorkflow(
      task.id,
      'Fieldwork (Executive)',
      'Correction Required',
      'Sent back to fieldwork executive for correction/rework.'
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">
                {task.taskCode}
              </span>
              <span className="text-xs text-amber-300 font-semibold">{task.category}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-100 mt-1">{task.clientName}</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenAI('task-summary', { task })}
              className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs flex items-center gap-1 border border-amber-500/30"
              title="AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">AI Inspect</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workflow Stepper */}
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            4-Tier Audit Review Hierarchy
          </p>
          <div className="grid grid-cols-5 gap-1 text-center">
            {stages.map((stage, idx) => {
              const isPassed = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stage} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isPassed
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-amber-500 ring-2 ring-amber-300'
                        : 'bg-slate-200'
                    }`}
                  ></div>
                  <p
                    className={`text-[9px] font-medium truncate ${
                      isCurrent
                        ? 'font-bold text-slate-900'
                        : isPassed
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.split(' ')[0]}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Workflow Action Bar */}
          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            {currentStageIndex > 0 && currentStageIndex < stages.length - 1 && (
              <button
                onClick={handleRejectOrRework}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Require Correction</span>
              </button>
            )}

            {currentStageIndex < stages.length - 1 ? (
              <button
                onClick={handleAdvance}
                className="ml-auto px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Advance to {stages[currentStageIndex + 1]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            ) : (
              <div className="ml-auto flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Audit Finalized</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Task Info */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">{task.taskDescription}</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Prepared By (Executive)</p>
                <p className="font-bold text-slate-800">{task.assignedPersonName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Reviewer</p>
                <p className="font-bold text-slate-800">{task.reviewerName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Due Date</p>
                <p className="font-bold text-rose-600">{task.dueDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Hours Logged</p>
                <p className="font-bold text-slate-800">{task.actualHours} / {task.estimatedHours} hrs</p>
              </div>
            </div>
          </div>

          {/* Review Comments & Audit Trail */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                Review Comments & Audit Log ({task.reviewComments.length})
              </h4>
            </div>

            <div className="space-y-2.5">
              {task.reviewComments.length === 0 ? (
                <p className="text-slate-400 text-center py-3">No review comments yet.</p>
              ) : (
                task.reviewComments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900">{c.authorName}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded capitalize">
                          {c.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{c.comment}</p>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded inline-block ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'Action Required'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handlePostComment} className="pt-2 space-y-2">
              <textarea
                rows={2}
                placeholder="Add audit finding, verification note, or correction request..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <select
                  value={commentStatus}
                  onChange={(e) => setCommentStatus(e.target.value as any)}
                  className="border border-slate-300 rounded-lg p-1.5 text-xs text-slate-700"
                >
                  <option value="Open">Status: Open Note</option>
                  <option value="Action Required">Status: Action Required (Rework)</option>
                  <option value="Resolved">Status: Verified & Resolved</option>
                </select>

                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Post Review Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
