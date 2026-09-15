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
/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener("submit", event => {

        event.preventDefault();

        const email =
            loginEmail.value.trim().toLowerCase();

        const password =
            loginPassword.value;

        loginError.textContent = "";


        /* =========================
           MASTER ADMIN LOGIN
        ========================= */

        if (
            email === "admin@taskmanager.com" &&
            password === "admin123"
        ) {

            currentUser = {
                id: "master-admin",
                name: "Master Admin",
                email: "admin@taskmanager.com",
                role: "admin"
            };

            setCurrentUser(currentUser);

            tasks = [];
            projects = [];
            activeProjectId = null;

            loginForm.reset();

            showAdminDashboard();

            updateAdminDashboard();

            return;
        }


        /* =========================
           NORMAL USER LOGIN
        ========================= */

        const user =
            findUserByEmail(email);


        if (!user || user.password !== password) {

            loginError.textContent =
                "Invalid email or password.";

            return;
        }


        currentUser = user;

        setCurrentUser(currentUser);

        tasks = loadTasks();
        projects = loadProjects();

        ensureDefaultProject();

        loginForm.reset();

        showUserApp();

        updateUI();
    });
}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        clearCurrentUser();

        currentUser = null;

        tasks = [];
        projects = [];

        activeProjectId = null;

        showLoginForm();
    });
}


/* =========================================================
   ADMIN DATA
========================================================= */

function getAdminUsers() {

    return getAllRegularUsers();
}


/* =========================================================
   ADMIN USER STATISTICS
========================================================= */

function getAdminUserStats() {

    const users =
        getAdminUsers();

    return users.map(user => {

        const userTasks =
            loadUserTasksForAdmin(user.id);

        const total =
            userTasks.length;

        const completed =
            userTasks.filter(
                task => task.status === "Done"
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
            tasks: userTasks,
            total,
            completed,
            pending,
            progress
        };
    });
}


/* =========================================================
   ADMIN SUMMARY
========================================================= */

function updateAdminSummary() {

    const users =
        getAdminUsers();

    let totalTasks = 0;
    let completedTasks = 0;

    users.forEach(user => {

        const userTasks =
            loadUserTasksForAdmin(user.id);

        totalTasks += userTasks.length;

        completedTasks +=
            userTasks.filter(
                task => task.status === "Done"
            ).length;
    });


    const pendingTasks =
        totalTasks - completedTasks;


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


    renderAdminSummary({

        totalUsers: users.length,

        totalTasks,

        pendingTasks,

        completedTasks
    });
}


/* =========================================================
   ADMIN USERS
========================================================= */

function updateAdminUsers() {

    const users =
        getAdminUsers();

    const stats =
        getAdminUserStats();


    renderAdminUsers(
        users,
        stats
    );
}


/* =========================================================
   ADMIN REPORTS
========================================================= */

function updateAdminReports() {

    const users =
        getAdminUsers();

    const stats =
        getAdminUserStats();


    renderAdminReports(
        users,
        stats
    );
}


/* =========================================================
   ADMIN DASHBOARD UPDATE
========================================================= */

function updateAdminDashboard() {

    if (!currentUser) return;

    if (currentUser.role !== "admin") return;


    updateAdminSummary();

    updateAdminUsers();

    updateAdminReports();

    populateAdminUserSelect();
}


/* =========================================================
   ADMIN USER SELECT
========================================================= */

function populateAdminUserSelect() {

    if (!adminUserSelect) return;


    const users =
        getAdminUsers();


    adminUserSelect.innerHTML =
        `<option value="">Select User</option>`;


    users.forEach(user => {

        const option =
            document.createElement("option");

        option.value =
            user.id;

        option.textContent =
            `${user.name} (${user.email})`;

        adminUserSelect.appendChild(option);
    });
}


/* =========================================================
   ADMIN ASSIGN TASK
========================================================= */

