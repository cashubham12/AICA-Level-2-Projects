import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { CommunicationLog } from '../../types';
import {
  MessageSquareText,
  Plus,
  Search,
  Calendar,
  Phone,
  Video,
  Users,
  Mail,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CommunicationTrackerProps {
  onOpenAI: (mode?: string, context?: any) => void;
}

export const CommunicationTracker: React.FC<CommunicationTrackerProps> = ({ onOpenAI }) => {
  const { communications, addCommunication, clients, assignments, currentUser } = useCA();

  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  // Form State
  const [clientId, setClientId] = useState<string>(clients[0]?.id || '');
  const [channel, setChannel] = useState<CommunicationLog['channel']>('Physical Meeting');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState<string>('CFO, Accounts Head');
  const [summary, setSummary] = useState<string>('');
  const [actionItems, setActionItems] = useState<string>('');

  const filteredComms = communications.filter((c) => {
    const summ = c.summary || c.discussionSummary || '';
    const ch = c.channel || c.communicationType || '';
    return (
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      summ.toLowerCase().includes(search.toLowerCase()) ||
      ch.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary) return;
    const cl = clients.find((c) => c.id === clientId) || clients[0];
    const asg = assignments.find((a) => a.clientId === cl.id) || assignments[0];

    addCommunication({
      clientId: cl.id,
      clientName: cl.name,
      assignmentId: asg?.id,
      date,
      channel,
      participants: participants.split(',').map((p) => p.trim()),
      summary,
      actionItems: actionItems ? actionItems.split('\n').map((a) => a.trim()) : [],
      loggedBy: currentUser.name,
    });

    setIsAddOpen(false);
    setSummary('');
    setActionItems('');
  };

  const channelIcons: Record<string, any> = {
    'Physical Meeting': Users,
    'Video Conference': Video,
    'Phone Call': Phone,
    'Email / Memo': Mail,
    'Audit Requisition Letter': FileText,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquareText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Client Communication & Audit Inquiries CRM</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional memory logging client meetings, management representations, and audit requisition follow-ups.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onOpenAI('email-draft', { clientName: 'Audit Committee', assignmentTitle: 'Annual Statutory Audit' })}
            className="flex items-center space-x-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Draft Requisition Email</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Log Interaction</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search communication logs, minutes, discussion topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Communication Feed Timeline */}
      <div className="space-y-4">
        {filteredComms.map((comm) => {
          const chKey = comm.channel || comm.communicationType || 'Physical Meeting';
          const Icon = channelIcons[chKey] || MessageSquareText;
          const commSummary = comm.summary || comm.discussionSummary || '';
          const partList = comm.participants || (comm.attendees ? [comm.attendees] : ['Partner & Client']);
          const actions = comm.actionItems || (comm.pendingAction ? [comm.pendingAction] : []);
          return (
            <div key={comm.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{comm.clientName}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {chKey} | Logged by: {comm.loggedBy || comm.responsiblePerson || 'CA In-Charge'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{comm.date}</span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-700 leading-relaxed font-normal">{commSummary}</p>

              {/* Participants & Action items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Participants Present</p>
                  <div className="flex flex-wrap gap-1">
                    {partList.map((p, idx) => (
                      <span key={idx} className="bg-white text-slate-700 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {actions.length > 0 && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                    <p className="text-[10px] font-bold uppercase text-amber-800 mb-1">Agreed Action Items</p>
                    <ul className="space-y-1 text-[11px] text-amber-900 list-disc list-inside">
                      {actions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Interaction Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <MessageSquareText className="w-4 h-4 text-blue-600" />
              Record Client Meeting / Discussion Minutes
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Entity</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interaction Medium</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value="Physical Meeting">Physical Meeting (Audit Visit)</option>
                    <option value="Video Conference">Video Conference (Teams/Zoom)</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Email / Memo">Email / Memo</option>
                    <option value="Audit Requisition Letter">Formal Requisition Letter</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Meeting</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Participants (Comma Separated)</label>
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Summary of Discussion</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Discussed provision for disputed GST liabilities, inventory obsolescence write-down..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Action Items (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Client to share valuation report by Friday"
                  value={actionItems}
                  onChange={(e) => setActionItems(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold shadow-sm"
                >
                  Save to CRM Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
