import React from 'react';
import { useCA } from '../../context/CAContext';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  GitPullRequest,
  FolderLock,
  CalendarDays,
  Clock,
  TrendingUp,
  MessageSquareText,
  FileSpreadsheet,
  Sparkles,
  BookOpen,
  Users,
  ShieldCheck,
  Building,
  Building2,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  onOpenAI: (mode?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAI }) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    firmProfile,
    assignments,
    tasks,
    complianceItems,
    timesheets,
  } = useCA();

  // Badge calculations
  const pendingApprovalsCount = tasks.filter(
    (t) => t.workflowStage === 'Partner Approval' || t.workflowStage === 'Manager Review'
  ).length;

  const overdueComplianceCount = complianceItems.filter(
    (c) => c.status === 'Overdue' || (c.status === 'Pending' && new Date(c.dueDate) <= new Date())
  ).length;

  const pendingTimesheetsCount = timesheets.filter((ts) => ts.status === 'Submitted').length;

  const navGroups = [
    {
      label: 'Practice Management',
      items: [
        {
          id: 'dashboard',
          label: 'Executive Dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'assignments',
          label: 'Assignments & Audits',
          icon: Briefcase,
          badge: assignments.length,
        },
        {
          id: 'tasks',
          label: 'Task Board & Kanban',
          icon: CheckSquare,
          badge: tasks.length,
        },
        {
          id: 'workflow',
          label: 'Workflow Approvals',
          icon: GitPullRequest,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
          badgeColor: 'bg-amber-500 text-slate-950 font-bold',
        },
      ],
    },
    {
      label: 'Governance & Operations',
      items: [
        {
          id: 'compliance',
          label: 'Compliance Calendar',
          icon: CalendarDays,
          badge: overdueComplianceCount > 0 ? overdueComplianceCount : null,
          badgeColor: 'bg-rose-500 text-white font-bold',
        },
        {
          id: 'documents',
          label: 'Working Paper Repository',
          icon: FolderLock,
          badge: null,
        },
        {
          id: 'timesheet',
          label: 'Timesheets & Logging',
          icon: Clock,
          badge: currentUser.role === 'partner' && pendingTimesheetsCount > 0 ? pendingTimesheetsCount : null,
          badgeColor: 'bg-blue-500 text-white',
        },
        {
          id: 'profitability',
          label: 'Profitability & Billing',
          icon: TrendingUp,
          badge: null,
        },
        {
          id: 'communications',
          label: 'Client Communication',
          icon: MessageSquareText,
          badge: null,
        },
      ],
    },
    {
      label: 'Practice Administration',
      items: [
        {
          id: 'settings',
          label: 'Firm & Team Settings',
          icon: Building2,
          badge: null,
        },
        {
          id: 'ai-assistant',
          label: 'Gemini CA AI',
          icon: Sparkles,
          highlight: true,
        },
        {
          id: 'reports',
          label: 'Reports & Excel Export',
          icon: FileSpreadsheet,
          badge: null,
        },
        {
          id: 'docs',
          label: 'System Architecture',
          icon: BookOpen,
          badge: 'v2.4',
          badgeColor: 'bg-slate-800 text-slate-400 font-mono text-[9px]',
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Role Badge Indicator */}
      <div className="p-3.5 mx-3 mt-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Active Role View
            </p>
            <p className="text-xs font-bold text-slate-100 capitalize truncate">
              {currentUser.role} Mode
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 custom-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'ai-assistant') {
                      onOpenAI();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                      : item.highlight
                      ? 'text-amber-400 hover:bg-amber-500/10 border border-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-slate-950'
                          : item.highlight
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-slate-950 text-amber-400'
                          : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Firm Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>ICAI FRN: {firmProfile.firmRegistrationNumber}</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Server
          </span>
        </div>
      </div>
    </aside>
  );
};
