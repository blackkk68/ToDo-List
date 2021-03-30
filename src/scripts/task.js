import { adaptiveTasks } from './adaptive';
import { sortingTaks, tasksFilter } from './filters';
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

    static render(tasks) {
        sortingTaks(tasks);
        tasksFilter(tasks);
        const html = tasks.map(task => {
            return `
        <li class="${task.class} ${task.isDone ? 'done' : ''}" data-id="${task.id}">
        ${task.text}<a class="kebab"></a>
        <ul class="task-menu hidden">
            <li class="mark-as-done">${task.isDone ? 'Не сделано' : 'Сделано'}</li>
            <li class="delete">Удалить</li>
        </ul></li>`}).join('');

        taskList.innerHTML = html;
        taskList.innerHTML ? noTaskText.classList.add('hidden') : noTaskText.classList.remove('hidden');

        const kebabs = taskList.querySelectorAll('.kebab');
        for (let kebab of kebabs) {
            kebab.addEventListener('click', evt => {
                const taskNode = evt.target.parentNode;
                const menu = taskNode.querySelector('.task-menu');
                const userToken = JSON.parse(localStorage.getItem('user')).token;
                TaskMenu.toggleTaskMenu(taskNode, menu);
                TaskMenu.deleteTask(taskNode, userToken);
                TaskMenu.markTaskAsDone(taskNode, menu, userToken);
            });
        }

    }
}

class TaskMenu {
    static open(taskNode, menu) {
        menu.classList.remove('hidden');
        setTimeout(() => {
            menu.classList.add('open');
            adaptiveTasks(taskNode, menu);
        }, 50);
    }

    static close(taskNode, menu) {
        menu.classList.remove('open');
        setTimeout(() => {
            menu.classList.add('hidden');
            adaptiveTasks(taskNode, menu);
        }, 200);
    }

    static toggleTaskMenu(taskNode, menu) {
        menu.classList.contains('hidden') ? this.open(taskNode, menu) : this.close(taskNode, menu);
    }

    static deleteTask(taskNode, userToken) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const index = tasks.findIndex(item => item.id == taskNode.dataset.id);
        const task = tasks[index];
        const deleteBtn = taskNode.querySelector('.delete');
        const email = JSON.parse(localStorage.getItem('user')).email;
        deleteBtn.onclick = function () {
            FetchTask.delete(email.replace(/\./g, ''), task.id, userToken)
                .then(taskNode.remove())
                .then(tasks.splice(index, 1))
                .then(tasks.length ? noTaskText.classList.add('hidden') : noTaskText.classList.remove('hidden'))
                .then(localStorage.setItem('tasks', JSON.stringify(tasks)))
        }
    }

    static markTaskAsDone(taskNode, menu, userToken) {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const index = tasks.findIndex(item => item.id == taskNode.dataset.id);
        const task = tasks[index];
        const doneBtn = taskNode.querySelector('.mark-as-done');
        const email = JSON.parse(localStorage.getItem('user')).email;
        doneBtn.onclick = function () {
            task.isDone = task.isDone ? false : true;
            FetchTask.patch(email.replace(/\./g, ''), task.id, userToken, task)
                .then(taskNode.classList.toggle("done"))
                .then(TaskMenu.close(taskNode, menu))
                .then(doneBtn.textContent = doneBtn.textContent === "Сделано" ? "Не сделано" : "Сделано");
            adaptiveTasks(taskNode, menu);
        }
    }
}

window.addEventListener('click', () => {
    const allTaskMenu = document.querySelectorAll('.task-menu');
    for (let taskMenu of allTaskMenu) {
        if (taskMenu.classList.contains('open')) {
            const taskNode = taskMenu.parentNode;
            TaskMenu.close(taskNode, taskMenu);
        }
    }
})