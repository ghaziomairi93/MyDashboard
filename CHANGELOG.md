# Changelog — Big Minds Dashboard

## v1.0.0 — 23 Mar 2026 · Initial Release *(CURRENT)*

### New Features

- Full dashboard with 14 widgets in a clean first release
- **Single shared location** — one saved location drives weather, clock timezone, greeting, prayer times, calendar timezone, and weather background theme
- Location button visible in greeting banner and Prayer Times widget — tap to search or change at any time
- **Weather theme system** — background changes based on location’s local time-of-day + weather condition:
  - Night (20:00–05:00): deep navy with animated stars and floating moon
  - Dawn (05:00–07:00): warm orange/amber gradient
  - Day clear (07:00–19:00): sky blue with pulsing sun
  - Day rain: dark blue-grey with 80 falling CSS raindrops
  - Day snow: cool dark with 60 drifting CSS snowflakes
  - Thunderstorm: near-black with lightning flash
  - Fog: drifting mist bands
  - Dusk (19:00–20:00): deep pink/magenta gradient
- **Crypto widget** — BTC, ETH, SOL, HNT prices + 24h change via CoinGecko free API, auto-refresh every 5 minutes
- **Forex + Metals widget** — USD/EUR rate, Gold (XAU) and Silver (XAG) per troy oz, auto-refresh every 5 minutes
- **Prayer times widget** — Fajr, Dhuhr, Asr, Maghrib, Isha via Aladhan API, next prayer highlighted, driven by shared location
- **News headlines** — top 5 stories via NYT RSS + rss2json free API
- **Mini calendar** — inline month view, tap any day to sync Reminders and Google Calendar to that date
- **Google Calendar** — OAuth sign-in, read events, create events (30 min default), delete events
- **Outlook Inbox** — PKCE OAuth (no secret), 15 unread emails, deep link to iOS mail app
- **Reminders / Tasks** — per-day tasks with date+time picker, day bar navigation, checkbox done state, delete, Clear Done
- **Countdown** — name + date + optional time, smart display: HH:MM:SS under 24h, Days+Hours over 24h
- **Quote of the day** — 15 curated quotes, tap or ↻ to refresh, persists across visits

### Architecture

- 3-file split: `index.html` + `main.js` + `style.css`
- `APP.version` is single source of truth for all version strings
- Release header comment at top of `index.html`
- Changelog built dynamically from JS array — future versions need one entry only
- `localStorage` keys prefixed `bmd_` for clean namespace
