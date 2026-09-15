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
/* =========================================================
   PART 2 / 5
   LOGIN + LOGOUT + ADMIN DASHBOARD
========================================================= */


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const email =
                loginEmail
                    ? loginEmail.value.trim().toLowerCase()
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
                email === "admin@taskmanager.com" &&
                password === "admin123"
            ) {

                currentUser =
                    getMasterUser();

                setCurrentUser(
                    currentUser
                );


                tasks = [];
                projects = [];
                activeProjectId = null;


                if (loginForm) {
                    loginForm.reset();
                }


                showAdminDashboard();

                updateAdminDashboard();

                renderAdminBoard();

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
                currentUser
            );


            loadCurrentUserData();

            ensureDefaultProject();


            if (loginForm) {
                loginForm.reset();
            }


            showUserApp();

            updateUI();
        }
    );
}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            clearCurrentUser();


            currentUser = null;

            tasks = [];

            projects = [];

            activeProjectId = null;

            searchTerm = "";

            currentFilter = "All";

            currentSort = "newest";

            currentView = "list";


            showLoginForm();
        }
    );
}


/* =========================================================
   ADMIN USER STATISTICS
========================================================= */

function getAdminUserStats() {

    const users =
        getAllRegularUsers();


    return users.map(
        user => {

            const userTasks =
                loadUserTasksForAdmin(
                    user.id
                );


            const total =
                userTasks.length;


            const completed =
                userTasks.filter(
                    task =>
                        task.status === "Done"
                ).length;


            const pending =
                total - completed;


            const progress =
                total > 0
                    ? Math.round(
                        (completed / total) * 100
                    )
                    : 0;


            return {

                user,

                tasks:
                    userTasks,

                total,

                completed,

                pending,

                progress
            };
        }
    );
}


/* =========================================================
   ADMIN SUMMARY
========================================================= */

function updateAdminSummary() {

    const users =
        getAllRegularUsers();


    let totalTasks = 0;

    let completedTasks = 0;


    users.forEach(
        user => {

            const userTasks =
                loadUserTasksForAdmin(
                    user.id
                );


            totalTasks +=
                userTasks.length;


            completedTasks +=
                userTasks.filter(
                    task =>
                        task.status === "Done"
                ).length;
        }
    );


    const pendingTasks =
        totalTasks -
        completedTasks;


    if (adminTotalUsers) {

        adminTotalUsers.textContent =
            users.length;
    }


    if (adminTotalTasks) {

        adminTotalTasks.textContent =
            totalTasks;
    }


    if (adminPendingTasks) {

        adminPendingTasks.textContent =
            pendingTasks;
    }


    if (adminCompletedTasks) {

        adminCompletedTasks.textContent =
            completedTasks;
    }


    if (
        typeof renderAdminSummary ===
        "function"
    ) {

        renderAdminSummary({

            totalUsers:
                users.length,

            totalTasks,

            pendingTasks,

            completedTasks
        });
    }
}


/* =========================================================
   ADMIN USERS
========================================================= */

function updateAdminUsers() {

    const users =
        getAllRegularUsers();


    const stats =
        getAdminUserStats();


    if (
        typeof renderAdminUsers ===
        "function"
    ) {

        renderAdminUsers(
            users,
            stats
        );
    }
}


/* =========================================================
   ADMIN REPORTS
========================================================= */

function updateAdminReports() {

    const users =
        getAllRegularUsers();


    const stats =
        getAdminUserStats();


    if (
        typeof renderAdminReports ===
        "function"
    ) {

        renderAdminReports(
            users,
            stats
        );
    }
}


/* =========================================================
   ADMIN USER SELECT
========================================================= */

function populateAdminUserSelect() {

    if (!adminUserSelect) return;


    const users =
        getAllRegularUsers();


    adminUserSelect.innerHTML =
        `<option value="">Select User</option>`;


    users.forEach(
        user => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                user.id;


            option.textContent =
                `${user.name} (${user.email})`;


            adminUserSelect.appendChild(
                option
            );
        }
    );
}


