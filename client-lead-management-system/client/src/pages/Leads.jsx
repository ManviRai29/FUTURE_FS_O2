import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import LeadModal from '../components/LeadModal';
import ConfirmModal from '../components/ConfirmModal';
import { getLeads, createLead, updateLead, deleteLead, updateLeadStatus } from '../services/leads';

const STATUSES = ['All', 'New', 'Contacted', 'Converted', 'Lost'];
const SOURCES = ['All', 'Website', 'Instagram', 'Referral', 'Advertisement', 'Other'];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [source, setSource] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [toast, setToast] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLeads({ search, status, source });
      setLeads(data.leads || []);
    } catch (err) {
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, status, source]);

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleAddClick = () => {
    setEditingLead(null);
    setShowModal(true);
  };

  const handleEditClick = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    if (editingLead) {
      await updateLead(editingLead._id, formData);
      showToast('Lead updated successfully');
    } else {
      await createLead(formData);
      showToast('Lead added successfully');
    }
    setShowModal(false);
    fetchLeads();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteLead(deletingLead._id);
      showToast('Lead deleted successfully');
      setDeletingLead(null);
      fetchLeads();
    } catch (err) {
      setError('Failed to delete lead. Please try again.');
      setDeletingLead(null);
    }
  };

  const handleStatusChange = async (lead, newStatus) => {
    try {
      await updateLeadStatus(lead._id, newStatus);
      setLeads((prev) => prev.map((l) => (l._id === lead._id ? { ...l, status: newStatus } : l)));
      showToast('Status updated');
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  return (
    <DashboardLayout title="Leads">
      {toast && <div className="toast">{toast}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="panel">
        <div className="panel-header panel-header-wrap">
          <h3>All Leads</h3>
          <button className="btn btn-primary" onClick={handleAddClick}>
            + Add Lead
          </button>
        </div>

        <div className="filters-row">
          <input
            className="search-input"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Sources' : s}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-state">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="empty-state">No leads match your filters.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Follow-up</th>
                  <th>Created</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <Link to={`/leads/${lead._id}`} className="link-strong">
                        {lead.name}
                      </Link>
                    </td>
                    <td>
                      <div>{lead.email}</div>
                      <div className="text-muted">{lead.phone}</div>
                    </td>
                    <td>{lead.source}</td>
                    <td>
                      <select
                        className="status-select"
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead, e.target.value)}
                      >
                        {['New', 'Contacted', 'Converted', 'Lost'].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '—'}</td>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="th-actions">
                      <button className="icon-btn" title="View" onClick={() => (window.location.href = `/leads/${lead._id}`)}>
                        👁
                      </button>
                      <button className="icon-btn" title="Edit" onClick={() => handleEditClick(lead)}>
                        ✏️
                      </button>
                      <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => setDeletingLead(lead)}>
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <LeadModal lead={editingLead} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}

      {deletingLead && (
        <ConfirmModal
          title="Delete Lead"
          message={`Are you sure you want to delete "${deletingLead.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingLead(null)}
        />
      )}
    </DashboardLayout>
  );
}
