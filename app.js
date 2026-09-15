import {
    loadTasks as loadTasksForUser,
    saveTasks as saveTasksForUser,
    loadProjects as loadProjectsForUser,
    saveProjects as saveProjectsForUser,
    loadUsers,
    saveUsers,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    findUserByEmail,
    isMasterCredentials,
    getMasterUser,
    isAdmin,
    getAllRegularUsers,
    loadUserTasksForAdmin,
    saveUserTasksForAdmin,
    createAssignedTask
} from "./storage.js";

import {
    renderTasks,
    renderProjects,
    renderBoard,
    renderTaskDetail,
    renderSubtasks,
    renderProgress,
    renderAdminUsers,
    renderAdminReports,
    renderAdminSummary
} from "./render.js";
