# Big Minds Dashboard

> Personal dashboard — mobile-first, GitHub Pages hosted.
> **Live:** https://ghaziomairi93.github.io/MyDashboard/

## Version

**v1.0.0** — 23 Mar 2026 · Initial Release

## File Structure

```
MyDashboard/
├── .github/workflows/codeql.yml   # Security scanning
├── index.html                     # HTML structure + release header
├── main.js                        # All JS — config, data, functions
├── style.css                      # All CSS — tokens, themes, components
├── CHANGELOG.md                   # Version history
└── README.md
```

## Widgets

|# |Widget                            |Source                  |Refresh                  |
|--|----------------------------------|------------------------|-------------------------|
|1 |Greeting + location button        |Local time (location TZ)|Real-time                |
|2 |Weather                           |Open-Meteo API          |On load / location change|
|3 |Live Clock                        |Location timezone       |Real-time                |
|4 |Stats (mail + events)             |MS Graph + Google Cal   |On sign-in               |
|5 |Crypto BTC/ETH/SOL/HNT            |CoinGecko free API      |Every 5 min              |
|6 |Forex + Metals USD/EUR/Gold/Silver|exchangerate.host       |Every 5 min              |
|7 |Countdown                         |localStorage            |Real-time                |
|8 |Tasks / Reminders                 |localStorage            |Instant                  |
|9 |Quote of the day                  |Built-in                |On tap                   |
|10|Prayer times                      |Aladhan API             |Daily / location change  |
|11|News headlines                    |NYT RSS via rss2json    |On load                  |
|12|Mini calendar                     |Local                   |Instant                  |
|13|Google Calendar                   |Google Calendar v3      |On demand                |
|14|Outlook Inbox                     |Microsoft Graph         |On demand                |

## Location

One saved location drives all widgets:

- Weather temperature and condition
- Clock timezone
- Greeting (Good morning / afternoon / evening)
- Prayer times
- Calendar event timezone
- Background weather theme

Set via the **Set Location** button in the greeting banner,
or the **Change Location** button in the Prayer Times widget.

## Deploy

```bash
git add .
git commit -m "v1.0.0 — Initial Release"
git push
```

GitHub Pages auto-deploys from `main` branch.

## Created by

Ghazi Omairi — built with AI assistance (Claude, Gemini, ChatGPT)
