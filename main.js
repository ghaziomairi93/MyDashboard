/* ================================================================
Big Minds Dashboard — main.js
v1.0.0 | 2026-03-23
Single shared location drives: weather, clock, greeting,
prayer times, calendar timezone, theme.
================================================================ */

// ── APP CONFIG ─────────────────────────────────────────────────
const APP = {
version:   ‘1.0.0’,
buildDate: ‘2026-03-23’,
name:      ‘Big Minds Dashboard’,
};

// ── API KEYS / CONSTANTS ───────────────────────────────────────
const G_CLIENT_ID  = ‘623465337664-jf51sn11crs5bs398inc40al4ksjv1rd.apps.googleusercontent.com’;
const MS_CLIENT_ID = ‘1155afdf-d585-48cc-af89-b973843ce21a’;
const MS_REDIRECT  = ‘https://ghaziomairi93.github.io/MyDashboard/’;
const MS_SCOPES    = ‘openid profile User.Read Mail.Read offline_access’;
const MS_AUTH_EP   = ‘https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize’;
const MS_TOKEN_EP  = ‘https://login.microsoftonline.com/consumers/oauth2/v2.0/token’;
const W3F_KEY      = ‘53bad208-02b2-40b6-974b-98f8b68d0439’;
const NEWS_URL     = ‘https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Frss.nytimes.com%2Fservices%2Fxml%2Frss%2Fnyt%2FHomePage.xml&count=5’;
const REFRESH_MS   = 5 * 60 * 1000; // 5 minutes

