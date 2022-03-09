window.addEventListener('load', async () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', onRegister);
});

async function onRegister(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    try {
        const url = 'http://localhost:3030/users/register';
        const res = await fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok || res.status != 200) {
            const error = await res.json();
            form.reset();
            throw new Error(error.message);
        }

        const result = await res.json();

        sessionStorage.setItem('token', result.accessToken);
        window.location.pathname = '/index.html';

    } catch (err) {
        alert(err.message);
    }
}

