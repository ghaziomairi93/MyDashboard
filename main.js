/* ================================================================
Big Minds Dashboard — main.js
Version: 2.5.0 | Do not edit inline — edit this file only
================================================================ */

// ================================================================
// APP CONFIG — bump APP.version for EVERY deployment
// ================================================================
const APP = {
version:   ‘2.5.0’,
buildDate: ‘2026-03-23’,
name:      ‘Big Minds Dashboard’,
features: {
weatherThemes:    true,
weatherParticles: true,
}
};

// ================================================================
// CONSTANTS
// ================================================================
const G_CLIENT_ID  = ‘623465337664-jf51sn11crs5bs398inc40al4ksjv1rd.apps.googleusercontent.com’;
const MS_CLIENT_ID = ‘1155afdf-d585-48cc-af89-b973843ce21a’;
const MS_REDIRECT  = ‘https://ghaziomairi93.github.io/MyDashboard/’;
const MS_SCOPES    = ‘openid profile User.Read Mail.Read offline_access’;
const MS_AUTH_EP   = ‘https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize’;
const MS_TOKEN_EP  = ‘https://login.microsoftonline.com/consumers/oauth2/v2.0/token’;
const W3F_KEY      = ‘53bad208-02b2-40b6-974b-98f8b68d0439’;

// ================================================================
// CHANGELOG — prepend a new entry here for every release
// ================================================================
const CHANGELOG = [
{ version:‘2.5.0’, label:‘3-File Split’, date:‘23 Mar 2026’, tag:‘current’, items:[
‘Codebase split into index.html + main.js + style.css + .github/workflows/codeql.yml’,
‘Fixed: openAddCalModal hour+1 overflow — clamped to max 23 to prevent invalid time 24:00’,
‘Fixed: resize handler now correctly passes weatherType (rain/snow/etc) to renderScene()’,
‘Fixed: applyTheme() now strips all existing t-* body classes before adding the new one’,
‘style.css: all CSS extracted, tokenised, and formatted for readability’,
‘main.js: all JS extracted, APP config at top, future features are flag-gated’,
‘README.md updated to reflect 3-file architecture and v2.5.0’,
‘CHANGELOG_v2.2.0.md replaced with CHANGELOG.md covering full history’,
]},
{ version:‘2.4.0’, label:‘Bug Fixes’, date:‘23 Mar 2026’, tag:’’, items:[
‘Layout & font sizes tightened — max-width 430px, compact padding for iPhone’,
‘Google Calendar icon rebuilt with clean non-overlapping SVG shapes’,
‘City search: event-listener-based rendering — fixes crash on city names with apostrophes’,
‘City search: debounced 350ms, up to 10 global results with admin region + country’,
‘Greeting: reads hour from activeTZ (location timezone) as soon as available’,
‘Weather theme engine: fixed variable scoping issue with activeWeatherTheme’,
‘Weather particles (rain, snow, stars, moon, sun, lightning, fog) reliably render’,
‘APP.version is single source of truth for page title, version tag, changelog badge’,
]},
{ version:‘2.3.0’, label:‘Theme Engine’, date:‘23 Mar 2026’, tag:’’, items:[
‘Dynamic weather theme system — background reflects time-of-day and weather condition’,
‘Night: deep navy/black with animated stars and floating moon’,
‘Dawn/Dusk: warm orange/pink atmospheric gradient’,
‘Day clear: bright sky blue with pulsing sun’,
‘Rain: dark blue-grey with 80 CSS animated raindrops’,
‘Snow: cool dark with 60 CSS animated snowflakes’,
‘Storm: near-black with random lightning flash overlay’,
‘Fog: three drifting layered fog band elements’,
‘Greeting message location-timezone aware’,
‘Changelog rendered from JS data array — new versions need one array entry only’,
]},
{ version:‘2.2.0’, label:‘Design Overhaul’, date:‘23 Mar 2026’, tag:’’, items:[
‘Full visual redesign — dark/techy polished aesthetic’,
‘Typography: Syne (headings), Space Mono (clock/mono), DM Sans (body)’,
‘Multi-accent color system: cyan, amber, green, blue, purple’,
‘Staggered fadeUp entry animations on all cards’,
‘Scanline animation on clock widget’,
‘Noise grain overlay for atmospheric depth’,
‘Modals use blur backdrop + fadeUp entrance’,
]},
{ version:‘2.1.9’, label:“Sensei’s Release”, date:‘20 Mar 2026’, tag:’’, items:[
‘Countdown: ≤24h shows live HH:MM:SS at 1s interval’,
‘Countdown: >24h shows Days + Hours at 60s interval’,
‘Add Event button hidden until Google sign-in’,
]},
{ version:‘2.0.1’, label:‘Hotfix’, date:‘20 Mar 2026’, tag:‘fix’, items:[
‘Fixed IDX14100 JWT malformed token error in Outlook’,
‘Token validator checks JWT structure before every API call’,
‘Auto-recovery: bad token cleared silently, Sign In restored’,
‘401 / InvalidAuthenticationToken handler auto-clears expired session’,
]},
{ version:‘2.0.0’, label:’’, date:‘19 Mar 2026’, tag:’’, items:[
‘PKCE Outlook login stable’,
‘Sessions persist via localStorage across page refresh’,
‘Unread mail count from Microsoft Graph unreadItemCount’,
‘Contact form via Web3Forms API’,
‘Deep links to Google Calendar and Mail apps on mobile’,
]},
{ version:‘1.0.0’, label:‘Initial Release’, date:‘Mar 2026’, tag:‘initial’, items:[
‘Initial concept — static HTML dashboard, no APIs, dummy data’,
‘Single-file architecture, no backend, no build tools’,
‘Hosted on GitHub Pages — ghaziomairi93.github.io/MyDashboard/’,
‘Created by Ghazi Omairi using Claude, ChatGPT, Gemini’,
]},
];

