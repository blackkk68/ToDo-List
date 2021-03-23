class FetchTask {
    static create(task, email, token) {
        return fetch(`https://to-do-list-with-auth-default-rtdb.firebaseio.com/tasks/${email}.json?auth=${token}`, {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                task.id = response.name;
                return task;
            })
    }

    static authAndGet(token, email) {
        return fetch(`https://to-do-list-with-auth-default-rtdb.firebaseio.com/tasks/${email}.json?auth=${token}`)
            .then(response => response.json())
    }

    static delete(email, id, token) {
        return fetch(`https://to-do-list-with-auth-default-rtdb.firebaseio.com/tasks/${email}/${id}.json?auth=${token}`, {
            method: 'DELETE'
        })
    }

    static patch(email, id, token, task) {
        return fetch(`https://to-do-list-with-auth-default-rtdb.firebaseio.com/tasks/${email}/${id}.json?auth=${token}`, {
            method: 'PATCH',
            body: JSON.stringify(task),
            headers: {
                'Content-type': 'application/json'
            }
        })
    }
}

class User {
    constructor(userName, email, password) {
        this.name = userName,
            this.email = email,
            this.password = password,
            this.id = `${new Date().getTime()}`
    }

    static addUser(user, email) {
        return fetch(`https://to-do-list-with-auth-default-rtdb.firebaseio.com/users/${email}.json`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json'
            }
        })
    }

    static getUser(token, email) {
        return fetch(`https://to-do-list-with-auth-default-rtdb.firebaseio.com/users/${email}.json?auth=${token}`, {
            method: 'GET'
        })
            .then(response => response.json())
    }
}

function authUser(email, password) {
    const apiKey = "AIzaSyDRC6hmVP842U45qZK8XxsZahElFPHM0Zc";
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            email, password,
            returnSecureToken: true
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => data.idToken)
}

function regNewUser(email, password) {
    const apiKey = "AIzaSyDRC6hmVP842U45qZK8XxsZahElFPHM0Zc";
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            email, password,
            returnSecureToken: true
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => data.idToken)
}

const leave = document.querySelector('.leave');
leave.addEventListener('click', evt => {
    evt.preventDefault();
    localStorage.removeItem('user');
    location.reload();
})