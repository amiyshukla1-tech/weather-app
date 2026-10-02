// CONFIG
const CACHE_PREFIX = 'weather_cache_';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// DOM REFERENCES
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const refreshBtn = document.getElementById('refresh-btn');
const suggestionsList = document.getElementById('suggestions-list');

const refreshModal = document.getElementById('refresh-modal');
const refreshModalMessage = document.getElementById('refresh-modal-message');
const confirmRefreshBtn = document.getElementById('confirm-refresh-btn');

const locationEl = document.getElementById('location');
const conditionEl = document.getElementById('condition');
const tempEl = document.getElementById('temperature');
const weatherIconEl = document.getElementById('weather-icon');
const windEl = document.getElementById('wind');
const rainEl = document.getElementById('rain');

const previousHoursContainer = document.querySelector('#previous-hours > div');
const futureHoursContainer = document.querySelector('#future-hours > div');

// STATE
let lastSearchedLocation = '';
let debounceTimer = null;

// CACHE HELPERS
function getCachedWeather(location) {
    try {
        const key = `${CACHE_PREFIX}${location.trim().toLowerCase()}`;
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const cached = JSON.parse(raw);
        if (!cached || !cached.timestamp || !cached.data) return null;

        const isExpired = Date.now() - cached.timestamp > CACHE_TTL_MS;
        if (isExpired) {
            localStorage.removeItem(key);
            return null;
        }

        return cached.data;
    } catch {
        return null;
    }
}

function setCachedWeather(location, data) {
    try {
        const key = `${CACHE_PREFIX}${location.trim().toLowerCase()}`;
        const payload = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem(key, JSON.stringify(payload));
    } catch {
        // Gracefully ignore storage quota or private browsing limits
    }
}

// FUNCTIONS
async function fetchWeather(location, forceRefresh = false) {
    // 1. Check valid cache first unless forced refresh requested
    if (!forceRefresh) {
        const cachedData = getCachedWeather(location);
        if (cachedData) {
            return cachedData;
        }
    }

    // 2. Fetch live data via secure serverless proxy
    const proxyUrl = `/api/weather?city=${encodeURIComponent(location)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
        if (response.status === 429) {
            const err = new Error('Weather service limit reached. Please try again later..');
            err.title = 'Weather Limit Reached';
            throw err;
        }
        if (response.status === 400 || response.status === 404) {
            const err = new Error(`We couldn't find weather for "${location}". Please check the spelling and try again.`);
            err.title = 'City Not Found';
            throw err;
        }
        const err = new Error('Oops, something went wrong. Please try again later.');
        err.title = 'Error';
        throw err;
    }

    const data = await response.json();

    // 3. Store fresh data in cache
    setCachedWeather(location, data);

    return data;
}

function getWeatherIcon(icon) {
    if (!icon) return '⛅';
    const name = icon.toLowerCase();
    if (name.includes('thunder')) return '⛈️';
    if (name.includes('snow') || name.includes('sleet') || name.includes('ice') || name.includes('hail')) return '❄️';
    if (name.includes('rain') || name.includes('shower')) return '🌧️';
    if (name.includes('wind')) return '💨';
    if (name.includes('fog')) return '🌫️';
    if (name.includes('partly-cloudy-night')) return '☁️';
    if (name.includes('partly-cloudy-day') || name.includes('partly-cloudy')) return '⛅';
    if (name.includes('cloud') || name.includes('overcast')) return '☁️';
    if (name.includes('clear-night')) return '🌙';
    if (name.includes('clear')) return '☀️';
    return '⛅';
}

function updateCurrentWeather(data) {
    const current = data.currentConditions;

    locationEl.textContent = data.resolvedAddress;
    conditionEl.textContent = current.conditions;
    tempEl.textContent = `${Math.round(current.temp)}°C`;
    windEl.textContent = `${Math.round(current.windspeed)} km/h`;
    rainEl.textContent = `${Math.round(current.precipprob ?? 0)}%`;

    if (weatherIconEl) {
        weatherIconEl.textContent = getWeatherIcon(current.icon);
    }
}

function getPreviousHours(data) {
    const currentEpoch = data.currentConditions.datetimeEpoch;
    const allHours = data.days.flatMap(day => day.hours);
    return allHours.filter(hour => hour.datetimeEpoch < currentEpoch).slice(-24);
}

function getFutureHours(data) {
    const currentEpoch = data.currentConditions.datetimeEpoch;
    const allHours = data.days.flatMap(day => day.hours);
    return allHours.filter(hour => hour.datetimeEpoch >= currentEpoch).slice(0, 24);
}

