import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all tasks when the component mounts
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getTasks();
      // Ensure data is always an array
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to connect to the backend server. Please verify the API is running.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle adding a new task
  const handleAddTask = async (title) => {
    setIsAdding(true);
    setError(null);

    try {
      const newTask = await createTask(title);
      // Prepend the new task to display it at the top of the list
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      return true;
    } catch (err) {
      console.error('Error adding task:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to create task. Please try again.';
      setError(message);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  // Handle toggling completion status
  const handleToggleComplete = async (task) => {
    const taskId = task._id || task.id;
    setUpdatingTaskId(taskId);
    setError(null);

    try {
      const updatedTask = await updateTask(taskId, {
        completed: !task.completed,
      });

      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          const currentId = t._id || t.id;
          return currentId === taskId ? updatedTask : t;
        })
      );
    } catch (err) {
      console.error('Error updating task:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to update task status. Please try again.';
      setError(message);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    setDeletingTaskId(taskId);
    setError(null);

    try {
      await deleteTask(taskId);
      setTasks((prevTasks) =>
        prevTasks.filter((t) => (t._id || t.id) !== taskId)
      );
    } catch (err) {
      console.error('Error deleting task:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete task. Please try again.';
      setError(message);
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Computed task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="app-wrapper">
      <div className="app-container">
        {/* Application Header */}
        <header className="app-header">
          <div className="header-brand">
            <span className="platform-tag">Three-Tier Architecture</span>
            <h1 className="app-title">Task Platform</h1>
            <p className="app-subtitle">
              Manage and organize your tasks with cloud-native reliability.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-card">
              <span className="stat-value">{totalTasks}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card">
              <span className="stat-value text-pending">{pendingTasks}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-value text-completed">{completedTasks}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="error-banner" role="alert">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
            <div className="error-actions">
              <button
                type="button"
                className="btn-retry"
                onClick={fetchTasks}
              >
                Retry
              </button>
              <button
                type="button"
                className="btn-dismiss"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="main-content">
          <section className="card form-section">
            <h2 className="section-heading">Create New Task</h2>
            <TaskForm onAddTask={handleAddTask} isLoading={isAdding} />
          </section>

          <section className="card list-section">
            <div className="list-header">
              <h2 className="section-heading">Your Tasks</h2>
              <button
                type="button"
                className="btn-refresh"
                onClick={fetchTasks}
                disabled={isLoading}
                title="Refresh task list"
              >
                ↻ Refresh
              </button>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <div className="spinner" aria-hidden="true" />
                <p>Loading tasks from API...</p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                updatingTaskId={updatingTaskId}
                deletingTaskId={deletingTaskId}
              />
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Tier 1: React Frontend &bull; Connected via Axios &bull; Port 8080 API
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
