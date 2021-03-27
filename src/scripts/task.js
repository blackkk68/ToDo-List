import { sortingTaks, tasksFilter } from './filters';
import { adaptiveTasks } from './adaptive';
import { FetchTask } from './auth';

const taskList = document.querySelector('.task-list');
const noTaskText = document.querySelector('.no-task-text');

export class Task {
    constructor(options) {
        this.text = options.text,
            this.importance = options.importance,
            this.order = options.order,
            this.class = options.class,
            this.isDone = options.isDone
    }

    static toggleTaskMenu(taskNode, kebab, menu) {
        menu.classList.toggle('hidden');
        adaptiveTasks(taskNode, kebab, menu);
    }

    static deleteTask(taskNode, index, tasks, userToken) {
        const deleteBtn = taskNode.querySelector('.delete');
        const email = JSON.parse(localStorage.getItem('user')).email;
        deleteBtn.onclick = function () {
            FetchTask.delete(email.replace(/\./g, ''), tasks[index].id, userToken)
                .then(taskNode.remove())
                .then(tasks.splice(index, 1))
                .then(tasks.length ? noTaskText.classList.add('hidden') : noTaskText.classList.remove('hidden'))
        }
    }

    static markTaskAsDone(taskNode, kebab, menu, task, userToken) {
        const doneBtn = taskNode.querySelector('.mark-as-done');
        const email = JSON.parse(localStorage.getItem('user')).email;
        doneBtn.onclick = function () {
            task.isDone = task.isDone ? false : true;
            FetchTask.patch(email.replace(/\./g, ''), task.id, userToken, task)
                .then(taskNode.classList.toggle("done"))
                .then(menu.classList.add('hidden'))
                .then(doneBtn.textContent = doneBtn.textContent === "Сделано" ? "Не сделано" : "Сделано");
            adaptiveTasks(taskNode, kebab, menu);
        }
    }
}

export function renderTasks(tasks) {
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
            const taskNode = evt.target.parentNode;
            const index = tasks.findIndex(item => item.id == taskNode.dataset.id);
            const task = tasks[index];
            const menu = taskNode.querySelector('.task-menu');
            const userToken = JSON.parse(localStorage.getItem('user')).token;
            Task.toggleTaskMenu(taskNode, kebab, menu);
            Task.deleteTask(taskNode, index, tasks, userToken);
            Task.markTaskAsDone(taskNode, kebab, menu, task, userToken);
        });
    }
}