function renderHourCard(hourData) {
    const time = hourData.datetime.slice(0, 5);
    const temp = Math.round(hourData.temp);
    const rain = Math.round(hourData.precipprob ?? 0);
    const icon = getWeatherIcon(hourData.icon);

    return `
        <div class="min-w-[90px] sm:min-w-[105px] shrink-0 flex flex-col items-center justify-between p-3 rounded-2xl bg-emerald-900/40 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-emerald-900/60 transition-all duration-200 text-center gap-1.5 shadow-md">
            <span class="text-xs font-semibold text-emerald-200/80 tracking-wide">${time}</span>
            <span class="text-2xl my-0.5 select-none drop-shadow">${icon}</span>
            <span class="text-lg font-extrabold text-white">${temp}°C</span>
            <span class="text-[11px] text-white/70 truncate w-full px-1" title="${hourData.conditions}">${hourData.conditions}</span>
            <span class="text-[10px] text-sky-300 font-medium">💧 ${rain}%</span>
        </div>
    `;
}

function renderHourlyList(hoursArray, container) {
    if (!container) return;
    container.innerHTML = hoursArray.map(renderHourCard).join('');
}

function showLoading() {
    searchBtn.disabled = true;
    refreshBtn.disabled = true;
    searchBtn.innerHTML = '<span class="loading loading-spinner loading-xs"></span> Searching...';
}

function hideLoading() {
    searchBtn.disabled = false;
    refreshBtn.disabled = false;
    searchBtn.innerHTML = 'Search';
}

function showError(title, message) {
    const errorModal = document.getElementById('error-modal');
    const errorTitle = document.getElementById('error-title');
    const errorMessage = document.getElementById('error-message');

    if (errorModal && errorTitle && errorMessage) {
        errorTitle.textContent = title || 'Error';
        errorMessage.textContent = message || 'Oops, something went wrong. Please try again later.';
        errorModal.showModal();
    }
}

async function fetchCitySuggestions(query) {
    if (!query || query.length < 2) {
        hideSuggestions();
        return;
    }

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        const response = await fetch(url);
        if (!response.ok) return;

        const data = await response.json();
        if (data.results && data.results.length > 0) {
            renderSuggestions(data.results);
        } else {
            hideSuggestions();
        }
    } catch {
        hideSuggestions();
    }
}

function renderSuggestions(cities) {
    if (!suggestionsList) return;

    suggestionsList.innerHTML = cities.map(city => {
        return `
            <li class="px-4 py-2.5 hover:bg-emerald-900/60 cursor-pointer flex items-center justify-between gap-2 text-sm transition-colors text-white" data-city="${city.name}">
                <div class="flex items-center gap-2 truncate">
                    <span class="text-emerald-400 shrink-0">📍</span>
                    <span class="font-semibold text-white">${city.name}</span>
                    <span class="text-xs text-emerald-200/70 truncate">${city.admin1 ? city.admin1 + ', ' : ''}${city.country}</span>
                </div>
            </li>
        `;
    }).join('');

    suggestionsList.classList.remove('hidden');
}

function hideSuggestions() {
    if (suggestionsList) {
        suggestionsList.classList.add('hidden');
        suggestionsList.innerHTML = '';
    }
}

async function handleSearch(targetLocation, forceRefresh = false) {
    const query = (targetLocation || locationInput.value).trim();
    hideSuggestions();

    if (!query) {
        showError('Location Required', 'Please enter a city or location name.');
        return;
    }

    try {
        showLoading();
        const data = await fetchWeather(query, forceRefresh);

        updateCurrentWeather(data);
        renderHourlyList(getPreviousHours(data), previousHoursContainer);
        renderHourlyList(getFutureHours(data), futureHoursContainer);

        lastSearchedLocation = query;
        locationInput.value = '';
    } catch (error) {
        showError(error.title || 'Error', error.message);
    } finally {
        hideLoading();
    }
}

// EVENT LISTENERS
searchBtn.addEventListener('click', () => handleSearch());

locationInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
    }
});

locationInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchCitySuggestions(locationInput.value.trim());
    }, 300);
});

if (suggestionsList) {
    suggestionsList.addEventListener('click', (e) => {
        const item = e.target.closest('li[data-city]');
        if (item) {
            const city = item.getAttribute('data-city');
            handleSearch(city);
        }
    });
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('section[aria-label="Search Location"]')) {
        hideSuggestions();
    }
});

refreshBtn.addEventListener('click', () => {
    if (!lastSearchedLocation) {
        showError('No Location Selected', 'Please search for a city before refreshing.');
        return;
    }

    if (refreshModal && refreshModalMessage) {
        refreshModalMessage.textContent = `Would you like to fetch fresh live weather data for "${lastSearchedLocation}"?`;
        refreshModal.showModal();
    } else {
        handleSearch(lastSearchedLocation, true);
    }
});

if (confirmRefreshBtn) {
    confirmRefreshBtn.addEventListener('click', () => {
        if (refreshModal) {
            refreshModal.close();
        }
        if (lastSearchedLocation) {
            handleSearch(lastSearchedLocation, true);
        }
    });
}

// INITIAL LOAD
// Disabled auto-fetch on page load to prevent burning daily API quota. 
// Searches are now triggered on-demand by user input.
// handleSearch('London');