// ================================================================
// QUOTES
// ================================================================
const QUOTES = [
{q:“The only way to do great work is to love what you do.”,a:“Steve Jobs”,y:“2005”},
{q:“In the middle of difficulty lies opportunity.”,a:“Albert Einstein”,y:“~1940s”},
{q:“It does not matter how slowly you go as long as you do not stop.”,a:“Confucius”,y:“~500 BC”},
{q:“Life is what happens when you’re busy making other plans.”,a:“John Lennon”,y:“1980”},
{q:“The future belongs to those who believe in the beauty of their dreams.”,a:“Eleanor Roosevelt”,y:“~1950s”},
{q:“Strive not to be a success, but rather to be of value.”,a:“Albert Einstein”,y:“~1950s”},
{q:“You miss 100% of the shots you don’t take.”,a:“Wayne Gretzky”,y:“~1983”},
{q:“Whether you think you can or you think you can’t, you’re right.”,a:“Henry Ford”,y:“~1940s”},
{q:“I have not failed. I’ve just found 10,000 ways that won’t work.”,a:“Thomas Edison”,y:“~1900s”},
{q:“The only impossible journey is the one you never begin.”,a:“Tony Robbins”,y:“2001”},
{q:“It always seems impossible until it’s done.”,a:“Nelson Mandela”,y:“~1990s”},
{q:“Success is not final, failure is not fatal: it is the courage to continue that counts.”,a:“Winston Churchill”,y:“~1940s”},
{q:“Be the change you wish to see in the world.”,a:“Mahatma Gandhi”,y:“~1913”},
{q:“The way to get started is to quit talking and begin doing.”,a:“Walt Disney”,y:“~1950s”},
{q:“The only limit to our realization of tomorrow will be our doubts of today.”,a:“Franklin D. Roosevelt”,y:“1945”},
{q:“Do what you can, with what you have, where you are.”,a:“Theodore Roosevelt”,y:“~1900s”},
{q:“Believe you can and you’re halfway there.”,a:“Theodore Roosevelt”,y:“~1900s”},
{q:“An unexamined life is not worth living.”,a:“Socrates”,y:“~399 BC”},
{q:“The best time to plant a tree was 20 years ago. The second best time is now.”,a:“Chinese Proverb”,y:””},
{q:“Keep your face always toward the sunshine.”,a:“Walt Whitman”,y:“~1860s”},
{q:“Act as if what you do makes a difference. It does.”,a:“William James”,y:“~1890s”},
{q:“The purpose of our lives is to be happy.”,a:“Dalai Lama”,y:“~1990s”},
{q:“Get busy living or get busy dying.”,a:“Stephen King”,y:“1982”},
{q:“What lies behind us and what lies before us are tiny matters compared to what lies within us.”,a:“Ralph Waldo Emerson”,y:“~1840s”},
{q:“You only live once, but if you do it right, once is enough.”,a:“Mae West”,y:“~1930s”},
];

// ================================================================
// WEATHER CODE MAP (WMO codes → label + theme)
// ================================================================
const WEATHER_META = {
0:{l:‘Clear’,t:‘clear’},        1:{l:‘Mostly Clear’,t:‘clear’},
2:{l:‘Partly Cloudy’,t:‘cloudy’},3:{l:‘Overcast’,t:‘cloudy’},
45:{l:‘Foggy’,t:‘fog’},         48:{l:‘Icy Fog’,t:‘fog’},
51:{l:‘Light Drizzle’,t:‘rain’},53:{l:‘Drizzle’,t:‘rain’},   55:{l:‘Heavy Drizzle’,t:‘rain’},
56:{l:‘Freezing Drizzle’,t:‘snow’},57:{l:‘Freezing Drizzle’,t:‘snow’},
61:{l:‘Light Rain’,t:‘rain’},   63:{l:‘Rain’,t:‘rain’},       65:{l:‘Heavy Rain’,t:‘rain’},
66:{l:‘Freezing Rain’,t:‘snow’},67:{l:‘Freezing Rain’,t:‘snow’},
71:{l:‘Light Snow’,t:‘snow’},   73:{l:‘Snow’,t:‘snow’},       75:{l:‘Heavy Snow’,t:‘snow’},
77:{l:‘Snow Grains’,t:‘snow’},
80:{l:‘Showers’,t:‘rain’},      81:{l:‘Showers’,t:‘rain’},    82:{l:‘Heavy Showers’,t:‘rain’},
85:{l:‘Snow Showers’,t:‘snow’}, 86:{l:‘Heavy Snow Showers’,t:‘snow’},
95:{l:‘Thunderstorm’,t:‘storm’},96:{l:‘Thunderstorm’,t:‘storm’},99:{l:‘Thunderstorm’,t:‘storm’},
};

// ================================================================
// STATE
// ================================================================
let activeTZ          = ‘’;
let selectedDate      = new Date().toDateString();
let tasks             = JSON.parse(localStorage.getItem(‘v17_tasks’)) || [];
let googleToken       = null;
let cdTimer           = null;
let calendarEvents    = [];
let activeWeatherType = ‘’;   // stores the raw weather type: ‘rain’,‘snow’,‘clear’, etc.

// ================================================================
// INIT
// ================================================================
window.onload = async () => {
document.getElementById(‘page-title’).textContent = APP.name + ’ v’ + APP.version;
document.getElementById(‘version-tag’).textContent = ‘v’ + APP.version + ’ \u00b7 ’ + APP.buildDate;

buildChangelog();
initLocation();
renderDayBars();
renderTasks();
requestAnimationFrame(updateClock);
initCountdown();
initQuote();
setPickersToday();

// Wire search input via addEventListener — avoids oninput attribute issues
document.getElementById(‘search-input’).addEventListener(‘input’, e => searchCity(e.target.value));

// MS OAuth redirect callback
const params = new URLSearchParams(window.location.search);
const code = params.get(‘code’);
if (code) { window.history.replaceState({}, ‘’, MS_REDIRECT); await exchangeMSCode(code); return; }

// Restore Google session
const gRaw = getSafeToken(‘google_token’);
if (gRaw) {
googleToken = gRaw;
document.getElementById(‘google-head-btn’).innerHTML =
‘<button class="btn-refresh" onclick="loadCal()">\u21bb Refresh</button>’;
const ab = document.getElementById(‘add-event-btn’);
if (ab) ab.style.display = ‘block’;
loadCal();
} else { loadLocalCalEvents(); }

// Restore MS session
const msRaw = getSafeToken(‘ms_token’);
if (msRaw) {
document.getElementById(‘ms-head-btn’).innerHTML =
‘<button class="btn-refresh" onclick="loadMail()">\u21bb Refresh</button>’;
setTimeout(() => { loadMail(); loadUnreadCount(); }, 300);
} else {
document.getElementById(‘ms-head-btn’).innerHTML =
‘<button class="btn-sign" onclick="startMSLogin()">Sign In</button>’;
document.getElementById(‘ms-body’).innerHTML =
‘<div class="empty">Sign in to see your emails</div>’;
}
};

// ================================================================
// CHANGELOG BUILDER — renders from CHANGELOG array, no manual HTML
// ================================================================
function buildChangelog() {
const container = document.getElementById(‘changelog-body’);
if (!container) return;
const extraTagStyle = { initial: ‘background:rgba(144,112,240,0.12);color:var(–purple)’ };
container.innerHTML = CHANGELOG.map((cl, i) => {
const isFirst = i === 0;
const tagClass = cl.tag === ‘current’ ? ‘cl-tag-current’ : cl.tag === ‘fix’ ? ‘cl-tag-fix’ : ‘’;
const tagStyle = extraTagStyle[cl.tag] || ‘’;
const tagHtml  = cl.tag
? `<span class="cl-tag ${tagClass}" style="${tagStyle}">${cl.tag.toUpperCase()}</span>`
: ‘’;
const badgeStyle = isFirst
? ‘background:var(–cyan);color:#000’
: ‘background:rgba(255,255,255,.09);color:var(–muted2)’;
const vid      = ‘v’ + cl.version.replace(/./g, ‘’);
const lbl      = cl.label ? ’ \u00b7 ’ + cl.label : ‘’;
const bodyOpen = isFirst ? ’ open’ : ‘’;
const chevRot  = isFirst ? ’ style=“transform:rotate(180deg)”’ : ‘’;
return (
`<div class="cl-block">` +
`<div class="cl-head" onclick="toggleCL('${vid}')">` +
`<span class="cl-badge" style="${badgeStyle}">v${cl.version}${lbl}</span>` +
`<span class="cl-date">${cl.date}</span>` +
tagHtml +
`<span class="cl-chevron" id="chev-${vid}"${chevRot}>&#9658;</span>` +
`</div>` +
`<div class="cl-body${bodyOpen}" id="cl-body-${vid}">` +
cl.items.map(it => `<div class="cl-item">${it}</div>`).join(’’) +
`</div>` +
`</div>`
);
}).join(’’);
}

