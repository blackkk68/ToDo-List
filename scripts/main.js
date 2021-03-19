const form = document.querySelector('.form');
let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
let counter = tasks.length;

renderTasks(tasks);

form.addEventListener('submit', evt => {
    evt.preventDefault();

    tasks.push(createNewTask(createOptions()));

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
    adaptiveTaskLength();
})