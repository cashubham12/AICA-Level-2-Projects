import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import { useCA } from '../../context/CAContext';
import { X, Building, ShieldCheck, Mail, Phone, User, DollarSign, FileText } from 'lucide-react';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit: Client | null;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  clientToEdit,
}) => {
  const { updateClient, addClient, users } = useCA();

  const partnerList = users.filter((u) => u.role === 'partner');
  const managerList = users.filter((u) => u.role === 'manager');

  const [formData, setFormData] = useState({
    name: '',
    industry: 'Manufacturing',
    pan: '',
    gstin: '',
    contactPerson: '',
    email: '',
    phone: '',
    turnover: '₹100 Cr - ₹500 Cr',
    partnerInCharge: partnerList[0]?.name || 'CA Rajeshwar Singhania',
    managerInCharge: managerList[0]?.name || 'CA Priya Mehta',
    auditType: 'Statutory & Tax Audit',
    feeArrangement: 500000,
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name,
        industry: clientToEdit.industry,
        pan: clientToEdit.pan,
        gstin: clientToEdit.gstin,
        contactPerson: clientToEdit.contactPerson,
        email: clientToEdit.email,
        phone: clientToEdit.phone,
        turnover: clientToEdit.turnover,
        partnerInCharge: clientToEdit.partnerInCharge,
        managerInCharge: clientToEdit.managerInCharge,
        auditType: clientToEdit.auditType,
        feeArrangement: clientToEdit.feeArrangement,
      });
    } else {
      setFormData({
        name: '',
        industry: 'Manufacturing',
        pan: '',
        gstin: '',
        contactPerson: '',
        email: '',
        phone: '+91 98000 00000',
        turnover: '₹50 Cr - ₹250 Cr',
        partnerInCharge: partnerList[0]?.name || 'CA Rajeshwar Singhania',
        managerInCharge: managerList[0]?.name || 'CA Priya Mehta',
        auditType: 'Statutory & Tax Audit',
        feeArrangement: 450000,
      });
    }
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Client Name is required.');
      return;
    }

    if (clientToEdit) {
      updateClient(clientToEdit.id, formData);
    } else {
      addClient(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {clientToEdit ? `Edit Client: ${clientToEdit.name}` : 'Add New Client Entity'}
              </h2>
              <p className="text-xs text-slate-400">
                Update corporate statutory details, audit scope, partner in-charge & contacts
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar text-xs">
          {/* Row 1: Client Entity Name & Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Company / Entity Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Pharma Solutions Ltd"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Industry Sector</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
              >
                <option value="Pharmaceuticals">Pharmaceuticals</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Banking & NBFC">Banking & NBFC</option>
                <option value="Real Estate & Infra">Real Estate & Infra</option>
                <option value="Retail & FMCG">Retail & FMCG</option>
                <option value="Steel & Heavy Engineering">Steel & Heavy Engineering</option>
                <option value="Services & Consulting">Services & Consulting</option>
              </select>
            </div>
          </div>

          {/* Row 2: PAN & GSTIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Entity PAN *</label>
              <input
                type="text"
                required
                placeholder="AAICA1234F"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">GSTIN Number *</label>
              <input
                type="text"
                required
                placeholder="27AAICA1234F1Z5"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Row 3: Contact Person & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Key Contact Person (CFO / MD / Head of Accounts)</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar (CFO)"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Contact Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  placeholder="accounts@client.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Phone & Turnover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Annual Turnover Bracket</label>
              <input
                type="text"
                placeholder="₹100 Cr - ₹500 Cr"
                value={formData.turnover}
                onChange={(e) => setFormData({ ...formData, turnover: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Engagement Allocation & Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Partner In-Charge</label>
              <select
                value={formData.partnerInCharge}
                onChange={(e) => setFormData({ ...formData, partnerInCharge: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
              >
                {partnerList.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Manager In-Charge</label>
              <select
                value={formData.managerInCharge}
                onChange={(e) => setFormData({ ...formData, managerInCharge: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
              >
                {managerList.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Agreed Annual Fee (INR)</label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.feeArrangement}
                  onChange={(e) => setFormData({ ...formData, feeArrangement: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
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
              <span>{clientToEdit ? 'Save Client Details' : 'Create Client Entity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
