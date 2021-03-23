function createAuthModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'hidden');
    modal.innerHTML = `
    <div class="modal-overlay" data-close="close">
        <div class="modal-window">
            <div class="modal-container">
                <div class="modal-auth">
                    <h2>Авторизация</h2>
                    <form class="form auth-form" action="#" method="post">
                        <input type="email" name="email" class="email" placeholder="Email" required>
                        <input type="password" name="password" class="password" placeholder="Пароль" required minlength="6">
                        <input type="submit" class="submit-btn" value="Войти">
                    </form>
                    <p>Нет аккаунта? <a href="#" class="registration">Зарегистрироваться</a></p>
                </div>
                <div class="modal-reg">
                    <h2>Регистрация</h2>
                    <form class="form reg-form" action="#" method="post">
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
const regForm = modalContainer.querySelector('.reg-form');
const authForm = modalContainer.querySelector('.auth-form');

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


authForm.addEventListener('submit', evt => {
    evt.preventDefault();

    const email = authForm.querySelector('.email').value;
    const password = authForm.querySelector('.password').value;
    authUser(email, password)
        .then((token) => {
            User.getUser(token, email.replace(/\./g, ''))
                .then(response => {
                    const user = Object.values(response)[0];
                    localStorage.clear();
                    localStorage.setItem('user', JSON.stringify(user));
                    location.reload();
                })
        });
});

regForm.addEventListener('submit', evt => {
    evt.preventDefault();

    const userName = regForm.querySelector('.name').value;
    const email = regForm.querySelector('.email').value;
    const password = regForm.querySelector('.password').value;
    regNewUser(email, password)
        .then(() => {
            const user = new User(userName, email, password);
            User.addUser(user, email.replace(/\./g, ''))
                .then(() => {
                    localStorage.clear();
                    localStorage.setItem('user', JSON.stringify(user));
                    location.reload();
                })
        })
})