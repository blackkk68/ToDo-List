const taskList = document.querySelector('.task-list');
const noTaskText = document.querySelector('.no-task-text');

class Task {
    constructor(options) {
        this.text = options.text,
            this.importance = options.importance,
            this.order = options.order,
            this.class = options.class,
            this.isDone = options.isDone
    }

    static toggleTaskMenu(menu) {
        menu.classList.toggle('hidden');
        adaptiveTaskMenu();
    }

    static deleteTask(index, task) {
        const deleteBtn = task.querySelector('.delete');
        const email = JSON.parse(localStorage.getItem('user')).email;
        deleteBtn.onclick = function () {
            FetchTask.delete(email.replace(/\./g, ''), tasks[index].id, userToken)
                .then(task.remove())
                .then(tasks.splice(index, 1))
                .then(tasks.length ? noTaskText.classList.add('hidden') : noTaskText.classList.remove('hidden'))
        }
    }

    static markTaskAsDone(index, task, menu) {
        const doneBtn = task.querySelector('.mark-as-done');
        const email = JSON.parse(localStorage.getItem('user')).email;
        doneBtn.onclick = function () {
            tasks[index].isDone = tasks[index].isDone ? false : true;
            FetchTask.patch(email.replace(/\./g, ''), tasks[index].id, userToken, tasks[index])
                .then(task.classList.toggle("done"))
                .then(menu.classList.add('hidden'))
                .then(doneBtn.textContent = doneBtn.textContent === "Сделано" ? "Не сделано" : "Сделано");
            adaptiveTaskMenu();
        }
    }
}

function renderTasks(tasks) {
    sortingTaks(tasks);
    tasksFilter(tasks);
    const html = tasks.map(task => {
        return `
    <li class="${task.class} ${task.isDone ? 'done' : ''}" data-id="${task.id}">
    ${task.text}<a class="kebab"></a>
    <div class="task-menu hidden"><ul>
        <li class="mark-as-done">Сделано</li>
        <li class="delete">Удалить</li>
    </ul></div></li>`}).join('');

    taskList.innerHTML = html;
    taskList.innerHTML ? noTaskText.classList.add('hidden') : noTaskText.classList.remove('hidden');

    const kebabs = taskList.querySelectorAll('.kebab');
    for (let kebab of kebabs) {
        kebab.addEventListener('click', evt => {
            const task = evt.target.parentNode;
            const index = tasks.findIndex(item => item.id == task.dataset.id);
            const menu = task.querySelector('.task-menu');
            Task.toggleTaskMenu(menu);
            Task.deleteTask(index, task);
            Task.markTaskAsDone(index, task, menu);
        });
    }
}