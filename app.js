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
/* =========================
   AUTH SCREEN FUNCTIONS
========================= */

function showLoginForm() {

    if (loginForm) {
        loginForm.hidden = false;
    }

    if (registerForm) {
        registerForm.hidden = true;
    }

    if (loginError) {
        loginError.textContent = "";
    }

    if (registerError) {
        registerError.textContent = "";
    }

    if (authSubtitle) {
        authSubtitle.textContent =
            "Login to continue to your Task Manager";
    }

}


function showRegisterForm() {

    if (loginForm) {
        loginForm.hidden = true;
    }

    if (registerForm) {
        registerForm.hidden = false;
    }

    if (loginError) {
        loginError.textContent = "";
    }

    if (registerError) {
        registerError.textContent = "";
    }

    if (authSubtitle) {
        authSubtitle.textContent =
            "Create your account to get started";
    }

}


/* =========================
   SHOW USER APP
========================= */

function showUserApp() {

    if (adminDashboard) {
        adminDashboard.hidden = true;
    }

    if (userTaskManager) {
        userTaskManager.hidden = false;
    }

    if (welcomeMessage && currentUser) {

        welcomeMessage.textContent =
            `Welcome, ${currentUser.name}!`;

    }

}


/* =========================
   SHOW ADMIN DASHBOARD
========================= */

function showAdminDashboard() {

    if (adminDashboard) {
        adminDashboard.hidden = false;
    }

    if (userTaskManager) {
        userTaskManager.hidden = true;
    }

    if (welcomeMessage) {

        welcomeMessage.textContent =
            "Welcome, Master Admin!";

    }

}


/* =========================
   SHOW APP
========================= */

function showApp() {

    if (authScreen) {
        authScreen.hidden = true;
    }

    if (appScreen) {
        appScreen.hidden = false;
    }


    if (currentUser && isAdmin(currentUser)) {

        showAdminDashboard();

        updateAdminDashboard();

    } else {

        showUserApp();

    }

}


/* =========================
   SHOW AUTH
========================= */

function showAuth() {

    if (authScreen) {
        authScreen.hidden = false;
    }

    if (appScreen) {
        appScreen.hidden = true;
    }

    showLoginForm();

}


/* =========================
   AUTH PAGE BUTTONS
========================= */

if (showRegisterBtn) {

    showRegisterBtn.addEventListener(
        "click",
        () => {

            showRegisterForm();

        }
    );

}


if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        () => {

            showLoginForm();

        }
    );

}


/* =========================
   REGISTER USER
========================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                registerName
                    ? registerName.value.trim()
                    : "";

            const email =
                registerEmail
                    ? registerEmail.value
                        .trim()
                        .toLowerCase()
                    : "";

            const password =
                registerPassword
                    ? registerPassword.value
                    : "";


            if (registerError) {
                registerError.textContent = "";
            }


            if (!name || !email || !password) {

                if (registerError) {

                    registerError.textContent =
                        "Please fill all fields.";

                }

                return;

            }


            if (password.length < 6) {

                if (registerError) {

                    registerError.textContent =
                        "Password must be at least 6 characters.";

                }

                return;

            }


            const users =
                loadUsers();


            const existingUser =
                users.find(
                    user =>
                        user.email === email
                );


            if (existingUser) {

                if (registerError) {

                    registerError.textContent =
                        "Email already registered.";

                }

                return;

            }


            const newUser = {

                id:
                    crypto.randomUUID(),

                name:
                    name,

                email:
                    email,

                password:
                    password,

                role:
                    "user"

            };


            users.push(newUser);

            saveUsers(users);


            setCurrentUser(newUser);

            currentUser =
                newUser;


            tasks =
                loadTasks();

            projects =
                loadProjects();


            ensureDefaultProject();


            registerForm.reset();


            showApp();

            updateUI();

        }
    );

}


/* =========================
   LOGIN
========================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                loginEmail
                    ? loginEmail.value
                        .trim()
                        .toLowerCase()
                    : "";

            const password =
                loginPassword
                    ? loginPassword.value
                    : "";


            if (loginError) {
                loginError.textContent = "";
            }


            /* =========================
               MASTER ADMIN LOGIN
            ========================= */

            if (
                isMasterCredentials(
                    email,
                    password
                )
            ) {

                currentUser =
                    getMasterUser();

                setCurrentUser(
                    currentUser
                );


                tasks = [];
                projects = [];

                activeProjectId = null;


                loginForm.reset();


                showApp();

                updateAdminDashboard();

                return;

            }


            /* =========================
               NORMAL USER LOGIN
            ========================= */

            const user =
                findUserByEmail(email);


            if (
                !user ||
                user.password !== password
            ) {

                if (loginError) {

                    loginError.textContent =
                        "Invalid email or password.";

                }

                return;

            }


            currentUser =
                user;

            setCurrentUser(
                user
            );


            tasks =
                loadTasks();

            projects =
                loadProjects();


            ensureDefaultProject();


            loginForm.reset();


            showApp();

            updateUI();

        }
    );

}


/* =========================
   LOGOUT
========================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            clearCurrentUser();

            currentUser = null;

            tasks = [];
            projects = [];

            activeProjectId = null;
            activeDetailTaskId = null;


            showAuth();

        }
    );

}