/* =========================================================
   ADMIN PROJECT SELECT
========================================================= */

function updateAdminProjectOptions(
    userId
) {

    if (!adminTaskProject) return;


    adminTaskProject.innerHTML =
        `<option value="">No Project</option>`;


    if (!userId) return;


    const userProjects =
        loadProjects(userId);


    userProjects.forEach(
        project => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                project.id;


            option.textContent =
                project.name;


            adminTaskProject.appendChild(
                option
            );
        }
    );
}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function updateAdminDashboard() {

    if (!currentUser) return;

    if (currentUser.role !== "admin")
        return;


    updateAdminSummary();

    updateAdminUsers();

    updateAdminReports();

    populateAdminUserSelect();
}


/* =========================================================
   ADMIN USER SELECT CHANGE
========================================================= */

if (adminUserSelect) {

    adminUserSelect.addEventListener(
        "change",
        () => {

            updateAdminProjectOptions(
                adminUserSelect.value
            );
        }
    );
}


/* =========================================================
   ADMIN REFRESH REPORTS
========================================================= */

if (refreshAdminReportsBtn) {

    refreshAdminReportsBtn.addEventListener(
        "click",
        () => {

            updateAdminDashboard();

            renderAdminBoard();
        }
    );
}


/* =========================================================
   ADMIN OPEN TASK MANAGER
========================================================= */

if (adminOpenTaskManagerBtn) {

    adminOpenTaskManagerBtn.addEventListener(
        "click",
        () => {

            alert(
                "Master Admin is using the Admin Dashboard."
            );
        }
    );
}
/* =========================================================
   PART 3 / 5
   TASK ADD + FILTER + SEARCH + SORT + VIEW
========================================================= */


/* =========================================================
   ADD TASK
========================================================= */

if (taskForm) {

    taskForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            if (!currentUser) return;

            if (currentUser.role === "admin") return;


            const text =
                taskInput
                    ? taskInput.value.trim()
                    : "";


            if (!text) return;


            const category =
                categorySelect
                    ? categorySelect.value
                    : "Work";


            const newTask = {

                id:
                    crypto.randomUUID(),

                text,

                category,

                status:
                    "To Do",

                priority:
                    "Normal",

                dueDate:
                    "",

                description:
                    "",

                notes:
                    "",

                subtasks:
                    [],

                projectId:
                    activeProjectId,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()
            };


            tasks.unshift(
                newTask
            );


            saveTasks(
                currentUser.id,
                tasks
            );


            if (taskForm) {
                taskForm.reset();
            }


            updateUI();
        }
    );
}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            updateUI();
        }
    );
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

if (filterButtons) {

    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    currentFilter =
                        button.dataset.category ||
                        button.textContent.trim();


                    filterButtons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    updateUI();
                }
            );
        }
    );
}


/* =========================================================
   SORT
========================================================= */

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        () => {

            currentSort =
                sortSelect.value;


            updateUI();
        }
    );
}


/* =========================================================
   LIST VIEW
========================================================= */

if (listViewBtn) {

    listViewBtn.addEventListener(
        "click",
        () => {

            currentView =
                "list";


            listViewBtn.classList.add(
                "active"
            );


            if (boardViewBtn) {

                boardViewBtn.classList.remove(
                    "active"
                );
            }


            updateUI();
        }
    );
}


/* =========================================================
   BOARD VIEW
========================================================= */

if (boardViewBtn) {

    boardViewBtn.addEventListener(
        "click",
        () => {

            currentView =
                "board";


            boardViewBtn.classList.add(
                "active"
            );


            if (listViewBtn) {

                listViewBtn.classList.remove(
                    "active"
                );
            }


            updateUI();
        }
    );
}


/* =========================================================
   TASK STATUS CHANGE
========================================================= */

