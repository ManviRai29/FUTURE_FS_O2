import { useState } from 'react';

const SOURCES = ['Website', 'Instagram', 'Referral', 'Advertisement', 'Other'];
const STATUSES = ['New', 'Contacted', 'Converted', 'Lost'];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  source: 'Website',
  status: 'New',
  message: '',
  followUpDate: '',
};

const toDateInputValue = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

export default function LeadModal({ lead, onClose, onSave }) {
  const isEdit = Boolean(lead);
  const [form, setForm] = useState(
    lead
      ? {
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          source: lead.source || 'Website',
          status: lead.status || 'New',
          message: lead.message || '',
          followUpDate: toDateInputValue(lead.followUpDate),
        }
      : emptyForm
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        ...form,
        followUpDate: form.followUpDate ? form.followUpDate : null,
      });
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{isEdit ? 'Edit Lead' : 'Add New Lead'}</h3>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Source</label>
              <select name="source" value={form.source} onChange={handleChange}>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Follow-up Date</label>
              <input type="date" name="followUpDate" value={form.followUpDate} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Lead message or requirement..." />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
