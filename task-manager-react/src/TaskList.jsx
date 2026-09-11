function TaskList({ tasks }) {
    return (
        <div>
            {tasks.length === 0 ? (
                <p>No tasks in this project.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.text}</strong>
                            <span> — {task.category}</span>
                            <span> — {task.status}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;