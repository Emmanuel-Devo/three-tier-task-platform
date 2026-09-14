import TaskItem from './TaskItem';

function TaskList({ tasks, onToggleComplete, onDeleteTask, updatingTaskId, deletingTaskId }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon" aria-hidden="true">📋</div>
        <h3>No tasks found</h3>
        <p>Your task list is empty. Add a new task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <ul className="task-list">
        {tasks.map((task) => {
          const taskId = task._id || task.id;
          return (
            <TaskItem
              key={taskId}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
              isUpdating={updatingTaskId === taskId}
              isDeleting={deletingTaskId === taskId}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default TaskList;