// Crypto coins config
const COINS = [
{ id:‘bitcoin’,  sym:‘BTC’, name:‘Bitcoin’,  color:’#f7931a’ },
{ id:‘ethereum’, sym:‘ETH’, name:‘Ethereum’, color:’#627eea’ },
{ id:‘solana’,   sym:‘SOL’, name:‘Solana’,   color:’#9945ff’ },
{ id:‘helium’,   sym:‘HNT’, name:‘Helium’,   color:’#474dff’ },
];

// WMO weather codes → { label, theme, icon }
const WX = {
0:{l:‘Clear’,t:‘clear’,i:‘☀️’},       1:{l:‘Mostly Clear’,t:‘clear’,i:‘🌤’},
2:{l:‘Partly Cloudy’,t:‘cloudy’,i:‘⛅’}, 3:{l:‘Overcast’,t:‘cloudy’,i:‘☁️’},
45:{l:‘Foggy’,t:‘fog’,i:‘🌫’},          48:{l:‘Icy Fog’,t:‘fog’,i:‘🌫’},
51:{l:‘Drizzle’,t:‘rain’,i:‘🌦’},       53:{l:‘Drizzle’,t:‘rain’,i:‘🌦’},       55:{l:‘Heavy Drizzle’,t:‘rain’,i:‘🌧’},
61:{l:‘Light Rain’,t:‘rain’,i:‘🌧’},    63:{l:‘Rain’,t:‘rain’,i:‘🌧’},          65:{l:‘Heavy Rain’,t:‘rain’,i:‘🌧’},
71:{l:‘Light Snow’,t:‘snow’,i:‘🌨’},    73:{l:‘Snow’,t:‘snow’,i:‘❄️’},          75:{l:‘Heavy Snow’,t:‘snow’,i:‘❄️’},
80:{l:‘Showers’,t:‘rain’,i:‘🌦’},       81:{l:‘Showers’,t:‘rain’,i:‘🌦’},       82:{l:‘Heavy Showers’,t:‘rain’,i:‘🌧’},
95:{l:‘Thunderstorm’,t:‘storm’,i:‘⛈’}, 96:{l:‘Thunderstorm’,t:‘storm’,i:‘⛈’}, 99:{l:‘Thunderstorm’,t:‘storm’,i:‘⛈’},
};

const PRAYER_NAMES = [‘Fajr’,‘Dhuhr’,‘Asr’,‘Maghrib’,‘Isha’];

const QUOTES = [
{q:“The only way to do great work is to love what you do.”,a:“Steve Jobs”,y:“2005”},
{q:“In the middle of difficulty lies opportunity.”,a:“Albert Einstein”,y:“~1940s”},
{q:“It does not matter how slowly you go as long as you do not stop.”,a:“Confucius”,y:“~500 BC”},
{q:“Life is what happens when you’re busy making other plans.”,a:“John Lennon”,y:“1980”},
{q:“The future belongs to those who believe in the beauty of their dreams.”,a:“Eleanor Roosevelt”,y:“~1950s”},
{q:“You miss 100% of the shots you don’t take.”,a:“Wayne Gretzky”,y:“~1983”},
{q:“Whether you think you can or you think you can’t, you’re right.”,a:“Henry Ford”,y:“~1940s”},
{q:“I have not failed. I’ve just found 10,000 ways that won’t work.”,a:“Thomas Edison”,y:“~1900s”},
{q:“It always seems impossible until it’s done.”,a:“Nelson Mandela”,y:“~1990s”},
{q:“Success is not final, failure is not fatal: the courage to continue is what counts.”,a:“Winston Churchill”,y:“~1940s”},
{q:“Be the change you wish to see in the world.”,a:“Mahatma Gandhi”,y:“~1913”},
{q:“The way to get started is to quit talking and begin doing.”,a:“Walt Disney”,y:“~1950s”},
{q:“Believe you can and you’re halfway there.”,a:“Theodore Roosevelt”,y:“~1900s”},
{q:“The purpose of our lives is to be happy.”,a:“Dalai Lama”,y:“~1990s”},
{q:“Get busy living or get busy dying.”,a:“Stephen King”,y:“1982”},
];

const CHANGELOG = [
{ v:‘1.0.0’, label:‘Initial Release’, date:‘23 Mar 2026’, tag:‘current’, items:[
‘Full dashboard: greeting, weather, clock, stats, crypto, forex/metals, countdown, tasks, quote, prayer times, news, mini calendar, Google Calendar, Outlook’,
‘Single shared location — drives weather, clock timezone, greeting time, prayer times, calendar timezone, and weather theme’,
‘Location search: worldwide via Open-Meteo geocoding, debounced, event-listener based’,
‘Dynamic weather theme system: background changes with time-of-day + weather condition’,
‘Night: stars + moon | Dawn/Dusk: warm gradients | Day: sky blue + sun | Rain: raindrops | Snow: snowflakes | Storm: lightning | Fog: drifting bands’,
‘Crypto: BTC, ETH, SOL, HNT via CoinGecko — auto-refresh every 5 minutes’,
‘Forex + Metals: USD/EUR, Gold (XAU), Silver (XAG) per troy oz — auto-refresh every 5 minutes’,
‘Prayer times: Fajr, Dhuhr, Asr, Maghrib, Isha via Aladhan API — next prayer highlighted’,
‘News: top 5 headlines via NYT RSS + rss2json’,
‘Mini calendar: tap any day to sync all date-aware widgets’,
‘Google Calendar: OAuth, read/create/delete events’,
‘Outlook Inbox: PKCE OAuth, 15 unread emails’,
‘Clean 3-file architecture: index.html + main.js + style.css’,
]},
];

// ── STATE ──────────────────────────────────────────────────────
let LOC         = JSON.parse(localStorage.getItem(‘bmd_loc’) || ‘null’);
// LOC = { lat, lon, name, tz } — single source of truth

let selectedDate   = new Date().toDateString();
let tasks          = JSON.parse(localStorage.getItem(‘bmd_tasks’) || ‘[]’);
let googleToken    = null;
let calEvents      = [];
let cdTimer        = null;
let miniCalMonth   = new Date(); // which month is shown
let _searchResults = [];
let _sTmr          = null;

// ── HELPERS ────────────────────────────────────────────────────
const $    = id  => document.getElementById(id);
const html = (id, h) => { const e = $(id); if (e) e.innerHTML = h; };
const pad  = n   => String(Math.floor(n)).padStart(2,‘0’);
const tz   = ()  => LOC?.tz || Intl.DateTimeFormat().resolvedOptions().timeZone;

function locHour() {
try { return parseInt(new Date().toLocaleTimeString(‘en-US’,{timeZone:tz(),hour12:false,hour:‘2-digit’}),10); }
catch(e) { return new Date().getHours(); }
}

function getSafeToken(key) {
const t = localStorage.getItem(key);
if (!t || t.length < 10) { if(t) localStorage.removeItem(key); return null; }
if (t.includes(’.’)) { const p=t.split(’.’); if(p.length<2||p.some(x=>!x)){localStorage.removeItem(key);return null;} }
return t;
}

// ── INIT ───────────────────────────────────────────────────────
window.onload = async () => {
// Stamp version
html(‘version-stamp’, ‘v’+APP.version+’ \u00b7 ‘+APP.buildDate);
if ($(‘page-title’)) $(‘page-title’).textContent = APP.name + ’ v’ + APP.version;

buildChangelog();
initLocationUI();
renderDayBars();
renderTasks();
requestAnimationFrame(clockTick);
initCountdown();
initQuote();
setPickersToday();
renderMiniCal();

// Wire search input
const si = $(‘search-inp’);
if (si) si.addEventListener(‘input’, e => doSearch(e.target.value));

// Periodic data refreshes
loadCrypto(); setInterval(loadCrypto, REFRESH_MS);
loadForex();  setInterval(loadForex,  REFRESH_MS);
loadNews();

// MS OAuth redirect
const code = new URLSearchParams(window.location.search).get(‘code’);
if (code) { window.history.replaceState({},’’,MS_REDIRECT); await exchangeMSCode(code); return; }

// Restore sessions
const gTok = getSafeToken(‘google_token’);
if (gTok) {
googleToken = gTok;
html(‘gcal-btn’, ‘<button class="btn btn-cyan" onclick="loadCal()">\u21bb Refresh</button>’);
html(‘gcal-add-btn’, ‘<button class="btn btn-green" onclick="openAddCalModal()">+ Add</button>’);
loadCal();
}
const mTok = getSafeToken(‘ms_token’);
if (mTok) {
html(‘ms-btn’,’<button class="btn btn-cyan" onclick="loadMail()">\u21bb Refresh</button>’);
setTimeout(()=>{loadMail();loadUnreadCount();},300);
}
};

// ── LOCATION UI ────────────────────────────────────────────────
// Called on init and after any location change
function initLocationUI() {
if (LOC) {
// Update location button label in greeting
html(‘loc-btn-label’, ’\u{1F4CD} ’ + LOC.name);
// Trigger all location-dependent features
fetchWeather();
loadPrayerTimes();
applyWeatherTheme(); // apply theme immediately with current time
} else {
html(‘loc-btn-label’, ‘\u{1F4CD} Set Location’);
applyTheme(‘night’); // default until location set
}
}

// Open/close search
function openSearch() {
$(‘search-ov’).classList.add(‘open’);
$(‘search-inp’).value = ‘’;
html(‘search-results’, ‘<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px 0">Start typing to search worldwide</div>’);
setTimeout(()=>$(‘search-inp’).focus(),100);
}
function closeSearch() { $(‘search-ov’).classList.remove(‘open’); }

// Debounced search
async function doSearch(v) {
clearTimeout(_sTmr);
const res = $(‘search-results’);
if (v.length < 2) {
res.innerHTML = ‘<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px 0">Type at least 2 characters</div>’;
return;
}
res.innerHTML = ‘<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px 0">Searching…</div>’;
_sTmr = setTimeout(async () => {
try {
const r = await fetch(‘https://geocoding-api.open-meteo.com/v1/search?name=’+encodeURIComponent(v)+’&count=10&language=en&format=json’);
const d = await r.json();
const items = d.results || [];
if (!items.length) { res.innerHTML=’<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px 0">No results found</div>’; return; }
_searchResults = items;
res.innerHTML = ‘’;
items.forEach((c,i) => {
const el = document.createElement(‘div’);
el.className = ‘s-item’;
const admin = [c.admin1, c.country].filter(Boolean).join(’, ‘);
el.innerHTML = ‘<div class="s-name">’+c.name+(admin?’, ‘+admin:’’)+’</div><div class="s-tz">’+(c.timezone||’’)+’</div>’;
el.addEventListener(‘click’, () => saveLocation(i));
res.appendChild(el);
});
} catch(e) { res.innerHTML=’<div style="color:var(--red);font-size:12px;text-align:center;padding:20px 0">Search failed. Check connection.</div>’; }
}, 350);
}

function saveLocation(idx) {
const c = _searchResults[idx]; if (!c) return;
LOC = { lat:c.latitude, lon:c.longitude, name:c.name, tz:c.timezone };
localStorage.setItem(‘bmd_loc’, JSON.stringify(LOC));
closeSearch();
initLocationUI(); // re-trigger everything with new location
}

// ── WEATHER ────────────────────────────────────────────────────
async function fetchWeather() {
if (!LOC) return;
try {
const r = await fetch(‘https://api.open-meteo.com/v1/forecast?latitude=’+LOC.lat+’&longitude=’+LOC.lon+’&current_weather=true’);
const d = await r.json();
const wc   = d.current_weather;
const meta = WX[wc.weathercode] || {l:‘Weather’,t:‘clear’,i:‘🌡’};
html(‘w-temp’, Math.round(wc.temperature)+’°’);
html(‘w-cond’, meta.l);
html(‘w-icon’, meta.i);
html(‘w-city’, LOC.name);
// Apply theme with actual weather type
applyWeatherTheme(meta.t);
} catch(e) {
html(‘w-temp’,’–°’); html(‘w-cond’,‘Unavailable’);
}
}

// ── THEME ENGINE ───────────────────────────────────────────────
function applyWeatherTheme(weatherType) {
const h = locHour();
const slot = h>=5&&h<7?‘dawn’: h>=7&&h<19?‘day’: h>=19&&h<21?‘dusk’: ‘night’;
let theme;
if (slot===‘night’) theme=‘night’;
else if (slot===‘dawn’)  theme=‘dawn’;
else if (slot===‘dusk’)  theme=‘dusk’;
else {
const map={rain:‘rain’,snow:‘snow’,storm:‘storm’,fog:‘fog’,cloudy:‘cloudy’,clear:‘day’};
theme = map[weatherType] || ‘day’;
}
applyTheme(theme);
renderScene(theme, slot, weatherType || ‘clear’);
}

function applyTheme(t) {
// Remove all t-* then add new
document.body.className = document.body.className.replace(/\bt-\S+/g,’’).trim();
document.body.classList.add(‘t-’+t);
}

function renderScene(theme, slot, wType) {
const sc = $(‘scene’); if (!sc) return;
sc.innerHTML = ‘’;
if (slot===‘night’)                  { addStars(sc,55); addMoon(sc); }
else if (slot===‘dawn’||slot===‘dusk’) addStars(sc,16);
else {
if (theme===‘day’)                    addSun(sc);
if (theme===‘cloudy’||theme===‘fog’)  addClouds(sc,theme);
if (theme===‘storm’)                 { addClouds(sc,‘storm’); addLightning(sc); }
}
if (wType===‘rain’)  addRain(sc);
if (wType===‘snow’)  addSnow(sc);
if (wType===‘fog’)   addFog(sc);
}

function addStars(sc,n) {
for (let i=0;i<n;i++) {
const s=document.createElement(‘div’); s.className=‘star’;
const sz=Math.random()*2.2+0.7;
s.style.cssText=‘width:’+sz+‘px;height:’+sz+‘px;top:’+(Math.random()*74)+’%;left:’+(Math.random()*100)+’%;–dur:’+(Math.random()*3+1.5).toFixed(1)+‘s;–dly:’+(Math.random()*4).toFixed(1)+‘s;opacity:’+(Math.random()*.6+.15).toFixed(2);
sc.appendChild(s);
}
}
function addMoon(sc) {
const m=document.createElement(‘div’); m.className=‘moon’;
[[18,25,10],[28,14,6],[8,34,5]].forEach(([x,y,sz])=>{const c=document.createElement(‘div’);c.className=‘moon-crater’;c.style.cssText=‘left:’+x+’%;top:’+y+’%;width:’+sz+‘px;height:’+sz+‘px;’;m.appendChild(c);});
sc.appendChild(m);
}
function addSun(sc){const s=document.createElement(‘div’);s.className=‘sun’;sc.appendChild(s);}
function addClouds(sc,type){
const op=type===‘storm’?0.18:0.09;
[{w:190,h:72,t:‘8%’,l:‘4%’},{w:250,h:82,t:‘5%’,l:‘43%’},{w:160,h:62,t:‘17%’,l:‘63%’}].forEach(c=>{
const el=document.createElement(‘div’);el.className=‘cloud’;
el.style.cssText=‘width:’+c.w+‘px;height:’+c.h+‘px;top:’+c.t+’;left:’+c.l+’;opacity:’+op;
sc.appendChild(el);
});
}
function addLightning(sc){const l=document.createElement(‘div’);l.className=‘lightning-flash’;l.style.animationDelay=(Math.random()*3)+‘s’;sc.appendChild(l);}
function addFog(sc){[20,42,62].forEach((t,i)=>{const f=document.createElement(‘div’);f.className=‘fog-band’;f.style.cssText=‘top:’+t+’%;opacity:’+(0.05+i*0.018).toFixed(3)+’;animation-delay:’+(i*2.8)+‘s;animation-duration:’+(9+i*3)+‘s;’;sc.appendChild(f);});}
function addRain(sc){for(let i=0;i<80;i++){const d=document.createElement(‘div’);d.className=‘raindrop’;const h=Math.random()*52+36;d.style.cssText=‘left:’+(Math.random()*112-6)+’%;height:’+h+‘px;opacity:’+(Math.random()*.38+.2).toFixed(2)+’;animation-duration:’+(Math.random()*.5+.5).toFixed(2)+‘s;animation-delay:’+(Math.random()*2).toFixed(2)+‘s;’;sc.appendChild(d);}}
function addSnow(sc){for(let i=0;i<60;i++){const f=document.createElement(‘div’);f.className=‘snowflake’;const sz=Math.random()*3.5+2;f.style.cssText=‘left:’+(Math.random()*105)+’%;width:’+sz+‘px;height:’+sz+‘px;opacity:’+(Math.random()*.5+.26).toFixed(2)+’;animation-duration:’+(Math.random()*4+4).toFixed(1)+‘s;animation-delay:’+(Math.random()*5).toFixed(1)+‘s;’;sc.appendChild(f);}}

window.addEventListener(‘resize’, () => { if(LOC) applyWeatherTheme(); });

// ── CLOCK + GREETING ───────────────────────────────────────────
function clockTick() {
const now = new Date();
const zone = LOC?.tz;
if (zone) {
const loc = new Date(now.toLocaleString(‘en-US’,{timeZone:zone}));
loc.setMilliseconds(now.getMilliseconds());
html(‘c-hms’, pad(loc.getHours())+’:’+pad(loc.getMinutes())+’:’+pad(loc.getSeconds()));
html(‘c-ms’,  Math.floor(loc.getMilliseconds()/10).toString().padStart(2,‘0’));
const tzName = now.toLocaleTimeString(‘en-US’,{timeZone:zone,timeZoneName:‘short’}).split(’ ‘).pop();
html(‘c-meta’, loc.toLocaleDateString(‘en-US’,{month:‘short’,day:‘numeric’})+’ \u00b7 ‘+tzName);
} else {
html(‘c-hms’, pad(now.getHours())+’:’+pad(now.getMinutes())+’:’+pad(now.getSeconds()));
html(‘c-ms’,  Math.floor(now.getMilliseconds()/10).toString().padStart(2,‘0’));
html(‘c-meta’, ‘Set location for timezone’);
}
updateGreeting();
requestAnimationFrame(clockTick);
}

function updateGreeting() {
const h = locHour();
const g = h<5?‘Good night’:h<12?‘Good morning’:h<17?‘Good afternoon’:h<21?‘Good evening’:‘Good night’;
const days=[‘Sunday’,‘Monday’,‘Tuesday’,‘Wednesday’,‘Thursday’,‘Friday’,‘Saturday’];
const months=[‘Jan’,‘Feb’,‘Mar’,‘Apr’,‘May’,‘Jun’,‘Jul’,‘Aug’,‘Sep’,‘Oct’,‘Nov’,‘Dec’];
let now;
try { now=new Date(new Date().toLocaleString(‘en-US’,{timeZone:tz()})); } catch(e){now=new Date();}
html(‘greeting-msg’, g+’ \u00b7 ‘+days[now.getDay()]+’, ‘+months[now.getMonth()]+’ ’+now.getDate());
}

// ── CRYPTO ─────────────────────────────────────────────────────
async function loadCrypto() {
const ids = COINS.map(c=>c.id).join(’,’);
try {
const r = await fetch(‘https://api.coingecko.com/api/v3/simple/price?ids=’+ids+’&vs_currencies=usd&include_24hr_change=true’);
const d = await r.json();
COINS.forEach(coin => {
const data = d[coin.id]; if (!data) return;
const px = data.usd, ch = data.usd_24h_change;
const pxStr = px>=1000?’$’+px.toLocaleString(‘en-US’,{maximumFractionDigits:0}):px>=1?’$’+px.toFixed(2):’$’+px.toFixed(4);
const chStr = (ch>=0?’+’:’’)+ch.toFixed(2)+’%’;
html(‘cp-px-’+coin.sym, pxStr);
const el=$(‘cp-ch-’+coin.sym);
if(el){el.textContent=chStr;el.className=’c-change ’+(ch>=0?‘up’:‘down’);}
});
html(‘crypto-ts’,’Updated ’+new Date().toLocaleTimeString([],{hour:‘2-digit’,minute:‘2-digit’}));
} catch(e) { html(‘crypto-ts’,‘Offline’); }
}

// ── FOREX + METALS ─────────────────────────────────────────────
async function loadForex() {
try {
// Primary: exchangerate.host (free, no key needed for limited use)
const r = await fetch(‘https://api.exchangerate.host/latest?base=USD&symbols=EUR,XAU,XAG’);
const d = await r.json();
const rates = d.rates || {};
if (rates.EUR)   html(‘fx-eur’,    rates.EUR.toFixed(4));
if (rates.XAU)   html(‘fx-gold’,  ‘$’+(1/rates.XAU).toLocaleString(‘en-US’,{maximumFractionDigits:0}));
if (rates.XAG)   html(‘fx-silver’,’$’+(1/rates.XAG).toFixed(2));
html(‘forex-ts’,’Updated ’+new Date().toLocaleTimeString([],{hour:‘2-digit’,minute:‘2-digit’}));
} catch(e) {
// Fallback: frankfurter for EUR only
try {
const r2=await fetch(‘https://api.frankfurter.app/latest?from=USD&to=EUR’);
const d2=await r2.json();
if(d2.rates?.EUR) html(‘fx-eur’, d2.rates.EUR.toFixed(4));
} catch(e2){}
html(‘forex-ts’,‘Partial’);
}
}

// ── PRAYER TIMES ───────────────────────────────────────────────
async function loadPrayerTimes() {
if (!LOC) return;
try {
const now  = new Date();
const ds   = now.getDate()+’-’+(now.getMonth()+1)+’-’+now.getFullYear();
const r    = await fetch(‘https://api.aladhan.com/v1/timings/’+ds+’?latitude=’+LOC.lat+’&longitude=’+LOC.lon+’&method=2’);
const d    = await r.json();
const T    = d.data?.timings; if (!T) return;
const mins = now.getHours()*60+now.getMinutes();
let nextIdx = -1;
const list = PRAYER_NAMES.map((name,i)=>{
const [hh,mm]=T[name].split(’:’).map(Number);
if(nextIdx===-1 && hh*60+mm>mins) nextIdx=i;
return {name,time:T[name]};
});
const grid=$(‘prayer-grid’); if(!grid) return;
grid.innerHTML=list.map((p,i)=>
‘<div class="p-item'+(i===nextIdx?' next':'')+'"><div class="p-name">’+p.name+’</div><div class="p-time">’+p.time+’</div></div>’
).join(’’);
} catch(e){ html(‘prayer-grid’,’<div class="empty">Prayer times unavailable</div>’); }
}

// ── NEWS ───────────────────────────────────────────────────────
async function loadNews() {
const el=$(‘news-list’); if(!el) return;
el.innerHTML=’<div class="empty">Loading…</div>’;
try {
const r=await fetch(NEWS_URL);
const d=await r.json();
const items=(d.items||[]).slice(0,5);
if(!items.length){el.innerHTML=’<div class="empty">No headlines available</div>’;return;}
el.innerHTML=items.map(item=>{
const dt=item.pubDate?new Date(item.pubDate).toLocaleDateString(‘en-US’,{month:‘short’,day:‘numeric’}):’’;
const src=(item.author||‘News’).split(’ ‘).slice(0,2).join(’ ‘);
return ‘<a class="news-item" href="'+(item.link||'#')+'" target="_blank" rel="noopener"><div class="n-title">’+(item.title||‘Untitled’)+’</div><div class="n-meta">’+src+(dt?’ \u00b7 ‘+dt:’’)+’</div></a>’;
}).join(’’);
} catch(e){el.innerHTML=’<div class="empty">Could not load news</div>’;}
}

// ── MINI CALENDAR ──────────────────────────────────────────────
function renderMiniCal() {
const y=miniCalMonth.getFullYear(), m=miniCalMonth.getMonth();
const months=[‘January’,‘February’,‘March’,‘April’,‘May’,‘June’,‘July’,‘August’,‘September’,‘October’,‘November’,‘December’];
html(‘mc-month’, months[m]+’ ‘+y);
const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
const today=new Date(), sd=new Date(selectedDate);
const isToday=d=>d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();
const isSel  =d=>d===sd.getDate()&&m===sd.getMonth()&&y===sd.getFullYear();
let h=’’;
for(let i=0;i<first;i++) h+=’<div class="mc-day other-month"></div>’;
for(let d=1;d<=days;d++){
const cls=[‘mc-day’];
if(isToday(d)) cls.push(‘today’);
if(isSel(d))   cls.push(‘selected’);
h+=’<div class="'+cls.join(' ')+'" onclick="mcSelectDay('+y+','+m+','+d+')">’+d+’</div>’;
}
html(‘mc-days’, h);
}
function mcPrev(){ miniCalMonth.setMonth(miniCalMonth.getMonth()-1); renderMiniCal(); }
function mcNext(){ miniCalMonth.setMonth(miniCalMonth.getMonth()+1); renderMiniCal(); }
function mcSelectDay(y,m,d){
selectedDate=new Date(y,m,d).toDateString();
renderDayBars(); renderTasks(); renderMiniCal();
if(googleToken) loadCal();
document.getElementById(‘rem-section’)?.scrollIntoView({behavior:‘smooth’});
}

// ── DAY BARS ───────────────────────────────────────────────────
function renderDayBars() {
const days=[];
for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()+i);days.push({label:d.toLocaleDateString(‘en-US’,{weekday:‘short’,day:‘numeric’}),key:d.toDateString()});}
[‘cal-day-bar’,‘rem-day-bar’].forEach(id=>{
const el=$(id); if(!el) return;
el.innerHTML=days.map(d=>’<div class="day-pill'+(d.key===selectedDate?' active':'')+'" onclick="selectDay(\''+d.key+'\')">’+d.label+’</div>’).join(’’);
});
}
function selectDay(key){selectedDate=key;renderDayBars();renderTasks();renderMiniCal();if(googleToken)loadCal();}

function setPickersToday(){
const today=new Date().toISOString().split(‘T’)[0];
[‘cal-date-picker’,‘rem-date-picker’].forEach(id=>{const e=$(id);if(e)e.value=today;});
const cd=$(‘cd-date’);if(cd)cd.min=today;
}

// ── TASKS ──────────────────────────────────────────────────────
function renderTasks(){
const all=tasks.filter(t=>t.dateKey===selectedDate);
html(‘tasks-count’, all.filter(t=>!t.done).length);
const le=$(‘rem-list’);if(!le)return;
le.innerHTML=all.length
?all.map(t=>’<div class="task-item'+(t.done?' done':'')+'"><input type=“checkbox” class=“task-cb”’+(t.done?’ checked’:’’)+’ onchange=“toggleTask(’+t.id+’,this.checked)”><span class="task-txt'+(t.done?' struck':'')+'">’+t.title+’</span><button class="del-btn" onclick="deleteTask('+t.id+')">🗑</button></div>’).join(’’)
:’<div class="empty">\u2705 All clear!</div>’;
}
function toggleTask(id,c){tasks=tasks.map(t=>t.id===id?{…t,done:c}:t);localStorage.setItem(‘bmd_tasks’,JSON.stringify(tasks));renderTasks();}
function deleteTask(id){if(!confirm(‘Delete this task?’))return;tasks=tasks.filter(t=>t.id!==id);localStorage.setItem(‘bmd_tasks’,JSON.stringify(tasks));renderTasks();}
function openRemModal(){
$(‘rem-inp’).value=’’;
const tv=$(‘rem-time-picker’).value;
html(‘rem-date-lbl’, selectedDate+(tv?’ at ‘+tv:’’));
$(‘rem-modal’).classList.add(‘open’);
setTimeout(()=>$(‘rem-inp’).focus(),100);
}
function closeRemModal(){ $(‘rem-modal’).classList.remove(‘open’); }
function confirmRem(){
const v=$(‘rem-inp’).value.trim();if(!v)return;
const tv=$(‘rem-time-picker’).value;
tasks.push({id:Date.now(),title:tv?v+’ \u23f0 ‘+tv:v,done:false,dateKey:selectedDate});
localStorage.setItem(‘bmd_tasks’,JSON.stringify(tasks));
renderTasks();closeRemModal();
}
function clearDone(){
const n=tasks.filter(t=>t.done).length;
if(!n){alert(‘No completed tasks.’);return;}
if(!confirm(‘Remove ‘+n+’ completed task’+(n>1?‘s’:’’)+’?’))return;
tasks=tasks.filter(t=>!t.done);localStorage.setItem(‘bmd_tasks’,JSON.stringify(tasks));renderTasks();
}
function onRemDatePick(v){if(!v)return;selectedDate=new Date(v+‘T00:00:00’).toDateString();renderDayBars();renderTasks();renderMiniCal();}
function onCalDatePick(v){if(!v)return;selectedDate=new Date(v+‘T00:00:00’).toDateString();renderDayBars();renderTasks();renderMiniCal();if(googleToken)loadCal();}

// ── COUNTDOWN ──────────────────────────────────────────────────
function openCDModal(){
const s=localStorage.getItem(‘bmd_cd’);
if(s){try{const ex=JSON.parse(s);const dt=new Date(ex.target);$(‘cd-name’).value=ex.name||’’;$(‘cd-date’).value=dt.getFullYear()+’-’+pad(dt.getMonth()+1)+’-’+pad(dt.getDate());$(‘cd-time’).value=pad(dt.getHours())+’:’+pad(dt.getMinutes());}catch(e){resetCD();}}else{resetCD();}
$(‘cd-modal’).classList.add(‘open’);
}
function resetCD(){$(‘cd-name’).value=’’;$(‘cd-time’).value=’’;const t=new Date();t.setDate(t.getDate()+1);$(‘cd-date’).value=t.toISOString().split(‘T’)[0];}
function closeCDModal(){$(‘cd-modal’).classList.remove(‘open’);}
function startCD(){
const name=$(‘cd-name’).value.trim(),dv=$(‘cd-date’).value,tv=$(‘cd-time’).value;
if(!name){alert(‘Please enter an event name.’);return;} if(!dv){alert(‘Please select a date.’);return;}
const target=new Date(dv+‘T’+(tv?tv+’:00’:‘00:00:00’));
if(target<=new Date()){alert(‘Please choose a future date or time.’);return;}
localStorage.setItem(‘bmd_cd’,JSON.stringify({name,target:target.getTime()}));
closeCDModal();renderCD({name,target:target.getTime()});
}
function initCountdown(){const s=localStorage.getItem(‘bmd_cd’);if(s){try{renderCD(JSON.parse(s));}catch(e){}}}
function renderCD(cd){
if(cdTimer)clearInterval(cdTimer);
const area=$(‘cd-area’);
function upd(){
const diff=cd.target-Date.now();
if(diff<=0){area.innerHTML=’<div style="font-size:11px;color:var(--green);font-weight:700;text-align:center">\ud83c\udf89 ‘+cd.name+’ has arrived!</div>’;clearInterval(cdTimer);return;}
const secs=Math.floor(diff/1000);
if(secs<=86399){
area.innerHTML=’<div class="cd-name">’+cd.name+’</div><div class="cd-hms">’+pad(Math.floor(secs/3600))+’:’+pad(Math.floor((secs%3600)/60))+’:’+pad(secs%60)+’</div><div class="cd-u">HRS \u00b7 MIN \u00b7 SEC</div>’;
if(cdTimer&&cdTimer._iv!==1000){clearInterval(cdTimer);cdTimer=setInterval(upd,1000);cdTimer._iv=1000;}
}else{
const d=Math.floor(secs/86400),h=Math.floor((secs%86400)/3600);
area.innerHTML=’<div class="cd-name">’+cd.name+’</div><div class="cd-boxes"><div class="cd-box"><div class="cd-bn">’+pad(d)+’</div><div class="cd-bl">Days</div></div><div class="cd-box"><div class="cd-bn">’+pad(h)+’</div><div class="cd-bl">Hrs</div></div></div>’;
if(cdTimer&&cdTimer._iv!==60000){clearInterval(cdTimer);cdTimer=setInterval(upd,60000);cdTimer._iv=60000;}
}
}
upd();
const iv=Math.floor((cd.target-Date.now())/1000)<=86399?1000:60000;
cdTimer=setInterval(upd,iv);cdTimer._iv=iv;
const btn=$(‘cd-btn’);if(btn)btn.textContent=’\u270e Change Event’;
}

// ── QUOTE ──────────────────────────────────────────────────────
function initQuote(){const s=localStorage.getItem(‘bmd_quote’);if(s){try{showQuote(JSON.parse(s));return;}catch(e){}}newQuote();}
function newQuote(){const q=QUOTES[Math.floor(Math.random()*QUOTES.length)];localStorage.setItem(‘bmd_quote’,JSON.stringify(q));showQuote(q);}
function showQuote(q){html(‘q-text’,q.q);html(‘q-author’,q.a?’\u2014 ‘+q.a+(q.y?’ \u00b7 ‘+q.y:’’):’’);}

// ── NUKE ───────────────────────────────────────────────────────
function nukeData(){if(confirm(‘Clear all data and sessions? This cannot be undone.’)){localStorage.clear();location.reload();}}

// ── MODALS ─────────────────────────────────────────────────────
function openModal(id)  {$(id)?.classList.add(‘open’);}
function closeModal(id) {$(id)?.classList.remove(‘open’);}
function showGuide()    {openModal(‘guide-modal’);}
function hideGuide()    {closeModal(‘guide-modal’);}
function showCL()       {openModal(‘cl-modal’);}
function hideCL()       {closeModal(‘cl-modal’);}
function showContact()  {openModal(‘contact-modal’);}
function hideContact()  {
closeModal(‘contact-modal’);
html(‘contact-status’,’’);
[‘contact-name’,‘contact-email’,‘contact-msg’].forEach(id=>{const e=$(id);if(e)e.value=’’;});
}

// ── CONTACT ────────────────────────────────────────────────────
async function submitContact(){
const name=$(‘contact-name’).value.trim(),email=$(‘contact-email’).value.trim(),msg=$(‘contact-msg’).value.trim(),stat=$(‘contact-status’);
if(!name||!email||!msg){stat.style.color=‘var(–red)’;stat.textContent=‘Please fill in all fields.’;return;}
if(!email.includes(’@’)){stat.style.color=‘var(–red)’;stat.textContent=‘Invalid email.’;return;}
stat.style.color=‘var(–muted)’;stat.textContent=‘Sending…’;
try{
const r=await fetch(‘https://api.web3forms.com/submit’,{method:‘POST’,headers:{‘Content-Type’:‘application/json’,‘Accept’:‘application/json’},body:JSON.stringify({access_key:W3F_KEY,name,email,message:msg,subject:‘Dashboard Support from ‘+name})});
const d=await r.json();
if(d.success){stat.style.color=‘var(–green)’;stat.textContent=’\u2705 Sent!’;setTimeout(hideContact,2000);}
else{stat.style.color=‘var(–red)’;stat.textContent=‘Failed. Try again.’;}
}catch(e){stat.style.color=‘var(–red)’;stat.textContent=‘Network error.’;}
}

// ── CHANGELOG ──────────────────────────────────────────────────
function buildChangelog(){
const c=$(‘cl-body’);if(!c)return;
c.innerHTML=CHANGELOG.map((cl,i)=>{
const isFirst=i===0;
const bs=isFirst?‘background:var(–cyan);color:#000’:‘background:rgba(255,255,255,.09);color:var(–muted2)’;
const vid=‘v’+cl.v.replace(/./g,’’);
const tHtml=cl.tag?’<span class="cl-tag '+(cl.tag==='current'?'cl-current':cl.tag==='fix'?'cl-fix':'')+'">’+cl.tag.toUpperCase()+’</span>’:’’;
const lbl=cl.label?’ \u00b7 ‘+cl.label:’’;
return ‘<div class="cl-block"><div class="cl-head" onclick="toggleCL(\''+vid+'\')"><span class="cl-badge" style="'+bs+'">v’+cl.v+lbl+’</span><span class="cl-date">’+cl.date+’</span>’+tHtml+’<span class=“cl-chev” id=“cc-’+vid+’”’+(isFirst?’ style=“transform:rotate(180deg)”’:’’)+’>►</span></div><div class="cl-body'+(isFirst?' open':'')+'" id="cl-bd-'+vid+'">’+cl.items.map(it=>’<div class="cl-item">’+it+’</div>’).join(’’)+’</div></div>’;
}).join(’’);
}
function toggleCL(vid){
const b=$(‘cl-bd-’+vid),c=$(‘cc-’+vid);if(!b)return;
const open=b.classList.contains(‘open’);
document.querySelectorAll(’.cl-body’).forEach(x=>x.classList.remove(‘open’));
document.querySelectorAll(’.cl-chev’).forEach(x=>x.style.transform=’’);
if(!open){b.classList.add(‘open’);if(c)c.style.transform=‘rotate(180deg)’;setTimeout(()=>b.parentElement.scrollIntoView({behavior:‘smooth’,block:‘start’}),50);}
}

// ── MICROSOFT PKCE ─────────────────────────────────────────────
function base64url(buf){return btoa(String.fromCharCode(…new Uint8Array(buf))).replace(/+/g,’-’).replace(///g,’_’).replace(/=/g,’’);}
async function sha256(s){return crypto.subtle.digest(‘SHA-256’,new TextEncoder().encode(s));}
function randStr(n){const a=new Uint8Array(n);crypto.getRandomValues(a);return base64url(a);}
async function startMSLogin(){
const v=randStr(64),c=base64url(await sha256(v));
localStorage.setItem(‘pkce_v’,v);
window.location.href=MS_AUTH_EP+’?client_id=’+MS_CLIENT_ID+’&response_type=code&redirect_uri=’+encodeURIComponent(MS_REDIRECT)+’&scope=’+encodeURIComponent(MS_SCOPES)+’&code_challenge=’+c+’&code_challenge_method=S256&response_mode=query’;
}
async function exchangeMSCode(code){
html(‘ms-body’,’<div class="empty">\u23f3 Signing in…</div>’);
try{
const body=new URLSearchParams({client_id:MS_CLIENT_ID,code,redirect_uri:MS_REDIRECT,grant_type:‘authorization_code’,code_verifier:localStorage.getItem(‘pkce_v’),scope:MS_SCOPES});
const r=await fetch(MS_TOKEN_EP,{method:‘POST’,headers:{‘Content-Type’:‘application/x-www-form-urlencoded’},body});
const data=await r.json();
if(data.access_token){
localStorage.setItem(‘ms_token’,data.access_token);
if(data.refresh_token)localStorage.setItem(‘ms_refresh’,data.refresh_token);
html(‘ms-btn’,’<button class="btn btn-cyan" onclick="loadMail()">\u21bb Refresh</button>’);
loadMail();loadUnreadCount();
}else{html(‘ms-body’,’<div class="empty">\u26a0\ufe0f ‘+(data.error_description||‘Login failed’)+’</div>’);}
}catch(e){html(‘ms-body’,’<div class="empty">\u26a0\ufe0f ‘+e.message+’</div>’);}
}

// ── OUTLOOK ────────────────────────────────────────────────────
async function loadMail(){
const token=getSafeToken(‘ms_token’);
if(!token){localStorage.removeItem(‘ms_token’);html(‘ms-btn’,’<button class="btn btn-blue" onclick="startMSLogin()">Sign In</button>’);html(‘ms-body’,’<div class="empty">Sign in to see your emails</div>’);return;}
html(‘ms-body’,’<div class="empty">\u23f3 Loading…</div>’);
try{
const r=await fetch(‘https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=15&$filter=isRead eq false&$select=subject,from,receivedDateTime,bodyPreview,webLink&$orderby=receivedDateTime desc’,{headers:{Authorization:‘Bearer ‘+token}});
const data=await r.json();
if(data.error){if(data.error.code===‘InvalidAuthenticationToken’){localStorage.removeItem(‘ms_token’);html(‘ms-btn’,’<button class="btn btn-blue" onclick="startMSLogin()">Sign In</button>’);html(‘ms-body’,’<div class="empty">Session expired. Sign in again.</div>’);return;}throw new Error(data.error.message);}
const msgs=data.value||[];
if(!msgs.length){html(‘ms-body’,’<div class="empty">\ud83c\udf89 No unread emails!</div>’);return;}
const colors=[’#4090ff’,’#a078f8’,’#12e888’,’#f0a418’,’#f04060’,’#18d8f0’];
const el=$(‘ms-body’);el.innerHTML=’’;
msgs.forEach((m,i)=>{
const sender=m.from?.emailAddress?.name||‘Unknown’;
const init=sender.split(’ ‘).map(p=>p[0]).join(’’).slice(0,2).toUpperCase();
const d=new Date(m.receivedDateTime),n2=new Date();
const t=d.toDateString()===n2.toDateString()?d.toLocaleTimeString([],{hour:‘2-digit’,minute:‘2-digit’}):d.toLocaleDateString([],{month:‘short’,day:‘numeric’});
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
const lnk=isIOS?‘message://’:(m.webLink||‘mailto:’+(m.from?.emailAddress?.address||’’));
el.innerHTML+=’<a class="mail-item" href="'+lnk+'"><div class="m-top"><div class="m-from"><div class="avatar" style="background:'+colors[i%colors.length]+'">’+init+’</div><div class="m-dot"></div>’+sender+’</div><div class="m-time">’+t+’</div></div><div class="m-subj">’+(m.subject||’(No subject)’)+’</div><div class="m-prev">’+(m.bodyPreview||’’).slice(0,70)+’</div></a>’;
});
}catch(e){html(‘ms-body’,’<div class="empty">\u26a0\ufe0f ‘+e.message+’</div>’);}
}
async function loadUnreadCount(){
const token=getSafeToken(‘ms_token’);if(!token)return;
try{const r=await fetch(‘https://graph.microsoft.com/v1.0/me/mailFolders/inbox?$select=unreadItemCount’,{headers:{Authorization:’Bearer ’+token}});const d=await r.json();if(d.unreadItemCount!==undefined)html(‘stat-mail’,d.unreadItemCount);}catch(e){}
}

// ── GOOGLE CALENDAR ────────────────────────────────────────────
function initGCal(){
google.accounts.oauth2.initTokenClient({
client_id:G_CLIENT_ID, scope:‘https://www.googleapis.com/auth/calendar’,
callback:resp=>{
if(resp.access_token){
googleToken=resp.access_token;localStorage.setItem(‘google_token’,googleToken);
html(‘gcal-btn’,’<button class="btn btn-cyan" onclick="loadCal()">\u21bb Refresh</button>’);
html(‘gcal-add-btn’,’<button class="btn btn-green" onclick="openAddCalModal()">+ Add</button>’);
loadCal();
}
}
}).requestAccessToken();
}
async function loadCal(){
html(‘gcal-body’,’<div class="empty">\u23f3 Loading…</div>’);
try{
const s=new Date(selectedDate);
const start=new Date(s.getFullYear(),s.getMonth(),s.getDate(),0,0,0).toISOString();
const end  =new Date(s.getFullYear(),s.getMonth(),s.getDate(),23,59,59).toISOString();
const r=await fetch(‘https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=’+start+’&timeMax=’+end,{headers:{Authorization:‘Bearer ‘+googleToken}});
const data=await r.json();
calEvents=data.items||[];
html(‘stat-events’,calEvents.length);
renderCal();
}catch(e){html(‘gcal-body’,’<div class="empty">\u26a0\ufe0f ‘+e.message+’</div>’);}
}
function renderCal(){
const el=$(‘gcal-body’);
if(!calEvents.length){el.innerHTML=’<div class="empty">\ud83d\udcec No events</div>’;return;}
el.innerHTML=calEvents.map((ev,i)=>{
const st=ev.start.dateTime||ev.start.date;
const time=ev.start.dateTime?new Date(st).toLocaleTimeString([],{hour:‘2-digit’,minute:‘2-digit’}):‘All Day’;
return ‘<div class="ev-item"><div class="ev-left" onclick="openEv(\''+ev.id+'\',\''+(ev.htmlLink||'')+'\')"><div class="ev-title">’+(ev.summary||‘No title’)+’</div><div class="ev-time">’+time+’</div></div><button class="del-btn" onclick="deleteEv('+i+')">🗑</button></div>’;
}).join(’’);
}
function openEv(id,link){
if(/iPad|iPhone|iPod/.test(navigator.userAgent)) window.location.href=‘googlecalendar://’;
else if(link) window.open(link,’_blank’);
}
async function deleteEv(i){
const ev=calEvents[i];if(!ev)return;
calEvents.splice(i,1);html(‘stat-events’,calEvents.length);renderCal();
if(googleToken&&ev.id){try{await fetch(‘https://www.googleapis.com/calendar/v3/calendars/primary/events/’+encodeURIComponent(ev.id),{method:‘DELETE’,headers:{Authorization:‘Bearer ‘+googleToken}});}catch(e){}}
}
function openAddCalModal(){
const sel=new Date(selectedDate);
$(‘new-ev-date’).value=sel.getFullYear()+’-’+pad(sel.getMonth()+1)+’-’+pad(sel.getDate());
$(‘new-ev-time’).value=pad(Math.min(new Date().getHours()+1,23))+’:00’;
$(‘new-ev-title’).value=’’;
$(‘add-cal-modal’).classList.add(‘open’);
}
function closeAddCalModal(){$(‘add-cal-modal’).classList.remove(‘open’);}
async function confirmAddCal(){
const title=$(‘new-ev-title’).value.trim(),dv=$(‘new-ev-date’).value,tv=$(‘new-ev-time’).value;
if(!title){alert(‘Please enter a title.’);return;} if(!dv||!tv){alert(‘Please pick a date and time.’);return;}
const startDT=new Date(dv+‘T’+tv+’:00’),endDT=new Date(startDT.getTime()+30*60*1000);
const btn=document.querySelector(’#add-cal-modal .m-ok’);
if(btn){btn.textContent=’\u23f3 Saving…’;btn.disabled=true;}
try{
const r=await fetch(‘https://www.googleapis.com/calendar/v3/calendars/primary/events’,{method:‘POST’,headers:{‘Authorization’:’Bearer ’+googleToken,‘Content-Type’:‘application/json’},body:JSON.stringify({summary:title,start:{dateTime:startDT.toISOString(),timeZone:LOC?.tz||‘UTC’},end:{dateTime:endDT.toISOString(),timeZone:LOC?.tz||‘UTC’}})});
const d=await r.json();
if(d.id){calEvents.unshift({id:d.id,summary:title,start:{dateTime:startDT.toISOString()},htmlLink:d.htmlLink});html(‘stat-events’,calEvents.length);renderCal();closeAddCalModal();setTimeout(loadCal,1500);}
else{alert(‘Failed to create event.’);}
}catch(e){alert(‘Error: ‘+e.message);}
if(btn){btn.textContent=’\u2713 Add Event’;btn.disabled=false;}
}
