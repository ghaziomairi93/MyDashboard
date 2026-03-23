const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// --- Credentials ---
const G_CLIENT_ID  = '623465337664-jf51sn11crs5bs398inc40al4ksjv1rd.apps.googleusercontent.com';
const MS_CLIENT_ID = '1155afdf-d585-48cc-af89-b973843ce21a';
const W3F_KEY      = '53bad208-02b2-40b6-974b-98f8b68d0439';
const REDIRECT_URI = `http://localhost:${PORT}/oauth/callback`;

app.use(bodyParser.json());

// --- Token storage ---
const TOKEN_FILE = 'tokens.json';
let tokens = {};
if(fs.existsSync(TOKEN_FILE)) tokens = JSON.parse(fs.readFileSync(TOKEN_FILE));
function saveTokens(){ fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens,null,2)); }

// Serve frontend
app.get('/', (req,res)=>{ res.sendFile(path.join(__dirname,'index.html')); });

// --- Google OAuth ---
app.get('/auth/google',(req,res)=>{
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${G_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=https://www.googleapis.com/auth/calendar.readonly&access_type=offline&prompt=consent`;
    res.redirect(url);
});
app.get('/oauth/callback', async (req,res)=>{
    const code = req.query.code;
    if(!code) return res.send("No code");
    const data = await fetch('https://oauth2.googleapis.com/token',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams({
            code, client_id:G_CLIENT_ID, redirect_uri:REDIRECT_URI, grant_type:'authorization_code'
        })
    }).then(r=>r.json());
    tokens.google = data; saveTokens();
    res.send("Google auth complete. Close window and refresh dashboard.");
});

// --- Microsoft OAuth ---
app.get('/auth/microsoft',(req,res)=>{
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${MS_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_mode=query&scope=Mail.Read Calendars.Read`;
    res.redirect(url);
});
app.get('/oauth/callback-ms', async (req,res)=>{
    const code = req.query.code;
    if(!code) return res.send("No code");
    const data = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams({
            client_id:MS_CLIENT_ID, scope:'Mail.Read Calendars.Read', code, redirect_uri:REDIRECT_URI, grant_type:'authorization_code'
        })
    }).then(r=>r.json());
    tokens.microsoft = data; saveTokens();
    res.send("Microsoft auth complete. Close window and refresh dashboard.");
});

// --- API Endpoints ---
app.get('/api/google/events', async (req,res)=>{
    if(!tokens.google?.access_token) return res.status(401).send({error:"Not authorized"});
    const data = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=5&orderBy=startTime&singleEvents=true',{
        headers:{Authorization:`Bearer ${tokens.google.access_token}`}
    }).then(r=>r.json());
    res.send(data);
});
app.get('/api/microsoft/mail', async (req,res)=>{
    if(!tokens.microsoft?.access_token) return res.status(401).send({error:"Not authorized"});
    const data = await fetch('https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=1',{
        headers:{Authorization:`Bearer ${tokens.microsoft.access_token}`}
    }).then(r=>r.json());
    res.send(data);
});

// --- Crypto & Forex ---
app.get('/api/crypto', async (req,res)=>{
    const coins = ['bitcoin','ethereum','solana','helium'];
    const data = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd`).then(r=>r.json());
    res.send(data);
});
app.get('/api/forex', async (req,res)=>{
    const data = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP').then(r=>r.json());
    res.send(data);
});

// --- Geocoding ---
app.get('/api/geocode', async (req,res)=>{
    const city = req.query.city; if(!city) return res.status(400).send({error:"No city"});
    const data = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`).then(r=>r.json());
    if(data.length>0) res.send({lat:data[0].lat, lon:data[0].lon});
    else res.status(404).send({error:"City not found"});
});

// --- Nuke ---
app.post('/api/nuke',(req,res)=>{ tokens={}; saveTokens(); res.send({status:"ok"}); });

// --- Support Form ---
app.post('/api/support', async (req,res)=>{
    const {email,message} = req.body;
    const data = await fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({access_key: W3F_KEY, email:email||'anonymous@example.com', message})
    }).then(r=>r.json());
    res.send(data);
});

app.listen(PORT,()=>console.log(`Dashboard running on http://localhost:${PORT}`));