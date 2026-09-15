/* =====================================================
   TASK MANAGER - APP.JS
   PART 1 / 3
===================================================== */

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


/* =====================================================
   STATE
===================================================== */

let currentUser =
    getCurrentUser();

let tasks = [];

let projects = [];

let activeProjectId = null;

let activeCategory = "All";

let searchText = "";

let currentView = "list";

let draggedTaskId = null;

let activeDetailTaskId = null;


/* =====================================================
   USER TASK STORAGE
===================================================== */

function loadTasks() {

    if (!currentUser) {
        return [];
    }

    return loadTasksForUser(
        currentUser.id
    );
}


function saveTasks(data) {

    if (!currentUser) {
        return;
    }

    saveTasksForUser(
        currentUser.id,
        data
    );
}


/* =====================================================
   USER PROJECT STORAGE
===================================================== */

function loadProjects() {

    if (!currentUser) {
        return [];
    }

    return loadProjectsForUser(
        currentUser.id
    );
}


function saveProjects(data) {

    if (!currentUser) {
        return;
    }

    saveProjectsForUser(
        currentUser.id,
        data
    );
}


/* =====================================================
   INITIAL DATA
===================================================== */

tasks =
    loadTasks();

projects =
    loadProjects();


/* =====================================================
   DEFAULT PROJECT
===================================================== */

function ensureDefaultProject() {

    if (
        currentUser &&
        !isAdmin(currentUser) &&
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

        saveProjects(
            projects
        );
    }


    if (projects.length > 0) {

        activeProjectId =
            projects[0].id;

    } else {

        activeProjectId =
            null;

    }

}


ensureDefaultProject();


/* =====================================================
   AUTH ELEMENTS
===================================================== */

const authScreen =
    document.getElementById(
        "authScreen"
    );

const appScreen =
    document.getElementById(
        "appScreen"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );

const registerForm =
    document.getElementById(
        "registerForm"
    );


const loginEmail =
    document.getElementById(
        "loginEmail"
    );

const loginPassword =
    document.getElementById(
        "loginPassword"
    );


const registerName =
    document.getElementById(
        "registerName"
    );

const registerEmail =
    document.getElementById(
        "registerEmail"
    );

const registerPassword =
    document.getElementById(
        "registerPassword"
    );


const loginError =
    document.getElementById(
        "loginError"
    );

const registerError =
    document.getElementById(
        "registerError"
    );


const authSubtitle =
    document.getElementById(
        "authSubtitle"
    );


const showRegisterBtn =
    document.getElementById(
        "showRegisterBtn"
    );

const showLoginBtn =
    document.getElementById(
        "showLoginBtn"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const welcomeMessage =
    document.getElementById(
        "welcomeMessage"
    );


/* =====================================================
   ADMIN ELEMENTS
===================================================== */

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


/* =====================================================
   TASK MANAGER ELEMENTS
===================================================== */

const taskForm =
    document.getElementById(
        "taskForm"
    );


const taskInput =
    document.getElementById(
        "taskInput"
    );


const categorySelect =
    document.getElementById(
        "categorySelect"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const clearSearchBtn =
    document.getElementById(
        "clearSearchBtn"
    );


const sortSelect =
    document.getElementById(
        "sortSelect"
    );


const listViewBtn =
    document.getElementById(
        "listViewBtn"
    );


const boardViewBtn =
    document.getElementById(
        "boardViewBtn"
    );


const taskList =
    document.getElementById(
        "taskList"
    );


const board =
    document.getElementById(
        "board"
    );


/* =====================================================
   PROJECT ELEMENTS
===================================================== */

const projectSelect =
    document.getElementById(
        "projectSelect"
    );


const newProjectBtn =
    document.getElementById(
        "newProjectBtn"
    );


const projectNameInput =
    document.getElementById(
        "projectNameInput"
    );


const projectForm =
    document.getElementById(
        "projectForm"
    );


const projectModal =
    document.getElementById(
        "projectModal"
    );


const closeProjectModalBtn =
    document.getElementById(
        "closeProjectModalBtn"
    );


/* =====================================================
   TASK DETAIL ELEMENTS
===================================================== */

const taskDetailModal =
    document.getElementById(
        "taskDetailModal"
    );


const taskDetailTitle =
    document.getElementById(
        "taskDetailTitle"
    );


const taskDetailDescription =
    document.getElementById(
        "taskDetailDescription"
    );


const taskDetailCategory =
    document.getElementById(
        "taskDetailCategory"
    );


const taskDetailPriority =
    document.getElementById(
        "taskDetailPriority"
    );


const taskDetailStatus =
    document.getElementById(
        "taskDetailStatus"
    );


const taskDetailDueDate =
    document.getElementById(
        "taskDetailDueDate"
    );


const taskDetailNotes =
    document.getElementById(
        "taskDetailNotes"
    );


const taskDetailSubtasks =
    document.getElementById(
        "taskDetailSubtasks"
    );


const closeTaskDetailBtn =
    document.getElementById(
        "closeTaskDetailBtn"
    );


/* =====================================================
   UNDO
===================================================== */

const undoToast =
    document.getElementById(
        "undoToast"
    );


const undoDeleteBtn =
    document.getElementById(
        "undoDeleteBtn"
    );


/* =====================================================
   AUTH SCREEN
===================================================== */

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


function showUserApp() {

    if (adminDashboard) {
        adminDashboard.hidden = true;
    }

    if (userTaskManager) {
        userTaskManager.hidden = false;
    }

    if (
        welcomeMessage &&
        currentUser
    ) {

        welcomeMessage.textContent =
            `Welcome, ${currentUser.name}!`;

    }

}


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


function showApp() {

    if (authScreen) {
        authScreen.hidden = true;
    }

    if (appScreen) {
        appScreen.hidden = false;
    }

    if (
        currentUser &&
        isAdmin(currentUser)
    ) {

        showAdminDashboard();

        updateAdminDashboard();

    } else {

        showUserApp();

    }

}


function showAuth() {

    if (authScreen) {
        authScreen.hidden = false;
    }

    if (appScreen) {
        appScreen.hidden = true;
    }

    showLoginForm();

}


/* =====================================================
   SHOW REGISTER
===================================================== */

if (showRegisterBtn) {

    showRegisterBtn.addEventListener(
        "click",
        () => {

            showRegisterForm();

        }
    );

}


/* =====================================================
   SHOW LOGIN
===================================================== */

if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        () => {

            showLoginForm();

        }
    );

}


/* =====================================================
   REGISTER
===================================================== */

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
                registerError.textContent =
                    "";
            }


            if (
                !name ||
                !email ||
                !password
            ) {

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


            if (
                isMasterCredentials(
                    email,
                    password
                )
            ) {

                if (registerError) {

                    registerError.textContent =
                        "This email is reserved.";

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


            users.push(
                newUser
            );

            saveUsers(
                users
            );


            currentUser =
                newUser;

            setCurrentUser(
                currentUser
            );


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
