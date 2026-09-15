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
   ADMIN ELEMENTS
========================= */

const adminDashboard =
    document.getElementById(
        "adminDashboard"
    );

const userTaskManager =
    document.getElementById(
        "userTaskManager"
    );

const adminUserSelect =
    document.getElementById(
        "adminUserSelect"
    );

const adminTaskTitle =
    document.getElementById(
        "adminTaskTitle"
    );

const adminTaskDescription =
    document.getElementById(
        "adminTaskDescription"
    );

const adminTaskCategory =
    document.getElementById(
        "adminTaskCategory"
    );

const adminTaskPriority =
    document.getElementById(
        "adminTaskPriority"
    );

const adminTaskDueDate =
    document.getElementById(
        "adminTaskDueDate"
    );

const adminTaskProject =
    document.getElementById(
        "adminTaskProject"
    );

const adminAssignTaskForm =
    document.getElementById(
        "adminAssignTaskForm"
    );

const adminAssignTaskBtn =
    document.getElementById(
        "adminAssignTaskBtn"
    );

const adminAssignMessage =
    document.getElementById(
        "adminAssignMessage"
    );

const refreshAdminReportsBtn =
    document.getElementById(
        "refreshAdminReportsBtn"
    );

const adminOpenTaskManagerBtn =
    document.getElementById(
        "adminOpenTaskManagerBtn"
    );
