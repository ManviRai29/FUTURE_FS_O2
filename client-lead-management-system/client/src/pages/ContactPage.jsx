import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitPublicLead } from '../services/leads';

const emptyForm = { name: '', email: '', phone: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number';
    if (!form.message.trim()) next.message = 'Please tell us a bit about your requirement';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitPublicLead(form);
      setSubmitted(true);
      setForm(emptyForm);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Something went wrong. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-page">
      <div className="public-card">
        <div className="auth-brand">
          <span className="sidebar-brand-icon">◆</span>
          <span>Mini CRM</span>
        </div>

        <h2 className="auth-title">Get in Touch</h2>
        <p className="auth-subtitle">
          Fill out the form below and our team will reach out to you shortly.
        </p>

        {submitted ? (
          <div className="alert alert-success">
            Thank you! Your message has been received. We will get back to you soon.
            <div style={{ marginTop: '0.75rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setSubmitted(false)}>
                Submit another response
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form">
            {serverError && <div className="alert alert-error">{serverError}</div>}

            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your requirement..."
              />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        <p className="auth-hint">
          Are you the admin? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
