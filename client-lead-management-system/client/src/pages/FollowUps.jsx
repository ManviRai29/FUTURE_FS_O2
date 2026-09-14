import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getFollowUps } from '../services/leads';

function FollowUpGroup({ title, leads, emptyText, badgeClass }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <span className={`count-pill ${badgeClass}`}>{leads.length}</span>
      </div>
      {leads.length === 0 ? (
        <div className="empty-state">{emptyText}</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Follow-up Date</th>
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
                  <td>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td>{new Date(lead.followUpDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function FollowUps() {
  const [data, setData] = useState({ today: [], upcoming: [], overdue: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getFollowUps();
      setData(res.followUps);
    } catch (err) {
      setError('Failed to load follow-ups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Follow-ups">
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading follow-ups...</div>
      ) : (
        <>
          <FollowUpGroup
            title="Overdue Follow-ups"
            leads={data.overdue}
            emptyText="No overdue follow-ups. Great job staying on top of things!"
            badgeClass="pill-red"
          />
          <FollowUpGroup
            title="Today's Follow-ups"
            leads={data.today}
            emptyText="No follow-ups scheduled for today."
            badgeClass="pill-orange"
          />
          <FollowUpGroup
            title="Upcoming Follow-ups"
            leads={data.upcoming}
            emptyText="No upcoming follow-ups scheduled."
            badgeClass="pill-blue"
          />
        </>
      )}
    </DashboardLayout>
  );
}
