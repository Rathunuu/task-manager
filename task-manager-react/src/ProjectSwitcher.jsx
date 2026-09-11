function ProjectSwitcher({ projects, activeProjectId, onProjectChange }) {
    return (
        <div>
            {projects.map((project) => (
                <button
                    key={project.id}
                    onClick={() => onProjectChange(project.id)}
                    className={
                        project.id === activeProjectId ? "active" : ""
                    }
                >
                    {project.name}
                </button>
            ))}
        </div>
    );
}

export default ProjectSwitcher;