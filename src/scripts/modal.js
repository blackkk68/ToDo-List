import { User } from './auth';

export function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'hidden');
    modal.innerHTML = `
    <div class="modal-overlay" data-close="close">
        <div class="modal-window">
        <span class="cross"></span>
            <div class="modal-container">
                <div class="modal-auth">
                    <h2>Авторизация</h2>
                    <p class="error hidden">Не верный логин и/или пароль</p>
                    <form class="form auth-form" action="#" method="post">
                        <input type="email" name="email" class="email" placeholder="Email" required>
                        <input type="password" name="password" class="password" placeholder="Пароль" required minlength="6">
                        <input type="submit" class="submit-btn" value="Войти">
                    </form>
                    <p>Нет аккаунта? <a href="#" class="registration">Зарегистрироваться</a></p>
                </div>
                <div class="modal-reg">
                    <h2>Регистрация</h2>
                    <p class="error hidden">Не верный логин и/или пароль</p>
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
createModal();

const modal = document.querySelector('.modal');
const modalContainer = modal.querySelector('.modal-container');
const registration = modal.querySelector('.registration');
const signIn = modal.querySelector('.sign-in');
const regForm = modalContainer.querySelector('.reg-form');
const authForm = modalContainer.querySelector('.auth-form');

export class Modal {
    static open() {
        modal.classList.remove('hidden');
        modal.classList.remove('hide');
        setTimeout(() => {
            modal.classList.add('open');
        }, 20);
    }

    static close() {
        modal.classList.remove('open');
        modal.classList.add('hide');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200)
    }

    static delete() {
        modal.remove();
    }
}

document.addEventListener('click', evt => {
    if (evt.target.dataset.close) {
        Modal.close();
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

    const email = authForm.querySelector('.email').value.toLowerCase();
    const password = authForm.querySelector('.password').value;
    const error = modalContainer.querySelector('.error');
    User.auth(email, password)
        .catch(err => console.log(err))
        .then(token => {
            if (token != undefined) {
                User.getFromBase(token, email.replace(/\./g, ''))
                    .then(response => {
                        let user = Object.values(response)[0];
                        user.token = token;
                        localStorage.clear();
                        localStorage.setItem('user', JSON.stringify(user));
                        location.reload();
                    })
            } else {
                error.classList.remove('hidden');
            }
        });
});

regForm.addEventListener('submit', evt => {
    evt.preventDefault();

    const userName = regForm.querySelector('.name').value;
    const email = regForm.querySelector('.email').value.toLowerCase();
    const password = regForm.querySelector('.password').value;
    User.regNew(email, password)
        .then(() => {
            const user = new User(userName, email, password);
            User.addToBase(user, email.replace(/\./g, ''))
                .then(() => {
                    localStorage.clear();
                    localStorage.setItem('user', JSON.stringify(user));
                    location.reload();
                })
        })
})

const cross = modal.querySelector('.cross');
cross.addEventListener('click', () => Modal.close());