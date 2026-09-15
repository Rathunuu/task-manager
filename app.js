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
/* =====================================================
   ADMIN DASHBOARD
===================================================== */

function getAdminData() {

    const users =
        getAllRegularUsers();


    const userStats = [];


    let totalTasks = 0;
    let pendingTasks = 0;
    let completedTasks = 0;

    let todo = 0;
    let inProgress = 0;
    let inReview = 0;


    users.forEach(user => {

        const userTasks =
            loadUserTasksForAdmin(
                user.id
            );


        const userTodo =
            userTasks.filter(
                task =>
                    (task.status || "To Do") ===
                    "To Do"
            ).length;


        const userInProgress =
            userTasks.filter(
                task =>
                    task.status ===
                    "In Progress"
            ).length;


        const userInReview =
            userTasks.filter(
                task =>
                    task.status ===
                    "In Review"
            ).length;


        const userCompleted =
            userTasks.filter(
                task =>
                    task.status ===
                    "Done"
            ).length;


        const userTotal =
            userTasks.length;


        const userActive =
            userTotal -
            userCompleted;


        totalTasks +=
            userTotal;

        completedTasks +=
            userCompleted;

        pendingTasks +=
            userActive;

        todo +=
            userTodo;

        inProgress +=
            userInProgress;

        inReview +=
            userInReview;


        userStats.push({

            userId:
                user.id,

            total:
                userTotal,

            active:
                userActive,

            completed:
                userCompleted,

            todo:
                userTodo,

            inProgress:
                userInProgress,

            inReview:
                userInReview

        });

    });


    return {

        users,

        userStats,

        summary: {

            totalUsers:
                users.length,

            totalTasks:
                totalTasks,

            pendingTasks:
                pendingTasks,

            completedTasks:
                completedTasks,

            todo:
                todo,

            inProgress:
                inProgress,

            inReview:
                inReview

        }

    };

}


/* =====================================================
   UPDATE ADMIN DASHBOARD
===================================================== */

function updateAdminDashboard() {

    if (
        !currentUser ||
        !isAdmin(currentUser)
    ) {

        return;

    }


    const data =
        getAdminData();


    /* =========================
       SUMMARY
    ========================= */

    renderAdminSummary(
        data.summary
    );


    /* =========================
       USERS
    ========================= */

    renderAdminUsers(
        data.users,
        data.userStats
    );


    /* =========================
       REPORTS
    ========================= */

    renderAdminReports(
        data.users,
        data.userStats
    );


    /* =========================
       USER DROPDOWN
    ========================= */

    if (adminUserSelect) {

        const currentValue =
            adminUserSelect.value;


        adminUserSelect.innerHTML = `
            <option value="">
                Select User
            </option>
        `;


        data.users.forEach(user => {

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

        });


        if (
            data.users.some(
                user =>
                    user.id ===
                    currentValue
            )
        ) {

            adminUserSelect.value =
                currentValue;

        }

    }

}


/* =====================================================
   REFRESH ADMIN REPORTS
===================================================== */

if (refreshAdminReportsBtn) {

    refreshAdminReportsBtn.addEventListener(
        "click",
        () => {

            updateAdminDashboard();

        }
    );

}
/* =====================================================
   ADMIN - ASSIGN TASK TO USER
===================================================== */

if (adminAssignTaskForm) {

    adminAssignTaskForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /* =========================
               ADMIN CHECK
            ========================= */

            if (
                !currentUser ||
                !isAdmin(currentUser)
            ) {

                return;

            }


            /* =========================
               GET FORM VALUES
            ========================= */

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


            /* =========================
               VALIDATION
            ========================= */

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


            /* =========================
               CREATE TASK
            ========================= */

            const newTask =
                createAssignedTask(
                    userId,
                    {
                        text:
                            title,

                        description:
                            description,

                        category:
                            category,

                        priority:
                            priority,

                        dueDate:
                            dueDate,

                        projectId:
                            projectId || null

                    }
                );


            if (!newTask) {

                if (adminAssignMessage) {

                    adminAssignMessage.textContent =
                        "Could not assign task.";

                }

                return;

            }


            /* =========================
               SUCCESS MESSAGE
            ========================= */

            if (adminAssignMessage) {

                adminAssignMessage.textContent =
                    "Task assigned successfully.";

            }


            /* =========================
               RESET FORM
            ========================= */

            adminAssignTaskForm.reset();


            /* =========================
               REFRESH DASHBOARD
            ========================= */

            updateAdminDashboard();

        }
    );

}
/* =====================================================
   ADMIN - OPEN TASK MANAGER
===================================================== */

