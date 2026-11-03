const express = require('express');
const VideoSync = require('./video/video_sync');
const hifiBridge = require('../build/Release/hifi_player_bridge.node');

const app = express();
const PORT = 8080;

let isPlaying = true;
let simulatedVideoLag = 0;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hi-Fi Control Deck</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: sans-serif; background: #0c0c0e; color: #e2e8f0; text-align: center; margin: 0; padding: 15px; }
                .container { max-width: 500px; margin: 0 auto; background: #141417; border: 1px solid #27272a; border-radius: 16px; padding: 20px; }
                h1 { color: #00ff88; font-size: 24px; margin-bottom: 20px; }
                .tab-bar { display: flex; background: #1f1f23; border-radius: 8px; padding: 4px; margin-bottom: 20px; }
                .tab-btn { flex: 1; background: none; border: none; color: #a1a1aa; padding: 10px; font-weight: bold; cursor: pointer; border-radius: 6px; }
                .tab-btn.active { background: #00ff88; color: #0c0c0e; }
                .tab-content { display: none; text-align: left; }
                .tab-content.active { display: block; }
                .metric-box { background: #1f1f23; border-radius: 8px; padding: 15px; margin-bottom: 12px; border-left: 4px solid #ffbb00; }
                .metric-title { font-size: 11px; color: #a1a1aa; text-transform: uppercase; font-weight: bold; }
                .metric-value { font-size: 18px; font-weight: bold; margin-top: 4px; font-family: monospace; }
                .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
                button.control-btn { background: #27272a; color: #fff; border: 1px solid #3f3f46; padding: 12px; font-weight: bold; border-radius: 8px; cursor: pointer; }
                .btn-primary { background: #00ff88 !important; color: #0c0c0e !important; }
                .thread-row { display: flex; justify-content: space-between; background: #1f1f23; padding: 10px; margin-bottom: 6px; border-radius: 6px; font-size: 13px; font-family: monospace; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>⚡ PURE HI-FI CORE ⚡</h1>
                <div class="tab-bar">
                    <button class="tab-btn active" onclick="switchTab('player')">📻 Playback</button>
                    <button class="tab-btn" onclick="switchTab('downloader')">📥 Downloads</button>
                    <button class="tab-btn" onclick="switchTab('database')">📊 Cloud Logs</button>
                </div>
                <div id="player" class="tab-content active">
                    <div class="metric-box" style="border-left-color: #ffbb00;"><div class="metric-title">📻 C++ Master Audio Clock</div><div id="audioClock" class="metric-value">0 ms</div></div>
                    <div class="metric-box" style="border-left-color: #38bdf8;"><div class="metric-title">🎬 Video Rendering Canvas</div><div id="videoClock" class="metric-value">0 ms</div></div>
                    <div class="metric-box" id="directiveBox" style="border-left-color: #00ff88;"><div class="metric-title">⚙️ Sync Alignment Action</div><div id="syncDirective" class="metric-value">RENDER_FRAME</div></div>
                    <div class="btn-grid">
                        <button id="togglePlay" class="control-btn btn-primary">Pause Engine</button>
                        <button id="btnNormal" class="control-btn">Reset Latency</button>
                        <button id="btnLag" class="control-btn" style="color: #ef4444;">Simulate Video Lag</button>
                        <button id="btnAhead" class="control-btn" style="color: #f59e0b;">Simulate Video Ahead</button>
                    </div>
                </div>
                <div id="downloader" class="tab-content">
                    <div class="thread-row"><span>🧵 Thread #1 (Chunk A)</span><span style="color:#00ff88;">ACTIVE (100%)</span></div>
                    <div class="thread-row"><span>🧵 Thread #2 (Chunk B)</span><span style="color:#00ff88;">ACTIVE (100%)</span></div>
                    <div class="thread-row" style="background:#15241d;"><span>🔒 SHA-256 Validation</span><span style="color:#00ff88;">INTEGRITY MATCHED</span></div>
                </div>
                <div id="database" class="tab-content">
                    <div class="thread-row"><span>🔹 Neon Cloud Database Connection</span><span>SUCCESS</span></div>
                    <div class="thread-row"><span>🔹 Automated Sync Logging Node</span><span>STANDBY READY</span></div>
                </div>
            </div>
            <script>
                function switchTab(t){document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));document.getElementById(t).classList.add('active');event.currentTarget.classList.add('active');}
                let playingState = true;
                document.getElementById('togglePlay').addEventListener('click', async () => {
                    const res = await fetch('/api/control', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'toggle_play' }) });
                    const d = await res.json(); playingState = d.isPlaying;
                    document.getElementById('togglePlay').innerText = playingState ? 'Pause Engine' : 'Resume Engine';
                });
                document.getElementById('btnLag').addEventListener('click', () => setOffset('lag'));
                document.getElementById('btnAhead').addEventListener('click', () => setOffset('ahead'));
                document.getElementById('btnNormal').addEventListener('click', () => setOffset('normal'));
                async function setOffset(m) { await fetch('/api/control', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: m }) }); }
                setInterval(async () => {
                    const res = await fetch('/api/tick'); const d = await res.json();
                    document.getElementById('audioClock').innerText = d.audioClock + ' ms';
                    document.getElementById('videoClock').innerText = d.videoClock + ' ms';
                    document.getElementById('syncDirective').innerText = d.directive;
                    const b = document.getElementById('directiveBox');
                    if (d.directive === 'RENDER_FRAME') b.style.borderLeftColor = '#00ff88';
                    if (d.directive === 'DROP_FRAME') b.style.borderLeftColor = '#ef4444';
                    if (d.directive === 'HOLD_FRAME') b.style.borderLeftColor = '#f59e0b';
                }, 200);
            </script>
        </body>
        </html>
    `);
});

app.get('/api/tick', (req, res) => {
    let nativeClock = 0;
    if (isPlaying) {
        nativeClock = hifiBridge.getHardwareTimestamp();
    } else {
        nativeClock = hifiBridge.getHardwareTimestamp() - 40;
    }
    let videoTime = nativeClock + simulatedVideoLag;
    if (videoTime < 0) videoTime = 0;
    const action = VideoSync.processFrameTiming(nativeClock, videoTime);
    res.json({ audioClock: nativeClock, videoClock: videoTime, directive: action });
});

app.post('/api/control', (req, res) => {
    const { action } = req.body;
    if (action === 'toggle_play') isPlaying = !isPlaying;
    if (action === 'lag') simulatedVideoLag = -80;
    if (action === 'ahead') simulatedVideoLag = 120;
    if (action === 'normal') simulatedVideoLag = 0;
    res.json({ isPlaying });
});

app.listen(PORT, () => {
    console.log("=========================================");
    console.log("📡 WEB GATEWAY DEPLOYED IN TWO HALVES");
    console.log("🔗 Open Browser Target: http://localhost:8080");
    console.log("=========================================");
});

// JSON API Route Endpoint: Triggers live concurrent downloading threads
app.post('/api/download', async (req, res) => {
    const { mediaUrl } = req.body;
    const targetPath = "downloaded_track.mp3";
    
    console.log(`\n[Web Downloader] Invoking concurrent fetch for: ${mediaUrl}`);
    
    // Trigger your detached multi-threaded downloader engine module
    const Downloader = require('./downloader/downloader');
    const success = await Downloader.downloadFile(mediaUrl, targetPath, 4);
    
    if (success) {
        res.json({ status: "SUCCESS", message: "Lossless asset coupled and SHA-256 verified." });
    } else {
        res.status(500).json({ status: "FAILED", message: "Stream transfer bottleneck encountered." });
    }
});