function toggleCL(vid) {
const body = document.getElementById(‘cl-body-’ + vid);
const chev = document.getElementById(‘chev-’ + vid);
if (!body) return;
const isOpen = body.classList.contains(‘open’);
document.querySelectorAll(’.cl-body’).forEach(b => b.classList.remove(‘open’));
document.querySelectorAll(’.cl-chevron’).forEach(c => c.style.transform = ‘’);
if (!isOpen) {
body.classList.add(‘open’);
if (chev) chev.style.transform = ‘rotate(180deg)’;
setTimeout(() => body.parentElement.scrollIntoView({ behavior: ‘smooth’, block: ‘start’ }), 50);
}
}

// ================================================================
// TOKEN VALIDATOR
// ================================================================
function getSafeToken(key) {
const t = localStorage.getItem(key);
if (!t || t.length < 10) { if (t) localStorage.removeItem(key); return null; }
if (t.includes(’.’)) {
const p = t.split(’.’);
if (p.length < 2 || p.some(x => !x.length)) { localStorage.removeItem(key); return null; }
}
return t;
}

// ================================================================
// LOCATION
// ================================================================
function initLocation() {
const loc = JSON.parse(localStorage.getItem(‘v16_loc’));
if (loc) { activeTZ = loc.tz; fetchWeather(loc.lat, loc.lon, loc.name); }
else { document.getElementById(‘c-meta’).textContent = ‘Setup Required’; updateGreeting(); applyTheme(‘night’); }
}

function toggleSearch() {
const m = document.getElementById(‘search-modal’);
m.classList.toggle(‘active’);
if (m.classList.contains(‘active’)) {
document.getElementById(‘search-input’).value = ‘’;
document.getElementById(‘search-results’).innerHTML =
‘<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px 0">Start typing to search worldwide</div>’;
setTimeout(() => document.getElementById(‘search-input’).focus(), 120);
}
}

// Search results stored in array — avoids inline onclick issues with special characters
let _searchResults = [];
let _searchTimer   = null;

async function searchCity(v) {
clearTimeout(_searchTimer);
_searchResults = [];
const res = document.getElementById(‘search-results’);
if (v.length < 2) {
res.innerHTML = ‘<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px 0">Type at least 2 characters</div>’;
return;
}
res.innerHTML = ‘<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px 0">Searching…</div>’;
_searchTimer = setTimeout(async () => {
try {
const r = await fetch(
‘https://geocoding-api.open-meteo.com/v1/search?name=’ +
encodeURIComponent(v) + ‘&count=10&language=en&format=json’
);
const d = await r.json();
const items = d.results || [];
if (!items.length) {
res.innerHTML = ‘<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px 0">No results. Try a different spelling.</div>’;
return;
}
_searchResults = items;
res.innerHTML  = ‘’;
items.forEach((c, idx) => {
const admin = [c.admin1, c.country].filter(Boolean).join(’, ’);
const el = document.createElement(‘div’);
el.className = ‘search-result-item’;
el.innerHTML =
‘<div class="search-result-name">’ + c.name + (admin ? ’, ’ + admin : ‘’) + ‘</div>’ +
‘<div class="search-result-meta">’ + (c.timezone || ‘’) + ‘</div>’;
el.addEventListener(‘click’, () => setLoc(idx));
res.appendChild(el);
});
} catch (e) {
res.innerHTML = ‘<div style="color:var(--red);font-size:12px;text-align:center;padding:20px 0">Search failed. Check connection.</div>’;
}
}, 350);
}

function setLoc(idx) {
const c = _searchResults[idx];
if (!c) return;
localStorage.setItem(‘v16_loc’, JSON.stringify({
lat: c.latitude, lon: c.longitude, name: c.name, tz: c.timezone
}));
location.reload();
}

async function fetchWeather(lat, lon, name) {
try {
const r = await fetch(
‘https://api.open-meteo.com/v1/forecast?latitude=’ + lat +
‘&longitude=’ + lon + ‘&current_weather=true’
);
const d  = await r.json();
const wc = d.current_weather;
const meta = WEATHER_META[wc.weathercode] || { l: ‘Weather’, t: ‘clear’ };
document.getElementById(‘w-content’).innerHTML =
‘<div class="w-condition">’ + meta.l + ‘</div>’ +
‘<div class="temp-big">’ + Math.round(wc.temperature) + ‘°</div>’;
document.getElementById(‘w-city’).textContent = name;
if (APP.features.weatherThemes) applyWeatherTheme(meta.t);
} catch (e) {
document.getElementById(‘w-content’).innerHTML =
‘<div class="w-hint">Tap to retry</div><div class="temp-big">–°</div>’;
}
}

// ================================================================
// THEME ENGINE
// ================================================================
function getLocHour() {
try {
return parseInt(
new Date().toLocaleTimeString(‘en-US’, {
timeZone: activeTZ || Intl.DateTimeFormat().resolvedOptions().timeZone,
hour12: false, hour: ‘2-digit’
}), 10
);
} catch (e) { return new Date().getHours(); }
}

function applyWeatherTheme(weatherType) {
const hour = getLocHour();
let slot;
if      (hour >= 5  && hour < 7)  slot = ‘dawn’;
else if (hour >= 7  && hour < 19) slot = ‘day’;
else if (hour >= 19 && hour < 21) slot = ‘dusk’;
else                               slot = ‘night’;

let theme;
if      (slot === ‘night’) theme = ‘night’;
else if (slot === ‘dawn’)  theme = ‘dawn’;
else if (slot === ‘dusk’)  theme = ‘dusk’;
else {
const map = { rain:‘rain’, snow:‘snow’, storm:‘storm’, fog:‘fog’, cloudy:‘cloudy’, clear:‘day’ };
theme = map[weatherType] || ‘day’;
}

// Store raw weather type for resize handler
activeWeatherType = weatherType;

applyTheme(theme);
if (APP.features.weatherParticles) renderScene(theme, slot, weatherType);
}

function applyTheme(t) {
// Remove all t-* classes cleanly before adding new one
const classes = Array.from(document.body.classList).filter(c => c.startsWith(‘t-’));
classes.forEach(c => document.body.classList.remove(c));
document.body.classList.add(‘t-’ + t);
}

function renderScene(theme, slot, weatherType) {
const layer = document.getElementById(‘particle-layer’);
layer.innerHTML = ‘’;

if      (slot === ‘night’)                { addStars(layer, 55); addMoon(layer); }
else if (slot === ‘dawn’ || slot === ‘dusk’) { addStars(layer, 16); }
else {
if (theme === ‘day’)    addSun(layer);
if (theme === ‘cloudy’ || theme === ‘fog’) addClouds(layer, theme);
if (theme === ‘storm’)  { addClouds(layer, ‘storm’); addLightning(layer); }
}

// Precipitation / atmosphere
if (weatherType === ‘rain’)  addRain(layer);
if (weatherType === ‘snow’)  addSnow(layer);
if (weatherType === ‘fog’)   addFog(layer);
}

