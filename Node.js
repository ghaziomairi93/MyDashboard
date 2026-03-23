// server.js
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const open = require('open');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// --- Your credentials ---
const G_CLIENT_ID = '623465337664-jf51sn11crs5bs398inc40al4ksjv1rd.apps.googleusercontent.com';
const MS_CLIENT_ID = '1155afdf-d585-48cc-af89-b973843ce21a';
const W3F_KEY    = '53bad208-02b2-40b6-974b-98f8b68d0439';
const REDIRECT_URI = 'http://localhost:3000/oauth/callback'; // adjust for your domain if hosted

app.use(bodyParser.json());
app.use(express.static('public'));

// --- Token storage ---
const TOKEN_FILE = 'tokens.json';
let tokens = {};
if(fs.existsSync(TOKEN_FILE)) {
    tokens = JSON.parse(fs.readFileSync(TOKEN_FILE));
}

// --- Helper to save tokens ---
function saveTokens() {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

// --- Google OAuth PKCE Flow ---
app.get('/auth/google', (req,res)=>{
    const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${G_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `response_type=code&` +
        `scope=https://www.googleapis.com/auth/calendar.readonly&` +
        `access_type=offline&prompt=consent`;
    res.redirect(url);
});

app.get('/oauth/callback', async (req,res)=>{
    const code = req.query.code;
    if(!code) return res.send("No code provided");
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
            code,
            client_id:G_CLIENT_ID,
            redirect_uri:REDIRECT_URI,
            grant_type:'authorization_code'
        })
    });
    const data = await tokenRes.json();
    tokens.google = data;
    saveTokens();
    res.send("Google auth complete. You can close this window and refresh dashboard.");
});

// --- Microsoft OAuth PKCE Flow ---
app.get('/auth/microsoft', (req,res)=>{
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${MS_CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `response_mode=query&scope=Mail.Read Calendars.Read`;
    res.redirect(url);
});

// --- Microsoft OAuth callback ---
app.get('/oauth/callback-ms', async (req,res)=>{
    const code = req.query.code;
    if(!code) return res.send("No code provided");
    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
            client_id:MS_CLIENT_ID,
            scope:'Mail.Read Calendars.Read',
            code,
            redirect_uri:REDIRECT_URI,
            grant_type:'authorization_code'
        })
    });
    const data = await tokenRes.json();
    tokens.microsoft = data;
    saveTokens();
    res.send("Microsoft auth complete. Close window and refresh dashboard.");
});

// --- API Endpoints for Frontend ---

// Google Calendar Events
app.get('/api/google/events', async (req,res)=>{
    if(!tokens.google || !tokens.google.access_token) return res.status(401).send({error:"Not authorized"});
    const eventsRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=5&orderBy=startTime&singleEvents=true',{
        headers:{Authorization:`Bearer ${tokens.google.access_token}`}
    });
    const data = await eventsRes.json();
    res.send(data);
});

// Microsoft Mail unread count
app.get('/api/microsoft/mail', async (req,res)=>{
    if(!tokens.microsoft || !tokens.microsoft.access_token) return res.status(401).send({error:"Not authorized"});
    const mailRes = await fetch('https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=1',{
        headers:{Authorization:`Bearer ${tokens.microsoft.access_token}`}
    });
    const data = await mailRes.json();
    res.send(data);
});

// Crypto + Forex Live Prices
app.get('/api/crypto', async (req,res)=>{
    const coins = ['bitcoin','ethereum','solana','helium'];
    const pricesRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd`);
    const data = await pricesRes.json();
    res.send(data);
});
app.get('/api/forex', async (req,res)=>{
    const forexRes = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP');
    const data = await forexRes.json();
    res.send(data);
});

// Geocoding
app.get('/api/geocode', async (req,res)=>{
    const city = req.query.city;
    if(!city) return res.status(400).send({error:"No city provided"});
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
    const data = await geoRes.json();
    if(data.length>0) {
        res.send({lat:data[0].lat, lon:data[0].lon});
    } else res.status(404).send({error:"City not found"});
});

// Nuke
app.post('/api/nuke',(req,res)=>{
    tokens = {};
    saveTokens();
    res.send({status:"ok"});
});

// Support Web3Forms
app.post('/api/support', async (req,res)=>{
    const {email,message} = req.body;
    const resp = await fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            access_key: W3F_KEY,
            email: email||'anonymous@example.com',
            message
        })
    });
    const data = await resp.json();
    res.send(data);
});

app.listen(PORT,()=>console.log(`Dashboard backend running on http://localhost:${PORT}`));
