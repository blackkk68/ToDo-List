const form = document.querySelector('.form');
let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
let counter = tasks.length;

renderTasks(tasks);

form.addEventListener('submit', evt => {
    evt.preventDefault();

    tasks.push(createtask(createOptions()));

    renderTasks(tasks);

    localStorage.setItem('tasks', JSON.stringify(tasks));
});

function createOptions() {
    const input = form.querySelector('.task-input');
    const importanceBtns = form.querySelectorAll('[name="importance"]');
    let checkedImportance;
    for (let item of importanceBtns) {
        if (item.checked) checkedImportance = item;
    }

    return {
        text: input.value.trim(),
        importance: Number(checkedImportance.dataset.importance),
        id: counter++,
        class: `task ${checkedImportance.value}`,
        isDone: false
    }
}

window.addEventListener('resize', () => {
    const tasks = document.querySelectorAll('.task');
    for (let task of tasks) {
        const taskMenu = task.querySelector('.task-menu');
        const kebab = task.querySelector('.kebab');

        if (window.matchMedia('(max-width: 1920px)').matches && taskMenu.classList.contains('hidden')) {
            kebab.style.left = '85%';
        }

        if (window.matchMedia('(max-width: 1199px)').matches && taskMenu.classList.contains('hidden')) {
            task.style.width = '55%';
            kebab.style.left = '82%';
        }

        if (window.matchMedia('(max-width: 768px)').matches && taskMenu.classList.contains('hidden')) {
            task.style.width = '80%';
            kebab.style.left = '86%';
        }

        if (window.matchMedia('(max-width: 480px)').matches && taskMenu.classList.contains('hidden')) {
            task.style.width = '85%';
            kebab.style.left = '84%';
        }

        if (!taskMenu.classList.contains('hidden')) {
            taskMenu.classList.add('hidden');
        }
    }
})