document.addEventListener(
    "change",
    event => {

        const statusElement =
            event.target.closest(
                "[data-task-status]"
            );


        if (!statusElement) return;

        if (!currentUser) return;

        if (currentUser.role === "admin")
            return;


        const taskId =
            statusElement.dataset.taskStatus;


        const task =
            tasks.find(
                item =>
                    item.id === taskId
            );


        if (!task) return;


        task.status =
            statusElement.value;


        task.updatedAt =
            new Date().toISOString();


        saveTasks(
            currentUser.id,
            tasks
        );


        updateUI();
    }
);


/* =========================================================
   UPDATE TASK
========================================================= */

function updateTask(
    taskId,
    updates
) {

    if (!currentUser) return;


    const task =
        tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) return;


    Object.assign(
        task,
        updates
    );


    task.updatedAt =
        new Date().toISOString();


    saveTasks(
        currentUser.id,
        tasks
    );


    updateUI();
}


/* =========================================================
   DELETE TASK
========================================================= */

document.addEventListener(
    "click",
    event => {

        const deleteButton =
            event.target.closest(
                "[data-delete-task]"
            );


        if (!deleteButton) return;


        if (!currentUser) return;

        if (currentUser.role === "admin")
            return;


        const taskId =
            deleteButton.dataset.deleteTask;


        const index =
            tasks.findIndex(
                task =>
                    task.id === taskId
            );


        if (index === -1) return;


        deletedTask =
            tasks[index];


        deletedTaskIndex =
            index;


        tasks.splice(
            index,
            1
        );


        saveTasks(
            currentUser.id,
            tasks
        );


        updateUI();


        showUndoMessage();
    }
);


/* =========================================================
   UNDO MESSAGE
========================================================= */

function showUndoMessage() {

    if (!undoBtn) return;


    undoBtn.style.display =
        "block";


    clearTimeout(
        undoTimeout
    );


    undoTimeout =
        setTimeout(
            () => {

                deletedTask =
                    null;

                deletedTaskIndex =
                    -1;


                if (undoBtn) {

                    undoBtn.style.display =
                        "none";
                }

            },
            5000
        );
}


/* =========================================================
   UNDO DELETE
========================================================= */

if (undoBtn) {

    undoBtn.addEventListener(
        "click",
        () => {

            if (!currentUser) return;

            if (!deletedTask) return;


            const index =
                Math.min(
                    deletedTaskIndex,
                    tasks.length
                );


            tasks.splice(
                index,
                0,
                deletedTask
            );


            saveTasks(
                currentUser.id,
                tasks
            );


            deletedTask =
                null;


            deletedTaskIndex =
                -1;


            clearTimeout(
                undoTimeout
            );


            undoBtn.style.display =
                "none";


            updateUI();
        }
    );
}


/* =========================================================
   TASK COUNT
========================================================= */

function updateTaskCount() {

    if (!taskCount) return;


    taskCount.textContent =
        `${tasks.length} Tasks`;
}


/* =========================================================
   PROJECT PROGRESS
========================================================= */

function updateProjectProgress() {

    if (!projectProgress) return;


    if (!activeProjectId) {

        projectProgress.textContent =
            "0 of 0 tasks done";

        return;
    }


    const projectTasks =
        tasks.filter(
            task =>
                task.projectId ===
                activeProjectId
        );


    const completed =
        projectTasks.filter(
            task =>
                task.status === "Done"
        ).length;


    projectProgress.textContent =
        `${completed} of ${projectTasks.length} tasks done`;
}


/* =========================================================
   UPDATE UI
========================================================= */

function updateUI() {

    if (!currentUser) return;


    if (currentUser.role === "admin") {

        updateAdminDashboard();

        renderAdminBoard();

        return;
    }


    loadCurrentUserData();

    ensureDefaultProject();


    if (welcomeUser) {

        welcomeUser.textContent =
            `Welcome, ${currentUser.name}!`;
    }


    if (
        typeof renderProjects ===
        "function"
    ) {

        renderProjects(
            projects,
            activeProjectId
        );
    }


    if (
        typeof renderTasks ===
        "function"
    ) {

        renderTasks(
            tasks,
            currentFilter,
            searchTerm,
            currentSort,
            activeProjectId
        );
    }


    if (
        typeof renderBoard ===
        "function"
    ) {

        renderBoard(
            tasks,
            currentFilter,
            searchTerm,
            currentSort,
            activeProjectId
        );
    }


    updateTaskCount();

    updateProjectProgress();
}
/* =========================================================
   PART 4 / 5
   PROJECTS + TASK DETAILS + SUBTASKS + DRAG & DROP
========================================================= */


