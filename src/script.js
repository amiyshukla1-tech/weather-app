// CONFIG
const API_KEY = '6NYKACSJPRC8NCA5BKRVU2B2T';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

// DOM REFERENCES
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const refreshBtn = document.getElementById('refresh-btn');

const locationEl = document.getElementById('location');
const conditionEl = document.getElementById('condition');
const tempEl = document.getElementById('temperature');
const windEl = document.getElementById('wind');
const rainEl = document.getElementById('rain');

const previousHoursContainer = document.querySelector('#previous-hours > div');
const futureHoursContainer = document.querySelector('#future-hours > div');

// STATE
let lastSearchedLocation = '';

// FUNCTIONS
async function fetchWeather(location) {
    const url = `${BASE_URL}/${encodeURIComponent(location)}/yesterday/tomorrow?unitGroup=metric&include=hours,current,days&key=${API_KEY}&contentType=json`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather data not found for "${location}". (Status: ${response.status})`);
    }

    return await response.json();
}

function updateCurrentWeather(data) {
    const current = data.currentConditions;

    locationEl.textContent = data.resolvedAddress;
    conditionEl.textContent = current.conditions;
    tempEl.textContent = `${Math.round(current.temp)}°C`;
    windEl.textContent = `${Math.round(current.windspeed)} km/h`;
    rainEl.textContent = `${Math.round(current.precipprob ?? 0)}%`;
}