if (adminAssignTaskForm) {

    adminAssignTaskForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const userId =
                adminUserSelect.value;

            const title =
                adminTaskTitle.value.trim();

            const description =
                adminTaskDescription.value.trim();

            const category =
                adminTaskCategory.value;

            const priority =
                adminTaskPriority.value;

            const dueDate =
                adminTaskDueDate.value;

            const projectId =
                adminTaskProject
                    ? adminTaskProject.value
                    : null;


            /* =========================
               VALIDATION
            ========================= */

            if (!userId) {

                adminAssignMessage.textContent =
                    "Please select a user.";

                return;
            }


            if (!title) {

                adminAssignMessage.textContent =
                    "Please enter a task title.";

                return;
            }


            /* =========================
               CREATE TASK
            ========================= */

            const createdTask =
                createAssignedTask(
                    userId,
                    {
                        text: title,

                        description,

                        category,

                        priority,

                        dueDate,

                        projectId
                    }
                );


            if (!createdTask) {

                adminAssignMessage.textContent =
                    "Could not assign task.";

                return;
            }


            /* =========================
               SUCCESS
            ========================= */

            adminAssignMessage.textContent =
                "Task assigned successfully!";


            adminAssignTaskForm.reset();


            updateAdminDashboard();


            setTimeout(() => {

                if (adminAssignMessage) {

                    adminAssignMessage.textContent =
                        "";
                }

            }, 3000);
        }
    );
}


/* =========================================================
   ADMIN USER CHANGE
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
   ADMIN PROJECT OPTIONS
========================================================= */

function updateAdminProjectOptions(userId) {

    if (!adminTaskProject) return;


    adminTaskProject.innerHTML =
        `<option value="">No Project</option>`;


    if (!userId) return;


    const userProjects =
        loadProjectsForUser(userId);


    userProjects.forEach(project => {

        const option =
            document.createElement("option");

        option.value =
            project.id;

        option.textContent =
            project.name;

        adminTaskProject.appendChild(option);
    });
}


/* =========================================================
   ADMIN REFRESH
========================================================= */

if (refreshAdminReportsBtn) {

    refreshAdminReportsBtn.addEventListener(
        "click",
        () => {

            updateAdminDashboard();
        }
    );
}


/* =========================================================
   OPEN USER TASK MANAGER
========================================================= */

if (adminOpenTaskManagerBtn) {

    adminOpenTaskManagerBtn.addEventListener(
        "click",
        () => {

            if (!currentUser) return;


            if (currentUser.role === "admin") {

                alert(
                    "Master Admin cannot open a personal task manager."
                );

                return;
            }


            showUserApp();

            updateUI();
        }
    );
}


/* =========================================================
   ADMIN BOARD
========================================================= */

function renderAdminBoard() {

    const users =
        getAdminUsers();


    const allTasks = [];


    users.forEach(user => {

        const userTasks =
            loadUserTasksForAdmin(user.id);


        userTasks.forEach(task => {

            allTasks.push({

                ...task,

                assignedUser:
                    user.name,

                assignedUserId:
                    user.id
            });
        });
    });


    const todo =
        allTasks.filter(
            task => task.status === "To Do"
        );

    const inProgress =
        allTasks.filter(
            task => task.status === "In Progress"
        );

    const inReview =
        allTasks.filter(
            task => task.status === "In Review"
        );

    const done =
        allTasks.filter(
            task => task.status === "Done"
        );


    if (adminTodoTasks) {

        adminTodoTasks.innerHTML =
            "";

        todo.forEach(task => {

            const card =
                createAdminTaskCard(task);

            adminTodoTasks.appendChild(card);
        });
    }


    if (adminInProgressTasks) {

        adminInProgressTasks.innerHTML =
            "";

        inProgress.forEach(task => {

            const card =
                createAdminTaskCard(task);

            adminInProgressTasks.appendChild(card);
        });
    }


    if (adminInReviewTasks) {

        adminInReviewTasks.innerHTML =
            "";

        inReview.forEach(task => {

            const card =
                createAdminTaskCard(task);

            adminInReviewTasks.appendChild(card);
        });
    }


    if (adminDoneTasks) {

        adminDoneTasks.innerHTML =
            "";

        done.forEach(task => {

            const card =
                createAdminTaskCard(task);

            adminDoneTasks.appendChild(card);
        });
    }
}


