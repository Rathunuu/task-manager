## Week 4 — React Version

The React version of the task manager is in the `task-manager-react/` folder.

To run it locally:

### Live Links
- Original (vanilla JS) app: [https://rathunuu.github.io/task-manager/]
- React version: [https://rathunuu.github.io/task-manager/task-manager-react/]

### Notes
- The `storage.js` logic (loadTasks, saveTasks, loadProjects, saveProjects) was carried over unchanged — same localStorage data format.
- `ProjectSwitcher` and `TaskList` components are wired to React state (`useState`) in `App.jsx`.
- Switching projects updates which tasks are shown, confirming the state is working correctly.
- The original vanilla-JS app is kept live and unchanged while the React version is built alongside it.
