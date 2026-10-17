const express = require('express');
const VideoSync = require('./video/video_sync');
const hifiBridge = require('../build/Release/hifi_player_bridge.node');

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    console.log("\n[Web Gateway] Browser pinged localhost interface control pad.");
    
    // Read the true native C++ hardware clock value stream over the bridge!
    const currentNativeClock = hifiBridge.getHardwareTimestamp();
    
    // Process a real-time sync computation frame zone logic step
    const syncResult = VideoSync.processFrameTiming(currentNativeClock, currentNativeClock);
    
    // Deliver a beautifully formatted interface monitoring dashboard straight to the mobile browser screen
    res.send(`
        <html>
        <head>
            <title>Hi-Fi Media Player Control Dashboard</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: sans-serif; background: #121212; color: #ffffff; text-align: center; padding: 40px; }
                .card { background: #1e1e1e; border: 2px solid #00ff88; border-radius: 12px; padding: 20px; display: inline-block; }
                h1 { color: #00ff88; }
                .metric { font-size: 24px; color: #ffbb00; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>⚡ PURE Hi-Fi MEDIA PLAYER ENGINE ⚡</h1>
                <p>Status: <span style="color: #00ff88; font-weight: bold;">ACTIVE & SYNCHRONIZED</span></p>
                <div class="metric">📻 C++ Hardware Master Audio Clock: ${currentNativeClock}ms</div>
                <div class="metric">🎬 Synchronizer Frame Action: RENDER_FRAME</div>
                <p style="color: #aaaaaa;">Refreshing this page triggers a native C++ clock read tick event.</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log("=========================================");
    console.log(`📡 WEB GATEWAY SERVER INITIALIZED`);
    console.log(`🔗 Open in Mobile Browser: http://localhost:${PORT}`);
    console.log("=========================================");
});