if (adminOpenTaskManagerBtn) {

    adminOpenTaskManagerBtn.addEventListener(
        "click",
        () => {

            if (
                !currentUser ||
                !isAdmin(currentUser)
            ) {
                return;
            }


            if (adminDashboard) {
                adminDashboard.hidden = true;
            }


            if (userTaskManager) {
                userTaskManager.hidden = false;
            }

        }
    );

}
/* =====================================================
   TASK MANAGER ELEMENTS
===================================================== */

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const categorySelect =
    document.getElementById("categorySelect");

const searchInput =
    document.getElementById("searchInput");

const clearSearchBtn =
    document.getElementById("clearSearchBtn");

const sortSelect =
    document.getElementById("sortSelect");

const listViewBtn =
    document.getElementById("listViewBtn");

const boardViewBtn =
    document.getElementById("boardViewBtn");

const taskList =
    document.getElementById("taskList");

const board =
    document.getElementById("board");

const projectSelect =
    document.getElementById("projectSelect");

const newProjectBtn =
    document.getElementById("newProjectBtn");

const projectNameInput =
    document.getElementById("projectNameInput");

const projectForm =
    document.getElementById("projectForm");

const projectModal =
    document.getElementById("projectModal");

const closeProjectModalBtn =
    document.getElementById("closeProjectModalBtn");


/* =====================================================
   TASK DETAIL ELEMENTS
===================================================== */

const taskDetailModal =
    document.getElementById("taskDetailModal");

const taskDetailTitle =
    document.getElementById("taskDetailTitle");

const taskDetailDescription =
    document.getElementById("taskDetailDescription");

const taskDetailCategory =
    document.getElementById("taskDetailCategory");

const taskDetailPriority =
    document.getElementById("taskDetailPriority");

const taskDetailStatus =
    document.getElementById("taskDetailStatus");

const taskDetailDueDate =
    document.getElementById("taskDetailDueDate");

const taskDetailNotes =
    document.getElementById("taskDetailNotes");

const taskDetailSubtasks =
    document.getElementById("taskDetailSubtasks");

const closeTaskDetailBtn =
    document.getElementById("closeTaskDetailBtn");


/* =====================================================
   UNDO TOAST
===================================================== */

const undoToast =
    document.getElementById("undoToast");

const undoDeleteBtn =
    document.getElementById("undoDeleteBtn");
/* =====================================================
   TASK FILTERING
===================================================== */

function getFilteredTasks() {

    let filteredTasks = [...tasks];

    /* PROJECT FILTER */
    if (activeProjectId) {
        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.projectId === activeProjectId
            );
    }

    /* CATEGORY FILTER */
    if (activeCategory !== "All") {
        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.category === activeCategory
            );
    }

    /* SEARCH */
    if (searchText.trim()) {

        const search =
            searchText
                .trim()
                .toLowerCase();

        filteredTasks =
            filteredTasks.filter(task => {

                const title =
                    String(task.text || "")
                        .toLowerCase();

                const description =
                    String(task.description || "")
                        .toLowerCase();

                const notes =
                    String(task.notes || "")
                        .toLowerCase();

                return (
                    title.includes(search) ||
                    description.includes(search) ||
                    notes.includes(search)
                );

            });
    }

    /* SORT */
    if (sortSelect) {

        const sortValue =
            sortSelect.value;

        if (sortValue === "newest") {

            filteredTasks.sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            );

        }

        if (sortValue === "oldest") {

            filteredTasks.sort(
                (a, b) =>
                    new Date(a.createdAt || 0) -
                    new Date(b.createdAt || 0)
            );

        }

        if (sortValue === "priority") {

            const priorityOrder = {
                "Urgent": 1,
                "High": 2,
                "Normal": 3,
                "Low": 4
            };

            filteredTasks.sort(
                (a, b) =>
                    (priorityOrder[a.priority] || 5) -
                    (priorityOrder[b.priority] || 5)
            );

        }

    }

    return filteredTasks;
}


/* =====================================================
   UPDATE TASK DISPLAY
===================================================== */

function updateTaskDisplay() {

    const filteredTasks =
        getFilteredTasks();

    if (currentView === "board") {

        renderBoard(filteredTasks);

    } else {

        renderTasks(filteredTasks);

    }

    if (activeProjectId) {

        const activeProject =
            projects.find(
                project =>
                    project.id === activeProjectId
            );

        const projectTasks =
            tasks.filter(
                task =>
                    task.projectId === activeProjectId
            );

        if (activeProject) {
            renderProgress(
                activeProject,
                projectTasks
            );
        }

    }

}
/* =====================================================
   SEARCH
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            searchText =
                searchInput.value;

            updateTaskDisplay();

        }
    );

}


/* =====================================================
   CLEAR SEARCH
===================================================== */

