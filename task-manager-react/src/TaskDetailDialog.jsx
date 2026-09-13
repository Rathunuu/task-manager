import { useEffect, useRef, useState } from "react";

function TaskDetailDialog({ task, onClose, onUpdateField, onAddSubtask, onToggleSubtask, onDeleteSubtask }) {
  const dialogRef = useRef(null);
  const [subtaskText, setSubtaskText] = useState("");

  useEffect(() => {
    if (task && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
    if (!task && dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [task]);

  if (!task) return null;

  function handleAddSubtask() {
    if (subtaskText.trim() === "") return;
    onAddSubtask(task.id, subtaskText.trim());
    setSubtaskText("");
  }

  return (
    <dialog ref={dialogRef} onClose={onClose} style={{ width: "min(550px, 90%)", borderRadius: "12px", border: "none", padding: "0" }}>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px" }}>{task.text}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>Description</label>
          <textarea
            value={task.description || ""}
            onChange={(e) => onUpdateField(task.id, "description", e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Status</label>
            <select value={task.status} onChange={(e) => onUpdateField(task.id, "status", e.target.value)} style={{ width: "100%", padding: "8px" }}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Priority</label>
            <select value={task.priority || "Normal"} onChange={(e) => onUpdateField(task.id, "priority", e.target.value)} style={{ width: "100%", padding: "8px" }}>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Due Date</label>
            <input
              type="date"
              value={task.dueDate || ""}
              onChange={(e) => onUpdateField(task.id, "dueDate", e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Category</label>
            <select value={task.category} onChange={(e) => onUpdateField(task.id, "category", e.target.value)} style={{ width: "100%", padding: "8px" }}>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>Notes</label>
          <textarea
            value={task.notes || ""}
            onChange={(e) => onUpdateField(task.id, "notes", e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>Subtasks</label>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <input
              type="text"
              value={subtaskText}
              onChange={(e) => setSubtaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
              placeholder="Add a subtask..."
              style={{ flex: 1, padding: "8px" }}
            />
            <button onClick={handleAddSubtask}>Add</button>
          </div>

          {(task.subtasks || []).map((sub) => (
            <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0" }}>
              <input
                type="checkbox"
                checked={sub.done}
                onChange={() => onToggleSubtask(task.id, sub.id)}
              />
              <span style={{ flex: 1, textDecoration: sub.done ? "line-through" : "none", color: sub.done ? "#999" : "#333" }}>
                {sub.text}
              </span>
              <button onClick={() => onDeleteSubtask(task.id, sub.id)} style={{ border: "none", background: "none", color: "red", cursor: "pointer", fontSize: "11px" }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
}

export default TaskDetailDialog;
