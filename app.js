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
   REGISTER
========================= */

if (showRegisterBtn) {

    showRegisterBtn.addEventListener(
        "click",
        () => {

            showRegisterForm();

        }
    );

}


/* =========================
   LOGIN PAGE
========================= */

if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        () => {

            showLoginForm();

        }
    );

}


/* =========================
   REGISTER FORM
========================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const name =
                registerName.value.trim();

            const email =
                registerEmail.value
                    .trim()
                    .toLowerCase();

            const password =
                registerPassword.value;

            registerError.textContent = "";


            if (!name || !email || !password) {

                registerError.textContent =
                    "Please fill all fields.";

                return;

            }


            if (password.length < 6) {

                registerError.textContent =
                    "Password must be at least 6 characters.";

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

                registerError.textContent =
                    "Email already registered.";

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
                    password

            };


            users.push(newUser);

            saveUsers(users);

            setCurrentUser(newUser);

            currentUser = newUser;


            tasks = loadTasks();

            projects = loadProjects();


            if (projects.length === 0) {

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


            activeProjectId =
                projects[0]?.id || null;


            showApp();

            updateUI();

            registerForm.reset();

        }

    );

}


/* =========================
   LOGIN FORM
========================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const email =
                loginEmail.value
                    .trim()
                    .toLowerCase();

            const password =
                loginPassword.value;

            loginError.textContent = "";


            const users =
                loadUsers();


            const user =
                users.find(
                    item =>
                        item.email === email &&
                        item.password === password
                );


            if (!user) {

                loginError.textContent =
                    "Invalid email or password.";

                return;

            }


            currentUser = user;

            setCurrentUser(user);


            tasks = loadTasks();

            projects = loadProjects();


            if (projects.length === 0) {

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


            activeProjectId =
                projects[0]?.id || null;


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
