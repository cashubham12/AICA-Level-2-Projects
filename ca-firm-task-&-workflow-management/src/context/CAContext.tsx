import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Client,
  Assignment,
  Task,
  ComplianceItem,
  DocumentItem,
  TimesheetEntry,
  CommunicationLog,
  NotificationItem,
  AuditLogEntry,
  ReviewComment,
  WorkflowStage,
  TaskStatus,
  AssignmentStatus,
  ComplianceStatus,
  FirmProfile,
} from '../types';
import { CAStore } from '../lib/storage';
import confetti from 'canvas-confetti';

interface CAContextType {
  firmProfile: FirmProfile;
  updateFirmProfile: (updates: Partial<FirmProfile>) => void;

  users: User[];
  currentUser: User;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  addUser: (userData: Omit<User, 'id' | 'assignedClientsCount' | 'activeTasksCount'>) => void;
  deleteUser: (userId: string) => void;

  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'clientCode' | 'activeAssignmentsCount'>) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  deleteClient: (clientId: string) => void;

  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'assignmentCode' | 'actualHours' | 'progressPercentage'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'taskCode' | 'actualHours' | 'reviewComments' | 'attachments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  advanceTaskWorkflow: (taskId: string, targetStage: WorkflowStage, newStatus: TaskStatus, comment?: string) => void;
  addReviewComment: (taskId: string, commentText: string, status?: 'Open' | 'Resolved' | 'Action Required') => void;

  complianceItems: ComplianceItem[];
  updateComplianceStatus: (id: string, status: ComplianceStatus, ackNumber?: string, remarks?: string) => void;
  addComplianceItem: (item: Omit<ComplianceItem, 'id' | 'escalationLevel'>) => void;
  escalateCompliance: (id: string) => void;

  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt' | 'version'>) => void;
  updateDocumentStatus: (id: string, status: DocumentItem['status'], notes?: string) => void;

  timesheets: TimesheetEntry[];
  addTimesheetEntry: (entry: Omit<TimesheetEntry, 'id' | 'status'>) => void;
  approveTimesheetEntry: (id: string) => void;

  communications: CommunicationLog[];
  addCommunication: (comm: Omit<CommunicationLog, 'id'>) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (title: string, message: string, priority?: NotificationItem['priority'], type?: NotificationItem['type']) => void;

  auditLogs: AuditLogEntry[];

  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAssignmentId: string | null;
  setSelectedAssignmentId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;

  resetDatabase: () => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
}

const CAContext = createContext<CAContextType | undefined>(undefined);