/* =========================================================
   ADMIN TASK CARD
========================================================= */

function createAdminTaskCard(task) {

    const card =
        document.createElement("div");

    card.className =
        "admin-task-card";


    card.innerHTML = `

        <div class="admin-task-title">
            ${escapeHtml(task.text)}
        </div>

        <div class="admin-task-user">
            👤 ${escapeHtml(task.assignedUser)}
        </div>

        <div class="admin-task-meta">
            <span>${escapeHtml(task.category || "Work")}</span>
            <span>${escapeHtml(task.priority || "Normal")}</span>
        </div>

    `;


    return card;
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   INITIAL ADMIN CHECK
========================================================= */

if (
    currentUser &&
    currentUser.role === "admin"
) {

    showAdminDashboard();

    updateAdminDashboard();

    renderAdminBoard();
}
/* =========================================================
   USER TASK MANAGER
========================================================= */

function refreshUserData() {

    if (!currentUser) return;

    tasks =
        loadTasksForUser(currentUser.id);

    projects =
        loadProjectsForUser(currentUser.id);

    ensureDefaultProject();
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


    refreshUserData();


    if (typeof renderTasks === "function") {

        renderTasks(
            tasks,
            currentFilter,
            searchTerm,
            currentSort
        );
    }


    if (typeof renderProjects === "function") {

        renderProjects(
            projects,
            activeProjectId
        );
    }


    if (typeof renderBoard === "function") {

        renderBoard(
            tasks,
            currentFilter,
            searchTerm
        );
    }


    updateTaskCount();

    updateProjectProgress();
}


/* =========================================================
   TASK COUNT
========================================================= */

function updateTaskCount() {

    const taskCount =
        document.getElementById("taskCount");

    if (!taskCount) return;

    taskCount.textContent =
        `${tasks.length} Tasks`;
}


/* =========================================================
   PROJECT PROGRESS
========================================================= */

function updateProjectProgress() {

    const projectProgress =
        document.getElementById(
            "projectProgress"
        );

    if (!projectProgress) return;


    if (!activeProjectId) {

        projectProgress.textContent =
            "0 of 0 tasks done";

        return;
    }


    const projectTasks =
        tasks.filter(
            task =>
                task.projectId === activeProjectId
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
   ADD TASK
========================================================= */

if (taskForm) {

    taskForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (!currentUser) return;


            const text =
                taskInput.value.trim();


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


            tasks.unshift(newTask);


            saveTasksForUser(
                currentUser.id,
                tasks
            );


            taskForm.reset();


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

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.category ||
                    button.textContent.trim();


                filterButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                updateUI();
            }
        );
    });
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
   VIEW MODE
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

            boardViewBtn?.classList.remove(
                "active"
            );

            updateUI();
        }
    );
}


if (boardViewBtn) {

    boardViewBtn.addEventListener(
        "click",
        () => {

            currentView =
                "board";

            boardViewBtn.classList.add(
                "active"
            );

            listViewBtn?.classList.remove(
                "active"
            );

            updateUI();
        }
    );
}


/* =========================================================
   TASK STATUS UPDATE
========================================================= */

document.addEventListener(
    "change",
    event => {

        if (
            !event.target.matches(
                "[data-task-status]"
            )
        ) return;


        const taskId =
            event.target.dataset.taskStatus;


        const task =
            tasks.find(
                item => item.id === taskId
            );


        if (!task) return;


        task.status =
            event.target.value;


        task.updatedAt =
            new Date().toISOString();


        saveTasksForUser(
            currentUser.id,
            tasks
        );


        updateUI();
    }
);


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


        tasks.splice(index, 1);


        saveTasksForUser(
            currentUser.id,
            tasks
        );


        updateUI();


        showUndoMessage();
    }
);