/* =========================================================
   LOAD ACTIVE PROJECT
========================================================= */

function loadActiveProject() {

    if (!currentUser) return;

    if (currentUser.role === "admin") return;


    const savedProject =
        localStorage.getItem(
            `task-manager-active-project-${currentUser.id}`
        );


    if (
        savedProject &&
        projects.some(
            project =>
                project.id === savedProject
        )
    ) {

        activeProjectId =
            savedProject;

        return;
    }


    activeProjectId =
        projects[0]?.id || null;
}


/* =========================================================
   PROJECT CLICK
========================================================= */

document.addEventListener(
    "click",
    event => {

        const projectElement =
            event.target.closest(
                "[data-project-id]"
            );


        if (!projectElement) return;

        if (!currentUser) return;


        const projectId =
            projectElement.dataset.projectId;


        if (!projectId) return;


        activeProjectId =
            projectId;


        localStorage.setItem(
            `task-manager-active-project-${currentUser.id}`,
            activeProjectId
        );


        updateUI();
    }
);


/* =========================================================
   NEW PROJECT
========================================================= */

if (newProjectBtn) {

    newProjectBtn.addEventListener(
        "click",
        () => {

            if (!currentUser) return;

            if (currentUser.role === "admin")
                return;


            if (newProjectDialog) {

                newProjectDialog.showModal();
            }
        }
    );
}


/* =========================================================
   CREATE PROJECT
========================================================= */

if (newProjectForm) {

    newProjectForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (!currentUser) return;

            if (currentUser.role === "admin")
                return;


            const name =
                newProjectName
                    ? newProjectName.value.trim()
                    : "";


            if (!name) return;


            const newProject = {

                id:
                    crypto.randomUUID(),

                name,

                createdAt:
                    new Date().toISOString()
            };


            projects.push(
                newProject
            );


            saveProjects(
                currentUser.id,
                projects
            );


            activeProjectId =
                newProject.id;


            localStorage.setItem(
                `task-manager-active-project-${currentUser.id}`,
                activeProjectId
            );


            newProjectForm.reset();


            if (newProjectDialog) {

                newProjectDialog.close();
            }


            updateUI();
        }
    );
}


/* =========================================================
   OPEN TASK DETAIL
========================================================= */

document.addEventListener(
    "click",
    event => {

        const taskElement =
            event.target.closest(
                "[data-task-id]"
            );


        if (!taskElement) return;

        if (!currentUser) return;

        if (currentUser.role === "admin")
            return;


        if (
            event.target.closest(
                "[data-delete-task]"
            )
        ) return;


        const taskId =
            taskElement.dataset.taskId;


        if (!taskId) return;


        const task =
            tasks.find(
                item =>
                    item.id === taskId
            );


        if (!task) return;


        openTaskDetail(
            task
        );
    }
);


/* =========================================================
   OPEN TASK DETAIL FUNCTION
========================================================= */

function openTaskDetail(task) {

    currentDetailTaskId =
        task.id;


    if (detailTitle) {

        detailTitle.value =
            task.text || "";
    }


    if (detailDescription) {

        detailDescription.value =
            task.description || "";
    }


    if (detailStatus) {

        detailStatus.value =
            task.status || "To Do";
    }


    if (detailPriority) {

        detailPriority.value =
            task.priority || "Normal";
    }


    if (detailDueDate) {

        detailDueDate.value =
            task.dueDate || "";
    }


    if (detailCategory) {

        detailCategory.value =
            task.category || "Work";
    }


    if (taskNotes) {

        taskNotes.value =
            task.notes || "";
    }


    renderTaskSubtasks(
        task
    );


    if (taskDetailDialog) {

        taskDetailDialog.showModal();
    }
}


