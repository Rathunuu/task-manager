function ProjectSwitcher({
    projects,
    activeProjectId,
    onProjectChange
}) {
    return (
        <div className="project-switcher">
            {projects.length === 0 ? (
                <p>No projects available.</p>
            ) : (
                projects.map((project) => (
                    <button
                        key={project.id}
                        type="button"
                        className={
                            project.id === activeProjectId
                                ? "project-button active"
                                : "project-button"
                        }
                        onClick={() => onProjectChange(project.id)}
                    >
                        {project.name}
                    </button>
                ))
            )}
        </div>
    );
}

export default ProjectSwitcher;
