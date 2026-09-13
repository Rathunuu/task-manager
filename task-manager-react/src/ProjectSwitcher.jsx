function ProjectSwitcher({ projects, activeProjectId, onSelectProject, onCreateProject }) {
  function handleNewProject() {
    const name = window.prompt("New project name:");
    if (name && name.trim() !== "") {
      onCreateProject(name.trim());
    }
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onSelectProject(project.id)}
          style={{
            fontWeight: project.id === activeProjectId ? "bold" : "normal",
            padding: "8px 14px",
            background: project.id === activeProjectId ? "#2563eb" : "#f0f0f0",
            color: project.id === activeProjectId ? "white" : "#333",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {project.name}
        </button>
      ))}
      <button onClick={handleNewProject} style={{ padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }}>
        + New Project
      </button>
    </div>
  );
}

export default ProjectSwitcher;