export const CAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firmProfile, setFirmProfile] = useState<FirmProfile>(() => CAStore.getFirmProfile());
  const [users, setUsers] = useState<User[]>(() => CAStore.getUsers());
  const [currentUser, setCurrentUser] = useState<User>(() => CAStore.getCurrentUser());
  const [clients, setClients] = useState<Client[]>(() => CAStore.getClients());
  const [assignments, setAssignments] = useState<Assignment[]>(() => CAStore.getAssignments());
  const [tasks, setTasks] = useState<Task[]>(() => CAStore.getTasks());
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(() => CAStore.getComplianceItems());
  const [documents, setDocuments] = useState<DocumentItem[]>(() => CAStore.getDocuments());
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(() => CAStore.getTimesheets());
  const [communications, setCommunications] = useState<CommunicationLog[]>(() => CAStore.getCommunications());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => CAStore.getNotifications());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => CAStore.getAuditLogs());

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Firm Profile Update
  const updateFirmProfile = (updates: Partial<FirmProfile>) => {
    const updated = { ...firmProfile, ...updates };
    setFirmProfile(updated);
    CAStore.saveFirmProfile(updated);
    CAStore.logAction(
      currentUser,
      'UPDATE_FIRM_PROFILE',
      'Firm Settings',
      `Updated CA firm profile: ${updated.firmName} (FRN: ${updated.firmRegistrationNumber})`
    );
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Firm Details Updated', `Firm profile updated to "${updated.firmName}" successfully.`, 'Low', 'system');
  };

  // User Management Handlers
  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
    setUsers(updatedUsers);
    CAStore.saveUsers(updatedUsers);

    // If updating current active user session
    if (currentUser.id === userId) {
      const updatedCurrent = { ...currentUser, ...updates };
      setCurrentUser(updatedCurrent);
    }

    // Cascade name changes to assignments, tasks, and timesheets if name changed
    if (updates.name) {
      const updatedAssignments = assignments.map((asg) => {
        let changed = false;
        let pName = asg.partnerName;
        let mName = asg.managerName;
        if (asg.partnerResponsibleId === userId) {
          pName = updates.name!;
          changed = true;
        }
        if (asg.managerResponsibleId === userId) {
          mName = updates.name!;
          changed = true;
        }
        return changed ? { ...asg, partnerName: pName, managerName: mName } : asg;
      });
      setAssignments(updatedAssignments);
      CAStore.saveAssignments(updatedAssignments);

      const updatedTasks = tasks.map((t) =>
        t.assignedToId === userId ? { ...t, assignedToName: updates.name! } : t
      );
      setTasks(updatedTasks);
      CAStore.saveTasks(updatedTasks);

      const updatedTimesheets = timesheets.map((ts) =>
        ts.employeeId === userId ? { ...ts, employeeName: updates.name! } : ts
      );
      setTimesheets(updatedTimesheets);
      CAStore.saveTimesheets(updatedTimesheets);
    }

    const targetUser = updatedUsers.find((u) => u.id === userId);
    CAStore.logAction(
      currentUser,
      'UPDATE_USER',
      'Team Management',
      `Updated profile & credentials for ${targetUser?.name || userId} (${targetUser?.role})`
    );
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('User Profile Updated', `Details for ${targetUser?.name || 'User'} were successfully saved.`, 'Low');
  };

  const addUser = (userData: Omit<User, 'id' | 'assignedClientsCount' | 'activeTasksCount'>) => {
    const newId = `user-${userData.role}-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      assignedClientsCount: 0,
      activeTasksCount: 0,
    };
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    CAStore.saveUsers(updatedUsers);
    CAStore.logAction(
      currentUser,
      'ADD_USER',
      'Team Management',
      `Added new ${newUser.role} member: ${newUser.name} (${newUser.designation})`
    );
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Team Member Added', `New ${newUser.role}: ${newUser.name} has been enrolled in the firm directory.`, 'Low');
  };

  const deleteUser = (userId: string) => {
    if (users.length <= 1) {
      alert('At least one user must remain in the practice.');
      return;
    }
    const targetUser = users.find((u) => u.id === userId);
    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    CAStore.saveUsers(updatedUsers);

    if (currentUser.id === userId) {
      switchUser(updatedUsers[0].id);
    }

    CAStore.logAction(
      currentUser,
      'DELETE_USER',
      'Team Management',
      `Removed user ${targetUser?.name || userId} from practice directory`
    );
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('User Removed', `User ${targetUser?.name || ''} has been removed from the directory.`, 'Medium');
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    const updatedClients = clients.map((c) => (c.id === clientId ? { ...c, ...updates } : c));
    setClients(updatedClients);
    CAStore.saveClients(updatedClients);

    // Cascade client name changes to assignments and tasks
    if (updates.name) {
      const updatedAssignments = assignments.map((a) =>
        a.clientId === clientId ? { ...a, clientName: updates.name! } : a
      );
      setAssignments(updatedAssignments);
      CAStore.saveAssignments(updatedAssignments);

      const updatedTasks = tasks.map((t) =>
        t.clientId === clientId ? { ...t, clientName: updates.name! } : t
      );
      setTasks(updatedTasks);
      CAStore.saveTasks(updatedTasks);
    }

    const cl = updatedClients.find((c) => c.id === clientId);
    CAStore.logAction(
      currentUser,
      'UPDATE_CLIENT',
      'Client Master',
      `Updated client profile for ${cl?.name || clientId}`
    );
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Client Updated', `Client details for "${cl?.name || 'Client'}" saved.`, 'Low');
  };

  const deleteClient = (clientId: string) => {
    const targetClient = clients.find((c) => c.id === clientId);
    const updatedClients = clients.filter((c) => c.id !== clientId);
    setClients(updatedClients);
    CAStore.saveClients(updatedClients);

    CAStore.logAction(
      currentUser,
      'DELETE_CLIENT',
      'Client Master',
      `Removed client record: ${targetClient?.name || clientId}`
    );
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Client Removed', `Client ${targetClient?.name || ''} has been deleted.`, 'Medium');
  };

  // Persist handlers
  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      CAStore.setCurrentUser(userId);
      CAStore.logAction(user, 'USER_SWITCH', 'Auth', `Switched active user session to ${user.name} (${user.designation})`);
      setAuditLogs(CAStore.getAuditLogs());
    }
  };

  const switchRole = (role: UserRole) => {
    const userWithRole = users.find((u) => u.role === role) || users[0];
    switchUser(userWithRole.id);
  };

  const addClient = (clientData: Omit<Client, 'id' | 'clientCode' | 'activeAssignmentsCount'>) => {
    const newId = `client-${Date.now()}`;
    const code = `${clientData.name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newClient: Client = {
      ...clientData,
      id: newId,
      clientCode: code,
      activeAssignmentsCount: 0,
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    CAStore.saveClients(updated);
    CAStore.logAction(currentUser, 'CREATE_CLIENT', 'Clients', `Added new client ${newClient.name} (${code})`);
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Client Added', `New client ${newClient.name} registered successfully.`, 'Low');
  };

  const addAssignment = (data: Omit<Assignment, 'id' | 'assignmentCode' | 'actualHours' | 'progressPercentage'>) => {
    const newId = `asg-${Date.now()}`;
    const code = `ASG-${new Date().getFullYear()}-${String(assignments.length + 1).padStart(3, '0')}`;
    const newAsg: Assignment = {
      ...data,
      id: newId,
      assignmentCode: code,
      actualHours: 0,
      progressPercentage: 0,
    };
    const updated = [newAsg, ...assignments];
    setAssignments(updated);
    CAStore.saveAssignments(updated);
    CAStore.logAction(currentUser, 'CREATE_ASSIGNMENT', 'Assignments', `Created assignment ${newAsg.assignmentCode} for ${newAsg.clientName}`);
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Assignment Created', `Assignment ${code} (${data.assignmentType}) allocated to ${data.managerName}.`, 'Medium');
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    const updated = assignments.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setAssignments(updated);
    CAStore.saveAssignments(updated);
    CAStore.logAction(currentUser, 'UPDATE_ASSIGNMENT', 'Assignments', `Updated assignment ID ${id}`);
    setAuditLogs(CAStore.getAuditLogs());
  };

  const deleteAssignment = (id: string) => {
    const target = assignments.find((a) => a.id === id);
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    CAStore.saveAssignments(updated);
    CAStore.logAction(currentUser, 'DELETE_ASSIGNMENT', 'Assignments', `Deleted assignment ${target?.assignmentCode || id}`);
    setAuditLogs(CAStore.getAuditLogs());
  };

  const addTask = (taskData: Omit<Task, 'id' | 'taskCode' | 'actualHours' | 'reviewComments' | 'attachments'>) => {
    const newId = `task-${Date.now()}`;
    const code = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTask: Task = {
      ...taskData,
      id: newId,
      taskCode: code,
      actualHours: 0,
      reviewComments: [],
      attachments: [],
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    CAStore.saveTasks(updated);
    CAStore.logAction(currentUser, 'CREATE_TASK', 'Tasks', `Created task ${code} assigned to ${newTask.assignedPersonName}`);
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Task Assigned', `Task "${newTask.taskDescription.substring(0, 40)}..." assigned to ${newTask.assignedPersonName}.`, 'Medium');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTasks(updated);
    CAStore.saveTasks(updated);
    CAStore.logAction(currentUser, 'UPDATE_TASK', 'Tasks', `Updated task ID ${id}`);
    setAuditLogs(CAStore.getAuditLogs());
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    CAStore.saveTasks(updated);
    CAStore.logAction(currentUser, 'DELETE_TASK', 'Tasks', `Deleted task ID ${id}`);
    setAuditLogs(CAStore.getAuditLogs());
  };

  const advanceTaskWorkflow = (taskId: string, targetStage: WorkflowStage, newStatus: TaskStatus, comment?: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    let newComments = [...targetTask.reviewComments];
    if (comment) {
      const commentObj: ReviewComment = {
        id: `rev-${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        stage: targetStage,
        comment,
        timestamp: new Date().toLocaleString(),
        status: 'Resolved',
      };
      newComments.push(commentObj);
    }

    const updates: Partial<Task> = {
      workflowStage: targetStage,
      status: newStatus,
      reviewComments: newComments,
      completedAt: targetStage === 'Completed' ? new Date().toISOString() : undefined,
    };

    if (targetStage === 'Completed') {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }

    updateTask(taskId, updates);
    CAStore.logAction(
      currentUser,
      'ADVANCE_WORKFLOW',
      'Workflow',
      `Moved task ${targetTask.taskCode} to stage "${targetStage}" (${newStatus})`
    );
    addNotification(
      'Workflow Updated',
      `Task ${targetTask.taskCode} advanced to ${targetStage} by ${currentUser.name}.`,
      targetStage === 'Partner Approval' ? 'Critical' : 'High'
    );
  };

  const addReviewComment = (taskId: string, commentText: string, status: 'Open' | 'Resolved' | 'Action Required' = 'Open') => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const newComment: ReviewComment = {
      id: `rev-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      stage: targetTask.workflowStage,
      comment: commentText,
      timestamp: new Date().toLocaleString(),
      status,
    };

    const updatedComments = [...targetTask.reviewComments, newComment];
    updateTask(taskId, { reviewComments: updatedComments });
    CAStore.logAction(currentUser, 'ADD_REVIEW_COMMENT', 'Review', `Added review comment on task ${targetTask.taskCode}`);
  };

  const updateComplianceStatus = (id: string, status: ComplianceStatus, ackNumber?: string, remarks?: string) => {
    const updated = complianceItems.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status,
          acknowledgmentNumber: ackNumber || c.acknowledgmentNumber,
          remarks: remarks || c.remarks,
          escalationLevel: status === 'Filed' ? (0 as 0) : c.escalationLevel,
        };
      }
      return c;
    });
    setComplianceItems(updated);
    CAStore.saveComplianceItems(updated);
    CAStore.logAction(currentUser, 'UPDATE_COMPLIANCE', 'Compliance', `Marked compliance item as ${status}`);
    setAuditLogs(CAStore.getAuditLogs());

    if (status === 'Filed') {
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const addComplianceItem = (itemData: Omit<ComplianceItem, 'id' | 'escalationLevel'>) => {
    const newItem: ComplianceItem = {
      ...itemData,
      id: `comp-${Date.now()}`,
      escalationLevel: 0,
    };
    const updated = [newItem, ...complianceItems];
    setComplianceItems(updated);
    CAStore.saveComplianceItems(updated);
    CAStore.logAction(currentUser, 'CREATE_COMPLIANCE', 'Compliance', `Scheduled ${newItem.complianceName} for ${newItem.clientName}`);
    setAuditLogs(CAStore.getAuditLogs());
  };

  const escalateCompliance = (id: string) => {
    const target = complianceItems.find((c) => c.id === id);
    if (!target) return;
    const newLevel = Math.min(3, target.escalationLevel + 1) as 1 | 2 | 3;
    const levelLabel = newLevel === 3 ? 'Partner Level' : newLevel === 2 ? 'Manager Level' : 'Executive Level';

    const updated = complianceItems.map((c) => (c.id === id ? { ...c, escalationLevel: newLevel, lastReminderSent: new Date().toISOString().split('T')[0] } : c));
    setComplianceItems(updated);
    CAStore.saveComplianceItems(updated);
    CAStore.logAction(currentUser, 'ESCALATE_COMPLIANCE', 'Compliance', `Escalated ${target.complianceName} to ${levelLabel}`);
    setAuditLogs(CAStore.getAuditLogs());
    addNotification(
      'Compliance Escalation Triggered',
      `${target.complianceName} for ${target.clientName} escalated to ${levelLabel}.`,
      'Critical'
    );
  };

  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadedAt' | 'version'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      version: 'v1.0',
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    CAStore.saveDocuments(updated);
    CAStore.logAction(currentUser, 'UPLOAD_DOCUMENT', 'Documents', `Uploaded file ${newDoc.fileName}`);
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Document Uploaded', `${newDoc.fileName} added to ${newDoc.clientName} folder.`, 'Low');
  };

  const updateDocumentStatus = (id: string, status: DocumentItem['status'], notes?: string) => {
    const updated = documents.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          status,
          notes: notes !== undefined ? notes : d.notes,
          verifiedBy: currentUser.name,
          verifiedAt: new Date().toISOString().split('T')[0],
        };
      }
      return d;
    });
    setDocuments(updated);
    CAStore.saveDocuments(updated);
    CAStore.logAction(currentUser, 'VERIFY_DOCUMENT', 'Documents', `Updated document verification status to ${status}`);
    setAuditLogs(CAStore.getAuditLogs());
  };

  const addTimesheetEntry = (entryData: Omit<TimesheetEntry, 'id' | 'status'>) => {
    const newEntry: TimesheetEntry = {
      ...entryData,
      id: `ts-${Date.now()}`,
      status: currentUser.role === 'partner' ? 'Approved' : 'Submitted',
      approvedBy: currentUser.role === 'partner' ? currentUser.name : undefined,
      approvedAt: currentUser.role === 'partner' ? new Date().toLocaleString() : undefined,
    };
    const updated = [newEntry, ...timesheets];
    setTimesheets(updated);
    CAStore.saveTimesheets(updated);
    CAStore.logAction(currentUser, 'LOG_TIMESHEET', 'Timesheet', `Logged ${newEntry.hours} hrs on ${newEntry.clientName}`);
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Timesheet Logged', `${newEntry.hours} hrs recorded for ${newEntry.clientName}.`, 'Low');
  };

  const approveTimesheetEntry = (id: string) => {
    const updated = timesheets.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: 'Approved' as const,
          approvedBy: currentUser.name,
          approvedAt: new Date().toLocaleString(),
        };
      }
      return t;
    });
    setTimesheets(updated);
    CAStore.saveTimesheets(updated);
    CAStore.logAction(currentUser, 'APPROVE_TIMESHEET', 'Timesheet', `Approved timesheet entry ID ${id}`);
    setAuditLogs(CAStore.getAuditLogs());
  };

  const addCommunication = (commData: Omit<CommunicationLog, 'id'>) => {
    const newComm: CommunicationLog = {
      ...commData,
      id: `comm-${Date.now()}`,
    };
    const updated = [newComm, ...communications];
    setCommunications(updated);
    CAStore.saveCommunications(updated);
    CAStore.logAction(currentUser, 'LOG_COMMUNICATION', 'Communication', `Logged client interaction with ${newComm.clientName}`);
    setAuditLogs(CAStore.getAuditLogs());
  };

  const addNotification = (
    title: string,
    message: string,
    priority: NotificationItem['priority'] = 'Medium',
    type: NotificationItem['type'] = 'system'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      priority,
      type,
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    CAStore.saveNotifications(updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    CAStore.saveNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    CAStore.saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    CAStore.saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    CAStore.saveNotifications([]);
  };

  const resetDatabase = () => {
    CAStore.resetAllToDefaults();
    setUsers(CAStore.getUsers());
    setCurrentUser(CAStore.getCurrentUser());
    setClients(CAStore.getClients());
    setAssignments(CAStore.getAssignments());
    setTasks(CAStore.getTasks());
    setComplianceItems(CAStore.getComplianceItems());
    setDocuments(CAStore.getDocuments());
    setTimesheets(CAStore.getTimesheets());
    setCommunications(CAStore.getCommunications());
    setNotifications(CAStore.getNotifications());
    setAuditLogs(CAStore.getAuditLogs());
    addNotification('Database Reset', 'Sample CA Firm demo data has been restored to default state.', 'Low');
  };

  return (
    <CAContext.Provider
      value={{
        firmProfile,
        updateFirmProfile,
        users,
        currentUser,
        switchUser,
        switchRole,
        updateUser,
        addUser,
        deleteUser,
        clients,
        addClient,
        updateClient,
        deleteClient,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        advanceTaskWorkflow,
        addReviewComment,
        complianceItems,
        updateComplianceStatus,
        addComplianceItem,
        escalateCompliance,
        documents,
        addDocument,
        updateDocumentStatus,
        timesheets,
        addTimesheetEntry,
        approveTimesheetEntry,
        communications,
        addCommunication,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification,
        auditLogs,
        activeTab,
        setActiveTab,
        selectedAssignmentId,
        setSelectedAssignmentId,
        selectedTaskId,
        setSelectedTaskId,
        resetDatabase,
        globalSearchQuery,
        setGlobalSearchQuery,
      }}
    >
      {children}
    </CAContext.Provider>
  );
};

export const useCA = () => {
  const context = useContext(CAContext);
  if (!context) {
    throw new Error('useCA must be used within a CAProvider');
  }
  return context;
};
