const taskList = document.querySelector('.task-list');
const noTaskText = document.querySelector('.no-task-text');

class Task {
    constructor(options) {
        this.text = options.text,
            this.importance = options.importance,
            this.id = options.id,
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
            taskMenu.toggleTaskMenu(menu);
            taskMenu.deleteTask(index, task);
            taskMenu.markTaskAsDone(index, task, menu);
        });
    }
    console.log(tasks);
}

const taskMenu = {
    toggleTaskMenu(menu) {
        menu.classList.toggle('hidden');
    },

    deleteTask(index, task) {
        const deleteBtn = task.querySelector('.delete');
        deleteBtn.onclick = function () {
            tasks.splice(index, 1);
            task.remove();
            tasks.length ? noTaskText.classList.add('hidden') : noTaskText.classList.remove('hidden');
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    },

    markTaskAsDone(index, task, menu) {
        const doneBtn = task.querySelector('.mark-as-done');
        doneBtn.onclick = function () {
            tasks[index].isDone = tasks[index].isDone ? false : true;
            task.classList.toggle("done");
            menu.classList.add('hidden');
            localStorage.setItem('tasks', JSON.stringify(tasks));
            if (doneBtn.textContent === "Сделано") {
                doneBtn.textContent = "Не сделано";
            } else {
                doneBtn.textContent = "Сделано";
            }
        }
    }
}