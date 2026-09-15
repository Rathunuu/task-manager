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
/* =========================
   STATE
========================= */

let currentUser = getCurrentUser();

let tasks = [];
let projects = [];

let activeProjectId = null;
let activeCategory = "All";
let searchText = "";
let currentView = "list";

let draggedTaskId = null;
let activeDetailTaskId = null;


/* =========================
   USER-WISE TASK STORAGE
========================= */

function loadTasks() {

    return currentUser
        ? loadTasksForUser(currentUser.id)
        : [];

}


function saveTasks(data) {

    if (currentUser) {

        saveTasksForUser(
            currentUser.id,
            data
        );

    }

}


/* =========================
   USER-WISE PROJECT STORAGE
========================= */

function loadProjects() {

    return currentUser
        ? loadProjectsForUser(currentUser.id)
        : [];

}


function saveProjects(data) {

    if (currentUser) {

        saveProjectsForUser(
            currentUser.id,
            data
        );

    }

}


/* =========================
   INITIAL DATA
========================= */

tasks = loadTasks();

projects = loadProjects();


/* =========================
   DEFAULT PROJECT
========================= */

function ensureDefaultProject() {

    if (
        currentUser &&
        !isAdmin(currentUser) &&
        projects.length === 0
    ) {

        const defaultProject = {

            id: crypto.randomUUID(),

            name: "My Project"

        };

        projects.push(
            defaultProject
        );

        saveProjects(projects);

    }


    if (projects.length > 0) {

        activeProjectId =
            projects[0].id;

    } else {

        activeProjectId = null;

    }

}


ensureDefaultProject();
