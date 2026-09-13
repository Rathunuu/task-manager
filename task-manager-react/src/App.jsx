import { useState, useEffect } from "react";
import ProjectSwitcher from "./ProjectSwitcher";
import TaskList from "./TaskList";
import { loadTasks, saveTasks, loadProjects } from "./storage";

function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    const loadedProjects = loadProjects();
    const loadedTasks = loadTasks();

    setProjects(loadedProjects);
    setTasks(loadedTasks);

    if (loadedProjects.length > 0) {
      setActiveProjectId(loadedProjects[0].id);
    }
  }, []);

  const tasksForActiveProject = tasks.filter(
    (task) => task.projectId === activeProjectId
  );

  // ADD TASK
  function handleAddTask() {
    const text = newTaskText.trim();
    if (text === "") return;

    const newTask = {
      id: crypto.randomUUID(),
      projectId: activeProjectId,
      text: text,
      category: "Work",
      status: "To Do",
      done: false,
      description: "",
      dueDate: "",
      priority: "Normal",
      notes: "",
      subtasks: [],
      createdAt: Date.now(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTaskText("");
  }

  // DELETE TASK
  function handleDeleteTask(taskId) {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  // CHANGE STATUS
  function handleStatusChange(taskId, newStatus) {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: newStatus, done: newStatus === "Done" }
        : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Task Manager (React Version)</h1>

      <ProjectSwitcher
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
      />

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="New task..."
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />
        <button onClick={handleAddTask} style={{ marginLeft: "8px" }}>
          Add Task
        </button>
      </div>

      <TaskList
        tasks={tasksForActiveProject}
        onDeleteTask={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default App;
