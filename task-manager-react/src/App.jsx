import { useState, useEffect } from "react";
import ProjectSwitcher from "./ProjectSwitcher";
import TaskList from "./TaskList";
import { loadTasks, loadProjects } from "./storage";

function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

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

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Task Manager (React Version)</h1>

      <ProjectSwitcher
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
      />

      <TaskList tasks={tasksForActiveProject} />
    </div>
  );
}

export default App;
