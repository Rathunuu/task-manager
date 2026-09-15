/* =========================
   RENDER TASKS - LIST VIEW
========================= */

export function renderTasks(tasks = []) {

    const taskList =
        document.getElementById("taskList");

    const emptyState =
        document.getElementById("emptyState");

    const taskCount =
        document.getElementById("taskCount");

    if (!taskList) {
        return;
    }

    taskList.innerHTML = "";

    if (taskCount) {
        taskCount.textContent = tasks.length;
    }

    if (tasks.length === 0) {

        if (emptyState) {
            emptyState.hidden = false;
        }

        return;
    }

    if (emptyState) {
        emptyState.hidden = true;
    }


    tasks.forEach((task, index) => {

        const li =
            document.createElement("li");

        li.className = "task-item";

        li.setAttribute(
            "draggable",
            "true"
        );

        li.dataset.id = task.id;
        li.dataset.taskId = task.id;
        li.dataset.index = index;


        const category =
            task.category || "Work";

        const categoryClass =
            String(category).toLowerCase();

        const status =
            task.status || "To Do";


        li.innerHTML = `

            <div
                class="drag-handle"
                aria-hidden="true"
            >
                ⋮⋮
            </div>

            <div class="task-content">

                <strong class="task-title">
                    ${escapeHTML(task.text || "")}
                </strong>

                <div class="task-meta">

                    <span
                        class="category-badge category-${escapeHTML(
                            categoryClass
                        )}"
                    >
                        ${escapeHTML(category)}
                    </span>

                    <span class="status-badge">
                        ${escapeHTML(status)}
                    </span>

                </div>

            </div>

            <button
                type="button"
                class="delete-btn"
                aria-label="Delete ${escapeHTML(
                    task.text || ""
                )}"
            >
                Delete
            </button>

        `;


        taskList.appendChild(li);

    });

}


/* =========================
   RENDER PROJECTS
========================= */

export function renderProjects(
    projects = [],
    activeProjectId
) {

    const projectSwitcher =
        document.getElementById(
            "projectSwitcher"
        );

    if (!projectSwitcher) {
        return;
    }


    projectSwitcher.innerHTML = "";


    projects.forEach(project => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "project-item";

        button.dataset.projectId =
            project.id;


        if (
            project.id ===
            activeProjectId
        ) {

            button.classList.add(
                "active"
            );

        }


        button.textContent =
            project.name;


        projectSwitcher.appendChild(
            button
        );

    });


    /* =========================
       NEW PROJECT BUTTON
    ========================= */

    let newProjectBtn =
        document.getElementById(
            "newProjectBtn"
        );


    /*
       Current HTML does not contain
       this button initially.

       Create it automatically if needed.
    */

    if (!newProjectBtn) {

        newProjectBtn =
            document.createElement(
                "button"
            );

        newProjectBtn.type =
            "button";

        newProjectBtn.id =
            "newProjectBtn";

        newProjectBtn.className =
            "project-item new-project-btn";

        newProjectBtn.textContent =
            "+ New Project";

    }


    if (
        newProjectBtn.parentElement !==
        projectSwitcher
    ) {

        projectSwitcher.appendChild(
            newProjectBtn
        );

    }

}


/* =========================
   RENDER KANBAN BOARD
========================= */

export function renderBoard(
    tasks = []
) {

    const columns = {

        "To Do":
            document.getElementById(
                "todoTasks"
            ),

        "In Progress":
            document.getElementById(
                "inProgressTasks"
            ),

        "In Review":
            document.getElementById(
                "inReviewTasks"
            ),

        "Done":
            document.getElementById(
                "doneTasks"
            )

    };


    const counts = {

        "To Do":
            document.getElementById(
                "todoCount"
            ),

        "In Progress":
            document.getElementById(
                "inProgressCount"
            ),

        "In Review":
            document.getElementById(
                "inReviewCount"
            ),

        "Done":
            document.getElementById(
                "doneCount"
            )

    };


    Object.values(columns).forEach(
        column => {

            if (column) {
                column.innerHTML = "";
            }

        }
    );


    Object.values(counts).forEach(
        count => {

            if (count) {
                count.textContent = "0";
            }

        }
    );


    tasks.forEach(task => {

        const status =
            task.status || "To Do";

        const column =
            columns[status];

        if (!column) {
            return;
        }


        const card =
            document.createElement("div");

        card.className =
            "kanban-task";

        card.setAttribute(
            "draggable",
            "true"
        );

        card.dataset.taskId =
            task.id;

        card.dataset.id =
            task.id;


        const category =
            task.category || "Work";

        const categoryClass =
            String(category).toLowerCase();


        card.innerHTML = `

            <div class="kanban-task-content">

                <strong class="task-title">
                    ${escapeHTML(
                        task.text || ""
                    )}
                </strong>

                <div class="task-meta">

                    <span
                        class="category-badge category-${escapeHTML(
                            categoryClass
                        )}"
                    >
                        ${escapeHTML(category)}
                    </span>

                </div>

            </div>

        `;


        column.appendChild(card);

    });


    Object.keys(columns).forEach(
        status => {

            const column =
                columns[status];

            const count =
                counts[status];


            if (
                column &&
                count
            ) {

                count.textContent =
                    column.children.length;

            }

        }
    );

}


