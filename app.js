/* =========================================================
   TASK MANAGER - APP.JS
   PART 1 / 5
========================================================= */

import {
    loadTasks,
    saveTasks,
    loadProjects,
    saveProjects,
    loadUsers,
    saveUsers,
    findUserByEmail,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    isMasterCredentials,
    getMasterUser,
    getAllRegularUsers,
    loadUserTasksForAdmin,
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


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentUser = null;

let tasks = [];

let projects = [];

let activeProjectId = null;

let currentFilter = "All";

let currentSort = "newest";

let currentView = "list";

let searchTerm = "";

let currentDetailTaskId = null;

let deletedTask = null;

let deletedTaskIndex = -1;

let undoTimeout = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

/* ---------- AUTH ---------- */

const authScreen =
    document.getElementById("authScreen");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginError =
    document.getElementById("loginError");

const registerName =
    document.getElementById("registerName");

const registerEmail =
    document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const registerError =
    document.getElementById("registerError");

const showRegisterBtn =
    document.getElementById("showRegisterBtn");

const showLoginBtn =
    document.getElementById("showLoginBtn");


/* ---------- USER APP ---------- */

const userTaskManager =
    document.getElementById("userTaskManager");

const welcomeUser =
    document.getElementById("welcomeUser");

const logoutBtn =
    document.getElementById("logoutBtn");

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const categorySelect =
    document.getElementById("categorySelect");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const filterButtons =
    document.querySelectorAll(
        "[data-category]"
    );

const listViewBtn =
    document.getElementById("listViewBtn");

const boardViewBtn =
    document.getElementById("boardViewBtn");

const taskCount =
    document.getElementById("taskCount");

const projectProgress =
    document.getElementById(
        "projectProgress"
    );


/* ---------- PROJECT ---------- */

const newProjectBtn =
    document.getElementById(
        "newProjectBtn"
    );

const newProjectDialog =
    document.getElementById(
        "newProjectDialog"
    );

const newProjectForm =
    document.getElementById(
        "newProjectForm"
    );

const newProjectName =
    document.getElementById(
        "newProjectName"
    );


/* ---------- TASK DETAIL ---------- */

const taskDetailDialog =
    document.getElementById(
        "taskDetailDialog"
    );

const detailTitle =
    document.getElementById(
        "detailTitle"
    );

const detailDescription =
    document.getElementById(
        "detailDescription"
    );

const detailStatus =
    document.getElementById(
        "detailStatus"
    );

const detailPriority =
    document.getElementById(
        "detailPriority"
    );

const detailDueDate =
    document.getElementById(
        "detailDueDate"
    );

const detailCategory =
    document.getElementById(
        "detailCategory"
    );

const taskNotes =
    document.getElementById(
        "taskNotes"
    );

const saveTaskDetailBtn =
    document.getElementById(
        "saveTaskDetailBtn"
    );

const closeDetailBtn =
    document.getElementById(
        "closeDetailBtn"
    );


/* ---------- SUBTASK ---------- */

const subtaskInput =
    document.getElementById(
        "subtaskInput"
    );

const addSubtaskBtn =
    document.getElementById(
        "addSubtaskBtn"
    );

const subtaskList =
    document.getElementById(
        "subtaskList"
    );


/* ---------- DATA ---------- */

const exportBtn =
    document.getElementById(
        "exportBtn"
    );

const importInput =
    document.getElementById(
        "importInput"
    );

const undoBtn =
    document.getElementById(
        "undoBtn"
    );


/* ---------- ADMIN ---------- */

const adminDashboard =
    document.getElementById(
        "adminDashboard"
    );

const adminTotalUsers =
    document.getElementById(
        "adminTotalUsers"
    );

const adminTotalTasks =
    document.getElementById(
        "adminTotalTasks"
    );

const adminPendingTasks =
    document.getElementById(
        "adminPendingTasks"
    );

const adminCompletedTasks =
    document.getElementById(
        "adminCompletedTasks"
    );

const adminUsersList =
    document.getElementById(
        "adminUsersList"
    );

const adminAssignTaskForm =
    document.getElementById(
        "adminAssignTaskForm"
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

const adminAssignMessage =
    document.getElementById(
        "adminAssignMessage"
    );

const adminTodoTasks =
    document.getElementById(
        "adminTodoTasks"
    );

const adminInProgressTasks =
    document.getElementById(
        "adminInProgressTasks"
    );

const adminInReviewTasks =
    document.getElementById(
        "adminInReviewTasks"
    );

const adminDoneTasks =
    document.getElementById(
        "adminDoneTasks"
    );

const adminReportsList =
    document.getElementById(
        "adminReportsList"
    );

const refreshAdminReportsBtn =
    document.getElementById(
        "refreshAdminReportsBtn"
    );

const adminOpenTaskManagerBtn =
    document.getElementById(
        "adminOpenTaskManagerBtn"
    );


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function loadCurrentUserData() {

    if (!currentUser) {
        tasks = [];
        projects = [];
        return;
    }

    if (currentUser.role === "admin") {
        tasks = [];
        projects = [];
        return;
    }

    tasks =
        loadTasks(currentUser.id);

    projects =
        loadProjects(currentUser.id);
}


function saveCurrentUserData() {

    if (!currentUser) return;

    if (currentUser.role === "admin") return;

    saveTasks(
        currentUser.id,
        tasks
    );

    saveProjects(
        currentUser.id,
        projects
    );
}


function ensureDefaultProject() {

    if (!currentUser) return;

    if (currentUser.role === "admin") return;

    if (!Array.isArray(projects)) {
        projects = [];
    }

    if (projects.length === 0) {

        const defaultProject = {
            id: crypto.randomUUID(),
            name: "My Project",
            createdAt: new Date().toISOString()
        };

        projects.push(defaultProject);

        saveProjects(
            currentUser.id,
            projects
        );
    }

    if (!activeProjectId) {

        activeProjectId =
            projects[0]?.id || null;
    }
}


/* =========================================================
   SCREEN FUNCTIONS
========================================================= */

function showLoginForm() {

    if (authScreen) {
        authScreen.style.display = "flex";
    }

    if (loginForm) {
        loginForm.style.display = "block";
    }

    if (registerForm) {
        registerForm.style.display = "none";
    }

    if (userTaskManager) {
        userTaskManager.style.display = "none";
    }

    if (adminDashboard) {
        adminDashboard.style.display = "none";
    }
}


function showRegisterForm() {

    if (authScreen) {
        authScreen.style.display = "flex";
    }

    if (loginForm) {
        loginForm.style.display = "none";
    }

    if (registerForm) {
        registerForm.style.display = "block";
    }

    if (userTaskManager) {
        userTaskManager.style.display = "none";
    }

    if (adminDashboard) {
        adminDashboard.style.display = "none";
    }
}


function showUserApp() {

    if (authScreen) {
        authScreen.style.display = "none";
    }

    if (userTaskManager) {
        userTaskManager.style.display = "block";
    }

    if (adminDashboard) {
        adminDashboard.style.display = "none";
    }

    if (welcomeUser && currentUser) {

        welcomeUser.textContent =
            `Welcome, ${currentUser.name}!`;
    }
}


function showAdminDashboard() {

    if (authScreen) {
        authScreen.style.display = "none";
    }

    if (userTaskManager) {
        userTaskManager.style.display = "none";
    }

    if (adminDashboard) {
        adminDashboard.style.display = "block";
    }
}


/* =========================================================
   AUTH BUTTONS
========================================================= */

if (showRegisterBtn) {

    showRegisterBtn.addEventListener(
        "click",
        () => {

            showRegisterForm();

            if (registerError) {
                registerError.textContent = "";
            }
        }
    );
}


if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        () => {

            showLoginForm();

            if (loginError) {
                loginError.textContent = "";
            }
        }
    );
}


