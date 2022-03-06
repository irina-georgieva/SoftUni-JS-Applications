async function lockedProfile() {

    const url = 'http://localhost:3030/jsonstore/advanced/profiles';
    const res = await fetch(url);
    const data = await res.json();

    const mainEl = document.getElementById('main');
    mainEl.replaceChildren();

    Object.entries(data).forEach(p => {
        const divEl = document.createElement('div');
        divEl.classList.add("profile");
        divEl.innerHTML = `<img src="./iconProfile2.png" class="userIcon" />
        <label>Lock</label>
        <input type="radio" name="user1Locked" value="lock" checked>
        <label>Unlock</label>
        <input type="radio" name="user1Locked" value="unlock"><br><hr>
        <label>Username</label><input type="text" name="user1Username" value=${p[1].username} disabled readonly />
        <div class="hiddenInfo"><hr><label>Email:</label>
        <input type="email" name="user1Email" value=${p[1].email} disabled readonly />
        <label>Age:</label>
        <input type="email" name="user1Age" value=${p[1].age} disabled readonly />
        </div>
        <button>Show more</button>`;

        const lockBox = divEl.querySelector('[value=lock]');
        const button = divEl.querySelector('button');
        const hiddenElLabel = divEl.querySelectorAll('.hiddenInfo label');
        const hiddenElInput = divEl.querySelectorAll('.hiddenInfo input');

        button.addEventListener('click', function () {

            if (lockBox.checked == false) {

                hiddenElLabel.forEach(el =>{
                    el.style.display = 'block';
                })
                hiddenElInput.forEach(el => {
                    el.style.display = 'block';
                })
            }
        });

        mainEl.appendChild(divEl);
    })

}