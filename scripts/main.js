const form = document.querySelector('.form');
const input = form.querySelector('.task-input');
const popup = document.querySelector('.popup');
const popupText = popup.querySelector('.popup-text');
let isLogined = false;
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
            authBtn.classList.add('hidden');
            isLogined = true;
        })
}

form.addEventListener('submit', evt => {
    evt.preventDefault();
    const newTask = createNewTask(createOptions());

    if (isLogined) {
        const email = JSON.parse(localStorage.getItem('user')).email.replace(/\./g, '');
        FetchTask.create(newTask, email, userToken)
            .then(task => {
                tasks.push(task);
                renderTasks(tasks);
                input.value = '';
            })
    } else {
        tasks.push(newTask);
        renderTasks(tasks);
        input.value = '';
    }
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

if (!localStorage.getItem('user')) {
    input.addEventListener('click', () => {
        popup.classList.remove('hidden');
        setTimeout(() => {
            popupText.classList.add('show');
        }, 300);
        popupText.addEventListener('click', () => {
            popupText.classList.add('hide');
            setTimeout(() => {
                popup.classList.add('hidden');
            }, 5000);
        })
    });
}