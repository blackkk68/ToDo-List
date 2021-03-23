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
}

function createNewTask(options) {
    return new Task(options);
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
            const email = JSON.parse(localStorage.getItem('user')).email;
            taskMenu.toggleTaskMenu(menu);
            taskMenu.deleteTask(index, task, email);
            taskMenu.markTaskAsDone(index, task, menu, email);
        });
    }
}

const taskMenu = {
    toggleTaskMenu(menu) {
        menu.classList.toggle('hidden');
        adaptiveTaskMenu();
    },

    deleteTask(index, task, email) {
        const deleteBtn = task.querySelector('.delete');
        deleteBtn.onclick = function () {
            task.remove();
            FetchTask.delete(email.replace(/\./g, ''), tasks[index].id, userToken)
                .then(tasks.splice(index, 1))
                .then(tasks.length ? noTaskText.classList.add('hidden') : noTaskText.classList.remove('hidden'))
        }
    },

    markTaskAsDone(index, task, menu, email) {
        const doneBtn = task.querySelector('.mark-as-done');
        doneBtn.onclick = function () {
            tasks[index].isDone = tasks[index].isDone ? false : true;
            task.classList.toggle("done");
            menu.classList.add('hidden');
            FetchTask.patch(email.replace(/\./g, ''), tasks[index].id, userToken, tasks[index])
                .then(() => {
                    if (doneBtn.textContent === "Сделано") {
                        doneBtn.textContent = "Не сделано";
                    } else {
                        doneBtn.textContent = "Сделано";
                    }
                })
            adaptiveTaskMenu();
        }
    }
}