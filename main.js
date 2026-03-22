/**
 * MyDashboard - v1.3 (v2.2.0 Optimized)
 * Restores Sensei Release UI Features with XSS Protection
 */

// DASHBOARD VERSION: v1.3 
// Date: 22.03.2026
// Time: 19:22:45

// ‼️ STEP 1: Precision LED Clock Logic
function updateClock() {
    const now = new Date();
    const clockMain = document.getElementById("clock-main") || document.querySelector(".clock-main");
    const clockMs = document.getElementById("clock-ms") || document.querySelector(".clock-ms");
    const dateLabel = document.getElementById("clock-date") || document.querySelector(".clock-date");

    if (clockMain) {
        clockMain.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
    }
    if (clockMs) {
        // High-speed milliseconds for that tactical look
        clockMs.textContent = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    }
    if (dateLabel) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        dateLabel.textContent = now.toLocaleDateString('en-GB', options).toUpperCase() + " - GMT+1";
    }
}

// ‼️ STEP 2: Horizontal Day Bar Generator
function generateDayBar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; 
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() + i);
        
        const dayBtn = document.createElement('button');
        // i === 0 sets today as the active 'pill'
        dayBtn.className = i === 0 ? 'day-btn active' : 'day-btn';
        dayBtn.textContent = `${days[d.getDay()]} ${d.getDate()}`;
        
        dayBtn.onclick = (e) => {
            e.preventDefault();
            container.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            dayBtn.classList.add('active');
        };
        container.appendChild(dayBtn);
    }
}

// ‼️ STEP 3: Feature Initializers (Tasks & Weather)
function initStaticFeatures() {
    // Set Weather (Matches your Ingolstadt screenshot)
    const temp = document.querySelector(".temp-big");
    const city = document.querySelector(".weather-city");
    if (temp) temp.textContent = "8°";
    if (city) city.textContent = "INGOLSTADT";

    // Set Uncompleted Tasks count
    const taskCount = document.querySelector(".uncompleted-count") || document.querySelector(".task-count");
    if (taskCount) taskCount.textContent = "1";
}

// ‼️ STEP 4: System Start
document.addEventListener("DOMContentLoaded", () => {
    console.log("Sensei v2.2.0: Booting system...");
    
    // Start Clock
    setInterval(updateClock, 50);
    updateClock();

    // Generate Day Bars for Reminders and Calendar
    generateDayBar("reminders-days"); 
    generateDayBar("calendar-days");

    // Load static UI data
    initStaticFeatures();
    
    console.log("Sensei v2.2.0: System Online.");
});
