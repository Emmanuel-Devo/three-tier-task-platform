import { useState } from 'react';

function TaskForm({ onAddTask, isLoading }) {
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    // Frontend validation: reject empty or whitespace-only task titles
    if (!trimmedTitle) {
      setValidationError('Please enter a task title before adding.');
      return;
    }

    setValidationError('');

    const success = await onAddTask(trimmedTitle);
    if (success) {
      setTitle('');
    }
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className={`task-input ${validationError ? 'input-error' : ''}`}
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={isLoading}
          aria-label="New task title"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      {validationError && (
        <p className="validation-message" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
}

export default TaskForm;
