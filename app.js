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
