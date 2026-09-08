const KEY = "task-manager-tasks";


export function loadTasks() {

    const storedTasks = localStorage.getItem(KEY);

    if (!storedTasks) {
        return [];
    }

    try {

        const tasks = JSON.parse(storedTasks);

        if (!Array.isArray(tasks)) {
            return [];
        }

        return tasks;

    } catch (error) {

        console.error("Could not load tasks:", error);

        return [];

    }
}


export function saveTasks(tasks) {

    localStorage.setItem(
        KEY,
        JSON.stringify(tasks)
    );

}