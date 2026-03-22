/**
 * MyDashboard - v1.3 Logic Core
 * Handles Modals, Countdown, and API Placeholders
 */

// ‼️ STEP 1: Clock Logic
function updateClock() {
    const now = new Date();
    const clockMain = document.getElementById("clock-main");
    const clockMs = document.getElementById("clock-ms");
    if (clockMain) clockMain.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
    if (clockMs) clockMs.textContent = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
}
setInterval(updateClock, 50);

// ‼️ STEP 2: Modal Handling
function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// ‼️ STEP 3: Countdown Logic
function saveCountdown() {
    const title = document.getElementById("new-event-title").value;
    const date = document.getElementById("new-event-date").value;
    
    if (title) document.getElementById("event-title-display").textContent = title;
    // Note: In a real app, you'd calculate the difference here.
    closeModal('countdown-modal');
    alert("Event Saved!");
}

// ‼️ STEP 4: Auth Placeholders (Google/Outlook)
function handleGoogleLogin() {
    console.log("Redirecting to Google OAuth...");
    alert("Connecting to Google Calendar...");
}

function handleOutlookLogin() {
    console.log("Redirecting to Microsoft OAuth...");
    alert("Connecting to Outlook Inbox...");
}

function submitSupport() {
    alert("Support message sent successfully!");
    closeModal('support-modal');
}

// ‼️ STEP 5: Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Generate Day Bars
    const containers = ["reminders-days", "calendar-days"];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (let i = 0; i < 7; i++) {
            const btn = document.createElement("button");
            btn.className = i === 0 ? "day-btn active" : "day-btn";
            btn.textContent = days[i];
            el.appendChild(btn);
        }
    });
});