function addStars(layer, n) {
for (let i = 0; i < n; i++) {
const s  = document.createElement(‘div’);
s.className = ‘star’;
const sz = Math.random() * 2.2 + 0.7;
s.style.cssText =
‘width:’ + sz + ‘px;height:’ + sz + ‘px;’ +
‘top:’ + (Math.random() * 74) + ‘%;left:’ + (Math.random() * 100) + ‘%;’ +
‘–dur:’ + (Math.random() * 3 + 1.5).toFixed(1) + ‘s;’ +
‘–delay:’ + (Math.random() * 4).toFixed(1) + ‘s;’ +
‘opacity:’ + (Math.random() * 0.6 + 0.15).toFixed(2);
layer.appendChild(s);
}
}

function addMoon(layer) {
const m = document.createElement(‘div’);
m.className = ‘moon-obj’;
[[18,25,10],[28,14,6],[8,34,5]].forEach(([x, y, sz]) => {
const c = document.createElement(‘div’);
c.className = ‘moon-crater’;
c.style.cssText = ‘left:’ + x + ‘%;top:’ + y + ‘%;width:’ + sz + ‘px;height:’ + sz + ‘px;’;
m.appendChild(c);
});
layer.appendChild(m);
}

function addSun(layer) {
const s = document.createElement(‘div’);
s.className = ‘sun-obj’;
layer.appendChild(s);
}

function addClouds(layer, type) {
const op = type === ‘storm’ ? 0.18 : 0.09;
[{w:190,h:72,t:‘8%’,l:‘4%’},{w:250,h:82,t:‘5%’,l:‘43%’},{w:160,h:62,t:‘17%’,l:‘62%’}].forEach(c => {
const el = document.createElement(‘div’);
el.className = ‘cloud-obj’;
el.style.cssText =
‘width:’ + c.w + ‘px;height:’ + c.h + ‘px;top:’ + c.t + ‘;left:’ + c.l + ‘;’ +
‘opacity:’ + op + ‘;background:rgba(160,170,200,’ + (op * 0.8) + ‘)’;
layer.appendChild(el);
});
}

function addLightning(layer) {
const li = document.createElement(‘div’);
li.className = ‘lightning-obj’;
li.style.animationDelay = (Math.random() * 3) + ‘s’;
layer.appendChild(li);
}

function addFog(layer) {
[20, 42, 62].forEach((top, i) => {
const f = document.createElement(‘div’);
f.className = ‘fog-layer’;
f.style.cssText =
‘top:’ + top + ‘%;’ +
‘opacity:’ + (0.05 + i * 0.018).toFixed(3) + ‘;’ +
‘animation-delay:’ + (i * 2.8) + ‘s;’ +
‘animation-duration:’ + (9 + i * 3) + ‘s;’;
layer.appendChild(f);
});
}

function addRain(layer) {
for (let i = 0; i < 80; i++) {
const d = document.createElement(‘div’);
d.className = ‘raindrop’;
const h = Math.random() * 52 + 36;
d.style.cssText =
‘left:’ + (Math.random() * 112 - 6) + ‘%;’ +
‘height:’ + h + ‘px;’ +
‘opacity:’ + (Math.random() * 0.38 + 0.2).toFixed(2) + ‘;’ +
‘animation-duration:’ + (Math.random() * 0.5 + 0.5).toFixed(2) + ‘s;’ +
‘animation-delay:’ + (Math.random() * 2).toFixed(2) + ‘s;’;
layer.appendChild(d);
}
}

function addSnow(layer) {
for (let i = 0; i < 60; i++) {
const f = document.createElement(‘div’);
f.className = ‘snowflake’;
const sz = Math.random() * 3.5 + 2;
f.style.cssText =
‘left:’ + (Math.random() * 105) + ‘%;’ +
‘width:’ + sz + ‘px;height:’ + sz + ‘px;’ +
‘opacity:’ + (Math.random() * 0.5 + 0.26).toFixed(2) + ‘;’ +
‘animation-duration:’ + (Math.random() * 4 + 4).toFixed(1) + ‘s;’ +
‘animation-delay:’ + (Math.random() * 5).toFixed(1) + ‘s;’;
layer.appendChild(f);
}
}

// ================================================================
// GREETING — uses activeTZ when set, device timezone as fallback
// ================================================================
function updateGreeting() {
const tz = activeTZ || Intl.DateTimeFormat().resolvedOptions().timeZone;
let hour;
try {
hour = parseInt(
new Date().toLocaleTimeString(‘en-US’, { timeZone: tz, hour12: false, hour: ‘2-digit’ }),
10
);
} catch (e) { hour = new Date().getHours(); }

const greet  = hour < 5 ? ‘Good night’ : hour < 12 ? ‘Good morning’ :
hour < 17 ? ‘Good afternoon’ : hour < 21 ? ‘Good evening’ : ‘Good night’;
const days   = [‘Sunday’,‘Monday’,‘Tuesday’,‘Wednesday’,‘Thursday’,‘Friday’,‘Saturday’];
const months = [‘Jan’,‘Feb’,‘Mar’,‘Apr’,‘May’,‘Jun’,‘Jul’,‘Aug’,‘Sep’,‘Oct’,‘Nov’,‘Dec’];
let now;
try { now = new Date(new Date().toLocaleString(‘en-US’, { timeZone: tz })); }
catch (e) { now = new Date(); }

const el = document.getElementById(‘greeting-msg’);
if (el) el.textContent = greet + ’ \u00b7 ’ + days[now.getDay()] + ’, ’ + months[now.getMonth()] + ’ ’ + now.getDate();
}

// ================================================================
// CLOCK
// ================================================================
function updateClock() {
const now = new Date();
const pad = n => n.toString().padStart(2, ‘0’);
if (activeTZ) {
const loc = new Date(now.toLocaleString(‘en-US’, { timeZone: activeTZ }));
loc.setMilliseconds(now.getMilliseconds());
document.getElementById(‘digi-hms’).textContent =
pad(loc.getHours()) + ‘:’ + pad(loc.getMinutes()) + ‘:’ + pad(loc.getSeconds());
document.getElementById(‘digi-ms’).textContent =
Math.floor(loc.getMilliseconds() / 10).toString().padStart(2, ‘0’);
const tz = now.toLocaleTimeString(‘en-US’, { timeZone: activeTZ, timeZoneName: ‘short’ }).split(’ ’).pop();
document.getElementById(‘c-meta’).textContent =
loc.toLocaleDateString(‘en-US’, { month: ‘short’, day: ‘numeric’ }) + ’ \u00b7 ’ + tz;
} else {
document.getElementById(‘digi-hms’).textContent =
pad(now.getHours()) + ‘:’ + pad(now.getMinutes()) + ‘:’ + pad(now.getSeconds());
document.getElementById(‘digi-ms’).textContent =
Math.floor(now.getMilliseconds() / 10).toString().padStart(2, ‘0’);
}
updateGreeting();
requestAnimationFrame(updateClock);
}

