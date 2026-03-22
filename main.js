/**
 * MyDashboard - v1.3 (v2.2.0 Optimized Migration)
 * Focus: XSS Security, High-Density UI, and API Reliability
 */

// DASHBOARD VERSION: v1.3
// Date: 22.03.2026
// Time: 19:15:30

// ‼️ STEP 1: Precision LED Clock & Milliseconds
function updateClock() {
    const now = new Date();
    // Use IDs for precision, Fallback to Classes if IDs are missing
    const clockMain = document.getElementById("clock-main") || document.querySelector(".clock-main");
    const clockMs = document.getElementById("clock-ms") || document.querySelector(".clock-ms");
    const dateLabel = document.getElementById("clock-date") || document.querySelector(".clock-date");

    if (clockMain) {
        clockMain.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
    }
    if (clockMs) {
        clockMs.textContent = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    }
    if (dateLabel) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        dateLabel.textContent = now.toLocaleDateString('en-GB', options).toUpperCase() + " - GMT+1";
    }
}
setInterval(updateClock, 50);

// ‼️ STEP 2: Horizontal Day Bar Generator (v2.1.8 Layout)
function generateDayBar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear for fresh render
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() + i);
        
        const dayBtn = document.createElement('button');
        dayBtn.className = i === 0 ? 'day-btn active' : 'day-btn';
        
        // Structure: "Fri 20"
        dayBtn.textContent = `${days[d.getDay()]} ${d.getDate()}`;
        
        dayBtn.onclick = () => {
            container.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            dayBtn.classList.add('active');
            console.log(`Switched to date: ${d.toDateString()}`);
        };
        container.appendChild(dayBtn);
    }
}

// ‼️ STEP 3: Initializing Widgets
document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    // Assuming your HTML has these IDs for the scrolling bars
    generateDayBar("reminders-days"); 
    generateDayBar("calendar-days");
    
    console.log("Sensei v2.2.0 Logic: ACTIVE");
});

