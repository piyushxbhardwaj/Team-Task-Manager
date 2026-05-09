import { useEffect, useState } from 'react';
import { getProjects, createProject } from '../services/projectService';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { Plus, Folder, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      toast.success('Project created!');
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Collaborate and manage team objectives.</p>
        </div>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="project-grid">
        {projects.length > 0 ? projects.map((project) => (
          <Link to={`/projects/${project._id}`} key={project._id} className="project-card glass">
            <div className="project-icon">
              <Folder size={24} />
            </div>
            <h3>{project.name}</h3>
            <p className="desc">{project.description}</p>
            <div className="project-footer">
              <div className="footer-item">
                <Users size={14} />
                <span>{project.members?.length || 0} Members</span>
              </div>
              <div className="footer-item">
                <Calendar size={14} />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        )) : (
          <div className="empty-state glass">
            <Folder size={48} />
            <p>No projects found. Create your first project to get started!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass animate-fade">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        
        .project-card {
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: var(--transition);
        }
        .project-card:hover { transform: translateY(-5px); border-color: var(--accent-color); }
        .project-icon { width: 48px; height: 48px; background: rgba(139, 92, 246, 0.1); color: var(--accent-color); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
        .project-card h3 { margin-bottom: 0.5rem; font-size: 1.125rem; }
        .desc { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .project-footer { display: flex; justify-content: space-between; border-top: 1px solid var(--glass-border); pt: 1rem; margin-top: auto; }
        .footer-item { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.75rem; padding-top: 1rem; }

        .empty-state { grid-column: 1 / -1; padding: 4rem; text-align: center; color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; gap: 1rem; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal-content { width: 100%; max-width: 500px; padding: 2rem; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
      `}</style>
    </Layout>
  );
};

export default Projects;