// ================================================================
// UTILS
// ================================================================
function setPickersToday() {
const today = new Date().toISOString().split(‘T’)[0];
[‘cal-date-picker’,‘rem-date-picker’].forEach(id => {
const el = document.getElementById(id); if (el) el.value = today;
});
const cd = document.getElementById(‘cd-date’); if (cd) cd.min = today;
}
function scrollToId(id) { document.getElementById(id)?.scrollIntoView({ behavior: ‘smooth’ }); }

// ================================================================
// DAY BARS
// ================================================================
function renderDayBars() {
const days = [];
for (let i = 0; i < 7; i++) {
const d = new Date(); d.setDate(d.getDate() + i);
days.push({ label: d.toLocaleDateString(‘en-US’, { weekday: ‘short’, day: ‘numeric’ }), key: d.toDateString() });
}
[‘cal-day-bar’,‘rem-day-bar’].forEach(barId => {
const el = document.getElementById(barId); if (!el) return;
el.innerHTML = days.map(d =>
‘<div class="day-pill' + (d.key === selectedDate ? ' active' : '') +
'" onclick="selectDay(\'' + d.key + '\')">’ + d.label + ‘</div>’
).join(’’);
});
}
function selectDay(key) { selectedDate = key; renderDayBars(); renderTasks(); if (googleToken) loadCal(); }

// ================================================================
// TASKS
// ================================================================
function renderTasks() {
const all = tasks.filter(t => t.dateKey === selectedDate);
const ce  = document.getElementById(‘tasks-count’); if (ce) ce.textContent = all.filter(t => !t.done).length;
const le  = document.getElementById(‘rem-list’);   if (!le) return;
le.innerHTML = all.length
? all.map(t =>
‘<div class="task-item' + (t.done ? ' done-item' : '') + '">’ +
‘<input type=“checkbox” class=“task-cb”’ + (t.done ? ’ checked’ : ‘’) +
’ onchange=“toggleTask(’ + t.id + ‘,this.checked)”>’ +
‘<span class="task-title' + (t.done ? ' struck' : '') + '">’ + t.title + ‘</span>’ +
‘<button class="del-btn" onclick="deleteTask(' + t.id + ')">🗑</button>’ +
‘</div>’
).join(’’)
: ‘<div class="empty">\u2705 All clear for this day!</div>’;
}
function toggleTask(id, c) {
tasks = tasks.map(t => t.id === id ? { …t, done: c } : t);
localStorage.setItem(‘v17_tasks’, JSON.stringify(tasks));
renderTasks();
}
function deleteTask(id) {
if (!confirm(‘Delete this task?’)) return;
tasks = tasks.filter(t => t.id !== id);
localStorage.setItem(‘v17_tasks’, JSON.stringify(tasks));
renderTasks();
}
function openReminderModal() {
document.getElementById(‘reminder-input’).value = ‘’;
const tv = document.getElementById(‘rem-time-picker’).value;
document.getElementById(‘reminder-date-label’).textContent = selectedDate + (tv ? ’ at ’ + tv : ‘’);
document.getElementById(‘reminder-modal’).classList.add(‘active’);
setTimeout(() => document.getElementById(‘reminder-input’).focus(), 120);
}
function closeReminderModal() { document.getElementById(‘reminder-modal’).classList.remove(‘active’); }
function confirmReminder() {
const v = document.getElementById(‘reminder-input’).value.trim(); if (!v) return;
const tv = document.getElementById(‘rem-time-picker’).value;
tasks.push({ id: Date.now(), title: tv ? v + ’ \u23f0 ’ + tv : v, done: false, dateKey: selectedDate });
localStorage.setItem(‘v17_tasks’, JSON.stringify(tasks));
renderTasks();
closeReminderModal();
}
function clearDoneTasks() {
const n = tasks.filter(t => t.done).length;
if (!n) { alert(‘No completed tasks to clear.’); return; }
if (!confirm(‘Remove ’ + n + ’ completed task’ + (n > 1 ? ‘s’ : ‘’) + ‘?’)) return;
tasks = tasks.filter(t => !t.done);
localStorage.setItem(‘v17_tasks’, JSON.stringify(tasks));
renderTasks();
}
function onRemDatePick(val) {
if (!val) return;
selectedDate = new Date(val + ‘T00:00:00’).toDateString();
renderDayBars(); renderTasks();
}
function onCalDatePick(val) {
if (!val) return;
selectedDate = new Date(val + ‘T00:00:00’).toDateString();
renderDayBars(); renderTasks();
if (googleToken) loadCal();
}

// ================================================================
// COUNTDOWN
// ================================================================
function openCDModal() {
const s = localStorage.getItem(‘cd_event’);
if (s) {
try {
const ex  = JSON.parse(s);
const dt  = new Date(ex.target);
const pad = n => n.toString().padStart(2, ‘0’);
document.getElementById(‘cd-name’).value = ex.name || ‘’;
document.getElementById(‘cd-date’).value = dt.getFullYear() + ‘-’ + pad(dt.getMonth()+1) + ‘-’ + pad(dt.getDate());
document.getElementById(‘cd-time’).value = pad(dt.getHours()) + ‘:’ + pad(dt.getMinutes());
} catch (e) { resetCD(); }
} else { resetCD(); }
document.getElementById(‘cd-modal’).classList.add(‘active’);
}
function resetCD() {
document.getElementById(‘cd-name’).value = ‘’;
document.getElementById(‘cd-time’).value = ‘’;
const t = new Date(); t.setDate(t.getDate() + 1);
document.getElementById(‘cd-date’).value = t.toISOString().split(‘T’)[0];
}
function closeCDModal() { document.getElementById(‘cd-modal’).classList.remove(‘active’); }
function startCountdown() {
const name    = document.getElementById(‘cd-name’).value.trim();
const dateVal = document.getElementById(‘cd-date’).value;
const timeVal = document.getElementById(‘cd-time’).value;
if (!name)    { alert(‘Please enter an event name.’); return; }
if (!dateVal) { alert(‘Please select a date.’); return; }
const target = new Date(dateVal + ‘T’ + (timeVal ? timeVal + ‘:00’ : ‘00:00:00’));
if (target <= new Date()) { alert(‘Please choose a future date or time.’); return; }
const cdData = { name, target: target.getTime() };
localStorage.setItem(‘cd_event’, JSON.stringify(cdData));
closeCDModal();
renderCountdown(cdData);
}
function initCountdown() {
const s = localStorage.getItem(‘cd_event’);
if (s) { try { renderCountdown(JSON.parse(s)); } catch (e) {} }
}
function renderCountdown(cdData) {
if (cdTimer) clearInterval(cdTimer);
const area = document.getElementById(‘cd-display-area’);
const pad  = n => String(Math.floor(n)).padStart(2, ‘0’);
function update() {
const diff = cdData.target - Date.now();
if (diff <= 0) {
area.innerHTML = ‘<div style="font-size:11px;color:var(--green);font-weight:700;text-align:center">🎉 ’ + cdData.name + ‘<br>has arrived!</div>’;
clearInterval(cdTimer); return;
}
const secs = Math.floor(diff / 1000);
if (secs <= 86399) {
area.innerHTML =
‘<div class="cd-event-name">’ + cdData.name + ‘</div>’ +
‘<div style="font-family:'Space Mono',monospace;font-size:20px;color:var(--amber);text-shadow:0 0 10px rgba(255,168,32,.38);letter-spacing:3px;margin-top:4px">’ +
pad(Math.floor(secs/3600)) + ‘:’ + pad(Math.floor((secs%3600)/60)) + ‘:’ + pad(secs%60) +
‘</div>’ +
‘<div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-top:3px;font-weight:600">HRS \u00b7 MIN \u00b7 SEC</div>’;
if (cdTimer && cdTimer._interval !== 1000) {
clearInterval(cdTimer); cdTimer = setInterval(update, 1000); cdTimer._interval = 1000;
}
} else {
const days = Math.floor(secs / (24*3600));
const hrs  = Math.floor((secs % (24*3600)) / 3600);
area.innerHTML =
‘<div class="cd-event-name">’ + cdData.name + ‘</div>’ +
‘<div class="cd-grid">’ +
‘<div class="cd-unit"><div class="cd-num">’ + pad(days) + ‘</div><div class="cd-unit-lbl">Days</div></div>’ +
‘<div class="cd-unit"><div class="cd-num">’ + pad(hrs)  + ‘</div><div class="cd-unit-lbl">Hrs</div></div>’ +
‘</div>’;
if (cdTimer && cdTimer._interval !== 60000) {
clearInterval(cdTimer); cdTimer = setInterval(update, 60000); cdTimer._interval = 60000;
}
}
}
update();
const iv = Math.floor((cdData.target - Date.now()) / 1000) <= 86399 ? 1000 : 60000;
cdTimer = setInterval(update, iv); cdTimer._interval = iv;
const btn = document.querySelector(’.cd-add-btn’);
if (btn) btn.textContent = ‘\u270e Change Event’;
}

