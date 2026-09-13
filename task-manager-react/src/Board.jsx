const STATUSES = ["To Do", "In Progress", "In Review", "Done"];

function Board({ tasks, onOpenTask, onStatusChange }) {
  function handleDrop(e, status) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onStatusChange(taskId, status);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
      {STATUSES.map((status) => (
        <div
          key={status}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, status)}
          style={{ background: "#f0f2f5", borderRadius: "10px", padding: "10px", minHeight: "300px" }}
        >
          <h4 style={{ marginBottom: "10px" }}>{status}</h4>

          {tasks
            .filter((t) => (t.status || "To Do") === status)
            .map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
                onClick={() => onOpenTask(task.id)}
                style={{
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "8px",
                  cursor: "grab",
                }}
              >
                <strong style={{ fontSize: "13px" }}>{task.text}</strong>
                <div style={{ fontSize: "11px", color: "#888" }}>{task.category}</div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
