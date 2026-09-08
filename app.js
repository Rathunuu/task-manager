import {
    loadTasks,
    saveTasks
} from "./storage.js";

import {
    renderTasks
} from "./render.js";


/* =========================
   STATE
========================= */

let tasks = loadTasks();

let activeCategory = "All";

let searchText = "";

let draggedTaskId = null;


/* =========================
   DOM ELEMENTS
========================= */

const taskInput =
    document.getElementById("taskInput");

const categorySelect =
    document.getElementById("categorySelect");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const filterButtons =
    document.querySelectorAll(
        "#categoryFilters button"
    );

const taskList =
    document.getElementById("taskList");

const exportBtn =
    document.getElementById("exportBtn");

const importInput =
    document.getElementById("importInput");

const undoToast =
    document.getElementById("undoToast");

const undoBtn =
    document.getElementById("undoBtn");


/* =========================
   INITIAL UI
========================= */

updateUI();


/* =========================
   ADD TASK
========================= */

function addTask(text, category) {

    const newTask = {
        id: crypto.randomUUID(),
        text: text,
        category: category,
        done: false,
        createdAt: Date.now()
    };


    tasks.push(newTask);

    saveTasks(tasks);

    updateUI();

    taskInput.value = "";

    taskInput.focus();
}


/* =========================
   ADD TASK BUTTON
========================= */

addTaskBtn.addEventListener(
    "click",
    () => {

        const text =
            taskInput.value.trim();

        const category =
            categorySelect.value;


        if (text === "") {

            taskInput.focus();

            return;
        }


        addTask(
            text,
            category
        );

    }
);


/* =========================
   ENTER KEY
========================= */

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            addTaskBtn.click();

        }

    }
);


/* =========================
   DELETE TASK
========================= */

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.classList.contains(
                "delete-btn"
            )
        ) {
            return;
        }


        const taskItem =
            event.target.closest(".task-item");


        if (!taskItem) {
            return;
        }


        deleteTask(
            taskItem.dataset.id
        );

    }
);


/* =========================
   DELETE TASK
========================= */

function deleteTask(taskId) {

    const originalIndex =
        tasks.findIndex(
            task => task.id === taskId
        );


    if (originalIndex === -1) {
        return;
    }


    const removedTask =
        tasks[originalIndex];


    tasks =
        tasks.filter(
            task => task.id !== taskId
        );


    saveTasks(tasks);

    updateUI();


    showUndoToast(
        removedTask,
        originalIndex
    );

}


/* =========================
   UNDO CLOSURE
========================= */

function showUndoToast(
    removedTask,
    originalIndex
) {

    let undoUsed = false;

    undoToast.hidden = false;


    const timeoutId =
        setTimeout(
            () => {

                undoToast.hidden = true;

            },
            5000
        );


    function undoDelete() {

        if (undoUsed) {
            return;
        }


        undoUsed = true;

        clearTimeout(timeoutId);


        tasks.splice(
            originalIndex,
            0,
            removedTask
        );


        saveTasks(tasks);

        updateUI();

        undoToast.hidden = true;

    }


    undoBtn.onclick =
        undoDelete;

}


/* =========================
   CATEGORY FILTER
========================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                activeCategory =
                    button.dataset.category;


                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
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


/* =========================
   LIVE SEARCH
========================= */

searchInput.addEventListener(
    "input",
    () => {

        searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        updateUI();

    }
);


/* =========================
   SORT
========================= */

sortSelect.addEventListener(
    "change",
    () => {

        updateUI();

    }
);


/* =========================
   GET VISIBLE TASKS
========================= */

function getVisibleTasks() {

    let visibleTasks =
        [...tasks];


    /* CATEGORY */

    if (
        activeCategory !== "All"
    ) {

        visibleTasks =
            visibleTasks.filter(
                task =>
                    task.category ===
                    activeCategory
            );

    }


    /* SEARCH */

    if (
        searchText !== ""
    ) {

        visibleTasks =
            visibleTasks.filter(
                task =>
                    task.text
                        .toLowerCase()
                        .includes(searchText)
            );

    }


    /*
       A-Z sorting only.

       Newest keeps the actual
       array order so drag order
       is preserved.
    */

    if (
        sortSelect.value === "az"
    ) {

        visibleTasks.sort(
            (a, b) =>
                a.text.localeCompare(
                    b.text
                )
        );

    }


    return visibleTasks;

}


/* =========================
   UPDATE UI
========================= */

function updateUI() {

    const visibleTasks =
        getVisibleTasks();


    renderTasks(
        visibleTasks
    );


    setupDragAndDrop();

}


/* =========================
   DRAG & DROP
========================= */