// ================================================================
// QUOTE
// ================================================================
function initQuote() {
const s = localStorage.getItem(‘dashboard_quote’);
if (s) { try { displayQuote(JSON.parse(s)); return; } catch (e) {} }
fetchQuote();
}
function fetchQuote() {
const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
localStorage.setItem(‘dashboard_quote’, JSON.stringify(q));
displayQuote(q);
}
function displayQuote(q) {
const te = document.getElementById(‘quote-text’);
const ae = document.getElementById(‘quote-author’);
if (te) te.textContent = q.q;
if (ae) ae.textContent = q.a ? ’\u2014 ’ + q.a + (q.y ? ’ \u00b7 ’ + q.y : ‘’) : ‘’;
}

// ================================================================
// NUKE
// ================================================================
function nukeData() {
if (confirm(‘This will log you out and clear all tasks, location, and all saved events. Continue?’)) {
localStorage.clear(); location.reload();
}
}

// ================================================================
// MODAL HELPERS
// ================================================================
function showGuide()     { document.getElementById(‘guide-modal’).classList.add(‘active’); }
function hideGuide()     { document.getElementById(‘guide-modal’).classList.remove(‘active’); }
function showChangelog() { document.getElementById(‘changelog-modal’).classList.add(‘active’); }
function hideChangelog() { document.getElementById(‘changelog-modal’).classList.remove(‘active’); }
function showContact()   { document.getElementById(‘contact-modal’).classList.add(‘active’); }
function hideContact()   {
document.getElementById(‘contact-modal’).classList.remove(‘active’);
document.getElementById(‘contact-status’).textContent = ‘’;
[‘contact-name’,‘contact-email’,‘contact-msg’].forEach(id => {
const el = document.getElementById(id); if (el) el.value = ‘’;
});
}

// ================================================================
// CONTACT
// ================================================================
async function submitContact() {
const name  = document.getElementById(‘contact-name’).value.trim();
const email = document.getElementById(‘contact-email’).value.trim();
const msg   = document.getElementById(‘contact-msg’).value.trim();
const stat  = document.getElementById(‘contact-status’);
if (!name||!email||!msg) { stat.style.color=‘var(–red)’; stat.textContent=‘Please fill in all fields.’; return; }
if (!email.includes(’@’)) { stat.style.color=‘var(–red)’; stat.textContent=‘Invalid email.’; return; }
stat.style.color = ‘var(–muted)’; stat.textContent = ‘Sending…’;
try {
const r = await fetch(‘https://api.web3forms.com/submit’, {
method: ‘POST’,
headers: { ‘Content-Type’:‘application/json’, ‘Accept’:‘application/json’ },
body: JSON.stringify({ access_key:W3F_KEY, name, email, message:msg, subject:’Dashboard Support from ’+name })
});
const d = await r.json();
if (d.success) {
stat.style.color = ‘var(–green)’;
stat.textContent = ‘\u2705 Sent! We'll reply within 24\u201348h.’;
setTimeout(hideContact, 2000);
} else { stat.style.color=‘var(–red)’; stat.textContent=‘Failed. Please try again.’; }
} catch (e) { stat.style.color=‘var(–red)’; stat.textContent=‘Network error. Try again.’; }
}

