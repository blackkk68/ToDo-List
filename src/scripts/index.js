import { renderTasks, Task } from './task';
import { FetchTask, User } from './auth';
import { sorting, importanceFilter } from './filters';
import { Modal } from './modal';
import '../styles/normalize.css';
import '../styles/style.css';

const authBtn = document.querySelector('.auth-btn');
const popup = document.querySelector('.popup');
const form = document.querySelector('.form');
const input = form.querySelector('.task-input');
const publish = form.querySelector('.publish');
publish.disabled = true;
let userToken;
let tasks = [];

if (localStorage.getItem('user')) {
    const email = JSON.parse(localStorage.getItem('user')).email;
    const password = JSON.parse(localStorage.getItem('user')).password;
    const userName = JSON.parse(localStorage.getItem('user')).name;

    const account = document.querySelector('.account');
    const user = account.querySelector('.user');
    const authBtn = document.querySelector('.auth-btn');

    User.auth(email, password)
        .then(token => {
            userToken = token;
            return FetchTask.getUserTasks(token, email.replace(/\./g, ''));
        })
        .then(response => {
            if (response) {
                tasks = Object.entries(response).map(item => {
                    item[1].id = item[0];
                    return item[1];
                });
                renderTasks(tasks);
            }
        })
        .then(() => {
            account.classList.remove('hidden');
            user.textContent = userName;
            authBtn.classList.add('hidden');
            publish.disabled = false;
        })
}

form.addEventListener('submit', evt => {
    evt.preventDefault();
    const newTask = new Task(createOptions());
    const email = JSON.parse(localStorage.getItem('user')).email.replace(/\./g, '');
    FetchTask.create(newTask, email, userToken)
        .then(task => {
            tasks.push(task);
            renderTasks(tasks);
            input.value = '';
        })
});

function createOptions() {
    const importanceBtns = form.querySelectorAll('[name="importance"]');
    let checkedImportance;
    for (let item of importanceBtns) {
        if (item.checked) checkedImportance = item;
    }

    return {
        text: input.value.trim(),
        importance: Number(checkedImportance.dataset.importance),
        order: new Date().getTime(),
        class: `task ${checkedImportance.value}`,
        isDone: false
    }
}

if (!localStorage.getItem('user')) {
    input.addEventListener('click', () => {
        popup.classList.remove('hidden');
        setTimeout(() => {
            popup.classList.add('show');
        }, 300);
        popup.addEventListener('click', () => {
            popup.classList.add('hide');
            setTimeout(() => {
                popup.classList.add('hidden');
            }, 5000);
        })
    });
}

authBtn.addEventListener('click', () => {
    Modal.open();
});

sorting.addEventListener('change', () => {
    renderTasks(tasks);
});

importanceFilter.addEventListener('change', () => {
    renderTasks(tasks);
});