function setupDragAndDrop() {

    const taskItems =
        document.querySelectorAll(
            ".task-item"
        );


    taskItems.forEach(
        item => {

            /* DRAG START */

            item.addEventListener(
                "dragstart",
                event => {

                    draggedTaskId =
                        item.dataset.id;


                    item.classList.add(
                        "dragging"
                    );


                    event.dataTransfer.effectAllowed =
                        "move";


                    event.dataTransfer.setData(
                        "text/plain",
                        draggedTaskId
                    );

                }
            );


            /* DRAG END */

            item.addEventListener(
                "dragend",
                () => {

                    item.classList.remove(
                        "dragging"
                    );

                    draggedTaskId = null;

                }
            );

        }
    );


    /*
       IMPORTANT:

       Dragover is handled by the
       whole task list instead of
       individual cards.

       This makes both:

       TOP → BOTTOM
       BOTTOM → TOP

       work correctly.
    */

    taskList.addEventListener(
        "dragover",
        handleDragOver
    );


    taskList.addEventListener(
        "drop",
        handleDrop
    );

}


/* =========================
   DRAG OVER
========================= */

function handleDragOver(event) {

    event.preventDefault();


    const draggingItem =
        document.querySelector(
            ".task-item.dragging"
        );


    if (!draggingItem) {
        return;
    }


    const taskItems =
        [
            ...taskList.querySelectorAll(
                ".task-item:not(.dragging)"
            )
        ];


    let closestItem = null;

    let closestOffset =
        Number.NEGATIVE_INFINITY;


    for (const item of taskItems) {

        const box =
            item.getBoundingClientRect();


        const offset =
            event.clientY -
            box.top -
            (box.height / 2);


        if (
            offset < 0 &&
            offset > closestOffset
        ) {

            closestOffset = offset;

            closestItem = item;

        }

    }


    if (closestItem) {

        taskList.insertBefore(
            draggingItem,
            closestItem
        );

    } else {

        taskList.appendChild(
            draggingItem
        );

    }

}


/* =========================
   DROP
========================= */

function handleDrop(event) {

    event.preventDefault();


    const draggedItem =
        document.querySelector(
            ".task-item.dragging"
        );


    if (!draggedItem) {
        return;
    }


    /*
       Read the final visual order
       from the DOM.
    */

    const orderedIds =
        [
            ...taskList.querySelectorAll(
                ".task-item"
            )
        ].map(
            item => item.dataset.id
        );


    /*
       Rebuild the original tasks
       array using the new order.
    */

    const taskMap =
        new Map(
            tasks.map(
                task => [
                    task.id,
                    task
                ]
            )
        );


    const reorderedTasks = [];


    orderedIds.forEach(
        id => {

            const task =
                taskMap.get(id);


            if (task) {

                reorderedTasks.push(
                    task
                );

            }

        }
    );


    /*
       Add any tasks that are not
       currently visible.

       This is important when
       search/filter is active.
    */

    tasks.forEach(
        task => {

            if (
                !orderedIds.includes(
                    task.id
                )
            ) {

                reorderedTasks.push(
                    task
                );

            }

        }
    );


    tasks =
        reorderedTasks;


    /*
       Save the new order.
    */

    saveTasks(tasks);


    draggedItem.classList.remove(
        "dragging"
    );


    draggedTaskId = null;


    /*
       Render again.
    */

    updateUI();

}


/* =========================
   EXPORT JSON
========================= */

exportBtn.addEventListener(
    "click",
    () => {

        const json =
            JSON.stringify(
                tasks,
                null,
                2
            );


        const blob =
            new Blob(
                [json],
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


/* =========================
   IMPORT JSON
========================= */

importInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                try {

                    const importedTasks =
                        JSON.parse(
                            event.target.result
                        );


                    if (
                        !Array.isArray(
                            importedTasks
                        )
                    ) {

                        throw new Error(
                            "Invalid task data"
                        );

                    }


                    const validTasks =
                        importedTasks.filter(
                            task =>
                                task &&
                                typeof task.text ===
                                    "string" &&
                                typeof task.category ===
                                    "string"
                        );


                    tasks =
                        validTasks.map(
                            task => ({

                                id:
                                    task.id ||
                                    crypto.randomUUID(),

                                text:
                                    task.text,

                                category:
                                    task.category,

                                done:
                                    Boolean(
                                        task.done
                                    ),

                                createdAt:
                                    task.createdAt ||
                                    Date.now()

                            })
                        );


                    saveTasks(tasks);

                    updateUI();


                    importInput.value = "";


                } catch (error) {

                    alert(
                        "Invalid JSON file. Please import a valid tasks.json file."
                    );

                }

            };


        reader.readAsText(file);

    }
);


/* =========================
   KEYBOARD SHORTCUTS
========================= */

document.addEventListener(
    "keydown",
    event => {

        const activeElement =
            document.activeElement;


        const isTyping =
            activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.tagName === "SELECT";


        /* N → NEW TASK */

        if (
            event.key.toLowerCase() === "n" &&
            !isTyping
        ) {

            event.preventDefault();

            taskInput.focus();

        }


        /* ESCAPE → CLEAR SEARCH */

        if (
            event.key === "Escape"
        ) {

            searchInput.value = "";

            searchText = "";

            updateUI();

        }

    }
);