/* =========================================================
   SAVE TASK DETAILS
========================================================= */

if (saveTaskDetailBtn) {

    saveTaskDetailBtn.addEventListener(
        "click",
        () => {

            if (!currentUser) return;


            if (!currentDetailTaskId)
                return;


            const task =
                tasks.find(
                    item =>
                        item.id ===
                        currentDetailTaskId
                );


            if (!task) return;


            if (detailTitle) {

                const title =
                    detailTitle.value.trim();

                if (title) {

                    task.text =
                        title;
                }
            }


            if (detailDescription) {

                task.description =
                    detailDescription.value;
            }


            if (detailStatus) {

                task.status =
                    detailStatus.value;
            }


            if (detailPriority) {

                task.priority =
                    detailPriority.value;
            }


            if (detailDueDate) {

                task.dueDate =
                    detailDueDate.value;
            }


            if (detailCategory) {

                task.category =
                    detailCategory.value;
            }


            if (taskNotes) {

                task.notes =
                    taskNotes.value;
            }


            task.updatedAt =
                new Date().toISOString();


            saveTasks(
                currentUser.id,
                tasks
            );


            currentDetailTaskId =
                null;


            if (taskDetailDialog) {

                taskDetailDialog.close();
            }


            updateUI();
        }
    );
}


/* =========================================================
   CLOSE TASK DETAIL
========================================================= */

if (closeDetailBtn) {

    closeDetailBtn.addEventListener(
        "click",
        () => {

            currentDetailTaskId =
                null;


            if (taskDetailDialog) {

                taskDetailDialog.close();
            }
        }
    );
}


/* =========================================================
   RENDER SUBTASKS
========================================================= */

