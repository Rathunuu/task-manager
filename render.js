export function renderTasks(tasks) {

    const taskList = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");
    const taskCount = document.getElementById("taskCount");

    taskList.innerHTML = "";


    /* TASK COUNT */

    taskCount.textContent = tasks.length;


    /* EMPTY STATE */

    if (tasks.length === 0) {

        emptyState.hidden = false;

        return;

    }

    emptyState.hidden = true;


    /* CREATE TASK CARDS */

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.className = "task-item";

        li.draggable = true;

        li.dataset.id = task.id;

        li.dataset.index = index;


        /* CATEGORY CLASS */

        const categoryClass =
            task.category.toLowerCase();


        li.innerHTML = `

            <div class="drag-handle">
                ⋮⋮
            </div>

            <div class="task-content">

                <strong class="task-title">
                    ${escapeHTML(task.text)}
                </strong>

                <div class="task-meta">

                    <span class="category-badge category-${categoryClass}">
                        ${escapeHTML(task.category)}
                    </span>

                </div>

            </div>

            <button
                class="delete-btn"
                aria-label="Delete ${escapeHTML(task.text)}"
            >
                Delete
            </button>

        `;


        taskList.appendChild(li);

    });

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}