import {
    loadTasks as loadTasksForUser,
    saveTasks as saveTasksForUser,
    loadProjects as loadProjectsForUser,
    saveProjects as saveProjectsForUser,
    loadUsers,
    saveUsers,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser
} from "./storage.js";

import {
    renderTasks,
    renderProjects,
    renderBoard,
    renderTaskDetail,
    renderSubtasks,
    renderProgress
} from "./render.js";


/* =========================
   STATE
========================= */


/* =========================
   AUTH / CURRENT USER
========================= */

let currentUser = getCurrentUser();


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

let tasks = loadTasks();

let projects = loadProjects();

let activeProjectId = null;

let activeCategory = "All";

let searchText = "";

let currentView = "list";

let draggedTaskId = null;

let activeDetailTaskId = null;


/* =========================
   PROJECT MIGRATION
========================= */

if (
    currentUser &&
    projects.length === 0
) {

    const defaultProject = {

        id:
            crypto.randomUUID(),

        name:
            "My Project"

    };

    projects.push(
        defaultProject
    );

    saveProjects(projects);

}


if (
    currentUser &&
    projects.length > 0
) {

    activeProjectId =
        projects[0].id;

}