/* =========================
   RENDER TASK DETAIL
========================= */

export function renderTaskDetail(task) {

    if (!task) {
        return;
    }


    const title =
        document.getElementById(
            "detailTaskTitle"
        );

    const description =
        document.getElementById(
            "detailDescription"
        );

    const status =
        document.getElementById(
            "detailStatus"
        );

    const priority =
        document.getElementById(
            "detailPriority"
        );

    const dueDate =
        document.getElementById(
            "detailDueDate"
        );

    const category =
        document.getElementById(
            "detailCategory"
        );

    const notes =
        document.getElementById(
            "taskNotes"
        );


    if (title) {

        title.textContent =
            task.text || "";

    }


    if (description) {

        if (
            "value" in description
        ) {

            description.value =
                task.description || "";

        } else {

            description.textContent =
                task.description ||
                "No description";

        }

    }


    if (status) {

        status.value =
            task.status || "To Do";

    }


    if (priority) {

        priority.value =
            task.priority || "Normal";

    }


    if (dueDate) {

        dueDate.value =
            task.dueDate || "";

    }


    if (category) {

        if (
            "value" in category
        ) {

            category.value =
                task.category || "Work";

        } else {

            category.textContent =
                task.category || "Work";

        }

    }


    if (notes) {

        notes.value =
            task.notes || "";

    }

}


/* =========================
   RENDER SUBTASKS
========================= */

export function renderSubtasks(
    subtasks = []
) {

    const subtaskList =
        document.getElementById(
            "subtaskList"
        );

    if (!subtaskList) {
        return;
    }


    subtaskList.innerHTML = "";


    if (
        !Array.isArray(subtasks) ||
        subtasks.length === 0
    ) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "subtask-empty";

        emptyMessage.textContent =
            "No subtasks yet.";


        subtaskList.appendChild(
            emptyMessage
        );

        return;
    }


    subtasks.forEach(
        subtask => {

            const item =
                document.createElement("div");

            item.className =
                "subtask-item";


            const checkbox =
                document.createElement("input");

            checkbox.type =
                "checkbox";

            checkbox.className =
                "subtask-checkbox";

            checkbox.dataset.subtaskId =
                subtask.id;

            checkbox.checked =
                Boolean(subtask.done);


            const label =
                document.createElement("label");

            label.textContent =
                subtask.text || "";


            if (subtask.done) {

                label.classList.add(
                    "completed"
                );

            }


            const deleteButton =
                document.createElement("button");

            deleteButton.type =
                "button";

            deleteButton.className =
                "subtask-delete";

            deleteButton.dataset.subtaskId =
                subtask.id;

            deleteButton.textContent =
                "Delete";


            item.appendChild(
                checkbox
            );

            item.appendChild(
                label
            );

            item.appendChild(
                deleteButton
            );


            subtaskList.appendChild(
                item
            );

        }
    );

}


/* =========================
   RENDER PROJECT PROGRESS
========================= */

export function renderProgress(
    project,
    projectTasks = []
) {

    const activeProjectName =
        document.getElementById(
            "activeProjectName"
        );

    const progressText =
        document.getElementById(
            "progressText"
        );

    const progressBar =
        document.getElementById(
            "progressBar"
        );

    const progressFill =
        document.getElementById(
            "progressFill"
        );


    if (!project) {
        return;
    }


    const totalTasks =
        projectTasks.length;


    const completedTasks =
        projectTasks.filter(
            task =>
                task.status === "Done"
        ).length;


    if (activeProjectName) {

        activeProjectName.textContent =
            project.name;

    }


    if (progressText) {

        progressText.textContent =
            `${completedTasks} of ${totalTasks} tasks done`;

    }


    const percentage =
        totalTasks === 0
            ? 0
            : Math.round(
                (
                    completedTasks /
                    totalTasks
                ) * 100
            );


    if (progressBar) {

        progressBar.setAttribute(
            "aria-valuenow",
            percentage
        );

    }


    if (progressFill) {

        progressFill.style.width =
            `${percentage}%`;

    }

}


/* =====================================================
   ADMIN DASHBOARD - USER LIST
===================================================== */

