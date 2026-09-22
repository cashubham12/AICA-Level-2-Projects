import React, { useState } from 'react';
import { useCA } from '../../context/CAContext';
import { User, UserRole, Client } from '../../types';
import {
  Building2,
  Users,
  ShieldCheck,
  UserCheck,
  Award,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileCheck,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  Building,
  RotateCcw,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';
import { EditFirmModal } from './EditFirmModal';
import { EditUserModal } from './EditUserModal';
import { EditClientModal } from './EditClientModal';

interface FirmSettingsViewProps {
  onOpenAI?: (mode?: string, context?: any) => void;
}

export const FirmSettingsView: React.FC<FirmSettingsViewProps> = ({ onOpenAI }) => {
  const {
    firmProfile,
    users,
    currentUser,
    switchUser,
    deleteUser,
    clients,
    deleteClient,
    resetDatabase,
  } = useCA();

  const [activeTab, setActiveTab] = useState<'firm' | 'team' | 'my-profile' | 'clients' | 'governance'>('firm');
  const [isEditFirmOpen, setIsEditFirmOpen] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [defaultUserRole, setDefaultUserRole] = useState<UserRole>('partner');
  const [selectedClientToEdit, setSelectedClientToEdit] = useState<Client | null>(null);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [teamRoleFilter, setTeamRoleFilter] = useState<string>('ALL');

  const partners = users.filter((u) => u.role === 'partner');
  const managers = users.filter((u) => u.role === 'manager');
  const executives = users.filter((u) => u.role === 'executive');
  const clientUsers = users.filter((u) => u.role === 'client');

  const filteredTeam = users.filter((u) => teamRoleFilter === 'ALL' || u.role === teamRoleFilter);

  const handleOpenAddUser = (role: UserRole = 'partner') => {
    setSelectedUserToEdit(null);
    setDefaultUserRole(role);
    setIsEditUserOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setSelectedUserToEdit(user);
    setIsEditUserOpen(true);
  };

  const handleOpenAddClient = () => {
    setSelectedClientToEdit(null);
    setIsEditClientOpen(true);
  };

  const handleOpenEditClient = (client: Client) => {
    setSelectedClientToEdit(client);
    setIsEditClientOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start md:items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
              {firmProfile.shortName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                  {firmProfile.firmName}
                </h1>
                <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
                  ICAI FRN: {firmProfile.firmRegistrationNumber}
                </span>
                <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full border border-slate-700">
                  {firmProfile.constitution} (Est. {firmProfile.yearOfEstablishment})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {firmProfile.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditFirmOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/20 flex items-center space-x-1.5 active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Firm Profile</span>
            </button>
            <button
              onClick={() => handleOpenAddUser('partner')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Partner / Staff</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto custom-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('firm')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition ${
              activeTab === 'firm'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Firm Profile & ICAI Info</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition ${
              activeTab === 'team'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Partners & Team ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-profile')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition ${
              activeTab === 'my-profile'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>My Active Profile ({currentUser.name})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition ${
              activeTab === 'clients'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Client Registry ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition ${
              activeTab === 'governance'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>SQC 1 & Peer Review</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FIRM PROFILE & MASTER DETAILS */}
      {activeTab === 'firm' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-column details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card: Legal Identity */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <h2 className="font-bold text-sm text-slate-900">ICAI Registration & Identity</h2>
                </div>
                <button
                  onClick={() => setIsEditFirmOpen(true)}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Details
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Firm Full Legal Name</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{firmProfile.firmName}</p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                  <p className="text-[10px] font-bold uppercase text-amber-800">Firm Registration Number (FRN)</p>
                  <p className="font-mono font-bold text-amber-950 text-base mt-0.5">{firmProfile.firmRegistrationNumber}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Constitution / Entity Type</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{firmProfile.constitution}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Year of Establishment</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{firmProfile.yearOfEstablishment} ({new Date().getFullYear() - firmProfile.yearOfEstablishment} Years of Practice)</p>
                </div>
              </div>
            </div>

            {/* Card: Statutory Tax Credentials */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <FileCheck className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-sm text-slate-900">Statutory Tax & Regulatory Identifiers</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Firm Permanent Account Number (PAN)</p>
                  <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{firmProfile.pan}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">GST Identification Number (GSTIN)</p>
                  <p className="font-mono font-bold text-slate-900 text-xs mt-0.5">{firmProfile.gstin}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Tax Deduction Number (TAN)</p>
                  <p className="font-mono font-bold text-slate-900 text-xs mt-0.5">{firmProfile.tan || 'Not Specified'}</p>
                </div>
              </div>
            </div>

            {/* Card: Registered Offices & Locations */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <MapPin className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-sm text-slate-900">Head Office & Branch Network</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                    Principal Head Office
                  </span>
                  <p className="font-semibold text-slate-900 mt-2">
                    {firmProfile.headOfficeAddress.line1}
                  </p>
                  <p className="text-slate-600">
                    {firmProfile.headOfficeAddress.line2}, {firmProfile.headOfficeAddress.city}, {firmProfile.headOfficeAddress.state} - {firmProfile.headOfficeAddress.pincode}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-2">Branch Office Locations</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {firmProfile.branchOffices.map((b, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center space-x-2 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Practice Quick Stats & Key Contacts */}
          <div className="space-y-6">
            {/* Firm Overview Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Official Communication
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2.5 text-slate-700">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-mono">{firmProfile.email}</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-700">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{firmProfile.phone}</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-700">
                  <Globe className="w-4 h-4 text-amber-500 shrink-0" />
                  <a href={firmProfile.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {firmProfile.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Quality Lead Partner */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Quality Control & SQC 1 Partner</span>
              </div>
              <p className="text-slate-800 font-semibold text-sm">
                {firmProfile.qualityControlPartner}
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Designated Engagement Quality Control Reviewer (EQCR) overseeing Standards on Auditing (SAs) and Peer Review compliance.
              </p>
              <div className="pt-2 border-t border-amber-200/60 text-[11px] text-slate-700 space-y-1">
                <p><strong>Peer Review Cert:</strong> {firmProfile.peerReviewCertNo}</p>
                <p><strong>Valid Upto:</strong> {firmProfile.peerReviewValidity}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Practice System Actions
              </h3>
              <button
                onClick={() => setIsEditFirmOpen(true)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition text-center"
              >
                Modify Firm Profile
              </button>
              <button
                onClick={() => handleOpenAddUser('partner')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition text-center shadow-xs"
              >
                Enroll New Partner / CA
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to restore default demo firm data?')) {
                    resetDatabase();
                  }
                }}
                className="w-full py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-medium rounded-xl transition text-center flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARTNERS & TEAM DIRECTORY */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <h2 className="font-bold text-base text-slate-900">Partners & Practice Team Directory</h2>
              <p className="text-slate-500">
                Manage Chartered Accountant partners, audit managers, executives, and article assistants
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                {['ALL', 'partner', 'manager', 'executive', 'client'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTeamRoleFilter(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                      teamRoleFilter === r
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r === 'ALL' ? 'All Roles' : `${r}s`}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleOpenAddUser('partner')}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeam.map((member) => {
              const isCurrent = currentUser.id === member.id;
              return (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl p-5 border transition shadow-xs space-y-4 relative ${
                    isCurrent ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Active Session
                    </span>
                  )}

                  <div className="flex items-start space-x-3.5">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div className="overflow-hidden pr-12">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-bold text-sm text-slate-900 truncate">
                          {member.name}
                        </h3>
                      </div>
                      <p className="text-xs text-amber-700 font-semibold truncate">
                        {member.designation}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {member.department}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                    {member.membershipNo && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-[11px] text-slate-400 font-medium">ICAI Mem. No:</span>
                        <span className="font-mono font-bold text-slate-900">{member.membershipNo}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400 font-medium">Role Type:</span>
                      <span className="font-bold capitalize text-slate-800">{member.role}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400 font-medium">Email:</span>
                      <span className="font-mono text-slate-700 truncate max-w-[170px]">{member.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400 font-medium">Phone:</span>
                      <span className="text-slate-700">{member.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 pt-1">
                      <span className="text-[11px] text-slate-400 font-medium">Rates (Cost / Billable):</span>
                      <span className="font-mono font-semibold text-slate-900">
                        ₹{member.hourlyCostRate} / ₹{member.hourlyBillingRate} /hr
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    {!isCurrent ? (
                      <button
                        onClick={() => switchUser(member.id)}
                        className="text-amber-600 hover:text-amber-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Switch Session</span>
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Logged In</span>
                      </span>
                    )}

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEditUser(member)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {users.length > 1 && !isCurrent && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${member.name} from directory?`)) {
                              deleteUser(member.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MY ACTIVE PROFILE */}
      {activeTab === 'my-profile' && (
        <div className="max-w-2xl bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <h2 className="font-bold text-base text-slate-900">{currentUser.name}</h2>
                <p className="text-xs text-amber-700 font-semibold">{currentUser.designation}</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenEditUser(currentUser)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit My Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase text-slate-400">Full Name</p>
              <p className="font-semibold text-slate-900 mt-0.5 text-sm">{currentUser.name}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase text-slate-400">ICAI Membership No.</p>
              <p className="font-mono font-bold text-slate-900 mt-0.5">{currentUser.membershipNo || 'N/A'}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase text-slate-400">Role Mode</p>
              <p className="font-semibold capitalize text-slate-800 mt-0.5">{currentUser.role}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase text-slate-400">Practice Department</p>
              <p className="font-semibold text-slate-800 mt-0.5">{currentUser.department}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase text-slate-400">Official Email</p>
              <p className="font-mono font-semibold text-slate-800 mt-0.5">{currentUser.email}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase text-slate-400">Contact Number</p>
              <p className="font-semibold text-slate-800 mt-0.5">{currentUser.phone}</p>
            </div>
            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 sm:col-span-2">
              <p className="text-[10px] font-bold uppercase text-amber-800">Assigned Hourly Rate Attribution</p>
              <p className="font-mono font-bold text-amber-950 mt-0.5 text-sm">
                Cost Rate: ₹{currentUser.hourlyCostRate}/hr | Billing Rate: ₹{currentUser.hourlyBillingRate}/hr
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLIENTS REGISTRY */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <h2 className="font-bold text-base text-slate-900">Client Entities Registry</h2>
              <p className="text-slate-500">
                Corporate clients, contact persons, tax registration numbers, and assigned engagement partners
              </p>
            </div>

            <button
              onClick={handleOpenAddClient}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Client</span>
            </button>
          </div>

          {/* Client Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Client Name & Code</th>
                    <th className="py-3 px-4">Industry Sector</th>
                    <th className="py-3 px-4">PAN / GSTIN</th>
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">Partner In-Charge</th>
                    <th className="py-3 px-4">Annual Fee</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{c.clientCode}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{c.industry}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div>PAN: {c.pan}</div>
                        <div className="text-slate-500">GST: {c.gstin}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{c.contactPerson}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{c.partnerInCharge}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{(c.feeArrangement || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEditClient(c)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Edit Client"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {clients.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete client record for ${c.name}?`)) {
                                  deleteClient(c.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                              title="Delete Client"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SQC 1 & PEER REVIEW GOVERNANCE */}
      {activeTab === 'governance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Award className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-sm text-slate-900">ICAI Peer Review Board Status</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-emerald-800">Peer Review Certificate Status</p>
                  <p className="font-bold text-emerald-950 text-sm mt-0.5">Active & Valid</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Certificate No.</p>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{firmProfile.peerReviewCertNo}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Validity Expiry</p>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{firmProfile.peerReviewValidity}</p>
                </div>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Eligible to audit listed entities, public sector enterprises, and large corporate entities under ICAI Peer Review Mandate.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-sm text-slate-900">SQC 1 Quality Policy & Four-Eye Review</h2>
            </div>
            <div className="space-y-3 text-slate-700 leading-relaxed text-[11px]">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">Standard Review Workflow:</p>
                <p>1. Executive / Article Fieldwork & Substantive Sampling</p>
                <p>2. Senior Associate Cross-Verification & Checklist</p>
                <p>3. Audit Manager Working Paper Sign-off</p>
                <p>4. Signing Partner Approval & UDIN Generation</p>
              </div>
              <p className="text-slate-500">
                All changes to audit reports and working papers are recorded in the permanent audit trail log with timestamps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <EditFirmModal
        isOpen={isEditFirmOpen}
        onClose={() => setIsEditFirmOpen(false)}
      />

      <EditUserModal
        isOpen={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        userToEdit={selectedUserToEdit}
        defaultRole={defaultUserRole}
      />

      <EditClientModal
        isOpen={isEditClientOpen}
        onClose={() => setIsEditClientOpen(false)}
        clientToEdit={selectedClientToEdit}
      />
    </div>
  );
};
