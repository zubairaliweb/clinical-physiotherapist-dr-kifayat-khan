import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  User,
  Edit2,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../lib/api';
import { CustomerRecord } from '../../types';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [viewCustomer, setViewCustomer] = useState<CustomerRecord | null>(null);
  const [editCustomer, setEditCustomer] = useState<CustomerRecord | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStatus, setFormStatus] = useState<CustomerRecord['status']>('Active');
  const [formNotes, setFormNotes] = useState('');
  const [formAdditionalInfo, setFormAdditionalInfo] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCustomers({
        search: searchTerm,
        status: statusFilter,
        limit: 100,
      });
      setCustomers(res.items);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load customer records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const openAddModal = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStatus('Active');
    setFormNotes('');
    setFormAdditionalInfo('');
    setFormError(null);
    setIsAddingNew(true);
  };

  const openEditModal = (c: CustomerRecord) => {
    setEditCustomer(c);
    setFormName(c.fullName);
    setFormPhone(c.phoneNumber);
    setFormEmail(c.email || '');
    setFormAddress(c.address || '');
    setFormDate(c.date || new Date().toISOString().split('T')[0]);
    setFormStatus(c.status);
    setFormNotes(c.notes || '');
    setFormAdditionalInfo(c.additionalInfo || '');
    setFormError(null);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || !formPhone.trim()) {
      setFormError('Customer Full Name and Phone Number are required.');
      return;
    }

    setFormSubmitting(true);
    try {
      if (editCustomer) {
        await api.updateCustomer(editCustomer.id, {
          fullName: formName.trim(),
          phoneNumber: formPhone.trim(),
          email: formEmail.trim(),
          address: formAddress.trim(),
          date: formDate,
          status: formStatus,
          notes: formNotes.trim(),
          additionalInfo: formAdditionalInfo.trim(),
        });
        setEditCustomer(null);
      } else {
        await api.addCustomer({
          fullName: formName.trim(),
          phoneNumber: formPhone.trim(),
          email: formEmail.trim(),
          address: formAddress.trim(),
          date: formDate,
          status: formStatus,
          notes: formNotes.trim(),
          additionalInfo: formAdditionalInfo.trim(),
        });
        setIsAddingNew(false);
      }
      await fetchCustomers();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCustomer(id);
      setDeleteConfirmId(null);
      await fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (customers.length === 0) return;
    const headers = ['Full Name', 'Phone', 'Email', 'Address', 'Date', 'Status', 'Notes', 'Additional Info'];
    const rows = customers.map((c) => [
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${c.phoneNumber.replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      `"${c.date || ''}"`,
      `"${c.status}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
      `"${(c.additionalInfo || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DrKifayatKhan_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: CustomerRecord['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Under Treatment':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Follow-up':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Discharged':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Inquiry':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Customer Records & Clinical Registry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Total {total} patient records found · Searchable by Name and Phone Number
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            disabled={customers.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR (Primary Feature) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-teal-700" />
            </div>
            <input
              type="text"
              placeholder="Search by Customer Name (e.g. Ali) or Phone Number (e.g. 03138161676)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-700 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Discharged">Discharged</option>
                <option value="Inquiry">Inquiry</option>
              </select>
            </div>
          </div>

          {/* Clear Button */}
          <div className="md:col-span-1 flex items-center">
            <button
              onClick={handleClearSearch}
              title="Reset Search & Filters"
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="md:hidden">Reset</span>
            </button>
          </div>
        </div>

        {/* Active search filter indicators */}
        {(searchTerm || statusFilter) && (
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <span>Filtering active:</span>
            {searchTerm && (
              <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md font-medium">
                Keyword: "{searchTerm}"
              </span>
            )}
            {statusFilter && (
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                Status: {statusFilter}
              </span>
            )}
            <button
              onClick={handleClearSearch}
              className="text-teal-700 font-semibold hover:underline ml-auto"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Customer List / Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
            <p className="text-sm">Searching customer registry...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No customer record found for this name or phone number.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
              Verify spelling or try searching with just the primary digits of the phone number.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Clear Search
              </button>
              <button
                onClick={openAddModal}
                className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all"
              >
                Create New Customer
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Customer Name</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Clinical Notes</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-slate-900">
                        {customer.fullName}
                      </div>
                      {customer.email && (
                        <div className="text-xs text-slate-400">
                          {customer.email}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <a
                        href={`tel:${customer.phoneNumber}`}
                        className="font-semibold text-teal-800 hover:underline flex items-center gap-1 text-xs sm:text-sm"
                      >
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span>{customer.phoneNumber}</span>
                      </a>
                    </td>

                    <td className="py-4 px-4 hidden md:table-cell text-xs text-slate-500">
                      {customer.date}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          customer.status
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 hidden lg:table-cell text-xs text-slate-600 max-w-xs truncate">
                      {customer.notes || '—'}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewCustomer(customer)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(customer)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(customer.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW CUSTOMER MODAL */}
      {viewCustomer && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewCustomer(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                  Clinical Customer Card
                </span>
                <h3 className="text-xl font-bold">{viewCustomer.fullName}</h3>
              </div>
              <button
                onClick={() => setViewCustomer(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase block">
                    Phone Number
                  </span>
                  <a
                    href={`tel:${viewCustomer.phoneNumber}`}
                    className="text-base font-bold text-teal-800 hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-4 h-4 text-teal-600" />
                    <span>{viewCustomer.phoneNumber}</span>
                  </a>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase block">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-1 ${getStatusBadge(
                      viewCustomer.status
                    )}`}
                  >
                    {viewCustomer.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase block">
                    Email Address
                  </span>
                  <span className="text-slate-800 font-medium">
                    {viewCustomer.email || '—'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase block">
                    Registration Date
                  </span>
                  <span className="text-slate-800 font-medium">
                    {viewCustomer.date || '—'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 font-bold uppercase block">
                  Residential / Clinic Address
                </span>
                <span className="text-slate-800 font-medium">
                  {viewCustomer.address || '—'}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">
                  Clinical Notes / Treatment History
                </span>
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {viewCustomer.notes || 'No clinical notes recorded.'}
                </p>
              </div>

              {viewCustomer.additionalInfo && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase block mb-1">
                    Additional Information
                  </span>
                  <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {viewCustomer.additionalInfo}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <a
                href={`https://wa.me/${viewCustomer.phoneNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>WhatsApp Message</span>
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const c = viewCustomer;
                    setViewCustomer(null);
                    openEditModal(c);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold"
                >
                  Edit Record
                </button>
                <button
                  onClick={() => setViewCustomer(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CUSTOMER MODAL */}
      {(isAddingNew || editCustomer) && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setIsAddingNew(false);
            setEditCustomer(null);
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editCustomer ? 'Edit Customer Record' : 'Add New Customer'}
                </h3>
                <p className="text-xs text-slate-400">
                  Fill in the patient's personal and clinical consultation details.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditCustomer(null);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 03138161676"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Discharged">Discharged</option>
                    <option value="Inquiry">Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sector F-7, Islamabad"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinical Notes / Diagnosis / Treatment History
                </label>
                <textarea
                  rows={3}
                  placeholder="Symptoms, physical assessment, plan of care, treatment session count..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Additional Information
                </label>
                <textarea
                  rows={2}
                  placeholder="Referral source, preferred appointment timings, emergency contact..."
                  value={formAdditionalInfo}
                  onChange={(e) => setFormAdditionalInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditCustomer(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editCustomer ? 'Update Customer' : 'Add Customer'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900">
              Delete Customer Record?
            </h3>
            <p className="text-xs text-center text-slate-500 mt-1 mb-6">
              This action cannot be undone. Are you sure you want to remove this patient from the registry?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
