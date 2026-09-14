function TaskItem({ task, onToggleComplete, onDeleteTask, isUpdating, isDeleting }) {
  const taskId = task._id || task.id;

  const handleCheckboxChange = () => {
    onToggleComplete(task);
  };

  const handleDeleteClick = () => {
    onDeleteTask(taskId);
  };

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={Boolean(task.completed)}
            onChange={handleCheckboxChange}
            disabled={isUpdating || isDeleting}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="checkmark" />
        </label>

        <div className="task-info">
          <span className="task-title">{task.title}</span>
          {formattedDate && <span className="task-date">Created {formattedDate}</span>}
        </div>
      </div>

      <div className="task-actions">
        <span className={`badge ${task.completed ? 'badge-completed' : 'badge-pending'}`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>

        <button
          type="button"
          className="btn-delete"
          onClick={handleDeleteClick}
          disabled={isDeleting || isUpdating}
          title="Delete task"
          aria-label={`Delete task "${task.title}"`}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
