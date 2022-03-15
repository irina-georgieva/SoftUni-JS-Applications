import { showView } from './dom.js';
import { showHome } from './home.js';

const section = document.getElementById('edit-movie');
const form = section.querySelector('form');
section.remove();

export async function showEdit(event) {
    event.preventDefault();

    const id = event.target.getAttribute('data-id');
    const url = 'http://localhost:3030/data/movies/' + id;
    const res = await fetch(url);
    const data = await res.json();

    section.querySelector('[name="title"]').value = data.title;
    section.querySelector('[name="description"]').value = data.description;
    section.querySelector('[name="imageUrl"]').value = data.img;

    form.addEventListener('submit', editMovie);

    async function editMovie(event) {
        event.preventDefault();
        const formData = new FormData(form);

        let title = formData.get('title');
        let description = formData.get('description');
        let img = formData.get('imageUrl');

        try {
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            const response = await fetch('http://localhost:3030/data/movies/' + id, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': userData.token
                },
                body: JSON.stringify({ title, description, img })
            });

            if (!response.ok || response.status != 200) {
                let data = await response.json();
                throw new Error(data.message);
            }

            showHome();

        } catch (error) {
            alert(error.message);
        }
    }

    showView(section);
}