export function renderAdminUsers(
    users = [],
    userStats = []
) {

    const container =
        document.getElementById(
            "adminUsersList"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(users) ||
        users.length === 0
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "admin-empty-state";

        empty.textContent =
            "No registered users yet.";

        container.appendChild(
            empty
        );

        return;
    }


    users.forEach(user => {

        const stats =
            userStats.find(
                item =>
                    item.userId ===
                    user.id
            ) || {

                total: 0,
                active: 0,
                completed: 0

            };


        const card =
            document.createElement("div");

        card.className =
            "admin-user-card";


        const avatar =
            document.createElement("div");

        avatar.className =
            "admin-user-avatar";

        avatar.textContent =
            String(
                user.name || "U"
            )
                .charAt(0)
                .toUpperCase();


        const info =
            document.createElement("div");

        info.className =
            "admin-user-info";


        const name =
            document.createElement("strong");

        name.textContent =
            user.name || "Unnamed User";


        const email =
            document.createElement("span");

        email.textContent =
            user.email || "";


        info.appendChild(name);
        info.appendChild(email);


        const statsBox =
            document.createElement("div");

        statsBox.className =
            "admin-user-stats";


        statsBox.innerHTML = `

            <div>
                <strong>${stats.total}</strong>
                <span>Total</span>
            </div>

            <div>
                <strong>${stats.active}</strong>
                <span>Active</span>
            </div>

            <div>
                <strong>${stats.completed}</strong>
                <span>Done</span>
            </div>

        `;


        card.appendChild(avatar);
        card.appendChild(info);
        card.appendChild(statsBox);


        container.appendChild(card);

    });

}


/* =====================================================
   ADMIN DASHBOARD - REPORTS
===================================================== */

export function renderAdminReports(
    users = [],
    userStats = []
) {

    const container =
        document.getElementById(
            "adminReportsList"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(users) ||
        users.length === 0
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "admin-empty-state";

        empty.textContent =
            "No user report data available.";

        container.appendChild(
            empty
        );

        return;

    }


    users.forEach(user => {

        const stats =
            userStats.find(
                item =>
                    item.userId ===
                    user.id
            ) || {

                total: 0,
                todo: 0,
                inProgress: 0,
                inReview: 0,
                completed: 0

            };


        const percentage =
            stats.total === 0
                ? 0
                : Math.round(
                    (
                        stats.completed /
                        stats.total
                    ) * 100
                );


        const report =
            document.createElement("div");

        report.className =
            "admin-report-card";


        report.innerHTML = `

            <div class="admin-report-header">

                <div>

                    <strong>
                        ${escapeHTML(
                            user.name || "Unnamed User"
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            user.email || ""
                        )}
                    </span>

                </div>

                <strong class="admin-report-percentage">
                    ${percentage}%
                </strong>

            </div>


            <div class="admin-report-progress">

                <div
                    class="admin-report-progress-fill"
                    style="width: ${percentage}%"
                ></div>

            </div>


            <div class="admin-report-status">

                <span>
                    To Do:
                    <strong>
                        ${stats.todo}
                    </strong>
                </span>

                <span>
                    In Progress:
                    <strong>
                        ${stats.inProgress}
                    </strong>
                </span>

                <span>
                    In Review:
                    <strong>
                        ${stats.inReview}
                    </strong>
                </span>

                <span>
                    Done:
                    <strong>
                        ${stats.completed}
                    </strong>
                </span>

            </div>

        `;


        container.appendChild(
            report
        );

    });

}


/* =====================================================
   ADMIN SUMMARY
===================================================== */

export function renderAdminSummary(
    summary = {}
) {

    const totalUsers =
        document.getElementById(
            "adminTotalUsers"
        );

    const totalTasks =
        document.getElementById(
            "adminTotalTasks"
        );

    const pendingTasks =
        document.getElementById(
            "adminPendingTasks"
        );

    const completedTasks =
        document.getElementById(
            "adminCompletedTasks"
        );


    const todoTasks =
        document.getElementById(
            "adminTodoTasks"
        );

    const inProgressTasks =
        document.getElementById(
            "adminInProgressTasks"
        );

    const inReviewTasks =
        document.getElementById(
            "adminInReviewTasks"
        );

    const doneTasks =
        document.getElementById(
            "adminDoneTasks"
        );


    if (totalUsers) {

        totalUsers.textContent =
            summary.totalUsers || 0;

    }


    if (totalTasks) {

        totalTasks.textContent =
            summary.totalTasks || 0;

    }


    if (pendingTasks) {

        pendingTasks.textContent =
            summary.pendingTasks || 0;

    }


    if (completedTasks) {

        completedTasks.textContent =
            summary.completedTasks || 0;

    }


    if (todoTasks) {

        todoTasks.textContent =
            summary.todo || 0;

    }


    if (inProgressTasks) {

        inProgressTasks.textContent =
            summary.inProgress || 0;

    }


    if (inReviewTasks) {

        inReviewTasks.textContent =
            summary.inReview || 0;

    }


    if (doneTasks) {

        doneTasks.textContent =
            summary.completedTasks || 0;

    }

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text ?? "");

    return div.innerHTML;

}
