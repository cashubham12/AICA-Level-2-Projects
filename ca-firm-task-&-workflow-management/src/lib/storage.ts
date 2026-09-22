import {
  User,
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
  FirmProfile,
} from '../types';
import {
  initialFirmProfile,
  initialUsers,
  initialClients,
  initialAssignments,
  initialTasks,
  initialComplianceItems,
  initialDocuments,
  initialTimesheets,
  initialCommunications,
  initialNotifications,
  initialAuditLogs,
} from '../data/mockData';

const STORAGE_KEYS = {
  FIRM_PROFILE: 'ca_firm_profile_v1',
  USERS: 'ca_firm_users_v1',
  CURRENT_USER_ID: 'ca_firm_current_user_v1',
  CLIENTS: 'ca_firm_clients_v1',
  ASSIGNMENTS: 'ca_firm_assignments_v1',
  TASKS: 'ca_firm_tasks_v1',
  COMPLIANCE: 'ca_firm_compliance_v1',
  DOCUMENTS: 'ca_firm_documents_v1',
  TIMESHEETS: 'ca_firm_timesheets_v1',
  COMMUNICATIONS: 'ca_firm_communications_v1',
  NOTIFICATIONS: 'ca_firm_notifications_v1',
  AUDIT_LOGS: 'ca_firm_audit_logs_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

export class CAStore {
  static getFirmProfile(): FirmProfile {
    return loadStorage<FirmProfile>(STORAGE_KEYS.FIRM_PROFILE, initialFirmProfile);
  }

  static saveFirmProfile(profile: FirmProfile) {
    saveStorage(STORAGE_KEYS.FIRM_PROFILE, profile);
  }

  static getUsers(): User[] {
    return loadStorage<User[]>(STORAGE_KEYS.USERS, initialUsers);
  }

  static saveUsers(users: User[]) {
    saveStorage(STORAGE_KEYS.USERS, users);
  }

  static getCurrentUser(): User {
    const users = this.getUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-partner-1';
    return users.find((u) => u.id === currentId) || users[0];
  }

  static setCurrentUser(userId: string): User {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    return this.getCurrentUser();
  }

  static getClients(): Client[] {
    return loadStorage<Client[]>(STORAGE_KEYS.CLIENTS, initialClients);
  }

  static saveClients(clients: Client[]) {
    saveStorage(STORAGE_KEYS.CLIENTS, clients);
  }

  static getAssignments(): Assignment[] {
    return loadStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
  }

  static saveAssignments(assignments: Assignment[]) {
    saveStorage(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }

  static getTasks(): Task[] {
    return loadStorage<Task[]>(STORAGE_KEYS.TASKS, initialTasks);
  }

  static saveTasks(tasks: Task[]) {
    saveStorage(STORAGE_KEYS.TASKS, tasks);
  }

  static getComplianceItems(): ComplianceItem[] {
    return loadStorage<ComplianceItem[]>(STORAGE_KEYS.COMPLIANCE, initialComplianceItems);
  }

  static saveComplianceItems(items: ComplianceItem[]) {
    saveStorage(STORAGE_KEYS.COMPLIANCE, items);
  }

  static getDocuments(): DocumentItem[] {
    return loadStorage<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, initialDocuments);
  }

  static saveDocuments(docs: DocumentItem[]) {
    saveStorage(STORAGE_KEYS.DOCUMENTS, docs);
  }

  static getTimesheets(): TimesheetEntry[] {
    return loadStorage<TimesheetEntry[]>(STORAGE_KEYS.TIMESHEETS, initialTimesheets);
  }

  static saveTimesheets(entries: TimesheetEntry[]) {
    saveStorage(STORAGE_KEYS.TIMESHEETS, entries);
  }

  static getCommunications(): CommunicationLog[] {
    return loadStorage<CommunicationLog[]>(STORAGE_KEYS.COMMUNICATIONS, initialCommunications);
  }

  static saveCommunications(comms: CommunicationLog[]) {
    saveStorage(STORAGE_KEYS.COMMUNICATIONS, comms);
  }

  static getNotifications(): NotificationItem[] {
    return loadStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }

  static saveNotifications(notifs: NotificationItem[]) {
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  static getAuditLogs(): AuditLogEntry[] {
    return loadStorage<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }

  static logAction(user: User, action: string, module: string, details: string) {
    const logs = this.getAuditLogs();
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      module,
      details,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
    };
    logs.unshift(newLog);
    saveStorage(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200));
  }

  static resetAllToDefaults() {
    saveStorage(STORAGE_KEYS.FIRM_PROFILE, initialFirmProfile);
    saveStorage(STORAGE_KEYS.USERS, initialUsers);
    saveStorage(STORAGE_KEYS.CLIENTS, initialClients);
    saveStorage(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
    saveStorage(STORAGE_KEYS.TASKS, initialTasks);
    saveStorage(STORAGE_KEYS.COMPLIANCE, initialComplianceItems);
    saveStorage(STORAGE_KEYS.DOCUMENTS, initialDocuments);
    saveStorage(STORAGE_KEYS.TIMESHEETS, initialTimesheets);
    saveStorage(STORAGE_KEYS.COMMUNICATIONS, initialCommunications);
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    saveStorage(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-partner-1');
  }
}
