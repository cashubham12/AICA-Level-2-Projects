import React, { useState, useEffect } from 'react';
import { CAProvider, useCA } from './context/CAContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PartnerDashboard } from './components/dashboard/PartnerDashboard';
import { ManagerDashboard } from './components/dashboard/ManagerDashboard';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { AssignmentList } from './components/assignments/AssignmentList';
import { AssignmentCreateModal } from './components/assignments/AssignmentCreateModal';
import { AssignmentDetailModal } from './components/assignments/AssignmentDetailModal';
import { TaskBoard } from './components/tasks/TaskBoard';
import { TaskCreateModal } from './components/tasks/TaskCreateModal';
import { TaskDetailDrawer } from './components/tasks/TaskDetailDrawer';
import { WorkflowApprovalCenter } from './components/workflow/WorkflowApprovalCenter';
import { ComplianceCalendar } from './components/compliance/ComplianceCalendar';
import { DocumentRepository } from './components/documents/DocumentRepository';
import { TimesheetManager } from './components/timesheet/TimesheetManager';
import { ProfitabilityAnalysis } from './components/profitability/ProfitabilityAnalysis';
import { CommunicationTracker } from './components/communication/CommunicationTracker';
import { ReportsCenter } from './components/reports/ReportsCenter';
import { FirmSettingsView } from './components/settings/FirmSettingsView';
import { SystemDocumentationModal } from './components/docs/SystemDocumentationModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    currentUser,
    selectedAssignmentId,
    setSelectedAssignmentId,
    selectedTaskId,
    setSelectedTaskId,
  } = useCA();

  // Modals state
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState<boolean>(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState<boolean>(false);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [aiMode, setAiMode] = useState<string>('task-summary');
  const [aiContext, setAiContext] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Keyboard shortcut Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenAI = (mode: string = 'task-summary', context: any = null) => {
    setAiMode(mode);
    setAiContext(context);
    setIsAIOpen(true);
  };

  // Render active dashboard based on role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'partner':
        return (
          <PartnerDashboard
            onOpenCreateAssignment={() => setIsCreateAssignmentOpen(true)}
            onOpenAI={handleOpenAI}
          />
        );
      case 'manager':
        return (
          <ManagerDashboard
            onOpenCreateTask={() => setIsCreateTaskOpen(true)}
            onOpenAI={handleOpenAI}
          />
        );
      case 'executive':
        return <ExecutiveDashboard onOpenAI={handleOpenAI} />;
      case 'client':
        return <ClientDashboard onOpenAI={handleOpenAI} />;
      default:
        return (
          <PartnerDashboard
            onOpenCreateAssignment={() => setIsCreateAssignmentOpen(true)}
            onOpenAI={handleOpenAI}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Role-adaptive sidebar */}
      <Sidebar onOpenAI={handleOpenAI} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAI={() => handleOpenAI('task-summary')}
        />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && renderDashboard()}

            {activeTab === 'assignments' && (
              <AssignmentList
                onOpenCreate={() => setIsCreateAssignmentOpen(true)}
                onOpenAI={handleOpenAI}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskBoard
                onOpenCreateTask={() => setIsCreateTaskOpen(true)}
                onOpenAI={handleOpenAI}
              />
            )}

            {activeTab === 'workflow' && (
              <WorkflowApprovalCenter onOpenAI={handleOpenAI} />
            )}

            {activeTab === 'compliance' && (
              <ComplianceCalendar onOpenAI={handleOpenAI} />
            )}

            {activeTab === 'documents' && <DocumentRepository />}

            {activeTab === 'timesheet' && <TimesheetManager />}

            {activeTab === 'profitability' && <ProfitabilityAnalysis />}

            {(activeTab === 'communication' || activeTab === 'communications') && (
              <CommunicationTracker onOpenAI={handleOpenAI} />
            )}

            {activeTab === 'settings' && (
              <FirmSettingsView onOpenAI={handleOpenAI} />
            )}

            {activeTab === 'reports' && <ReportsCenter onOpenAI={handleOpenAI} />}

            {activeTab === 'docs' && <SystemDocumentationModal />}
          </div>
        </main>
      </div>

      {/* Assignment Create Modal */}
      <AssignmentCreateModal
        isOpen={isCreateAssignmentOpen}
        onClose={() => setIsCreateAssignmentOpen(false)}
      />

      {/* Assignment Detail Modal */}
      {selectedAssignmentId && (
        <AssignmentDetailModal
          assignmentId={selectedAssignmentId}
          onClose={() => setSelectedAssignmentId(null)}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
          onOpenAI={handleOpenAI}
        />
      )}

      {/* Task Create Modal */}
      <TaskCreateModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />

      {/* Task Detail Drawer */}
      {selectedTaskId && (
        <TaskDetailDrawer
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onOpenAI={handleOpenAI}
        />
      )}

      {/* Server-Side Gemini AI Suite Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        initialMode={aiMode}
        initialContext={aiContext}
      />

      {/* Global Quick Search (Cmd+K) Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CAProvider>
      <AppContent />
    </CAProvider>
  );
}