// ================================================================
// MICROSOFT PKCE
// ================================================================
function base64url(buf) {
return btoa(String.fromCharCode(…new Uint8Array(buf)))
.replace(/+/g,’-’).replace(///g,’_’).replace(/=/g,’’);
}
async function sha256(s) {
return crypto.subtle.digest(‘SHA-256’, new TextEncoder().encode(s));
}
function randomStr(n) {
const a = new Uint8Array(n); crypto.getRandomValues(a); return base64url(a);
}
async function startMSLogin() {
const v = randomStr(64), c = base64url(await sha256(v));
localStorage.setItem(‘pkce_v’, v);
window.location.href =
MS_AUTH_EP + ‘?client_id=’ + MS_CLIENT_ID +
‘&response_type=code&redirect_uri=’ + encodeURIComponent(MS_REDIRECT) +
‘&scope=’ + encodeURIComponent(MS_SCOPES) +
‘&code_challenge=’ + c + ‘&code_challenge_method=S256&response_mode=query’;
}
async function exchangeMSCode(code) {
document.getElementById(‘ms-body’).innerHTML = ‘<div class="empty">\u23f3 Signing in to Outlook…</div>’;
try {
const body = new URLSearchParams({
client_id: MS_CLIENT_ID, code,
redirect_uri: MS_REDIRECT,
grant_type: ‘authorization_code’,
code_verifier: localStorage.getItem(‘pkce_v’),
scope: MS_SCOPES
});
const r    = await fetch(MS_TOKEN_EP, { method:‘POST’, headers:{‘Content-Type’:‘application/x-www-form-urlencoded’}, body });
const data = await r.json();
if (data.access_token) {
localStorage.setItem(‘ms_token’, data.access_token);
if (data.refresh_token) localStorage.setItem(‘ms_refresh’, data.refresh_token);
document.getElementById(‘ms-head-btn’).innerHTML =
‘<button class="btn-refresh" onclick="loadMail()">\u21bb Refresh</button>’;
loadMail(); loadUnreadCount();
} else {
document.getElementById(‘ms-body’).innerHTML =
’<div class="empty">\u26a0\ufe0f ’ + (data.error_description || ‘Login failed’) + ‘</div>’;
}
} catch (e) {
document.getElementById(‘ms-body’).innerHTML = ’<div class="empty">\u26a0\ufe0f ’ + e.message + ‘</div>’;
}
}

// ================================================================
// OUTLOOK MAIL
// ================================================================
async function loadMail() {
const token = getSafeToken(‘ms_token’);
if (!token) {
localStorage.removeItem(‘ms_token’); localStorage.removeItem(‘ms_refresh’);
document.getElementById(‘ms-head-btn’).innerHTML = ‘<button class="btn-sign" onclick="startMSLogin()">Sign In</button>’;
document.getElementById(‘ms-body’).innerHTML = ‘<div class="empty">Sign in to see your emails</div>’;
return;
}
const el = document.getElementById(‘ms-body’);
el.innerHTML = ‘<div class="empty">\u23f3 Loading inbox…</div>’;
try {
const r = await fetch(
‘https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages’ +
‘?$top=15&$filter=isRead eq false’ +
‘&$select=subject,from,receivedDateTime,bodyPreview,webLink’ +
‘&$orderby=receivedDateTime desc’,
{ headers: { Authorization: ‘Bearer ’ + token } }
);
const data = await r.json();
if (data.error) {
if (data.error.code === ‘InvalidAuthenticationToken’) {
localStorage.removeItem(‘ms_token’); localStorage.removeItem(‘ms_refresh’);
document.getElementById(‘ms-head-btn’).innerHTML = ‘<button class="btn-sign" onclick="startMSLogin()">Sign In</button>’;
el.innerHTML = ‘<div class="empty">Session expired. Tap Sign In to reconnect.</div>’;
return;
}
throw new Error(data.error.message);
}
const msgs = data.value || [];
if (!msgs.length) { el.innerHTML = ‘<div class="empty">\ud83c\udf89 No unread emails!</div>’; return; }
const colors = [’#3080ff’,’#9070f0’,’#00e07a’,’#ffa820’,’#ff4060’,’#00cff0’];
el.innerHTML = ‘’;
msgs.forEach((m, i) => {
const sender    = m.from?.emailAddress?.name || ‘Unknown’;
const emailAddr = m.from?.emailAddress?.address || ‘’;
const init      = sender.split(’ ‘).map(p => p[0]).join(’’).slice(0,2).toUpperCase();
const d         = new Date(m.receivedDateTime), now2 = new Date();
const t = d.toDateString() === now2.toDateString()
? d.toLocaleTimeString([], {hour:‘2-digit’,minute:‘2-digit’})
: d.toLocaleDateString([], {month:‘short’,day:‘numeric’});
const isIOS    = /iPad|iPhone|iPod/.test(navigator.userAgent);
const mailLink = isIOS ? ‘message://’ : (m.webLink || ‘mailto:’ + emailAddr);
el.innerHTML +=
‘<div class="mail-item" onclick="window.location.href=\'' + mailLink + '\'">’ +
‘<div class="mail-top">’ +
‘<div class="mail-sender">’ +
‘<div class="avatar" style="background:' + colors[i % colors.length] + '">’ + init + ‘</div>’ +
‘<div class="unread-dot"></div>’ + sender +
‘</div>’ +
‘<div class="mail-time">’ + t + ‘</div>’ +
‘</div>’ +
‘<div class="mail-subject">’ + (m.subject || ‘(No subject)’) + ‘</div>’ +
‘<div class="mail-preview">’ + (m.bodyPreview || ‘’).slice(0, 70) + ‘</div>’ +
‘</div>’;
});
} catch (e) { el.innerHTML = ’<div class="empty">\u26a0\ufe0f ’ + e.message + ‘</div>’; }
}

async function loadUnreadCount() {
const token = getSafeToken(‘ms_token’); if (!token) return;
try {
const r = await fetch(
‘https://graph.microsoft.com/v1.0/me/mailFolders/inbox?$select=unreadItemCount’,
{ headers: { Authorization: ’Bearer ’ + token } }
);
const d = await r.json();
if (d.unreadItemCount !== undefined)
document.getElementById(‘stat-mail’).textContent = d.unreadItemCount;
} catch (e) {}
}

// ================================================================
// GOOGLE CALENDAR
// ================================================================
function initGoogle() {
google.accounts.oauth2.initTokenClient({
client_id: G_CLIENT_ID,
scope: ‘https://www.googleapis.com/auth/calendar’,
callback: resp => {
if (resp.access_token) {
googleToken = resp.access_token;
localStorage.setItem(‘google_token’, googleToken);
document.getElementById(‘google-head-btn’).innerHTML =
‘<button class="btn-refresh" onclick="loadCal()">\u21bb Refresh</button>’;
const b = document.getElementById(‘add-event-btn’);
if (b) b.style.display = ‘block’;
loadCal();
}
}
}).requestAccessToken();
}

async function loadCal() {
const el = document.getElementById(‘google-body’);
el.innerHTML = ‘<div class="empty">\u23f3 Loading events…</div>’;
try {
const s     = new Date(selectedDate);
const start = new Date(s.getFullYear(),s.getMonth(),s.getDate(),0,0,0).toISOString();
const end   = new Date(s.getFullYear(),s.getMonth(),s.getDate(),23,59,59).toISOString();
const r = await fetch(
‘https://www.googleapis.com/calendar/v3/calendars/primary/events’ +
‘?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=’ + start + ‘&timeMax=’ + end,
{ headers: { Authorization: ’Bearer ’ + googleToken } }
);
const data  = await r.json();
const items = data.items || [];
const localEvs  = JSON.parse(localStorage.getItem(‘local_cal_events’) || ‘[]’);
const selStr    = new Date(selectedDate).toDateString();
const localDay  = localEvs.filter(ev => new Date(ev.start.dateTime || ev.start.date).toDateString() === selStr);
calendarEvents  = […localDay, …items];
document.getElementById(‘stat-events’).textContent = calendarEvents.length;
renderCalEvents();
} catch (e) { el.innerHTML = ’<div class="empty">\u26a0\ufe0f ’ + e.message + ‘</div>’; }
}

function loadLocalCalEvents() {
const localEvs = JSON.parse(localStorage.getItem(‘local_cal_events’) || ‘[]’);
const selStr   = new Date(selectedDate).toDateString();
calendarEvents = localEvs.filter(ev => new Date(ev.start.dateTime || ev.start.date).toDateString() === selStr);
document.getElementById(‘stat-events’).textContent = calendarEvents.length;
if (calendarEvents.length) renderCalEvents();
else document.getElementById(‘google-body’).innerHTML = ‘<div class="empty">Sign in to see your events</div>’;
}

function renderCalEvents() {
const el = document.getElementById(‘google-body’);
if (!calendarEvents.length) { el.innerHTML = ‘<div class="empty">\ud83d\udcec No events this day</div>’; return; }
el.innerHTML = ‘’;
calendarEvents.forEach((ev, idx) => {
const st   = ev.start.dateTime || ev.start.date;
const time = ev.start.dateTime
? new Date(st).toLocaleTimeString([], {hour:‘2-digit’,minute:‘2-digit’})
: ‘All Day’;
const localBadge = ev.local ? ‘<span class="local-event-badge">LOCAL</span>’ : ‘’;
const eid = ev.id || ‘’;
el.innerHTML +=
‘<div class="list-item">’ +
‘<div style="flex:1;cursor:pointer" onclick="openCalEvent(\'' + eid + '\',\'' + (ev.htmlLink||'') + '\')">’ +
‘<div style="display:flex;align-items:center;gap:5px;font-weight:600;font-size:13px">’ + (ev.summary||’(No title)’) + localBadge + ‘</div>’ +
(ev.location ? ‘<div style="font-size:11px;color:var(--muted);margin-top:1px">’ + ev.location + ‘</div>’ : ‘’) +
‘<div style="font-size:11px;color:var(--cyan);font-weight:600;font-family:\'Space Mono\',monospace;margin-top:3px">’ + time + ‘</div>’ +
‘</div>’ +
‘<button class="del-btn" onclick="deleteCalEvent(' + idx + ')">🗑</button>’ +
‘</div>’;
});
}

function openCalEvent(eventId, htmlLink) {
const isIOS    = /iPad|iPhone|iPod/.test(navigator.userAgent);
const appStore = ‘https://apps.apple.com/app/google-calendar-get-organised/id909319292’;
if (isIOS) {
let deepLink = ‘googlecalendar://’;
if (eventId && !eventId.startsWith(‘local_’)) {
try { deepLink = ‘googlecalendar://calendar/event?eid=’ + btoa(eventId).replace(/=/g, ‘’); } catch (e) {}
}
let gone = false;
const hide = () => { gone = true; };
document.addEventListener(‘visibilitychange’, hide, { once: true });
window.location.href = deepLink;
setTimeout(() => {
document.removeEventListener(‘visibilitychange’, hide);
if (!gone && confirm(‘Google Calendar app not installed.\nOpen App Store?’))
window.location.href = appStore;
}, 2000);
} else {
if (htmlLink) window.open(htmlLink, ‘_blank’);
else window.open(‘https://calendar.google.com/calendar/r’, ‘_blank’);
}
}

async function deleteCalEvent(idx) {
const ev = calendarEvents[idx]; if (!ev) return;
if (ev.local) {
let le = JSON.parse(localStorage.getItem(‘local_cal_events’) || ‘[]’);
le = le.filter(e => e.id !== ev.id);
localStorage.setItem(‘local_cal_events’, JSON.stringify(le));
calendarEvents.splice(idx, 1);
document.getElementById(‘stat-events’).textContent = calendarEvents.length;
renderCalEvents(); return;
}
if (googleToken && ev.id) {
calendarEvents.splice(idx, 1);
document.getElementById(‘stat-events’).textContent = calendarEvents.length;
renderCalEvents();
try {
const r = await fetch(
‘https://www.googleapis.com/calendar/v3/calendars/primary/events/’ + encodeURIComponent(ev.id),
{ method: ‘DELETE’, headers: { Authorization: ’Bearer ’ + googleToken } }
);
if (r.status !== 204 && r.status !== 410) { console.warn(‘Delete failed’); loadCal(); }
} catch (e) { console.warn(‘Delete error’, e); }
return;
}
calendarEvents.splice(idx, 1);
document.getElementById(‘stat-events’).textContent = calendarEvents.length;
renderCalEvents();
}

function openAddCalModal() {
const sel = new Date(selectedDate);
const pad = n => n.toString().padStart(2, ‘0’);
document.getElementById(‘new-ev-date’).value =
sel.getFullYear() + ‘-’ + pad(sel.getMonth()+1) + ‘-’ + pad(sel.getDate());
// FIX: clamp hour+1 to max 23 to prevent invalid time value “24:00”
const nextHour = Math.min(new Date().getHours() + 1, 23);
document.getElementById(‘new-ev-time’).value = pad(nextHour) + ‘:00’;
document.getElementById(‘new-ev-title’).value = ‘’;
document.getElementById(‘add-cal-modal’).classList.add(‘active’);
}
function closeAddCalModal() { document.getElementById(‘add-cal-modal’).classList.remove(‘active’); }

async function confirmAddCalEvent() {
const title   = document.getElementById(‘new-ev-title’).value.trim();
const dateVal = document.getElementById(‘new-ev-date’).value;
const timeVal = document.getElementById(‘new-ev-time’).value;
if (!title)   { alert(‘Please enter an event title.’); return; }
if (!dateVal) { alert(‘Please select a date.’); return; }
if (!timeVal) { alert(‘Please select a start time.’); return; }
const startDT = new Date(dateVal + ‘T’ + timeVal + ‘:00’);
const endDT   = new Date(startDT.getTime() + 30 * 60 * 1000);
const btn = document.querySelector(’#add-cal-modal .modal-confirm’);
if (btn) { btn.textContent = ‘\u23f3 Saving…’; btn.disabled = true; }
if (googleToken) {
try {
const body = {
summary: title,
start: { dateTime: startDT.toISOString(), timeZone: activeTZ || ‘UTC’ },
end:   { dateTime: endDT.toISOString(),   timeZone: activeTZ || ‘UTC’ }
};
const r    = await fetch(
‘https://www.googleapis.com/calendar/v3/calendars/primary/events’,
{ method:‘POST’, headers:{‘Authorization’:‘Bearer ‘+googleToken,‘Content-Type’:‘application/json’}, body:JSON.stringify(body) }
);
const data = await r.json();
if (data.id) {
const newEv = { id:data.id, summary:title, start:{dateTime:startDT.toISOString()}, end:{dateTime:endDT.toISOString()}, htmlLink:data.htmlLink };
selectedDate = startDT.toDateString();
calendarEvents.unshift(newEv);
document.getElementById(‘stat-events’).textContent = calendarEvents.length;
renderCalEvents(); renderDayBars(); closeAddCalModal();
setTimeout(() => loadCal(), 1500); return;
}
} catch (e) { console.warn(‘Google API failed:’, e); }
}
showCalConfirm(’\u26a0\ufe0f Sign in to Google Calendar to add events.’);
}

function showCalConfirm(msg) {
const el = document.getElementById(‘add-cal-confirm-msg’);
if (el) { el.textContent = msg; el.style.display = ‘block’; setTimeout(() => { el.style.display=‘none’; }, 2500); }
const btn = document.querySelector(’#add-cal-modal .modal-confirm’);
if (btn) { btn.textContent = ‘\u2713 Add Event’; btn.disabled = false; }
}

// ================================================================
// RESIZE — re-render particles with correct weatherType
// ================================================================
window.addEventListener(‘resize’, () => {
if (!activeWeatherType) return;
const hour = getLocHour();
const slot = hour >= 5 && hour < 7 ? ‘dawn’ :
hour >= 7 && hour < 19 ? ‘day’ :
hour >= 19 && hour < 21 ? ‘dusk’ : ‘night’;
const map   = { rain:‘rain’, snow:‘snow’, storm:‘storm’, fog:‘fog’, cloudy:‘cloudy’, clear:‘day’ };
const theme = slot === ‘night’ ? ‘night’ : slot === ‘dawn’ ? ‘dawn’ : slot === ‘dusk’ ? ‘dusk’ : (map[activeWeatherType] || ‘day’);
renderScene(theme, slot, activeWeatherType);
});