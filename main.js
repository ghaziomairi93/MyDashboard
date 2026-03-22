/* 
  ================================================================
  ‼️ STEP 1: STATE MANAGEMENT
  ================================================================
*/
let state = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    event: JSON.parse(localStorage.getItem('targetEvent')) || null,
    weather: { temp: 0, city: 'Ingolstadt' }
};

/* 
  ================================================================
  ‼️ STEP 2: CORE TICKER (CLOCK & COUNTDOWN)
  ================================================================
*/
function startTick() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('live-clock').innerText = now.toLocaleTimeString();
        
        if (state.event) {
            updateCountdown(state.event);
        }
    }, 1000);
}

function updateCountdown(targetDate) {
    const diff = new Date(targetDate) - new Date();
    const display = document.getElementById('cd-timer');
    
    if (diff <= 0) {
        display.innerText = "EVENT STARTED";
        return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    
    // ‼️ Logic: If more than 24h, show days, else show HMS
    display.innerText = h > 24 ? `${Math.floor(h/24)}d ${h%24}h` : `${h}:${m}:${s}`;
}

/* 
  ================================================================
  ‼️ STEP 3: WEATHER LOGIC (Open-Meteo)
  ================================================================
*/
async function updateWeather() {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=48.76&longitude=11.42&current_weather=true`);
        const data = await res.json();
        document.getElementById('temp-display').innerText = `${data.current_weather.temperature}°C`;
        document.getElementById('weather-desc').innerText = "Clear Skies";
    } catch (e) {
        console.error("Weather failed");
    }
}

/* 
  ================================================================
  ‼️ STEP 4: UTILS & DATA DESTRUCTION
  ================================================================
*/
function nukeStorage() {
    if(confirm("Wipe all local data?")) {
        localStorage.clear();
        location.reload();
    }
}

function addTask() {
    const input = document.getElementById('task-in');
    if(!input.value) return;
    state.tasks.push(input.value);
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    input.value = '';
    renderTasks();
}

window.onload = () => {
    startTick();
    updateWeather();
    // ‼️ Initial render logic
};
