function TaskList({ tasks }) {
    return (
        <div className="task-list">
            {tasks.length === 0 ? (
                <p className="empty-task-message">
                    No tasks in this project.
                </p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} className="task-item">
                            <div className="task-content">
                                <h3>{task.text}</h3>

                                <div className="task-meta">
                                    <span className="task-category">
                                        Category: {task.category}
                                    </span>

                                    <span className="task-status">
                                        Status: {task.status}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;
