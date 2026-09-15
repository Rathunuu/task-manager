const USERS_KEY = "task-manager-users";
const SESSION_KEY = "task-manager-session";

const TASKS_KEY = "task-manager-tasks";
const PROJECTS_KEY = "task-manager-projects";


/* =========================
   MASTER ACCOUNT
========================= */

const MASTER_EMAIL = "admin@taskmanager.com";
const MASTER_PASSWORD = "admin123";


/* =========================
   USER STORAGE
========================= */

export function loadUsers() {

    const storedUsers =
        localStorage.getItem(USERS_KEY);

    if (!storedUsers) {
        return [];
    }

    try {

        const users =
            JSON.parse(storedUsers);

        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        console.error(
            "Could not load users:",
            error
        );

        return [];

    }
}


export function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


/* =========================
   FIND USER
========================= */

export function findUserByEmail(email) {

    const users = loadUsers();

    return users.find(
        user =>
            user.email ===
            String(email)
                .trim()
                .toLowerCase()
    ) || null;

}


/* =========================
   MASTER LOGIN
========================= */

export function isMasterCredentials(
    email,
    password
) {

    return (
        String(email)
            .trim()
            .toLowerCase() ===
            MASTER_EMAIL
        &&
        password ===
            MASTER_PASSWORD
    );

}


export function getMasterUser() {

    return {

        id: "master-admin",

        name: "Master Admin",

        email: MASTER_EMAIL,

        role: "admin"

    };

}


/* =========================
   SESSION STORAGE
========================= */

export function getCurrentUser() {

    const storedSession =
        localStorage.getItem(
            SESSION_KEY
        );

    if (!storedSession) {
        return null;
    }

    try {

        return JSON.parse(
            storedSession
        );

    } catch (error) {

        console.error(
            "Could not load session:",
            error
        );

        return null;

    }

}


export function setCurrentUser(user) {

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );

}


export function clearCurrentUser() {

    localStorage.removeItem(
        SESSION_KEY
    );

}


/* =========================
   USER ROLE
========================= */

export function isAdmin(user) {

    return Boolean(
        user &&
        user.role === "admin"
    );

}


/* =========================
   USER-SPECIFIC KEYS
========================= */

function getUserTasksKey(userId) {

    return `${TASKS_KEY}-${userId}`;

}


function getUserProjectsKey(userId) {

    return `${PROJECTS_KEY}-${userId}`;

}


/* =========================
   TASK STORAGE
========================= */

export function loadTasks(userId) {

    if (!userId) {
        return [];
    }

    const storedTasks =
        localStorage.getItem(
            getUserTasksKey(userId)
        );

    if (!storedTasks) {
        return [];
    }

    try {

        const tasks =
            JSON.parse(storedTasks);

        return Array.isArray(tasks)
            ? tasks
            : [];

    } catch (error) {

        console.error(
            "Could not load tasks:",
            error
        );

        return [];

    }

}


export function saveTasks(
    userId,
    tasks
) {

    if (!userId) {
        return;
    }

    localStorage.setItem(
        getUserTasksKey(userId),
        JSON.stringify(
            Array.isArray(tasks)
                ? tasks
                : []
        )
    );

}


/* =========================
   PROJECT STORAGE
========================= */

export function loadProjects(userId) {

    if (!userId) {
        return [];
    }

    const storedProjects =
        localStorage.getItem(
            getUserProjectsKey(userId)
        );

    if (!storedProjects) {
        return [];
    }

    try {

        const projects =
            JSON.parse(storedProjects);

        return Array.isArray(projects)
            ? projects
            : [];

    } catch (error) {

        console.error(
            "Could not load projects:",
            error
        );

        return [];

    }

}


export function saveProjects(
    userId,
    projects
) {

    if (!userId) {
        return;
    }

    localStorage.setItem(
        getUserProjectsKey(userId),
        JSON.stringify(
            Array.isArray(projects)
                ? projects
                : []
        )
    );

}


/* =========================
   ADMIN TASK ACCESS
========================= */

/*
   Master can access any user's
   tasks through their user ID.
*/

export function loadUserTasksForAdmin(
    userId
) {

    return loadTasks(userId);

}


export function saveUserTasksForAdmin(
    userId,
    tasks
) {

    saveTasks(
        userId,
        tasks
    );

}


/* =========================
   USER LIST FOR ADMIN
========================= */

export function getAllRegularUsers() {

    return loadUsers().filter(
        user =>
            user.role !== "admin"
    );

}


/* =========================
   CREATE ASSIGNED TASK
========================= */

export function createAssignedTask(
    userId,
    taskData
) {

    if (!userId) {
        return null;
    }

    const tasks =
        loadTasks(userId);

    const newTask = {

        id:
            crypto.randomUUID(),

        text:
            taskData.text || "New Task",

        category:
            taskData.category || "Work",

        status:
            taskData.status || "To Do",

        priority:
            taskData.priority || "Normal",

        dueDate:
            taskData.dueDate || "",

        description:
            taskData.description || "",

        notes:
            "",

        subtasks:
            [],

        assignedBy:
            "master-admin",

        assignedAt:
            new Date().toISOString(),

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

        projectId:
            taskData.projectId || null

    };


    tasks.unshift(
        newTask
    );

    saveTasks(
        userId,
        tasks
    );

    return newTask;

}
/* =========================================================
   ADMIN CHECK
========================================================= */

export function isAdmin(user) {
    return user && user.role === "admin";
}
