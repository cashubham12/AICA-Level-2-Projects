import React, { useState, useEffect, useRef } from 'react';
import { useCA } from '../../context/CAContext';
import {
  Bell,
  Search,
  Sparkles,
  UserCheck,
  ChevronDown,
  ShieldAlert,
  Clock,
  RotateCcw,
  CheckCircle2,
  Building2,
  X,
  Trash2,
  Check,
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenAI: (mode?: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAI, onOpenSearch }) => {
  const {
    firmProfile,
    currentUser,
    users,
    switchUser,
    switchRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    resetDatabase,
    setActiveTab,
  } = useCA();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle Escape key and outside/side click to dismiss menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showNotifMenu) setShowNotifMenu(false);
        if (showUserMenu) setShowUserMenu(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        showNotifMenu &&
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setShowNotifMenu(false);
      }
      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showNotifMenu || showUserMenu) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifMenu, showUserMenu]);

  const roleColors: Record<UserRole, string> = {
    partner: 'bg-amber-100 text-amber-900 border-amber-300',
    manager: 'bg-blue-100 text-blue-900 border-blue-300',
    executive: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    client: 'bg-purple-100 text-purple-900 border-purple-300',
  };

  return (
    <header className="h-16 bg-slate-900 text-white border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Brand & Firm Title */}
      <div
        onClick={() => setActiveTab('settings')}
        className="flex items-center space-x-3 cursor-pointer group transition"
        title="Click to view & edit Firm Profile / Settings"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg tracking-tighter group-hover:scale-105 transition shrink-0">
          {firmProfile.shortName.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-base text-slate-100 tracking-tight flex items-center gap-1.5 group-hover:text-amber-400 transition">
              {firmProfile.shortName} <span className="text-xs font-normal text-amber-400 hidden sm:inline">| Chartered Accountants</span>
            </h1>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
              ICAI: {firmProfile.firmRegistrationNumber}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block truncate max-w-md">
            {firmProfile.tagline}
          </p>
        </div>
      </div>

      {/* Global Search & AI Shortcut & Actions */}
      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs transition shadow-inner"
          title="Search Assignments, Tasks, Clients (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search records...</span>
          <kbd className="hidden sm:inline bg-slate-900 text-[10px] text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Gemini AI Assistant Button */}
        <button
          onClick={() => onOpenAI()}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-md shadow-amber-500/20 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Gemini CA AI</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className={`relative p-2 rounded-lg border transition ${
              showNotifMenu
                ? 'bg-slate-700 text-white border-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
            }`}
            aria-label="Notifications"
            title="Notifications (Click or press Esc to dismiss)"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-sm">Notifications & Alerts</span>
                  {unreadCount > 0 && (
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-mono hidden sm:inline" title="Press Esc or click outside to dismiss">
                    Esc
                  </span>
                  <button
                    onClick={() => setShowNotifMenu(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Close notifications (Esc)"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-header controls */}
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>{notifications.length} Total alert{notifications.length === 1 ? '' : 's'}</span>
                <div className="flex items-center space-x-3">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-slate-700 hover:text-amber-700 hover:underline flex items-center space-x-1 font-medium transition"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Mark all read</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-rose-600 hover:text-rose-800 hover:underline flex items-center space-x-1 font-medium transition"
                      title="Clear and remove all notifications"
                    >
                      <Trash2 className="w-3 h-3 text-rose-500" />
                      <span>Clear all</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
                      <Bell className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-700 text-xs">No notifications</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">All firm alerts and task assignments are caught up.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 hover:bg-slate-50 cursor-pointer transition flex items-start space-x-2.5 group relative ${
                        !n.read ? 'bg-amber-50/70 border-l-2 border-amber-500' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.priority === 'Critical' ? (
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                        ) : n.type === 'approval' ? (
                          <UserCheck className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold ${!n.read ? 'text-slate-950' : 'text-slate-700'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                      </div>

                      {/* Remove single notification button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n.id);
                        }}
                        className="absolute top-2.5 right-2 opacity-60 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                        title="Remove notification"
                        aria-label="Remove notification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className="p-2 bg-slate-100 text-slate-500 text-[10px] text-center border-t border-slate-200">
                Press <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded font-mono text-[9px]">Esc</kbd> or click outside to dismiss
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher & Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition text-left"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/50"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold leading-none text-slate-100">{currentUser.name}</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <span
                  className={`text-[9px] uppercase font-bold px-1 py-0.2 rounded border ${roleColors[currentUser.role]}`}
                >
                  {currentUser.role}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                  {currentUser.designation.split('-')[0]}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 bg-slate-900 text-white border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-100">{currentUser.name}</p>
                    <p className="text-[11px] text-amber-300 font-mono">{currentUser.membershipNo || 'ICAI Registered'}</p>
                    <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Quick Role Simulation */}
              <div className="p-2 bg-slate-50 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1.5">
                  Simulate Role Dashboard
                </p>
                <div className="grid grid-cols-2 gap-1 px-1">
                  {(['partner', 'manager', 'executive', 'client'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setShowUserMenu(false);
                      }}
                      className={`text-left px-2 py-1.5 rounded text-[11px] font-medium capitalize transition flex items-center justify-between ${
                        currentUser.role === r
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <span>{r} View</span>
                      {currentUser.role === r && <CheckCircle2 className="w-3 h-3 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Switch User Accounts */}
              <div className="p-2 max-h-56 overflow-y-auto">
                <p className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">
                  Team Members & Accounts
                </p>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center space-x-2 transition ${
                      currentUser.id === u.id
                        ? 'bg-amber-50 text-amber-950 font-semibold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex-1 truncate">
                      <p className="truncate text-xs">{u.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{u.role} - {u.designation}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-2 bg-slate-50 border-t border-slate-100 flex flex-col space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 text-[11px] text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 font-semibold px-2 py-1.5 rounded-lg transition"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Firm & Team Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Reset demo database to original sample data?')) {
                      resetDatabase();
                      setShowUserMenu(false);
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-1 text-[11px] text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
