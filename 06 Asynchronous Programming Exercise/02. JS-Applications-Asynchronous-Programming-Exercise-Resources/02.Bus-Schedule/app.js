function solve() {
    const label = document.querySelector('#info span');
    const deparBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    let stop = {
        next: 'depot'
    };

    async function depart() {
        deparBtn.disabled = true;

        const url = `http://localhost:3030/jsonstore/bus/schedule/${stop.next}`;
        const res = await fetch(url);
        stop = await res.json();

        label.textContent = `Next stop ${stop.name}`;

        arriveBtn.disabled = false;
    }

    function arrive() {
        label.textContent = `Arriving at ${stop.name}`;

        deparBtn.disabled = false;
        arriveBtn.disabled = true;

    }

    return {
        depart,
        arrive
    };
}

let result = solve();
