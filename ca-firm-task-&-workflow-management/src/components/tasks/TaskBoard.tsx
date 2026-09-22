import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { Task, TaskStatus, PriorityLevel } from '../../types';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ListFilter,
  Kanban,
  Table as TableIcon,
} from 'lucide-react';
import { TaskCreateModal } from './TaskCreateModal';
import { TaskDetailDrawer } from './TaskDetailDrawer';

interface TaskBoardProps {
  onOpenAI: (mode?: string, context?: any) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ onOpenAI }) => {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    advanceTaskWorkflow,
    currentUser,
  } = useCA();

  const [search, setSearch] = useState<string>('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [viewFormat, setViewFormat] = useState<'kanban' | 'list'>('kanban');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [activeDrawerTaskId, setActiveDrawerTaskId] = useState<string | null>(null);

  // Auto-open drawer if coming from another module
  React.useEffect(() => {
    if (selectedTaskId) {
      setActiveDrawerTaskId(selectedTaskId);
      setSelectedTaskId(null);
    }
  }, [selectedTaskId]);

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      t.taskDescription.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.taskCode.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedPersonName.toLowerCase().includes(search.toLowerCase());

    const matchAssignee = selectedAssignee === 'ALL' || t.assignedPersonName.includes(selectedAssignee);
    const matchPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;

    return matchSearch && matchAssignee && matchPriority;
  });

  const columns: { id: TaskStatus; label: string; bg: string; border: string }[] = [
    { id: 'To Do', label: 'To Do / Allocated', bg: 'bg-slate-50', border: 'border-slate-300' },
    { id: 'In Progress', label: 'Fieldwork / In Progress', bg: 'bg-blue-50/50', border: 'border-blue-300' },
    { id: 'Submitted for Review', label: 'Submitted for Review', bg: 'bg-purple-50/50', border: 'border-purple-300' },
    { id: 'Correction Required', label: 'Rework / Action Needed', bg: 'bg-rose-50/50', border: 'border-rose-300' },
    { id: 'Completed', label: 'Finalized & Signed Off', bg: 'bg-emerald-50/50', border: 'border-emerald-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900">Task Board & Working Papers Kanban</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            4-tier operational review pipeline across {tasks.length} working paper deliverables.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* View format switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewFormat('kanban')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                viewFormat === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewFormat('list')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                viewFormat === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search tasks, client entities, audit standards, assignees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-xs"
          >
            <option value="ALL">All Assignees</option>
            <option value="Rohan">Rohan Verma (Article)</option>
            <option value="Neha">Neha Gupta (Article)</option>
            <option value="Amit">Amit Saxena (Manager)</option>
            <option value="Pooja">Pooja Iyer (Senior)</option>
          </select>
        </div>

        <div className="w-full md:w-36">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-xs"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewFormat === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`${col.bg} border ${col.border} rounded-2xl p-3 flex flex-col min-h-[480px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="font-bold text-xs text-slate-800 truncate">{col.label}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs italic">No items</div>
                  ) : (
                    colTasks.map((t) => {
                      const isCritical = t.priority === 'Critical';
                      return (
                        <div
                          key={t.id}
                          onClick={() => setActiveDrawerTaskId(t.id)}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition space-y-2.5 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                              {t.taskCode}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                isCritical
                                  ? 'bg-rose-100 text-rose-800'
                                  : t.priority === 'High'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {t.priority}
                            </span>
                          </div>

                          <p className="font-semibold text-xs text-slate-900 leading-snug group-hover:text-amber-700 transition">
                            {t.taskDescription}
                          </p>

                          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                            <span className="font-medium text-slate-700 truncate max-w-[110px]">
                              {t.clientName}
                            </span>
                            <span className="font-mono text-rose-600 font-semibold">{t.dueDate}</span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" />
                              {t.assignedPersonName.split(' ')[0]}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-slate-400" />
                              {t.reviewComments.length}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Task Description</th>
                  <th className="p-3">Client Entity</th>
                  <th className="p-3">Assignee</th>
                  <th className="p-3">Reviewer</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Workflow Stage</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-700">{t.taskCode}</td>
                    <td className="p-3 font-semibold text-slate-900 max-w-xs">{t.taskDescription}</td>
                    <td className="p-3 font-medium text-slate-700">{t.clientName}</td>
                    <td className="p-3 text-slate-600">{t.assignedPersonName}</td>
                    <td className="p-3 text-slate-600">{t.reviewerName}</td>
                    <td className="p-3 font-semibold text-rose-600">{t.dueDate}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                        {t.workflowStage}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setActiveDrawerTaskId(t.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <TaskCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {activeDrawerTaskId && (
        <TaskDetailDrawer
          taskId={activeDrawerTaskId}
          onClose={() => setActiveDrawerTaskId(null)}
          onOpenAI={onOpenAI}
        />
      )}
    </div>
  );
};
