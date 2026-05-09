import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../services/projectService';
import { getTasksByProject, createTask, updateTask, deleteTask } from '../services/taskService';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { Plus, Search, Filter, MoreVertical, Trash2, Edit3, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    projectId: id
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    let result = tasks;
    if (search) {
      result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (statusFilter !== 'All') {
      result = result.filter(t => t.status === statusFilter);
    }
    setFilteredTasks(result);
  }, [search, statusFilter, tasks]);

  const fetchData = async () => {
    try {
      const [projData, taskData] = await Promise.all([
        getProjectById(id),
        getTasksByProject(id)
      ]);
      setProject(projData);
      setTasks(taskData);
      setFilteredTasks(taskData);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      toast.success('Task created!');
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', projectId: id });
      fetchData();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>{project?.name}</h1>
          <p>{project?.description}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="toolbar glass">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <div key={task._id} className="task-row glass">
            <div className="task-main">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <div className="task-meta">
              <span className={`badge priority-${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <div className="due-date">
                <Calendar size={14} />
                <span className={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-danger' : ''}>
                  {new Date(task.dueDate).toLocaleDateString()}
                  {new Date(task.dueDate) < new Date() && task.status !== 'Completed' && (
                    <AlertCircle size={14} style={{ marginLeft: '4px', display: 'inline' }} />
                  )}
                </span>
              </div>
              <select 
                value={task.status} 
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className={`status-select status-${task.status.replace(' ', '-').toLowerCase()}`}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {user?.role === 'Admin' && (
                <button onClick={() => handleDeleteTask(task._id)} className="btn-icon text-danger">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="empty-state glass">
             <AlertCircle size={48} />
             <p>No tasks found for this project.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass animate-fade">
            <h2>New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Title</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .toolbar { padding: 1rem; margin-bottom: 2rem; display: flex; gap: 1.5rem; }
        .search-box { flex: 1; display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.05); padding: 0 1rem; border-radius: 12px; }
        .search-box input { background: transparent; border: none; padding: 0.75rem 0; width: 100%; }
        .filter-group { display: flex; align-items: center; gap: 0.75rem; }
        .filter-group select { width: auto; min-width: 150px; }

        .task-list { display: flex; flex-direction: column; gap: 1rem; }
        .task-row { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; transition: var(--transition); }
        .task-row:hover { border-color: var(--glass-border); background: rgba(255,255,255,0.05); }
        .task-main h3 { font-size: 1rem; margin-bottom: 0.25rem; }
        .task-main p { color: var(--text-secondary); font-size: 0.85rem; }

        .task-meta { display: flex; align-items: center; gap: 1.5rem; }
        .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .priority-low { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .priority-medium { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .priority-high { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .due-date { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; min-width: 120px; }
        .status-select { width: auto; min-width: 120px; font-size: 0.85rem; padding: 0.5rem; border-radius: 8px; }
        .status-todo { border-color: var(--text-secondary); }
        .status-in-progress { border-color: var(--warning); color: var(--warning); }
        .status-completed { border-color: var(--success); color: var(--success); }

        .btn-icon { background: transparent; border: none; cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: var(--transition); }
        .btn-icon:hover { background: rgba(239, 68, 68, 0.1); }
        .text-danger { color: var(--danger); }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .empty-state { padding: 4rem; text-align: center; color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; gap: 1rem; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal-content { width: 100%; max-width: 500px; padding: 2rem; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
      `}</style>
    </Layout>
  );
};

export default ProjectDetails;