/* =========================================================
   REGISTER
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                registerName.value.trim();

            const email =
                registerEmail.value
                    .trim()
                    .toLowerCase();

            const password =
                registerPassword.value;


            if (registerError) {
                registerError.textContent = "";
            }


            if (!name) {

                registerError.textContent =
                    "Please enter your name.";

                return;
            }


            if (!email) {

                registerError.textContent =
                    "Please enter your email.";

                return;
            }


            if (!password) {

                registerError.textContent =
                    "Please enter a password.";

                return;
            }


            if (
                email ===
                "admin@taskmanager.com"
            ) {

                registerError.textContent =
                    "This email is reserved.";

                return;
            }


            const existingUser =
                findUserByEmail(email);


            if (existingUser) {

                registerError.textContent =
                    "Email already registered.";

                return;
            }


            const users =
                loadUsers();


            const newUser = {

                id:
                    crypto.randomUUID(),

                name,

                email,

                password,

                role:
                    "user",

                createdAt:
                    new Date().toISOString()
            };


            users.push(newUser);

            saveUsers(users);


            registerForm.reset();

            showLoginForm();


            if (loginEmail) {
                loginEmail.value =
                    email;
            }


            if (loginError) {

                loginError.textContent =
                    "Registration successful. Please login.";
            }
        }
    );
}
