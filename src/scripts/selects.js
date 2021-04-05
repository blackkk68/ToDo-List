import { Task } from "./task";

class Select {
    constructor(options) {
        this.currentValue = options.currentValue,
            this.options = options.options,
            this.selectType = options.selectType,
            this.render()
    }

    render() {
        const filters = document.querySelector('.filters-container');
        const optionsHtml = this.options.map(item => `<li class="option">${item}</li>`);
        const html = `
        <div class="${this.selectType}">
            <div class="select">
                <span class="input">${this.currentValue}</span>
                <span class="select-arrow"></span>
            </div>
            <ul class="options hidden">
                ${optionsHtml.join('')}
            </ul>
        </div>
        `

        filters.insertAdjacentHTML('beforeend', html);
    }

    open(options, selectArrow) {
        options.classList.remove('hidden');
        selectArrow.classList.add('rotate');
        setTimeout(() => {
            options.classList.add('open');
        }, 50);
    }

    close(options, selectArrow) {
        options.classList.remove('open');
        selectArrow.classList.remove('rotate');
        setTimeout(() => {
            options.classList.add('hidden');
        }, 200);
    }

    setCurrentValue(input, newValue) {
        this.currentValue = newValue;
        input.textContent = newValue;
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        Task.render(tasks);
    }
}

const filterOptions = {
    currentValue: 'Все дела',
    options: ['Все дела', 'Обычные', 'Важные', 'Обязательные'],
    selectType: 'importance-filter'
}

const sortingOptions = {
    currentValue: 'По порядку',
    options: ['По порядку', 'По важности'],
    selectType: 'sorting'
}

export const filter = new Select(filterOptions);
export const sorting = new Select(sortingOptions);

