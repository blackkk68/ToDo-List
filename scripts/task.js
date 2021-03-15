let taskList = document.querySelector(".task-list");

class Task {
    constructor(options) {
        this.text = options.text,
            this.impotance = options.importance,
            this.order = options.order,
            this.class = options.class
    }
}

function createNewTask(options) {
    return new Task(options);
}

function renderTasks(tasks) {
    const html = tasks.map(task => `<li class="${task.class}">${task.text}</li>`).join('');

    taskList.innerHTML = html
        ? html
        : `<p class="no-task-text">У вас ещё нет дел</p>`;
}