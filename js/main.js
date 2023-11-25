
//Get city coordinates from JSON file
const cityJSON = [];
$.getJSON("city_coordinates.json", function(data) {
    let i = 0;
    data.forEach(e => {
        document.getElementById("select-location").innerHTML += `<option value=${i}>${e.city}, ${e.country}</option>`;
        i++;
        cityJSON.push(e);
    });
});

function getWeather() {
    //Get selected location
    const element = document.getElementById("select-location");
    const selectedCity = cityJSON[element.value];
    //Display currently selected location
    document.getElementById("location-info").innerHTML =
    `<b>City: </b> ${selectedCity.city},
    <b>Country: </b> ${selectedCity.country},
    <b>Longitude: </b> ${selectedCity.longitude},
    <b>Latitude: </b> ${selectedCity.latitude}`;
    //Options for 7timer API call
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    //Get request from 7Timer API
    fetch(`http://www.7timer.info/bin/api.pl?lon=${selectedCity.longitude}&lat=${selectedCity.latitude}&product=civillight&output=json`, requestOptions)
    .then(response => response.text())
    .then(result => {
        const weatherdata = JSON.parse(result);
        console.log(weatherdata);
        generateCards(weatherdata)
    })
    .catch(error => console.log('error', error));
}

function generateCards(data) {
    const doFahrenheit = document.getElementById("fahrenheit-toggle").checked;
    document.getElementById("weather-cards").innerHTML = "";
    data.dataseries.forEach(e => {
        //Format data
        const date = e.date.toString();
        const datestring = date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8);
        const fulldate = new Date(datestring);
        let tempMax = e.temp2m.max;
        let tempMin = e.temp2m.min;
        if (doFahrenheit) {
            tempMax = Math.floor(e.temp2m.max * (9/5) + 32);
            tempMin = Math.floor(e.temp2m.min * (9/5) + 32);
        }
        //Add card to document
        document.getElementById("weather-cards").innerHTML +=
            `<div class="col-auto g-2 m-2 text-center" style="min-width:220px">
                <div class="card shadow border-0">
                    <div class="card-header bg-info border-0"> <b> ${fulldate.toDateString()} </b> </div>
                    <div class="card-footer border-0 bg-info-subtle">
                        <b>Weather</b>: ${e.weather} <br>
                        <img src="images/${e.weather}.png" alt="${e.weather}"> <br>
                        <b>High</b>: ${tempMax} ${doFahrenheit ? " °F" : " °C"} <br>
                        <b>Low</b>: ${tempMin} ${doFahrenheit ? " °F" : " °C"} <br>
                    </div>
                </div>
            </div>`;
    });
}