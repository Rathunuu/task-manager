function ProjectSwitcher({ projects, activeProjectId, onSelectProject }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onSelectProject(project.id)}
          style={{
            fontWeight: project.id === activeProjectId ? "bold" : "normal",
            padding: "8px 16px",
          }}
        >
          {project.name}
        </button>
      ))}
    </div>
  );
}

export default ProjectSwitcher;
