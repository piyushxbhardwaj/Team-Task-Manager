import { useEffect, useState } from 'react';
import { getStats } from '../services/taskService';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's an overview of your team's progress.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon purple">
            <BarChart3 size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Tasks</h3>
            <p className="stat-value">{stats?.totalTasks}</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon green">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <h3>Completed</h3>
            <p className="stat-value">{stats?.statusBreakdown.Completed}</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon yellow">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>In Progress</h3>
            <p className="stat-value">{stats?.statusBreakdown['In Progress']}</p>
          </div>
        </div>

        <div className="stat-card glass border-danger">
          <div className="stat-icon red">
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Overdue</h3>
            <p className="stat-value text-danger">{stats?.overdueTasks}</p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .dashboard-header { margin-bottom: 2.5rem; }
        .dashboard-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        .dashboard-header p { color: var(--text-secondary); }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: var(--transition);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-color);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .yellow { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .red { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .stat-info h3 { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
        .stat-value { font-size: 1.5rem; font-weight: 700; }
        .text-danger { color: var(--danger); }
        .border-danger { border-color: rgba(239, 68, 68, 0.2); }
      `}</style>
    </Layout>
  );
};

export default Dashboard;