if (clearSearchBtn) {

    clearSearchBtn.addEventListener(
        "click",
        () => {

            if (searchInput) {
                searchInput.value = "";
            }

            searchText = "";

            updateTaskDisplay();

        }
    );

}


/* =====================================================
   SORT
===================================================== */

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        () => {

            updateTaskDisplay();

        }
    );

}


/* =====================================================
   LIST VIEW
===================================================== */

if (listViewBtn) {

    listViewBtn.addEventListener(
        "click",
        () => {

            currentView = "list";

            listViewBtn.classList.add("active");

            if (boardViewBtn) {
                boardViewBtn.classList.remove("active");
            }

            if (taskList) {
                taskList.hidden = false;
            }

            if (board) {
                board.hidden = true;
            }

            updateTaskDisplay();

        }
    );

}


/* =====================================================
   BOARD VIEW
===================================================== */

if (boardViewBtn) {

    boardViewBtn.addEventListener(
        "click",
        () => {

            currentView = "board";

            boardViewBtn.classList.add("active");

            if (listViewBtn) {
                listViewBtn.classList.remove("active");
            }

            if (taskList) {
                taskList.hidden = true;
            }

            if (board) {
                board.hidden = false;
            }

            updateTaskDisplay();

        }
    );

}
/* =====================================================
   CATEGORY FILTER BUTTONS
===================================================== */

const categoryButtons =
    document.querySelectorAll(
        "[data-category]"
    );

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categoryButtons.forEach(
                btn =>
                    btn.classList.remove("active")
            );

            button.classList.add("active");

            activeCategory =
                button.dataset.category;

            updateTaskDisplay();

        }
    );

});
/* =====================================================
   ADD NEW TASK
===================================================== */

if (taskForm) {

    taskForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            if (
                !currentUser ||
                isAdmin(currentUser)
            ) {
                return;
            }

            const title =
                taskInput
                    ? taskInput.value.trim()
                    : "";

            const category =
                categorySelect
                    ? categorySelect.value
                    : "Work";

            if (!title) {
                return;
            }

            const newTask = {

                id: crypto.randomUUID(),

                text: title,

                category: category,

                status: "To Do",

                priority: "Normal",

                dueDate: "",

                description: "",

                notes: "",

                subtasks: [],

                projectId:
                    activeProjectId,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };

            tasks.unshift(newTask);

            saveTasks(tasks);

            if (taskInput) {
                taskInput.value = "";
            }

            updateTaskDisplay();

        }
    );

}
/* =====================================================
   PROJECT SELECTION
===================================================== */

if (projectSelect) {

    projectSelect.addEventListener(
        "change",
        () => {

            activeProjectId =
                projectSelect.value || null;

            updateTaskDisplay();

        }
    );

}


/* =====================================================
   PROJECT MODAL
===================================================== */

if (newProjectBtn) {

    newProjectBtn.addEventListener(
        "click",
        () => {

            if (projectModal) {
                projectModal.hidden = false;
            }

            if (projectNameInput) {
                projectNameInput.value = "";
                projectNameInput.focus();
            }

        }
    );

}


/* =====================================================
   CLOSE PROJECT MODAL
===================================================== */

if (closeProjectModalBtn) {

    closeProjectModalBtn.addEventListener(
        "click",
        () => {

            if (projectModal) {
                projectModal.hidden = true;
            }

        }
    );

}
/* =====================================================
   CREATE NEW PROJECT
===================================================== */

if (projectForm) {

    projectForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            if (
                !currentUser ||
                isAdmin(currentUser)
            ) {
                return;
            }

            const name =
                projectNameInput
                    ? projectNameInput.value.trim()
                    : "";

            if (!name) {
                return;
            }

            const newProject = {

                id: crypto.randomUUID(),

                name: name

            };

            projects.push(newProject);

            saveProjects(projects);

            activeProjectId =
                newProject.id;

            if (projectModal) {
                projectModal.hidden = true;
            }

            if (projectNameInput) {
                projectNameInput.value = "";
            }

            renderProjects(
                projects,
                activeProjectId
            );

            updateTaskDisplay();

        }
    );

}
/* =====================================================
   INITIAL UI UPDATE
===================================================== */

function updateUI() {

    if (!currentUser) {
        showAuth();
        return;
    }

    if (isAdmin(currentUser)) {
        showAdminDashboard();
        updateAdminDashboard();
        return;
    }

    showUserApp();

    tasks = loadTasks();
    projects = loadProjects();

    ensureDefaultProject();

    renderProjects(
        projects,
        activeProjectId
    );

    updateTaskDisplay();

}


