const form = document.querySelector(".form");
const input = form.querySelector(".task-input").value;
const importanceBtns = form.querySelectorAll("[name='importance']");
let counter = 1;
let tasks = [];

form.addEventListener('submit', evt => {
    evt.preventDefault();

    let checkedImportance;
    for (let item of importanceBtns) {
        if (item.checked) checkedImportance = item;
    }

    let settings = {
        text: input,
        importance: checkedImportance.dataset.importance,
        order: counter,
        class: checkedImportance.value
    };
    tasks.push(createNewTask(settings));

    renderTasks(tasks);


    counter++;
})
