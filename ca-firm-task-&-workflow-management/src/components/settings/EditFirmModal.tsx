import React, { useState, useEffect } from 'react';
import { useCA } from '../../context/CAContext';
import {
  Building2,
  X,
  ShieldCheck,
  Award,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileCheck2,
  Calendar,
  Layers,
} from 'lucide-react';

interface EditFirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditFirmModal: React.FC<EditFirmModalProps> = ({ isOpen, onClose }) => {
  const { firmProfile, updateFirmProfile, users } = useCA();

  const [formData, setFormData] = useState({
    firmName: firmProfile.firmName,
    shortName: firmProfile.shortName,
    tagline: firmProfile.tagline,
    firmRegistrationNumber: firmProfile.firmRegistrationNumber,
    constitution: firmProfile.constitution,
    yearOfEstablishment: firmProfile.yearOfEstablishment,
    peerReviewCertNo: firmProfile.peerReviewCertNo,
    peerReviewValidity: firmProfile.peerReviewValidity,
    pan: firmProfile.pan,
    gstin: firmProfile.gstin,
    tan: firmProfile.tan || '',
    email: firmProfile.email,
    phone: firmProfile.phone,
    website: firmProfile.website,
    line1: firmProfile.headOfficeAddress.line1,
    line2: firmProfile.headOfficeAddress.line2,
    city: firmProfile.headOfficeAddress.city,
    state: firmProfile.headOfficeAddress.state,
    pincode: firmProfile.headOfficeAddress.pincode,
    branchOffices: firmProfile.branchOffices.join('\n'),
    qualityControlPartner: firmProfile.qualityControlPartner,
    defaultFinancialYear: firmProfile.defaultFinancialYear,
    defaultAssessmentYear: firmProfile.defaultAssessmentYear,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firmName: firmProfile.firmName,
        shortName: firmProfile.shortName,
        tagline: firmProfile.tagline,
        firmRegistrationNumber: firmProfile.firmRegistrationNumber,
        constitution: firmProfile.constitution,
        yearOfEstablishment: firmProfile.yearOfEstablishment,
        peerReviewCertNo: firmProfile.peerReviewCertNo,
        peerReviewValidity: firmProfile.peerReviewValidity,
        pan: firmProfile.pan,
        gstin: firmProfile.gstin,
        tan: firmProfile.tan || '',
        email: firmProfile.email,
        phone: firmProfile.phone,
        website: firmProfile.website,
        line1: firmProfile.headOfficeAddress.line1,
        line2: firmProfile.headOfficeAddress.line2,
        city: firmProfile.headOfficeAddress.city,
        state: firmProfile.headOfficeAddress.state,
        pincode: firmProfile.headOfficeAddress.pincode,
        branchOffices: firmProfile.branchOffices.join('\n'),
        qualityControlPartner: firmProfile.qualityControlPartner,
        defaultFinancialYear: firmProfile.defaultFinancialYear,
        defaultAssessmentYear: firmProfile.defaultAssessmentYear,
      });
    }
  }, [firmProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firmName.trim()) {
      alert('Firm Name is required.');
      return;
    }

    updateFirmProfile({
      firmName: formData.firmName,
      shortName: formData.shortName || formData.firmName,
      tagline: formData.tagline,
      firmRegistrationNumber: formData.firmRegistrationNumber,
      constitution: formData.constitution as any,
      yearOfEstablishment: Number(formData.yearOfEstablishment),
      peerReviewCertNo: formData.peerReviewCertNo,
      peerReviewValidity: formData.peerReviewValidity,
      pan: formData.pan,
      gstin: formData.gstin,
      tan: formData.tan,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      headOfficeAddress: {
        line1: formData.line1,
        line2: formData.line2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      branchOffices: formData.branchOffices
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      qualityControlPartner: formData.qualityControlPartner,
      defaultFinancialYear: formData.defaultFinancialYear,
      defaultAssessmentYear: formData.defaultAssessmentYear,
    });

    onClose();
  };

  const partnerList = users.filter((u) => u.role === 'partner');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Edit Chartered Accountant Firm Master Details
              </h2>
              <p className="text-xs text-slate-400">
                Update ICAI Firm Registration Number (FRN), Registered Offices, Peer Review & Practice Information
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
          {/* Section: Basic Identity */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>1. ICAI Registration & Legal Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Firm Legal Name (as per ICAI Register) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex & Associates, Chartered Accountants"
                  value={formData.firmName}
                  onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Short Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex & Associates"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ICAI Firm Registration No. (FRN) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 104522W"
                  value={formData.firmRegistrationNumber}
                  onChange={(e) => setFormData({ ...formData, firmRegistrationNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold text-amber-900 bg-amber-50/50"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Constitution Type</label>
                <select
                  value={formData.constitution}
                  onChange={(e) => setFormData({ ...formData, constitution: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                >
                  <option value="Partnership Firm">Partnership Firm</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Individual Practice">Individual Practice</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Year Established</label>
                <input
                  type="number"
                  min="1940"
                  max="2030"
                  value={formData.yearOfEstablishment}
                  onChange={(e) => setFormData({ ...formData, yearOfEstablishment: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-slate-700 font-semibold mb-1">
                Firm Tagline / Portal Subheading
              </label>
              <input
                type="text"
                placeholder="e.g. Enterprise Practice, Workflow Governance & Statutory Audit Portal"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section: Peer Review & Quality Governance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 pt-2">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Peer Review & SQC 1 Quality Governance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Peer Review Certificate No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. PR-2023-09412"
                  value={formData.peerReviewCertNo}
                  onChange={(e) => setFormData({ ...formData, peerReviewCertNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Peer Review Valid Upto
                </label>
                <input
                  type="date"
                  value={formData.peerReviewValidity}
                  onChange={(e) => setFormData({ ...formData, peerReviewValidity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Quality Control Lead Partner
                </label>
                <select
                  value={formData.qualityControlPartner}
                  onChange={(e) => setFormData({ ...formData, qualityControlPartner: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                >
                  {partnerList.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.membershipNo || 'Partner'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Tax Identifiers & Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 pt-2">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-500" />
              <span>3. Statutory Tax Numbers & Official Communication</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Firm PAN</label>
                <input
                  type="text"
                  placeholder="AAIFA1988K"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Firm GSTIN</label>
                <input
                  type="text"
                  placeholder="27AAIFA1988K1Z3"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Firm TAN (Optional)</label>
                <input
                  type="text"
                  placeholder="MUMA12345E"
                  value={formData.tan}
                  onChange={(e) => setFormData({ ...formData, tan: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="contact@firm.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Direct Landline / Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="+91 (022) 2854-9900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Firm Website URL</label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="https://firm.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Head Office Address & Branches */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 pt-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>4. Head Office & Branch Locations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Address Line 1</label>
                <input
                  type="text"
                  placeholder="Tower 4, 8th Floor, Express Trade Center"
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Address Line 2 (Area/Locality)</label>
                <input
                  type="text"
                  placeholder="Bandra-Kurla Complex (BKC)"
                  value={formData.line2}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">City</label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">State</label>
                <input
                  type="text"
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">PIN Code</label>
                <input
                  type="text"
                  placeholder="400051"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-slate-700 font-semibold mb-1">
                Branch Offices (One per line)
              </label>
              <textarea
                rows={3}
                placeholder="Connaught Place, New Delhi - 110001&#10;Indiranagar, Bengaluru - 560038"
                value={formData.branchOffices}
                onChange={(e) => setFormData({ ...formData, branchOffices: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Section: Practice Defaults */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 pt-2">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>5. Financial & Assessment Year Defaults</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Current Financial Year (FY)</label>
                <input
                  type="text"
                  placeholder="2024-25"
                  value={formData.defaultFinancialYear}
                  onChange={(e) => setFormData({ ...formData, defaultFinancialYear: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Current Assessment Year (AY)</label>
                <input
                  type="text"
                  placeholder="2025-26"
                  value={formData.defaultAssessmentYear}
                  onChange={(e) => setFormData({ ...formData, defaultAssessmentYear: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
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
              <span>Save & Update Firm Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
