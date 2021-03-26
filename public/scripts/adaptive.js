function adaptiveTaskLength() {
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
}

function adaptiveTaskMenu() {
    const tasks = document.querySelectorAll('.task');
    for (let task of tasks) {
        const taskMenu = task.querySelector('.task-menu');
        const kebab = task.querySelector('.kebab');
        if (window.matchMedia('(max-width: 768px)').matches && !taskMenu.classList.contains('hidden')) {
            task.style.width = '65%';
            kebab.style.left = '83%';
        } else if (window.matchMedia('(max-width: 768px)').matches && taskMenu.classList.contains('hidden')) {
            task.style.width = '80%';
            kebab.style.left = '86%';
        }

        if (window.matchMedia('(max-width: 480px)').matches && !taskMenu.classList.contains('hidden')) {
            task.style.width = '65%';
            kebab.style.left = '81%';
        } else if (window.matchMedia('(max-width: 480px)').matches && taskMenu.classList.contains('hidden')) {
            task.style.width = '85%';
            kebab.style.left = '84%';
        }
    }
}

window.addEventListener('resize', () => {
    adaptiveTaskLength();
})