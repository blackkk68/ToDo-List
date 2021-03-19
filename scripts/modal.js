function createAuthModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'hidden');
    modal.innerHTML = `
    <div class="modal-overlay" data-close="close">
        <div class="modal-window">
            <div class="modal-container">
                <div class="modal-auth">
                    <h2>Авторизация</h2>
                    <form class="auth-form" action="#" method="post">
                        <input type="email" name="email" class="email" placeholder="Email" required>
                        <input type="password" name="password" class="password" placeholder="Пароль" required minlength="6">
                        <input type="submit" class="submit-btn" value="Войти">
                    </form>
                    <p>Нет аккаунта? <a href="#" class="registration">Зарегистрироваться</a></p>
                </div>
                <div class="modal-reg">
                    <h2>Регистрация</h2>
                    <form class="auth-form" action="#" method="post">
                        <input type="text" name="name" class="name" placeholder="Имя" required>
                        <input type="email" name="email" class="email" placeholder="Email" required>
                        <input type="password" name="password" class="password" placeholder="Пароль" required minlength="6">
                        <input type="submit" class="submit-btn" value="Зарегистрироваться">
                    </form>
                    <p>Есть аккаунт? <a href="#" class="sign-in">Войти</a></p>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.appendChild(modal);
}
createAuthModal();

const authBtn = document.querySelector('.auth-btn');
const modalNode = document.querySelector('.modal');
const modalContainer = modalNode.querySelector('.modal-container');
const registration = modalNode.querySelector('.registration');
const signIn = modalNode.querySelector('.sign-in');

const modal = {
    open() {
        modalNode.classList.remove('hidden');
        modalNode.classList.remove('hide');
        setTimeout(() => {
            modalNode.classList.add('open');
        }, 20);
    },

    close() {
        modalNode.classList.remove('open');
        modalNode.classList.add('hide');
        setTimeout(() => {
            modalNode.classList.add('hidden');
        }, 200)
    },

    delete() {
        modalNode.remove();
    }
}

authBtn.addEventListener('click', () => {
    modal.open();
});

document.addEventListener('click', evt => {
    evt.preventDefault();
    if (evt.target.dataset.close) {
        modal.close();
    }
});

registration.addEventListener('click', evt => {
    evt.preventDefault();
    modalContainer.classList.add('rotate');
});

signIn.addEventListener('click', evt => {
    evt.preventDefault();
    modalContainer.classList.remove('rotate');
});