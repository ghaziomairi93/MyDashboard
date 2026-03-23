# Changelog — Big Minds Dashboard

All notable changes to this project are documented here.  
The full interactive changelog is also available inside the dashboard (tap **Updates**).

-----

## v2.5.0 — 23 Mar 2026 · 3-File Split *(CURRENT)*

- Codebase split into `index.html` + `main.js` + `style.css` + `.github/workflows/codeql.yml`
- Fixed: `openAddCalModal` hour+1 overflow — clamped to max 23 to prevent invalid time `24:00`
- Fixed: resize handler now correctly passes `weatherType` (rain/snow/etc) to `renderScene()`
- Fixed: `applyTheme()` strips all existing `t-*` body classes before adding the new one
- `style.css`: all CSS extracted, tokenised, and formatted for readability
- `main.js`: all JS extracted, `APP` config at top, future features are flag-gated via `APP.features`
- `README.md` updated to reflect 3-file architecture and v2.5.0
- `CHANGELOG.md` replaces `CHANGELOG_v2.2.0.md` and covers full version history

## v2.4.0 — 23 Mar 2026 · Bug Fixes

- Layout & font sizes tightened — max-width 430px, compact padding for iPhone
- Google Calendar icon rebuilt with clean non-overlapping SVG shapes — no render artefacts
- City search: switched to `addEventListener`-based rendering — fixes crash on city names with apostrophes or special characters
- City search: debounced 350ms, returns up to 10 global results with admin region + country
- Greeting message: reads hour from `activeTZ` (location timezone) as soon as set
- Weather theme engine: fixed variable scoping issue — `activeWeatherTheme` now set before `renderScene()` call
- Weather particles (rain, snow, stars, moon, sun, lightning, fog, clouds) reliably render on theme switch
- `APP.version` is single source of truth — page title, version tag, and changelog badge all read from it

## v2.3.0 — 23 Mar 2026 · Theme Engine

- Dynamic weather theme system — background reflects time-of-day and weather condition
- Night: deep navy/black sky with animated stars and floating moon
- Dawn/Dusk: warm orange/pink atmospheric gradient
- Day clear: bright sky blue with pulsing sun
- Rain/Drizzle/Showers: dark blue-grey with 80 CSS animated raindrops
- Snow: cool dark background with 60 CSS animated snowflakes
- Thunderstorm: near-black with random lightning flash animation
- Fog/Mist: three drifting layered fog band elements
- Greeting message now derived from chosen location timezone, not device time
- Changelog now rendered from JS `CHANGELOG` data array — future versions need one array entry only
- Weather condition codes mapped to 26 WMO codes with readable English labels

## v2.2.0 — 23 Mar 2026 · Design Overhaul

- Full visual redesign — dark/techy polished aesthetic
- Typography: Syne (headings), Space Mono (clock/mono), DM Sans (body)
- Multi-accent color system: cyan, amber, green, blue, purple per widget
- Staggered `fadeUp` entry animations on all dashboard cards
- Scanline animation on clock widget for CRT terminal feel
- Noise grain overlay for atmospheric depth
- Modals use blur backdrop + `fadeUp` entrance animation
- All v2.1.9 functionality preserved

## v2.1.9 — 20 Mar 2026 · Sensei’s Release

- Countdown smart display: ≤24h shows live HH:MM:SS at 1s interval
- Countdown smart display: >24h shows Days + Hours at 60s interval
- Add Event button hidden until Google sign-in
- Removed local event fallback — events require Google sign-in

## v2.0.1 — 20 Mar 2026 · Hotfix

- Fixed IDX14100 JWT malformed token error in Outlook Inbox
- Token validator added — checks JWT structure before every API call
- Auto-recovery — bad token silently cleared, Sign In button restored
- 401 / `InvalidAuthenticationToken` handler auto-clears expired session

## v2.0.0 — 19 Mar 2026

- PKCE Outlook login fully stable
- Sessions persist via `localStorage` across page refresh
- Unread mail count from real Microsoft Graph `unreadItemCount`
- Contact form fully anonymous via Web3Forms API
- Deep links to Google Calendar and Mail apps on mobile

## v1.0.0 — Mar 2026 · Initial Release

- Initial concept — static HTML dashboard, no APIs, dummy data only
- Single-file architecture: one `index.html`, no backend, no build tools
- Hosted on GitHub Pages — `ghaziomairi93.github.io/MyDashboard/`
- Created by Ghazi Omairi using AI assistance (Claude, ChatGPT, Gemini)