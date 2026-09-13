import { useState, useEffect } from "react";
import ProjectSwitcher from "./ProjectSwitcher";
import Controls from "./Controls";
import TaskList from "./TaskList";
import Board from "./Board";
import TaskDetailDialog from "./TaskDetailDialog";
import { loadTasks, saveTasks, loadProjects, saveProjects } from "./storage";

function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Work");
  const [newTaskStatus, setNewTaskStatus] = useState("To Do");

  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentView, setCurrentView] = useState("list");

  const [activeDetailTaskId, setActiveDetailTaskId] = useState(null);
  const [undoData, setUndoData] = useState(null);

  useEffect(() => {
    const loadedProjects = loadProjects();
    const loadedTasks = loadTasks();
    setProjects(loadedProjects);
    setTasks(loadedTasks);
    if (loadedProjects.length > 0) {
      setActiveProjectId(loadedProjects[0].id);
    }
  }, []);

  function persistTasks(updated) {
    setTasks(updated);
    saveTasks(updated);
  }

  function persistProjects(updated) {
    setProjects(updated);
    saveProjects(updated);
  }

  // ---------- PROJECT ----------
  function handleCreateProject(name) {
    const newProject = { id: crypto.randomUUID(), name };
    const updated = [...projects, newProject];
    persistProjects(updated);
    setActiveProjectId(newProject.id);
  }

  // ---------- ADD TASK ----------
  function handleAddTask() {
    const text = newTaskText.trim();
    if (text === "" || !activeProjectId) return;

    const newTask = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      text,
      category: newTaskCategory,
      status: newTaskStatus,
      done: newTaskStatus === "Done",
      description: "",
      dueDate: "",
      priority: "Normal",
      notes: "",
      subtasks: [],
      createdAt: Date.now(),
    };

    persistTasks([...tasks, newTask]);
    setNewTaskText("");
  }

  // ---------- DELETE TASK (with undo) ----------
  function handleDeleteTask(taskId) {
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return;
    const removed = tasks[index];

    const updated = tasks.filter((t) => t.id !== taskId);
    persistTasks(updated);

    setUndoData({ task: removed, index });
    setTimeout(() => setUndoData(null), 5000);
  }

  function handleUndo() {
    if (!undoData) return;
    const updated = [...tasks];
    updated.splice(undoData.index, 0, undoData.task);
    persistTasks(updated);
    setUndoData(null);
  }

  // ---------- STATUS ----------
  function handleStatusChange(taskId, newStatus) {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus, done: newStatus === "Done" } : t
    );
    persistTasks(updated);
  }

  // ---------- GENERIC FIELD UPDATE (for detail dialog) ----------
  function handleUpdateField(taskId, field, value) {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const newTask = { ...t, [field]: value };
      if (field === "status") newTask.done = value === "Done";
      return newTask;
    });
    persistTasks(updated);
  }

  // ---------- SUBTASKS ----------
  function handleAddSubtask(taskId, text) {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const subtasks = [...(t.subtasks || []), { id: crypto.randomUUID(), text, done: false }];
      return { ...t, subtasks };
    });
    persistTasks(updated);
  }

  function handleToggleSubtask(taskId, subtaskId) {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const subtasks = (t.subtasks || []).map((s) =>
        s.id === subtaskId ? { ...s, done: !s.done } : s
      );
      return { ...t, subtasks };
    });
    persistTasks(updated);
  }

  function handleDeleteSubtask(taskId, subtaskId) {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const subtasks = (t.subtasks || []).filter((s) => s.id !== subtaskId);
      return { ...t, subtasks };
    });
    persistTasks(updated);
  }

  // ---------- REORDER (list drag & drop) ----------
  function handleReorder(orderedIds) {
    const projectTasksMap = new Map(tasks.filter((t) => t.projectId === activeProjectId).map((t) => [t.id, t]));
    const reordered = orderedIds.map((id) => projectTasksMap.get(id)).filter(Boolean);
    const otherTasks = tasks.filter((t) => t.projectId !== activeProjectId);
    persistTasks([...otherTasks, ...reordered]);
  }

  // ---------- EXPORT / IMPORT ----------
  function handleExport() {
    const data = { projects, tasks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tasks.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.projects && data.tasks) {
          persistProjects(data.projects);
          persistTasks(data.tasks);
          if (data.projects.length > 0) setActiveProjectId(data.projects[0].id);
        }
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // ---------- FILTER / SEARCH / SORT ----------
  let visibleTasks = tasks.filter((t) => t.projectId === activeProjectId);

  if (activeCategory !== "All") {
    visibleTasks = visibleTasks.filter((t) => t.category === activeCategory);
  }

  if (searchText.trim() !== "") {
    visibleTasks = visibleTasks.filter((t) =>
      t.text.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  visibleTasks = [...visibleTasks].sort((a, b) => {
    if (sortBy === "az") return a.text.localeCompare(b.text);
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);
  const completedCount = projectTasks.filter((t) => t.status === "Done").length;

  const activeDetailTask = tasks.find((t) => t.id === activeDetailTaskId) || null;

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Task Manager (React Version)</h1>

      <ProjectSwitcher
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onCreateProject={handleCreateProject}
      />

      {activeProject && (
        <p style={{ color: "#666", marginBottom: "16px" }}>
          <strong>{activeProject.name}</strong> — {completedCount} of {projectTasks.length} tasks done
        </p>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          placeholder="New task..."
          style={{ flex: 1, padding: "8px", minWidth: "150px" }}
        />
        <select value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)} style={{ padding: "8px" }}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <select value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)} style={{ padding: "8px" }}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="In Review">In Review</option>
          <option value="Done">Done</option>
        </select>
        <button onClick={handleAddTask} style={{ padding: "8px 16px" }}>Add Task</button>
      </div>

      <Controls
        searchText={searchText}
        onSearchChange={setSearchText}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {currentView === "list" ? (
        <TaskList
          tasks={visibleTasks}
          onOpenTask={setActiveDetailTaskId}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onReorder={handleReorder}
        />
      ) : (
        <Board
          tasks={visibleTasks}
          onOpenTask={setActiveDetailTaskId}
          onStatusChange={handleStatusChange}
        />
      )}

      <div style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
        <button onClick={handleExport}>Export JSON</button>
        <label style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "6px", cursor: "pointer" }}>
          Import JSON
          <input type="file" accept=".json" onChange={handleImport} hidden />
        </label>
      </div>

      <TaskDetailDialog
        task={activeDetailTask}
        onClose={() => setActiveDetailTaskId(null)}
        onUpdateField={handleUpdateField}
        onAddSubtask={handleAddSubtask}
        onToggleSubtask={handleToggleSubtask}
        onDeleteSubtask={handleDeleteSubtask}
      />

      {undoData && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", background: "#172033", color: "white", padding: "12px 16px", borderRadius: "8px", display: "flex", gap: "16px", alignItems: "center" }}>
          <span>Task deleted</span>
          <button onClick={handleUndo} style={{ background: "#3b82f6", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
