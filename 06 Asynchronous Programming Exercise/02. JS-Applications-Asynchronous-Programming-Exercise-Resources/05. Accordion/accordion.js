async function solution() {
    const mainEl = document.getElementById('main');

    const url = 'http://localhost:3030/jsonstore/advanced/articles/list';
    const res = await fetch(url);
    const data = await res.json();

    Object.entries(data).forEach(a => {
        const divEl = document.createElement('div');
        divEl.classList.add("accordion");
        divEl.innerHTML = `<div class="accordion">
        <div class="head">
        <span>${a[1].title}</span>
        <button class="button" id=${a[1]._id}>More</button>
        </div>
        <div class="extra">
        <p></p>
        </div>
        </div>`;

        const button = divEl.querySelector('button');
        const pEl = divEl.querySelector('p');
        const extraContent = divEl.querySelector('.extra');
        let isContentHidden = true;

        button.addEventListener('click', async function () {
            if (isContentHidden) {
                const content = await getContent(a[1]._id)
                button.textContent = "Less"

                pEl.textContent = content;
                extraContent.style.display = 'block';

                isContentHidden = false;
            } else {
                button.textContent = "More"
                extraContent.style.display = 'none';
                isContentHidden = true;
            };

        });

        mainEl.appendChild(divEl);
    })
};

solution();

async function getContent(id) {
    const url = 'http://localhost:3030/jsonstore/advanced/articles/details/' + id;

    const res = await fetch(url);
    const data = await res.json();

    return data.content;
}

