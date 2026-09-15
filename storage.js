const USERS_KEY = "task-manager-users";
const CURRENT_USER_KEY = "task-manager-current-user";


/* =========================
   USER AUTH
========================= */

export function loadUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) return [];
    try {
        const users = JSON.parse(stored);
        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

export function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(username, password) {
    const users = loadUsers();
    const exists = users.find(u => u.username === username);
    if (exists) {
        return { success: false, message: "Username already exists." };
    }
    users.push({ username, password });
    saveUsers(users);
    return { success: true };
}

export function loginUser(username, password) {
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return { success: false, message: "Invalid username or password." };
    }
    localStorage.setItem(CURRENT_USER_KEY, username);
    return { success: true };
}

export function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser() {
    return localStorage.getItem(CURRENT_USER_KEY);
}


/* =========================
   TASK STORAGE (per-user)
========================= */

function tasksKey(username) {
    return `task-manager-tasks-${username}`;
}

function projectsKey(username) {
    return `task-manager-projects-${username}`;
}

export function loadTasks(username) {
    const storedTasks = localStorage.getItem(tasksKey(username));
    if (!storedTasks) return [];
    try {
        const tasks = JSON.parse(storedTasks);
        return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
        console.error("Could not load tasks:", error);
        return [];
    }
}

export function saveTasks(username, tasks) {
    localStorage.setItem(tasksKey(username), JSON.stringify(tasks));
}


/* =========================
   PROJECT STORAGE (per-user)
========================= */

export function loadProjects(username) {
    const storedProjects = localStorage.getItem(projectsKey(username));
    if (!storedProjects) return [];
    try {
        const projects = JSON.parse(storedProjects);
        return Array.isArray(projects) ? projects : [];
    } catch (error) {
        console.error("Could not load projects:", error);
        return [];
    }
}

export function saveProjects(username, projects) {
    localStorage.setItem(projectsKey(username), JSON.stringify(projects));
}
