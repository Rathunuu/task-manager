function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p>No tasks in this project.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.text} — {task.category} — {task.status}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
