import { useState } from "react";

function TaskList({ tasks, onOpenTask, onDeleteTask, onStatusChange, onReorder }) {
  const [draggedId, setDraggedId] = useState(null);

  function handleDragStart(id) {
    setDraggedId(id);
  }

  function handleDragOver(e, overId) {
    e.preventDefault();
    if (!draggedId || draggedId === overId) return;

    const ids = tasks.map((t) => t.id);
    const draggedIndex = ids.indexOf(draggedId);
    const overIndex = ids.indexOf(overId);
    if (draggedIndex === -1 || overIndex === -1) return;

    const newIds = [...ids];
    newIds.splice(draggedIndex, 1);
    newIds.splice(overIndex, 0, draggedId);
    onReorder(newIds);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDraggedId(null);
  }

  if (tasks.length === 0) {
    return <p style={{ color: "#888" }}>No tasks found.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map((task) => (
        <li
          key={task.id}
          draggable
          onDragStart={() => handleDragStart(task.id)}
          onDragOver={(e) => handleDragOver(e, task.id)}
          onDrop={handleDrop}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px",
            marginBottom: "8px",
            background: "white",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            cursor: "grab",
            opacity: draggedId === task.id ? 0.5 : 1,
          }}
        >
          <span
            onClick={() => onOpenTask(task.id)}
            style={{ flex: 1, cursor: "pointer" }}
          >
            <strong>{task.text}</strong>{" "}
            <span style={{ fontSize: "12px", color: "#666" }}>— {task.category}</span>
          </span>

          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>

          <button onClick={() => onDeleteTask(task.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
