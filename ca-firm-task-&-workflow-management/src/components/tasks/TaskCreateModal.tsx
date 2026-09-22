import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { TaskCategory, PriorityLevel, WorkflowStage } from '../../types';
import { X, Plus, CheckSquare } from 'lucide-react';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskCreateModal: React.FC<TaskCreateModalProps> = ({ isOpen, onClose }) => {
  const { assignments, users, addTask } = useCA();

  const [assignmentId, setAssignmentId] = useState<string>(assignments[0]?.id || '');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [category, setCategory] = useState<TaskCategory>('Audit Vouching');
  const [assignedPersonId, setAssignedPersonId] = useState<string>('user-exec-1');
  const [reviewerId, setReviewerId] = useState<string>('user-manager-1');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>('2025-09-25');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [estimatedHours, setEstimatedHours] = useState<number>(16);

  if (!isOpen) return null;

  const selectedAsg = assignments.find((a) => a.id === assignmentId) || assignments[0];
  const selectedAssignee = users.find((u) => u.id === assignedPersonId) || users[4];
  const selectedReviewer = users.find((u) => u.id === reviewerId) || users[2];

  const categories: TaskCategory[] = [
    'Audit Vouching',
    'IFCoFR Testing',
    'Tax 3CD Verification',
    'GST Reconciliation',
    'Bank Audit Fieldwork',
    'Stock Count',
    'IBC Claim Verification',
    'Valuation Modeling',
    'CARO 2020 Reporting',
    'Partner Sign-off',
    'Compliance Filing',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDescription) return;

    addTask({
      assignmentId: selectedAsg.id,
      assignmentName: selectedAsg.assignmentCode + ' - ' + selectedAsg.assignmentType,
      clientId: selectedAsg.clientId,
      clientName: selectedAsg.clientName,
      taskDescription,
      category,
      assignedPersonId: selectedAssignee.id,
      assignedPersonName: selectedAssignee.name,
      assignedPersonRole: selectedAssignee.role,
      reviewerId: selectedReviewer.id,
      reviewerName: selectedReviewer.name,
      startDate,
      dueDate,
      priority,
      status: 'To Do',
      workflowStage: 'Fieldwork (Executive)',
      estimatedHours,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-100">Add Audit Task / Working Paper</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Parent Assignment</label>
            <select
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.assignmentCode} - {a.clientName} ({a.assignmentType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Task Description / Audit Scope</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Scrutiny of Trade Payables aging beyond 45 days (MSME Sec 43Bh Compliance)..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Executive (Article)</label>
              <select
                value={assignedPersonId}
                onChange={(e) => setAssignedPersonId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reviewer (Manager / Senior)</label>
              <select
                value={reviewerId}
                onChange={(e) => setReviewerId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                {users
                  .filter((u) => u.role === 'manager' || u.role === 'partner')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.designation})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-rose-700 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Est. Hours</label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
