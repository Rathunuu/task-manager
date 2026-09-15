const USERS_KEY = "task-manager-users";
const SESSION_KEY = "task-manager-session";

const TASKS_KEY = "task-manager-tasks";
const PROJECTS_KEY = "task-manager-projects";


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

        if (!Array.isArray(users)) {
            return [];
        }

        return users;

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
   SESSION STORAGE
========================= */

export function getCurrentUser() {

    const storedSession =
        localStorage.getItem(SESSION_KEY);

    if (!storedSession) {
        return null;
    }

    try {

        return JSON.parse(storedSession);

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
   USER-SPECIFIC KEY
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

        if (!Array.isArray(tasks)) {
            return [];
        }

        return tasks;

    } catch (error) {

        console.error(
            "Could not load tasks:",
            error
        );

        return [];

    }
}


export function saveTasks(userId, tasks) {

    if (!userId) {
        return;
    }

    localStorage.setItem(
        getUserTasksKey(userId),
        JSON.stringify(tasks)
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

        if (!Array.isArray(projects)) {
            return [];
        }

        return projects;

    } catch (error) {

        console.error(
            "Could not load projects:",
            error
        );

        return [];

    }
}


export function saveProjects(userId, projects) {

    if (!userId) {
        return;
    }

    localStorage.setItem(
        getUserProjectsKey(userId),
        JSON.stringify(projects)
    );

}
