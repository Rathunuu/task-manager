function TaskList({ tasks, onDeleteTask, onStatusChange }) {
  if (tasks.length === 0) {
    return <p>No tasks in this project.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} style={{ marginBottom: "10px" }}>
          <span>{task.text} — {task.category} — </span>

          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>

          <button onClick={() => onDeleteTask(task.id)} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
