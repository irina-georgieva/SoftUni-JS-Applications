window.addEventListener('load', () => {
    let userView = document.getElementById('user');
    let guestView = document.getElementById('guest');
    let logoutBtn = document.getElementById('logoutBtn');

    if (sessionStorage.getItem('token')) {
        userView.style.display = 'inline-block';
        guestView.style.display = 'none';
        logoutBtn.addEventListener('click', logout);
    } else {
        userView.style.display = 'none';
        guestView.style.display = 'inline-block';
    }
});

async function logout() {
    const url = 'http://localhost:3030/users/logout';
    await fetch(url, {
        method: 'get',
        headers: {
            'X-Authorization': sessionStorage.getItem('token')
        },
    });
    sessionStorage.removeItem('token');
    window.location = '/login.html';
}