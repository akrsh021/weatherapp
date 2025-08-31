// Weather App by Akrahit Sharma
// Unique features: animated backgrounds, cloud/rain/snow, sunshine animation

const apiKey = "55b95fd4005ca6fdc40ae0f8ef78f5be";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const weatherDisplay = document.getElementById("weatherDisplay");
const background = document.getElementById("background");

// Fetch weather by city name
async function fetchWeather(city) {
    resetWeather();
    if (!city) return alert("Enter a city");
    try {
        const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await resp.json();
        if (data.cod !== 200) { 
            alert("City not found"); 
            return; 
        }
        showWeather(data);
    } catch (err) { 
        alert("Error fetching data: " + err.message); 
    }
}

// Fetch weather by coordinates (geolocation)
async function fetchWeatherByCoords(lat, lon) {
    resetWeather();
    try {
        const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await resp.json();
        showWeather(data);
    } catch (err) { 
        alert("Error fetching data: " + err.message); 
    }
}

// Show weather & change background
function showWeather(data) {
    const temp = data.main.temp.toFixed(1);
    const main = data.weather[0].main.toLowerCase();

    removeWeatherAnim();

    let icon = "fas fa-sun";

    if (main.includes("cloud")) { 
        background.style.background = "linear-gradient(to bottom,#bdc3c7,#2c3e50)"; 
        addClouds(); 
        icon = "fas fa-cloud";
    } else if (main.includes("rain") || main.includes("drizzle")) { 
        background.style.background = "linear-gradient(to bottom,#4e54c8,#8f94fb)"; 
        addRain(); 
        icon = "fas fa-cloud-showers-heavy";
    } else if (main.includes("snow")) { 
        background.style.background = "linear-gradient(to bottom,#e0f7fa,#81d4fa)"; 
        addSnow(); 
        icon = "far fa-snowflake";
    } else if (main.includes("thunderstorm")) { 
        background.style.background = "linear-gradient(to bottom,#373b44,#4286f4)"; 
        addRain(); 
        icon = "fas fa-bolt";
    } else { 
        background.style.background = "linear-gradient(to bottom,#87ceeb,#ccefff)"; 
        icon = "fas fa-sun";
    }

    weatherDisplay.innerHTML = `
        <div class="weather-icon"><i class="${icon}"></i></div>
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${data.weather[0].main} - ${data.weather[0].description}</p>
        <p>🌡 Temp: ${temp}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
    `;
    weatherDisplay.classList.remove("hidden");
}

// Animations
function removeWeatherAnim() {
    document.querySelectorAll(".cloud, .rain-drop, .snowflake").forEach(el => el.remove());
}
function addClouds() { for (let i = 0; i < 5; i++) { let cloud = document.createElement("div"); cloud.className = "cloud"; cloud.style.top = `${Math.random() * 50 + 10}%`; cloud.style.animationDuration = `${Math.random() * 30 + 20}s`; background.appendChild(cloud); } }
function addRain() { for (let i = 0; i < 50; i++) { let drop = document.createElement("div"); drop.className = "rain-drop"; drop.style.left = `${Math.random() * 100}%`; drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`; background.appendChild(drop); } }
function addSnow() { for (let i = 0; i < 50; i++) { let snow = document.createElement("div"); snow.className = "snowflake"; snow.style.left = `${Math.random() * 100}%`; snow.style.animationDuration = `${Math.random() * 5 + 3}s`; snow.textContent = "❄"; background.appendChild(snow); } }
function resetWeather() { weatherDisplay.classList.add("hidden"); removeWeatherAnim(); }

// Event Listeners
searchBtn.addEventListener("click", () => { fetchWeather(cityInput.value.trim()); });
cityInput.addEventListener("keyup", e => { if (e.key === "Enter") searchBtn.click(); });
locBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
            () => alert("Location denied")
        );
    }
});
