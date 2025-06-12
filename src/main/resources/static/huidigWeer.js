"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('huidig-weer-container');
    if (!container) return;

    const getWeatherButton = container.querySelector('#getWeather');
    const loaderElement = container.querySelector('#loader');
    const weatherDataElement = container.querySelector('#weather-data');
    const cachedNoticeElement = container.querySelector('#cached-notice');
    const weatherWarningElement = container.querySelector('#weather-warning');
    const apiKey = '058600f0298df0d6e6a61940b383e959';

    const toggleLoader = (show) => {
        if (loaderElement) loaderElement.style.display = show ? 'block' : 'none';
    };

    const displayWeather = (weatherData, fromCache = false) => {
        const date = new Date(weatherData.dt * 1000).toLocaleString();
        const weatherHtml = `
            <h3>${weatherData.name}</h3>
            <p><strong>Temperatuur:</strong> ${Math.round(weatherData.main.temp)}°C</p>
            <p><strong>Weersomstandigheden:</strong> ${weatherData.weather[0].description}</p>
            <p><strong>Luchtvochtigheid:</strong> ${weatherData.main.humidity}%</p>
            <p><strong>Windsnelheid:</strong> ${weatherData.wind.speed} m/s</p>
            <p><strong>Laatst bijgewerkt:</strong> ${date}</p>
        `;
        if (weatherDataElement) weatherDataElement.innerHTML = weatherHtml;
        if (cachedNoticeElement)
            cachedNoticeElement.textContent = fromCache ? 'Gegevens zijn van cache. Nieuwe gegevens worden opgehaald...' : '';
    };

    const displayWarning = (weatherData) => {
        let warning = '';
        if (weatherData.rain && (weatherData.rain["1h"] >= 10 || weatherData.rain["3h"] >= 30)) {
            warning += `⚠️ Zware regenval op jouw locatie! `;
        }
        if (weatherData.wind && weatherData.wind.speed >= 15) {
            warning += `⚠️ Zeer sterke wind! `;
        }
        if (weatherWarningElement)
            weatherWarningElement.innerHTML = warning
                ? `<div class="huidig-weer-waarschuwing">${warning}</div>`
                : '';
    };

    const fetchWeather = async (lat, lon) => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=nl`);
        if (!response.ok) throw new Error(`API fout: ${response.status}`);
        return await response.json();
    };

    const getWeather = async () => {
        toggleLoader(true);
        const cachedWeatherData = localStorage.getItem('weatherData');
        if (cachedWeatherData) {
            displayWeather(JSON.parse(cachedWeatherData), true);
            displayWarning(JSON.parse(cachedWeatherData));
        }
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });
            const { latitude, longitude } = position.coords;
            const weatherData = await fetchWeather(latitude, longitude);
            localStorage.setItem('weatherData', JSON.stringify(weatherData));
            displayWeather(weatherData, false);
            displayWarning(weatherData);
        } catch (error) {
            let errorMessage = "Er is een fout opgetreden bij het ophalen van het weer.";
            if (error.code === 1) {
                errorMessage = "Locatietoegang geweigerd. Sta locatietoegang toe om het weer voor jouw locatie te zien.";
            } else if (error.code === 2) {
                errorMessage = "Locatie niet beschikbaar. Probeer het later opnieuw.";
            } else if (error.code === 3) {
                errorMessage = "Time-out bij het ophalen van de locatie. Probeer het opnieuw.";
            }
            if (weatherDataElement) weatherDataElement.innerHTML = `<p class="error">${errorMessage}</p>`;
            if (weatherWarningElement) weatherWarningElement.innerHTML = '';
        } finally {
            toggleLoader(false);
        }
    };

    if (getWeatherButton) {
        getWeatherButton.addEventListener('click', getWeather);
    }

    // Toon bij laden van de pagina direct gecachte gegevens (indien aanwezig)
    const cachedWeatherData = localStorage.getItem('weatherData');
    if (cachedWeatherData) {
        displayWeather(JSON.parse(cachedWeatherData), true);
        displayWarning(JSON.parse(cachedWeatherData));
        // Haal direct nieuwe data op na tonen cache
        if (getWeatherButton) getWeather();
    }
});