function renderTaskSubtasks(task) {

    if (!subtaskList) return;


    subtaskList.innerHTML =
        "";


    if (!Array.isArray(task.subtasks)) {

        task.subtasks = [];
    }


    task.subtasks.forEach(
        (subtask, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "subtask-item";


            item.innerHTML = `

                <label>

                    <input
                        type="checkbox"
                        data-subtask-index="${index}"
                        ${subtask.completed ? "checked" : ""}
                    >

                    <span>
                        ${escapeHtml(subtask.text)}
                    </span>

                </label>

                <button
                    type="button"
                    data-delete-subtask="${index}"
                >
                    Delete
                </button>

            `;


            subtaskList.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   ADD SUBTASK
========================================================= */

if (addSubtaskBtn) {

    addSubtaskBtn.addEventListener(
        "click",
        () => {

            if (!currentUser) return;


            if (!currentDetailTaskId)
                return;


            const task =
                tasks.find(
                    item =>
                        item.id ===
                        currentDetailTaskId
                );


            if (!task) return;


            const text =
                subtaskInput
                    ? subtaskInput.value.trim()
                    : "";


            if (!text) return;


            if (!Array.isArray(task.subtasks)) {

                task.subtasks = [];
            }


            task.subtasks.push({

                id:
                    crypto.randomUUID(),

                text,

                completed:
                    false
            });


            if (subtaskInput) {

                subtaskInput.value =
                    "";
            }


            saveTasks(
                currentUser.id,
                tasks
            );


            renderTaskSubtasks(
                task
            );
        }
    );
}


/* =========================================================
   SUBTASK CLICK
========================================================= */

if (subtaskList) {

    subtaskList.addEventListener(
        "click",
        event => {

            if (!currentDetailTaskId)
                return;


            const task =
                tasks.find(
                    item =>
                        item.id ===
                        currentDetailTaskId
                );


            if (!task) return;


            /* DELETE SUBTASK */

            const deleteButton =
                event.target.closest(
                    "[data-delete-subtask]"
                );


            if (deleteButton) {

                const index =
                    Number(
                        deleteButton.dataset
                            .deleteSubtask
                    );


                task.subtasks.splice(
                    index,
                    1
                );


                saveTasks(
                    currentUser.id,
                    tasks
                );


                renderTaskSubtasks(
                    task
                );


                return;
            }


            /* COMPLETE SUBTASK */

            const checkbox =
                event.target.closest(
                    "[data-subtask-index]"
                );


            if (checkbox) {

                const index =
                    Number(
                        checkbox.dataset
                            .subtaskIndex
                    );


                if (
                    task.subtasks[index]
                ) {

                    task.subtasks[index]
                        .completed =
                        checkbox.checked;
                }


                saveTasks(
                    currentUser.id,
                    tasks
                );
            }
        }
    );
}


/* =========================================================
   DRAG & DROP
========================================================= */

let draggedTaskId = null;


/* ---------- DRAG START ---------- */

document.addEventListener(
    "dragstart",
    event => {

        const taskElement =
            event.target.closest(
                "[data-task-id]"
            );


        if (!taskElement) return;

        if (!currentUser) return;


        draggedTaskId =
            taskElement.dataset.taskId;


        taskElement.classList.add(
            "dragging"
        );


        if (
            event.dataTransfer
        ) {

            event.dataTransfer.effectAllowed =
                "move";

            event.dataTransfer.setData(
                "text/plain",
                draggedTaskId
            );
        }
    }
);


/* ---------- DRAG END ---------- */

document.addEventListener(
    "dragend",
    event => {

        const taskElement =
            event.target.closest(
                "[data-task-id]"
            );


        if (taskElement) {

            taskElement.classList.remove(
                "dragging"
            );
        }


        draggedTaskId =
            null;
    }
);


/* ---------- DRAG OVER ---------- */

document.addEventListener(
    "dragover",
    event => {

        const dropZone =
            event.target.closest(
                "[data-drop-zone]"
            );


        if (!dropZone) return;


        event.preventDefault();


        if (
            event.dataTransfer
        ) {

            event.dataTransfer.dropEffect =
                "move";
        }
    }
);


/* ---------- DROP ---------- */

document.addEventListener(
    "drop",
    event => {

        const dropZone =
            event.target.closest(
                "[data-drop-zone]"
            );


        if (!dropZone) return;


        event.preventDefault();


        if (!currentUser) return;


        const taskId =
            draggedTaskId ||
            event.dataTransfer?.getData(
                "text/plain"
            );


        if (!taskId) return;


        const task =
            tasks.find(
                item =>
                    item.id === taskId
            );


        if (!task) return;


        const newStatus =
            dropZone.dataset.dropZone;


        if (newStatus) {

            task.status =
                newStatus;
        }


        task.updatedAt =
            new Date().toISOString();


        saveTasks(
            currentUser.id,
            tasks
        );


        updateUI();
    }
);


/* =========================================================
   HELPER - ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}
/* =========================================================
   PART 5 / 5
   ADMIN ASSIGN + ADMIN BOARD + IMPORT/EXPORT
   + KEYBOARD + START APPLICATION
========================================================= */


/* =========================================================
   ADMIN - ASSIGN TASK TO USER
========================================================= */

if (adminAssignTaskForm) {

    adminAssignTaskForm.addEventListener("submit", event => {

        event.preventDefault();

        if (!currentUser) return;
        if (currentUser.role !== "admin") return;

        const userId =
            adminUserSelect
                ? adminUserSelect.value
                : "";

        const title =
            adminTaskTitle
                ? adminTaskTitle.value.trim()
                : "";

        const description =
            adminTaskDescription
                ? adminTaskDescription.value.trim()
                : "";

        const category =
            adminTaskCategory
                ? adminTaskCategory.value
                : "Work";

        const priority =
            adminTaskPriority
                ? adminTaskPriority.value
                : "Normal";

        const dueDate =
            adminTaskDueDate
                ? adminTaskDueDate.value
                : "";

        const projectId =
            adminTaskProject
                ? adminTaskProject.value
                : "";

        if (!userId) {

            if (adminAssignMessage) {
                adminAssignMessage.textContent =
                    "Please select a user.";
            }

            return;
        }

        if (!title) {

            if (adminAssignMessage) {
                adminAssignMessage.textContent =
                    "Please enter a task title.";
            }

            return;
        }

        const assignedTask =
            createAssignedTask(
                userId,
                {
                    text: title,
                    description,
                    category,
                    priority,
                    dueDate,
                    projectId: projectId || null,
                    status: "To Do"
                }
            );

        if (!assignedTask) {

            if (adminAssignMessage) {
                adminAssignMessage.textContent =
                    "Could not assign task.";
            }

            return;
        }

        if (adminAssignMessage) {
            adminAssignMessage.textContent =
                "Task assigned successfully.";
        }

        if (adminAssignTaskForm) {
            adminAssignTaskForm.reset();
        }

        updateAdminProjectOptions("");

        updateAdminDashboard();
        renderAdminBoard();
    });
}


/* =========================================================
   ADMIN - BOARD
========================================================= */

function renderAdminBoard() {

    if (!currentUser) return;
    if (currentUser.role !== "admin") return;

    const users =
        getAllRegularUsers();

    const allTasks = [];

    users.forEach(user => {

        const userTasks =
            loadUserTasksForAdmin(user.id);

        userTasks.forEach(task => {

            allTasks.push({
                ...task,
                assignedUserName: user.name,
                assignedUserEmail: user.email,
                assignedUserId: user.id
            });

        });

    });

    const columns = {
        "To Do": adminTodoTasks,
        "In Progress": adminInProgressTasks,
        "In Review": adminInReviewTasks,
        "Done": adminDoneTasks
    };

    Object.values(columns).forEach(column => {

        if (column) {
            column.innerHTML = "";
        }

    });

    allTasks.forEach(task => {

        const column =
            columns[task.status] ||
            columns["To Do"];

        if (!column) return;

        const card =
            document.createElement("div");

        card.className =
            "admin-task-card";

        card.innerHTML = `

            <div class="admin-task-title">
                ${escapeHtml(task.text)}
            </div>

            <div class="admin-task-user">
                Assigned to:
                <strong>
                    ${escapeHtml(task.assignedUserName)}
                </strong>
            </div>

            <div class="admin-task-meta">
                <span>
                    ${escapeHtml(task.category || "Work")}
                </span>

                <span>
                    ${escapeHtml(task.priority || "Normal")}
                </span>
            </div>

            ${
                task.dueDate
                    ? `<div class="admin-task-due">
                        Due: ${escapeHtml(task.dueDate)}
                       </div>`
                    : ""
            }

        `;

        column.appendChild(card);
    });
}


/* =========================================================
   ADMIN - OPEN TASK MANAGER BUTTON
========================================================= */

if (adminOpenTaskManagerBtn) {

    adminOpenTaskManagerBtn.addEventListener(
        "click",
        () => {

            if (!currentUser) return;

            if (currentUser.role === "admin") {

                alert(
                    "Master Admin can manage users and assigned tasks from this dashboard."
                );

                return;
            }

            showUserApp();
            updateUI();
        }
    );
}


/* =========================================================
   EXPORT TASKS
========================================================= */

if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        () => {

            if (!currentUser) return;
            if (currentUser.role === "admin") return;

            const exportData = {
                exportedAt:
                    new Date().toISOString(),

                user: {
                    id: currentUser.id,
                    name: currentUser.name,
                    email: currentUser.email
                },

                projects,
                tasks
            };

            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            exportData,
                            null,
                            2
                        )
                    ],
                    {
                        type: "application/json"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "tasks.json";

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);
        }
    );
}