/* =========================================================
   UNDO
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

                deletedTask = null;

                deletedTaskIndex = -1;

                undoBtn.style.display =
                    "none";

            },
            5000
        );
}


if (undoBtn) {

    undoBtn.addEventListener(
        "click",
        () => {

            if (
                !deletedTask ||
                !currentUser
            ) return;


            const insertIndex =
                Math.min(
                    deletedTaskIndex,
                    tasks.length
                );


            tasks.splice(
                insertIndex,
                0,
                deletedTask
            );


            saveTasksForUser(
                currentUser.id,
                tasks
            );


            deletedTask = null;

            deletedTaskIndex = -1;


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
   PROJECT SELECT
========================================================= */

document.addEventListener(
    "click",
    event => {

        const project =
            event.target.closest(
                "[data-project-id]"
            );


        if (!project) return;


        const projectId =
            project.dataset.projectId;


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
   NEW PROJECT BUTTON
========================================================= */

if (newProjectBtn) {

    newProjectBtn.addEventListener(
        "click",
        () => {

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


            const name =
                newProjectName.value.trim();


            if (!name) return;


            const project = {

                id:
                    crypto.randomUUID(),

                name,

                createdAt:
                    new Date().toISOString()
            };


            projects.push(project);


            saveProjectsForUser(
                currentUser.id,
                projects
            );


            activeProjectId =
                project.id;


            newProjectForm.reset();


            newProjectDialog?.close();


            updateUI();
        }
    );
}


/* =========================================================
   TASK DETAIL
========================================================= */

document.addEventListener(
    "click",
    event => {

        const taskButton =
            event.target.closest(
                "[data-task-id]"
            );


        if (!taskButton) return;


        if (
            event.target.closest(
                "[data-delete-task]"
            )
        ) return;


        const taskId =
            taskButton.dataset.taskId;


        const task =
            tasks.find(
                item =>
                    item.id === taskId
            );


        if (!task) return;


        openTaskDetail(task);
    }
);


/* =========================================================
   OPEN TASK DETAIL
========================================================= */

function openTaskDetail(task) {

    currentDetailTaskId =
        task.id;


    if (taskDetailDialog) {

        taskDetailDialog.showModal();
    }


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


    renderTaskSubtasks(task);
}


/* =========================================================
   SAVE TASK DETAIL
========================================================= */

if (saveTaskDetailBtn) {

    saveTaskDetailBtn.addEventListener(
        "click",
        () => {

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

                task.text =
                    detailTitle.value.trim();
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


            saveTasksForUser(
                currentUser.id,
                tasks
            );


            taskDetailDialog?.close();


            currentDetailTaskId =
                null;


            updateUI();
        }
    );
}


/* =========================================================
   CLOSE DETAIL
========================================================= */

if (closeDetailBtn) {

    closeDetailBtn.addEventListener(
        "click",
        () => {

            taskDetailDialog?.close();

            currentDetailTaskId =
                null;
        }
    );
}


/* =========================================================
   SUBTASKS
========================================================= */

function renderTaskSubtasks(task) {

    if (!subtaskList) return;


    subtaskList.innerHTML =
        "";


    const subtasks =
        Array.isArray(task.subtasks)
            ? task.subtasks
            : [];


    subtasks.forEach(
        (subtask, index) => {

            const item =
                document.createElement("div");

            item.className =
                "subtask-item";


            item.innerHTML = `

                <input
                    type="checkbox"
                    ${subtask.completed ? "checked" : ""}
                    data-subtask-index="${index}"
                >

                <span>
                    ${escapeHtml(subtask.text)}
                </span>

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


            subtaskInput.value =
                "";


            saveTasksForUser(
                currentUser.id,
                tasks
            );


            renderTaskSubtasks(task);
        }
    );
}


/* =========================================================
   SUBTASK CHECK / DELETE
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


                saveTasksForUser(
                    currentUser.id,
                    tasks
                );


                renderTaskSubtasks(task);

                return;
            }


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


                task.subtasks[index]
                    .completed =
                    checkbox.checked;


                saveTasksForUser(
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


document.addEventListener(
    "dragstart",
    event => {

        const card =
            event.target.closest(
                "[data-task-id]"
            );


        if (!card) return;


        draggedTaskId =
            card.dataset.taskId;


        card.classList.add(
            "dragging"
        );
    }
);


document.addEventListener(
    "dragend",
    event => {

        const card =
            event.target.closest(
                "[data-task-id]"
            );


        if (card) {

            card.classList.remove(
                "dragging"
            );
        }


        draggedTaskId = null;
    }
);


document.addEventListener(
    "dragover",
    event => {

        const container =
            event.target.closest(
                "[data-drop-zone]"
            );


        if (!container) return;


        event.preventDefault();
    }
);


document.addEventListener(
    "drop",
    event => {

        const container =
            event.target.closest(
                "[data-drop-zone]"
            );


        if (!container) return;


        event.preventDefault();


        if (!draggedTaskId) return;


        const draggedTask =
            tasks.find(
                task =>
                    task.id ===
                    draggedTaskId
            );


        if (!draggedTask) return;


        const newStatus =
            container.dataset.dropZone;


        if (newStatus) {

            draggedTask.status =
                newStatus;
        }


        saveTasksForUser(
            currentUser.id,
            tasks
        );


        updateUI();
    }
);


/* =========================================================
   EXPORT JSON
========================================================= */

if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        () => {

            if (!currentUser) return;


            const data =
                JSON.stringify(
                    tasks,
                    null,
                    2
                );


            const blob =
                new Blob(
                    [data],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href =
                url;

            link.download =
                "tasks.json";


            document.body.appendChild(
                link
            );


            link.click();

            link.remove();


            URL.revokeObjectURL(
                url
            );
        }
    );
}


/* =========================================================
   IMPORT JSON
========================================================= */

if (importInput) {

    importInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files?.[0];


            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                () => {

                    try {

                        const imported =
                            JSON.parse(
                                reader.result
                            );


                        if (
                            !Array.isArray(
                                imported
                            )
                        ) {

                            alert(
                                "Invalid tasks.json file."
                            );

                            return;
                        }


                        tasks =
                            imported;


                        saveTasksForUser(
                            currentUser.id,
                            tasks
                        );


                        updateUI();


                        alert(
                            "Tasks imported successfully."
                        );

                    } catch (error) {

                        alert(
                            "Could not import tasks.json."
                        );
                    }
                };


            reader.readAsText(file);


            importInput.value =
                "";
        }
    );
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const tag =
            document.activeElement?.tagName;


        const isTyping =
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT";


        /* N → NEW TASK */

        if (
            event.key.toLowerCase() === "n" &&
            !isTyping
        ) {

            event.preventDefault();

            taskInput?.focus();

            return;
        }


        /* ESCAPE → CLEAR SEARCH */

        if (
            event.key === "Escape"
        ) {

            if (searchInput) {

                searchInput.value =
                    "";

                searchTerm =
                    "";

                updateUI();
            }
        }
    }
);


/* =========================================================
   ACTIVE PROJECT LOAD
========================================================= */

function loadActiveProject() {

    if (!currentUser) return;


    const saved =
        localStorage.getItem(
            `task-manager-active-project-${currentUser.id}`
        );


    if (
        saved &&
        projects.some(
            project =>
                project.id === saved
        )
    ) {

        activeProjectId =
            saved;

        return;
    }


    activeProjectId =
        projects[0]?.id || null;
}


/* =========================================================
   START APPLICATION
========================================================= */

function startApplication() {

    const session =
        getCurrentUser();


    if (!session) {

        showLoginForm();

        return;
    }


    currentUser =
        session;


    if (
        currentUser.role === "admin"
    ) {

        showAdminDashboard();

        updateAdminDashboard();

        renderAdminBoard();

        return;
    }


    refreshUserData();

    loadActiveProject();

    showUserApp();

    updateUI();
}


/* =========================================================
   START
========================================================= */

startApplication();
