import { useEffect, useState } from "react";
import ProjectSwitcher from "./ProjectSwitcher";
import TaskList from "./TaskList";
import { loadTasks, loadProjects, saveTasks, saveProjects } from "./storage";

function App() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState("");

    useEffect(() => {
        const loadedTasks = loadTasks();
        const loadedProjects = loadProjects();

        // If React localhost has no data yet,
        // create temporary Week 4 test data.
        if (loadedProjects.length === 0) {
            const demoProjects = [
                { id: "project-1", name: "My Project" },
                { id: "project-2", name: "Portfolio Project" }
            ];

            const demoTasks = [
                {
                    id: "task-1",
                    text: "Complete Week 4 React Setup",
                    category: "Work",
                    status: "In Progress",
                    projectId: "project-1"
                },
                {
                    id: "task-2",
                    text: "Build Portfolio Website",
                    category: "Work",
                    status: "To Do",
                    projectId: "project-2"
                }
            ];

            saveProjects(demoProjects);
            saveTasks(demoTasks);

            setProjects(demoProjects);
            setTasks(demoTasks);
            setActiveProjectId(demoProjects[0].id);

            return;
        }

        setTasks(loadedTasks);
        setProjects(loadedProjects);
        setActiveProjectId(loadedProjects[0]?.id || "");
    }, []);

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
                onProjectChange={setActiveProjectId}
            />

            <h2>Tasks</h2>

            <TaskList tasks={activeProjectTasks} />
        </div>
    );
}

export default App;