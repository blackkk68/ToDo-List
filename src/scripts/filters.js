export const sorting = document.querySelector(".sorting");
export const importanceFilter = document.querySelector(".importance-filter");

export function sortingTaks(tasks) {
    if (sorting.value === "by-importance") {
        tasks.sort((a, b) => {
            return b.importance - a.importance;
        })
    } else if (sorting.value === "by-order") {
        tasks.sort((a, b) => {
            return a.order - b.order;
        })
    }
    return tasks;
}

export function tasksFilter(tasks) {
    for (let task of tasks) {
        task.class = task.class.replace(/ hidden/, '');
        if (!task.class.match(`${importanceFilter.value}`) && importanceFilter.value !== "all") {
            task.class += " hidden";
        } else if (task.class.match(/importanceFilter.value/)) {
            task.class = importanceFilter.value;
        } else if (importanceFilter.value === "all") {
            task.class = task.class.replace(/ hidden/, '');
        }
    }
    return tasks;
}