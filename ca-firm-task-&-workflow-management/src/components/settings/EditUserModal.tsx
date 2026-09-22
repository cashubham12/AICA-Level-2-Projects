import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { useCA } from '../../context/CAContext';
import { X, UserCheck, ShieldCheck, Mail, Phone, Award, DollarSign, Briefcase, Building } from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null; // null means adding a new user
  defaultRole?: UserRole;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  defaultRole = 'partner',
}) => {
  const { updateUser, addUser, users } = useCA();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: defaultRole as UserRole,
    designation: '',
    department: '',
    phone: '',
    membershipNo: '',
    hourlyCostRate: 2000,
    hourlyBillingRate: 5000,
    avatarUrl: '',
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        designation: userToEdit.designation,
        department: userToEdit.department,
        phone: userToEdit.phone,
        membershipNo: userToEdit.membershipNo || '',
        hourlyCostRate: userToEdit.hourlyCostRate,
        hourlyBillingRate: userToEdit.hourlyBillingRate,
        avatarUrl: userToEdit.avatarUrl,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: defaultRole,
        designation: defaultRole === 'partner' ? 'Partner - Audit & Assurance' : defaultRole === 'manager' ? 'Audit Manager' : 'Article Assistant / Executive',
        department: 'Statutory & Tax Audit',
        phone: '+91 98000 00000',
        membershipNo: defaultRole === 'partner' ? 'FCA-' : defaultRole === 'manager' ? 'ACA-' : '',
        hourlyCostRate: defaultRole === 'partner' ? 4000 : defaultRole === 'manager' ? 2200 : 750,
        hourlyBillingRate: defaultRole === 'partner' ? 11000 : defaultRole === 'manager' ? 5500 : 2000,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }
  }, [userToEdit, defaultRole, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please enter both Name and Email.');
      return;
    }

    if (userToEdit) {
      updateUser(userToEdit.id, formData);
    } else {
      addUser(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {userToEdit ? `Edit ${userToEdit.role === 'partner' ? 'Partner' : 'Team Member'}: ${userToEdit.name}` : `Add New ${formData.role === 'partner' ? 'Partner' : 'Team Member'}`}
              </h2>
              <p className="text-xs text-slate-400">
                Update professional designation, ICAI membership credentials, rates & contact info
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar text-xs">
          {/* Row 1: Role & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Role Type *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
              >
                <option value="partner">Partner (FCA / Signing)</option>
                <option value="manager">Manager (Audit / Tax ACA)</option>
                <option value="executive">Executive / Article Assistant</option>
                <option value="client">Client Representative</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Full Name with Prefix *</label>
              <input
                type="text"
                required
                placeholder="e.g. CA Rajeshwar Singhania or CA Shubham Choudhary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Row 2: Designation & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Designation *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Partner - Audit & Assurance"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department / Practice Area *</label>
              <input
                type="text"
                required
                placeholder="e.g. Statutory & Forensic Audit"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: ICAI Membership Number & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ICAI Membership No. {formData.role === 'partner' || formData.role === 'manager' ? '(Mandatory for Sign-off)' : '(Optional)'}
              </label>
              <div className="relative">
                <Award className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. FCA-084291 or ACA-145882"
                  value={formData.membershipNo}
                  onChange={(e) => setFormData({ ...formData, membershipNo: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official Mobile / Direct Phone</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 98201 23456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Email Address & Avatar URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="partner@firm.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Avatar Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-600"
              />
            </div>
          </div>

          {/* Row 5: Financial Hourly Rates */}
          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-900 font-bold">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Engagement Costing & Billing Rates (INR per hour)</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Used in assignment direct labor cost calculations and profit margin realization analysis.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Internal Direct Cost (₹ / hr)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={formData.hourlyCostRate}
                  onChange={(e) => setFormData({ ...formData, hourlyCostRate: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Client Billable Rate (₹ / hr)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.hourlyBillingRate}
                  onChange={(e) => setFormData({ ...formData, hourlyBillingRate: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{userToEdit ? 'Save Changes' : 'Create Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