/* =========================================================
   IMPORT TASKS
========================================================= */

if (importInput) {

    importInput.addEventListener(
        "change",
        event => {

            if (!currentUser) return;
            if (currentUser.role === "admin") return;

            const file =
                event.target.files?.[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload = () => {

                try {

                    const importedData =
                        JSON.parse(
                            reader.result
                        );

                    let importedTasks = [];

                    let importedProjects = [];

                    if (
                        Array.isArray(
                            importedData
                        )
                    ) {
                        importedTasks =
                            importedData;
                    }

                    else {

                        if (
                            Array.isArray(
                                importedData.tasks
                            )
                        ) {
                            importedTasks =
                                importedData.tasks;
                        }

                        if (
                            Array.isArray(
                                importedData.projects
                            )
                        ) {
                            importedProjects =
                                importedData.projects;
                        }
                    }

                    if (!Array.isArray(importedTasks)) {
                        importedTasks = [];
                    }

                    if (!Array.isArray(importedProjects)) {
                        importedProjects = [];
                    }

                    tasks =
                        importedTasks.map(
                            task => ({
                                id:
                                    task.id ||
                                    crypto.randomUUID(),

                                text:
                                    task.text ||
                                    "Imported Task",

                                category:
                                    task.category ||
                                    "Work",

                                status:
                                    task.status ||
                                    "To Do",

                                priority:
                                    task.priority ||
                                    "Normal",

                                dueDate:
                                    task.dueDate ||
                                    "",

                                description:
                                    task.description ||
                                    "",

                                notes:
                                    task.notes ||
                                    "",

                                subtasks:
                                    Array.isArray(
                                        task.subtasks
                                    )
                                        ? task.subtasks
                                        : [],

                                projectId:
                                    task.projectId ||
                                    null,

                                createdAt:
                                    task.createdAt ||
                                    new Date().toISOString(),

                                updatedAt:
                                    new Date().toISOString()
                            })
                        );

                    if (
                        importedProjects.length > 0
                    ) {

                        projects =
                            importedProjects.map(
                                project => ({
                                    id:
                                        project.id ||
                                        crypto.randomUUID(),

                                    name:
                                        project.name ||
                                        "Imported Project",

                                    createdAt:
                                        project.createdAt ||
                                        new Date().toISOString()
                                })
                            );

                    }

                    else {

                        if (!Array.isArray(projects)) {
                            projects = [];
                        }
                    }

                    if (projects.length === 0) {
                        ensureDefaultProject();
                    }

                    if (
                        activeProjectId &&
                        !projects.some(
                            project =>
                                project.id ===
                                activeProjectId
                        )
                    ) {
                        activeProjectId =
                            projects[0]?.id ||
                            null;
                    }

                    saveCurrentUserData();

                    updateUI();

                    alert(
                        "Tasks imported successfully."
                    );

                }

                catch (error) {

                    console.error(
                        "Import error:",
                        error
                    );

                    alert(
                        "Invalid JSON file."
                    );
                }

                finally {

                    importInput.value = "";
                }
            };

            reader.readAsText(file);
        }
    );
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const activeElement =
            document.activeElement;

        const isTyping =
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.tagName === "SELECT"
            );

        /* ---------- N = NEW TASK ---------- */

        if (
            event.key.toLowerCase() === "n" &&
            !isTyping
        ) {

            if (
                currentUser &&
                currentUser.role !== "admin" &&
                taskInput
            ) {

                event.preventDefault();

                taskInput.focus();
            }
        }


        /* ---------- ESCAPE = CLEAR SEARCH ---------- */

        if (event.key === "Escape") {

            if (
                searchInput &&
                searchInput.value
            ) {

                searchInput.value = "";

                searchTerm = "";

                updateUI();
            }
        }
    }
);


/* =========================================================
   START APPLICATION
========================================================= */

function startApplication() {

    currentUser =
        getCurrentUser();

    if (!currentUser) {

        showLoginForm();

        return;
    }

    if (currentUser.role === "admin") {

        tasks = [];
        projects = [];
        activeProjectId = null;

        showAdminDashboard();

        updateAdminDashboard();

        renderAdminBoard();

        return;
    }

    loadCurrentUserData();

    ensureDefaultProject();

    loadActiveProject();

    showUserApp();

    updateUI();
}


/* =========================================================
   INITIAL START
========================================================= */

startApplication();


/* =========================================================
   END OF APP.JS
========================================================= */
