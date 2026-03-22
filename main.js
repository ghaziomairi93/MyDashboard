/* 
  ================================================================
  ‼️ STEP 1: CONFIGURATION & CONSTANTS
  ================================================================
*/
const G_CLIENT_ID = 'YOUR_GOOGLE_ID';
const MS_CLIENT_ID = 'YOUR_MS_ID';
const QUOTES = [
  {q:"The only way to do great work is to love what you do.",a:"Steve Jobs",y:"2005"},
  // ... include all 30 quotes from source
];

let tasks = JSON.parse(localStorage.getItem('v17_tasks')) || [];
let googleToken = null;
let cdTimer = null;

/* 
  ================================================================
  ‼️ STEP 2: CORE INITIALIZATION (window.onload)
  ================================================================
*/
window.onload = async () => {
    stampVersion();
    initLocation();
    renderDayBars();
    renderTasks();
    initCountdown();
    initQuote();
    requestAnimationFrame(updateClock);
    
    // Handle MS OAuth Redirects
    const params = new URLSearchParams(window.location.search);
    if(params.get('code')) await exchangeMSCode(params.get('code'));
};

/* 
  ================================================================
  ‼️ STEP 3: SMART COUNTDOWN LOGIC
  ================================================================
*/
function renderCountdown(cdData) {
    if(cdTimer) clearInterval(cdTimer);
    const area = document.getElementById('cd-display-area');
    
    function update() {
        const diff = cdData.target - Date.now();
        if(diff <= 0) {
            area.innerHTML = `<div>🎉 ${cdData.name} Arrived!</div>`;
            clearInterval(cdTimer); return;
        }
        
        const totalSecs = Math.floor(diff/1000);
        // ‼️ Logic: If < 24h, show HH:MM:SS ticker (1s interval)
        if(totalSecs <= 86399) {
            const hh = Math.floor(totalSecs / 3600);
            const mm = Math.floor((totalSecs % 3600) / 60);
            const ss = totalSecs % 60;
            area.innerHTML = `<div class="led-main">${hh}:${mm}:${ss}</div>`;
            resetTimer(1000);
        } else {
            // ‼️ Logic: If > 24h, show Days/Hours only (60s interval)
            const days = Math.floor(totalSecs / 86400);
            area.innerHTML = `<div>${days} Days Remaining</div>`;
            resetTimer(60000);
        }
    }
    update();
}

/* 
  ================================================================
  ‼️ STEP 4: AUTH & API HANDLING (PKCE & GSI)
  ================================================================
*/
function getSafeToken(key) {
    const t = localStorage.getItem(key);
    if(!t || t.length < 10) return null;
    return t; // Basic validation check logic
}

async function startMSLogin() {
    // ‼️ Implementation of PKCE flow without external libraries
}
