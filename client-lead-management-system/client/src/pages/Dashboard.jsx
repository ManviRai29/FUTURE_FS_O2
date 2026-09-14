import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { getStats } from '../services/leads';

const CARD_CONFIG = [
  { key: 'total', label: 'Total Leads', icon: '👥', color: 'card-blue' },
  { key: 'new', label: 'New Leads', icon: '✨', color: 'card-cyan' },
  { key: 'contacted', label: 'Contacted', icon: '📞', color: 'card-orange' },
  { key: 'converted', label: 'Converted', icon: '✅', color: 'card-green' },
  { key: 'lost', label: 'Lost', icon: '⚠️', color: 'card-red' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStats();
      setStats(data.stats);
      setRecentLeads(data.recentLeads || []);
    } catch (err) {
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            {CARD_CONFIG.map((card) => (
              <div key={card.key} className={`stat-card ${card.color}`}>
                <div className="stat-card-icon">{card.icon}</div>
                <div>
                  <div className="stat-card-value">{stats?.[card.key] ?? 0}</div>
                  <div className="stat-card-label">{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Recent Leads</h3>
              <Link to="/leads" className="link">
                View all leads →
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <div className="empty-state">No leads yet. New leads will appear here.</div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => (
                      <tr key={lead._id}>
                        <td>{lead.name}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone}</td>
                        <td>{lead.source}</td>
                        <td>
                          <StatusBadge status={lead.status} />
                        </td>
                        <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
