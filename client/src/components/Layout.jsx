import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, LogOut, User as UserIcon } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar glass">
        <div className="logo">
          <h2>TaskFlow</h2>
        </div>
        <nav>
          <Link to="/dashboard" className="nav-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/projects" className="nav-item">
            <Briefcase size={20} />
            <span>Projects</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <UserIcon size={20} />
            <div>
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
      <style jsx="true">{`
        .sidebar {
          width: 260px;
          height: 100vh;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          border-radius: 0;
          border-left: none;
          border-top: none;
          border-bottom: none;
        }

        .logo {
          margin-bottom: 3rem;
        }

        .logo h2 {
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }

        nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition);
        }

        .nav-item:hover, .nav-item.active {
          background: var(--glass-border);
          color: var(--text-primary);
        }

        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--glass-border);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .btn-logout {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          padding: 0.5rem;
          transition: var(--transition);
        }

        .btn-logout:hover {
          color: var(--danger);
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none; /* Mobile menu needed later */
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
