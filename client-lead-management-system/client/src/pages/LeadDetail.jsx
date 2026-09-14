import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { getLeadById, updateLeadStatus, addLeadNote, setFollowUpDate, deleteLead } from '../services/leads';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteText, setNoteText] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const fetchLead = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLeadById(id);
      setLead(data.lead);
      setFollowUp(data.lead.followUpDate ? new Date(data.lead.followUpDate).toISOString().slice(0, 10) : '');
    } catch (err) {
      setError('Could not load this lead. It may have been deleted.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const data = await updateLeadStatus(id, newStatus);
      setLead(data.lead);
      showToast('Status updated');
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      const data = await addLeadNote(id, noteText.trim());
      setLead(data.lead);
      setNoteText('');
      showToast('Note added');
    } catch (err) {
      setError('Failed to add note.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleSaveFollowUp = async () => {
    setSavingFollowUp(true);
    try {
      const data = await setFollowUpDate(id, followUp || null);
      setLead(data.lead);
      showToast('Follow-up date updated');
    } catch (err) {
      setError('Failed to update follow-up date.');
    } finally {
      setSavingFollowUp(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLead(id);
      navigate('/leads');
    } catch (err) {
      setError('Failed to delete lead.');
      setShowDelete(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Lead Details">
        <div className="loading-state">Loading lead...</div>
      </DashboardLayout>
    );
  }

  if (error && !lead) {
    return (
      <DashboardLayout title="Lead Details">
        <div className="alert alert-error">{error}</div>
        <Link to="/leads" className="link">
          ← Back to Leads
        </Link>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Lead Details">
      {toast && <div className="toast">{toast}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <Link to="/leads" className="link back-link">
        ← Back to Leads
      </Link>

      <div className="detail-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>{lead.name}</h3>
            <StatusBadge status={lead.status} />
          </div>

          <div className="detail-info">
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span>{lead.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone</span>
              <span>{lead.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Source</span>
              <span>{lead.source}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Created</span>
              <span>{new Date(lead.createdAt).toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Message</span>
              <span>{lead.message || '—'}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Update Status</label>
            <select value={lead.status} onChange={(e) => handleStatusChange(e.target.value)}>
              {['New', 'Contacted', 'Converted', 'Lost'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Follow-up Date</label>
            <div className="inline-form">
              <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
              <button className="btn btn-outline btn-sm" onClick={handleSaveFollowUp} disabled={savingFollowUp}>
                {savingFollowUp ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>
            Delete Lead
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Notes</h3>
          </div>

          <form onSubmit={handleAddNote} className="inline-form" style={{ marginBottom: '1rem' }}>
            <input
              placeholder="Add a note about this lead..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={savingNote}>
              {savingNote ? 'Adding...' : 'Add'}
            </button>
          </form>

          {lead.notes && lead.notes.length > 0 ? (
            <ul className="notes-list">
              {[...lead.notes].reverse().map((note) => (
                <li key={note._id} className="note-item">
                  <p>{note.text}</p>
                  <span className="text-muted">{new Date(note.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">No notes yet. Add the first note above.</div>
          )}
        </div>
      </div>

      {showDelete && (
        <ConfirmModal
          title="Delete Lead"
          message={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </DashboardLayout>
  );
}
