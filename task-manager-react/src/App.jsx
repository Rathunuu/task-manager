import { useEffect, useState } from "react";
import ProjectSwitcher from "./ProjectSwitcher";
import TaskList from "./TaskList";
import { loadTasks, loadProjects } from "./storage";

function App() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState("");

    useEffect(() => {
        const loadedTasks = loadTasks();
        const loadedProjects = loadProjects();

        setTasks(loadedTasks);
        setProjects(loadedProjects);

        if (loadedProjects.length > 0) {
            setActiveProjectId(loadedProjects[0].id);
        }
    }, []);

    const handleProjectChange = (projectId) => {
        setActiveProjectId(projectId);
    };

    const activeProjectTasks = tasks.filter(
        (task) => task.projectId === activeProjectId
    );

    return (
        <div>
            <h1>Task Manager React</h1>

            <h2>Projects</h2>

            <ProjectSwitcher
                projects={projects}
                activeProjectId={activeProjectId}
                onProjectChange={handleProjectChange}
            />

            <h2>Tasks</h2>

            <TaskList tasks={activeProjectTasks} />
        </div>
    );
}

export default App;
