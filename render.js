/* =========================
   RENDER TASKS
========================= */

export function renderTasks(tasks) {

    const taskList =
        document.getElementById("taskList");

    const emptyState =
        document.getElementById("emptyState");

    const taskCount =
        document.getElementById("taskCount");


    /* =========================
       CLEAR OLD TASKS
    ========================= */

    taskList.innerHTML = "";


    /* =========================
       TASK COUNT
    ========================= */

    taskCount.textContent =
        tasks.length;


    /* =========================
       EMPTY STATE
    ========================= */

    if (tasks.length === 0) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    /* =========================
       CREATE TASK CARDS
    ========================= */

    tasks.forEach(
        (task, index) => {

            const li =
                document.createElement("li");


            /* =====================
               TASK ITEM
            ===================== */

            li.className =
                "task-item";


            /*
               Make the entire task card
               draggable.
            */

            li.setAttribute(
                "draggable",
                "true"
            );


            /*
               Store task information
               inside data attributes.
            */

            li.dataset.id =
                task.id;

            li.dataset.index =
                index;


            /* =====================
               CATEGORY CLASS
            ===================== */

            const categoryClass =
                task.category
                    .toLowerCase();


            /* =====================
               TASK HTML
            ===================== */

            li.innerHTML = `

                <div
                    class="drag-handle"
                    aria-hidden="true"
                >
                    ⋮⋮
                </div>


                <div class="task-content">

                    <strong class="task-title">
                        ${escapeHTML(task.text)}
                    </strong>


                    <div class="task-meta">

                        <span
                            class="category-badge category-${categoryClass}"
                        >
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


            /* =====================
               ADD TO TASK LIST
            ===================== */

            taskList.appendChild(li);

        }
    );

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}
