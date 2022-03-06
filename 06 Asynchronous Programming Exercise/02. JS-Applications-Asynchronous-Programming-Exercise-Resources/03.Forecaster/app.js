function attachEvents() {

    document.getElementById('submit').addEventListener('click', getForecast);
}

attachEvents();

async function getForecast() {
    let cityName = document.getElementById('location').value;
    const divForecast = document.getElementById('forecast');
    divForecast.style.display = 'block';

    const code = await getLocationCode(cityName);

    const [current, upcoming] = await Promise.all([
        getCurrent(code),
        getUpcomming(code)
    ]);

    const currentForecast = current.forecast;
    let condition = '';

    if(currentForecast.condition == 'Sunny'){
        condition = "&#x2600;"
    } else if(currentForecast.condition == 'Partly sunny'){
        condition = "&#x26C5;"
    }else if(currentForecast.condition == 'Overcast'){
        condition = "&#x2601;"
    }else if(currentForecast.condition == 'Rain'){
        condition = "&#x2614;"
    }

    const currentDiv = document.getElementById('current')
    
    const divElementCurrent = document.createElement('div');
    divElementCurrent.classList.add('forecasts');
    divElementCurrent.innerHTML = `<span class="condition symbol">${condition}</span>`;
    
    const spanElement = document.createElement('span');
    spanElement.classList.add("condition");
    spanElement.innerHTML = `<span class="forecast-data">${current.name}</span>
    <span class="forecast-data">${currentForecast.high}&#176;${currentForecast.low}&#176;</span>
    <span class="forecast-data">${currentForecast.condition}</span>`;
    divElementCurrent.appendChild(spanElement);
    
    currentDiv.appendChild(divElementCurrent);
    
    const upcomingDiv = document.getElementById('upcoming');

    const divElementUpcoming = document.createElement('div');
    divElementUpcoming.classList.add('forecast-info');
    Object.values(upcoming.forecast).forEach(obj =>{
        let condition = '';

        if(obj.condition == 'Sunny'){
            condition = "&#x2600;"
        } else if(obj.condition == 'Partly sunny'){
            condition = "&#x26C5;"
        }else if(obj.condition == 'Overcast'){
            condition = "&#x2601;"
        }else if(obj.condition == 'Rain'){
            condition = "&#x2614;"
        }

        const spanElementUpcoming = document.createElement('span');
        spanElementUpcoming.classList.add("upcoming");
        spanElementUpcoming.innerHTML = `<span class="symbol">${condition}</span>
        <span class="forecast-data">${obj.high}&#176;${obj.low}&#176;</span>
        <span class="forecast-data">${obj.condition}</span>`;

        divElementUpcoming.appendChild(spanElementUpcoming);    
    });
    upcomingDiv.appendChild(divElementUpcoming);
}

async function getLocationCode(name) {
    const divForecast = document.getElementById('forecast');
    divForecast.style.display = 'block';

    const url = 'http://localhost:3030/jsonstore/forecaster/locations';

    try {
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error('Stop ID not found');
        }
        const data = await res.json();

        const location = data.find(l => l.name == name);

        return location.code;
    } catch (error) {
        divForecast.textContent = 'Error';
    }
}

async function getCurrent(code) {
    const url = 'http://localhost:3030/jsonstore/forecaster/today/' + code;
    const res = await fetch(url);
    const data = await res.json();

    return data;
}

async function getUpcomming(code) {
    const url = 'http://localhost:3030/jsonstore/forecaster/upcoming/' + code;
    const res = await fetch(url);
    const data = await res.json();

    return data;
}