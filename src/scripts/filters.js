import { sorting, filter } from './selects';

const sortingFilter = document.querySelector(".sorting");
const importanceFilter = document.querySelector(".importance-filter");

const filterSelect = importanceFilter.querySelector('.select');
filterSelect.addEventListener('click', () => {
    toggleSelect(filter, importanceFilter);
    hilightCurrentOption(filterSelect);
})

const sortingSelect = sortingFilter.querySelector('.select');
sortingSelect.addEventListener('click', () => {
    toggleSelect(sorting, sortingFilter);
    hilightCurrentOption(sortingSelect);
})

function toggleSelect(selectObj, selectNode) {
    const selectArrow = selectNode.querySelector('.select-arrow');
    const options = selectNode.querySelector('.options');
    options.classList.contains('open') ? selectObj.close(options, selectArrow) : selectObj.open(options, selectArrow);
}

function hilightCurrentOption(select) {
    const filter = select.parentNode;
    const options = filter.querySelectorAll('.option');
    const input = filter.querySelector('.input');

    options.forEach((option) => {
        option.classList.remove('current');
        if (option.textContent === input.textContent) {
            option.classList.add('current');
        }
    })
}

window.addEventListener('click', () => {
    const allOptions = document.querySelectorAll('.options');
    for (let options of allOptions) {
        if (options.classList.contains('open')) {
            if (options.parentNode.classList.contains('importance-filter')) {
                const selectArrow = filterSelect.querySelector('.select-arrow');
                filter.close(options, selectArrow);
            } else if (options.parentNode.classList.contains('sorting')) {
                const selectArrow = sortingSelect.querySelector('.select-arrow');
                sorting.close(options, selectArrow);
            }
        }
    }
})

function changeCurrentOption(selectType, selectObj) {
    const options = selectType.querySelectorAll('li');
    for (let option of options) {
        option.addEventListener('click', () => {
            const input = selectType.querySelector('.input');
            selectObj.setCurrentValue(input, option.textContent);
        })
    }
}
changeCurrentOption(sortingFilter, sorting);
changeCurrentOption(importanceFilter, filter);

export function sortingTaks(tasks) {
    if (sorting.currentValue === "По важности") {
        tasks.sort((a, b) => {
            return b.importance - a.importance;
        })
    } else if (sorting.currentValue === "По порядку") {
        tasks.sort((a, b) => {
            return a.order - b.order;
        })
    }
    return tasks;
}

export function tasksFilter(tasks) {
    for (let task of tasks) {
        task.class = task.class.replace(/ hidden/, '');
        if (filter.currentValue === 'Обычные' && !task.class.match(/to-do/)) {
            task.class = `${task.class} hidden`;
        } else if (filter.currentValue === 'Важные' && !task.class.match(/better-do/)) {
            task.class = `${task.class} hidden`;
        } else if (filter.currentValue === 'Обязательные' && !task.class.match(/necessary-do/)) {
            task.class = `${task.class} hidden`;
        }
    }
    return tasks;
}