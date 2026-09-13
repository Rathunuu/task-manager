function Controls({
  searchText, onSearchChange,
  activeCategory, onCategoryChange,
  sortBy, onSortChange,
  currentView, onViewChange,
}) {
  const categories = ["All", "Work", "Personal", "Urgent"];

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", margin: "16px 0", padding: "12px", background: "#f7f7f7", borderRadius: "8px" }}>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ padding: "8px", flex: 1, minWidth: "150px" }}
      />

      <div style={{ display: "flex", gap: "4px" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            style={{
              padding: "6px 10px",
              background: activeCategory === cat ? "#2563eb" : "white",
              color: activeCategory === cat ? "white" : "#333",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} style={{ padding: "8px" }}>
        <option value="newest">Newest</option>
        <option value="az">A → Z</option>
      </select>

      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={() => onViewChange("list")}
          style={{ padding: "6px 12px", background: currentView === "list" ? "#2563eb" : "white", color: currentView === "list" ? "white" : "#333", border: "1px solid #ccc", borderRadius: "6px", cursor: "pointer" }}
        >
          List
        </button>
        <button
          onClick={() => onViewChange("board")}
          style={{ padding: "6px 12px", background: currentView === "board" ? "#2563eb" : "white", color: currentView === "board" ? "white" : "#333", border: "1px solid #ccc", borderRadius: "6px", cursor: "pointer" }}
        >
          Board
        </button>
      </div>
    </div>
  );
}

export default Controls;