/* =====================================================
   START APPLICATION
===================================================== */

if (currentUser) {
    updateUI();
} else {
    showAuth();
}
/* =====================================================
   UPDATE TASK STATUS
===================================================== */

function updateTaskStatus(taskId, newStatus) {

    const task =
        tasks.find(
            item => item.id === taskId
        );

    if (!task) {
        return;
    }

    task.status =
        newStatus;

    task.updatedAt =
        new Date().toISOString();

    saveTasks(tasks);

    updateTaskDisplay();

    if (
        currentUser &&
        isAdmin(currentUser)
    ) {
        updateAdminDashboard();
    }

}


/* =====================================================
   TASK STATUS EVENT
===================================================== */

document.addEventListener(
    "change",
    event => {

        const statusSelect =
            event.target.closest(
                "[data-task-status]"
            );

        if (!statusSelect) {
            return;
        }

        const taskId =
            statusSelect.dataset.taskStatus;

        const newStatus =
            statusSelect.value;

        updateTaskStatus(
            taskId,
            newStatus
        );

    }
);
/* =====================================================
   DELETE TASK
===================================================== */

let deletedTask = null;
let deleteTimer = null;

function deleteTask(taskId) {

    const taskIndex =
        tasks.findIndex(
            task => task.id === taskId
        );

    if (taskIndex === -1) {
        return;
    }

    deletedTask = {
        task: tasks[taskIndex],
        index: taskIndex
    };

    tasks.splice(
        taskIndex,
        1
    );

    saveTasks(tasks);

    updateTaskDisplay();

    /* SHOW UNDO */

    if (undoToast) {
        undoToast.hidden = false;
    }

    clearTimeout(deleteTimer);

    deleteTimer =
        setTimeout(
            () => {

                deletedTask = null;

                if (undoToast) {
                    undoToast.hidden = true;
                }

            },
            5000
        );

}


/* =====================================================
   DELETE BUTTON EVENT
===================================================== */

document.addEventListener(
    "click",
    event => {

        const deleteButton =
            event.target.closest(
                "[data-delete-task]"
            );

        if (!deleteButton) {
            return;
        }

        const taskId =
            deleteButton.dataset.deleteTask;

        deleteTask(taskId);

    }
);


/* =====================================================
   UNDO DELETE
===================================================== */

if (undoDeleteBtn) {

    undoDeleteBtn.addEventListener(
        "click",
        () => {

            if (!deletedTask) {
                return;
            }

            tasks.splice(
                deletedTask.index,
                0,
                deletedTask.task
            );

            saveTasks(tasks);

            deletedTask = null;

            clearTimeout(deleteTimer);

            if (undoToast) {
                undoToast.hidden = true;
            }

            updateTaskDisplay();

        }
    );

}
/* =====================================================
   OPEN TASK DETAIL
===================================================== */

function openTaskDetail(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );

    if (!task) {
        return;
    }

    activeDetailTaskId =
        taskId;

    if (taskDetailModal) {
        taskDetailModal.hidden = false;
    }

    if (taskDetailTitle) {
        taskDetailTitle.value =
            task.text || "";
    }

    if (taskDetailDescription) {
        taskDetailDescription.value =
            task.description || "";
    }

    if (taskDetailCategory) {
        taskDetailCategory.value =
            task.category || "Work";
    }

    if (taskDetailPriority) {
        taskDetailPriority.value =
            task.priority || "Normal";
    }

    if (taskDetailStatus) {
        taskDetailStatus.value =
            task.status || "To Do";
    }

    if (taskDetailDueDate) {
        taskDetailDueDate.value =
            task.dueDate || "";
    }

    if (taskDetailNotes) {
        taskDetailNotes.value =
            task.notes || "";
    }

    if (taskDetailSubtasks) {
        renderSubtasks(
            task.subtasks || []
        );
    }

}


/* =====================================================
   TASK DETAIL BUTTON EVENT
===================================================== */

document.addEventListener(
    "click",
    event => {

        const detailButton =
            event.target.closest(
                "[data-task-detail]"
            );

        if (!detailButton) {
            return;
        }

        const taskId =
            detailButton.dataset.taskDetail;

        openTaskDetail(taskId);

    }
);


/* =====================================================
   CLOSE TASK DETAIL
===================================================== */

if (closeTaskDetailBtn) {

    closeTaskDetailBtn.addEventListener(
        "click",
        () => {

            if (taskDetailModal) {
                taskDetailModal.hidden = true;
            }

            activeDetailTaskId =
                null;

        }
    );

}
