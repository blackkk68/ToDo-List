const form = document.querySelector('.form');
const input = form.querySelector('.task-input');
let userToken;
let tasks = [];
let counter = tasks.length;

if (localStorage.getItem('user')) {
    const email = JSON.parse(localStorage.getItem('user')).email;
    const password = JSON.parse(localStorage.getItem('user')).password;
    const userName = JSON.parse(localStorage.getItem('user')).name;

    const account = document.querySelector('.account');
    const user = account.querySelector('.user');
    const authBtn = document.querySelector('.auth-btn');

    authUser(email, password)
        .then(token => {
            userToken = token;
            return FetchTask.authAndGet(token, email.replace(/\./g, ''));
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
            authBtn.style.background = 'url("../img/with-auth.svg") no-repeat';
            authBtn.style.cursor = 'default';
            authBtn.disabled = true;
        })
}

form.addEventListener('submit', evt => {
    evt.preventDefault();

    const email = JSON.parse(localStorage.getItem('user')).email.replace(/\./g, '');
    const newTask = createNewTask(createOptions());

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
        order: counter++,
        class: `task ${checkedImportance.value}`,
        isDone: false
    }
}

window.addEventListener('resize', () => {
    adaptiveTaskLength();
})