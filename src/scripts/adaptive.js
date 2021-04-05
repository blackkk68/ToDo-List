export function adaptiveTasks(task, taskMenu) {
    if (window.matchMedia('(max-width: 1199px)').matches && taskMenu.classList.contains('hidden')) {
        task.style.width = '55%';
    }

    if (window.matchMedia('(max-width: 768px)').matches && !taskMenu.classList.contains('hidden')) {
        task.style.width = '65%';
    } else if (window.matchMedia('(max-width: 768px)').matches && taskMenu.classList.contains('hidden')) {
        task.style.width = '80%';
    }

    if (window.matchMedia('(max-width: 480px)').matches && !taskMenu.classList.contains('hidden')) {
        task.style.width = '64%';
    } else if (window.matchMedia('(max-width: 480px)').matches && taskMenu.classList.contains('hidden')) {
        task.style.width = '84%';
    }
}

window.addEventListener('resize', () => {
    const tasks = document.querySelectorAll('.task');
    for (let task of tasks) {
        const taskMenu = task.querySelector('.task-menu');

        adaptiveTasks(task, taskMenu);

        if (!taskMenu.classList.contains('hidden')) {
            taskMenu.classList.add('hidden');
        }
    }
});