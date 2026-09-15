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
   AUTH ELEMENTS
========================= */

const authScreen =
    document.getElementById("authScreen");

const appScreen =
    document.getElementById("appScreen");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const registerName =
    document.getElementById("registerName");

const registerEmail =
    document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const loginError =
    document.getElementById("loginError");

const registerError =
    document.getElementById("registerError");

const authSubtitle =
    document.getElementById("authSubtitle");

const showRegisterBtn =
    document.getElementById("showRegisterBtn");

const showLoginBtn =
    document.getElementById("showLoginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const welcomeMessage =
    document.getElementById("welcomeMessage");


/* =========================
   AUTH SCREEN FUNCTIONS
========================= */

function showLoginForm() {

    loginForm.hidden = false;
    registerForm.hidden = true;

    loginError.textContent = "";
    registerError.textContent = "";

    authSubtitle.textContent =
        "Login to continue to your Task Manager";

}


function showRegisterForm() {

    loginForm.hidden = true;
    registerForm.hidden = false;

    loginError.textContent = "";
    registerError.textContent = "";

    authSubtitle.textContent =
        "Create your account to get started";

}


function showApp() {

    authScreen.hidden = true;
    appScreen.hidden = false;

    if (welcomeMessage && currentUser) {

        welcomeMessage.textContent =
            `Welcome, ${currentUser.name}!`;

    }

}


function showAuth() {

    authScreen.hidden = false;
    appScreen.hidden = true;

    showLoginForm();

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
