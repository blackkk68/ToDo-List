import { Task } from './task';
import { FetchTask, User } from './auth';
import { Modal } from './modal';
import '../styles/normalize.css';
import '../styles/style.css';

const loading = document.querySelector('.to-do-list-loading');
const page = document.querySelector('.to-do-list-container');
const authBtn = document.querySelector('.auth-btn');
const popup = document.querySelector('.popup');
const form = document.querySelector('.form');
const input = form.querySelector('.task-input');
const publish = form.querySelector('.publish');
publish.disabled = true;

if (localStorage.getItem('user')) {
    const email = JSON.parse(localStorage.getItem('user')).email;
    const password = JSON.parse(localStorage.getItem('user')).password;
    const userName = JSON.parse(localStorage.getItem('user')).name;

    const account = document.querySelector('.account');
    const user = account.querySelector('.user');
    const authBtn = document.querySelector('.auth-btn');

    User.auth(email, password)
        .then(token => {
            let user = JSON.parse(localStorage.getItem('user'));
            user.token = token;
            localStorage.setItem('user', JSON.stringify(user));
            return FetchTask.getUserTasks(token, email.replace(/\./g, ''));
        })
        .then(response => {
            if (response) {
                const tasks = Object.entries(response).map(item => {
                    item[1].id = item[0];
                    return item[1];
                });
                Task.render(tasks);
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        })
        .then(() => {
            account.classList.remove('hidden');
            user.textContent = userName;
            authBtn.classList.add('hidden');
            publish.disabled = false;
            loading.remove();
            page.classList.remove('hidden');
        })
} else {
    loading.remove();
    page.classList.remove('hidden');
}

form.addEventListener('submit', evt => {
    evt.preventDefault();
    const newTask = new Task(createOptions());
    const email = JSON.parse(localStorage.getItem('user')).email.replace(/\./g, '');
    const userToken = JSON.parse(localStorage.getItem('user')).token;
    FetchTask.create(newTask, email, userToken)
        .then(task => {
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks.push(task);
            Task.render(tasks);
            input.value = '';
            localStorage.setItem('tasks', JSON.stringify(tasks));
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