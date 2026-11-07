const HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Standalone Media Player</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      background: #0f172a; 
      color: #e2e8f0; 
      min-height: 100vh;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    
    /* Header */
    .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #334155; }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .status { font-size: 14px; color: #94a3b8; }
    .status.online { color: #22c55e; }
    
    /* Tabs */
    .tabs { display: flex; gap: 4px; margin: 20px 0; background: #1e293b; padding: 4px; border-radius: 12px; }
    .tab { 
      flex: 1; padding: 12px; background: transparent; border: none; 
      color: #94a3b8; cursor: pointer; border-radius: 8px; font-size: 15px; font-weight: 500;
      transition: all 0.2s;
    }
    .tab.active { background: #3b82f6; color: white; }
    .tab:hover:not(.active) { background: #334155; color: #e2e8f0; }
    
    /* Tab Content */
    .tab-content { display: none; animation: fadeIn 0.3s; }
    .tab-content.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
    /* Card */
    .card { background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #334155; }
    .card h3 { margin-bottom: 16px; font-size: 18px; }
    
    /* Player Controls */
    .player-controls { display: flex; justify-content: center; gap: 12px; margin: 20px 0; }
    .btn-circle { 
      width: 56px; height: 56px; border-radius: 50%; border: none; 
      background: #3b82f6; color: white; cursor: pointer; font-size: 20px;
      display: flex; align-items: center; justify-content: center;
    }
    .btn-circle:hover { background: #2563eb; }
    .btn-circle.play { width: 64px; height: 64px; font-size: 24px; }
    
    .progress-bar { width: 100%; height: 6px; background: #334155; border-radius: 3px; margin: 16px 0; cursor: pointer; }
    .progress { height: 100%; background: #3b82f6; border-radius: 3px; width: 30%; }
    .time { display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; }
    
    /* Inputs */
    input, textarea { 
      width: 100%; padding: 12px; margin: 8px 0; border-radius: 8px; 
      border: 1px solid #334155; background: #0f172a; color: #e2e8f0; 
      font-family: inherit; font-size: 15px;
    }
    input:focus, textarea:focus { outline: none; border-color: #3b82f6; }
    
    /* Buttons */
    .btn { 
      background: #3b82f6; color: white; border: none; padding: 12px 24px; 
      border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 500; width: 100%;
    }
    .btn:hover { background: #2563eb; }
    .btn:disabled { background: #334155; cursor: not-allowed; }
    
    /* Response area */
    #response { 
      margin-top: 16px; padding: 16px; background: #0f172a; border-radius: 8px; 
      white-space: pre-wrap; min-height: 60px; border: 1px solid #334155;
    }
    
    /* Playlist */
    .playlist-item { 
      padding: 12px; background: #0f172a; border-radius: 8px; margin: 8px 0; 
      cursor: pointer; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;
    }
    .playlist-item:hover { border-color: #3b82f6; }
    .playlist-item.active { background: #1e3a8a; border-color: #3b82f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Standalone Media Player</h1>
      <div class="status online" id="status">● API Online</div>
    </div>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('player')">Player</button>
      <button class="tab" onclick="switchTab('chat')">AI Chat</button>
      <button class="tab" onclick="switchTab('settings')">Settings</button>
    </div>

    <!-- Player Tab -->
    <div id="player" class="tab-content active">
      <div class="card">
        <h3>Now Playing</h3>
        <div style="text-align: center; padding: 20px 0;">
          <div style="font-size: 18px; margin-bottom: 4px;" id="track-name">No track selected</div>
          <div style="font-size: 14px; color: #94a3b8;" id="artist-name">Select from playlist</div>
        </div>
        <div class="progress-bar"><div class="progress" id="progress"></div></div>
        <div class="time"><span id="current-time">0:00</span><span id="duration">0:00</span></div>
        <div class="player-controls">
          <button class="btn-circle" onclick="prevTrack()">⏮</button>
          <button class="btn-circle play" id="playBtn" onclick="togglePlay()">▶</button>
          <button class="btn-circle" onclick="nextTrack()">⏭</button>
        </div>
      </div>
      
      <div class="card">
        <h3>Playlist</h3>
        <div id="playlist">
          <div class="playlist-item" onclick="loadTrack('Lo-fi Study Beat', 'AI Generated', 180)">
            <span>Lo-fi Study Beat</span><span style="color: #94a3b8;">3:00</span>
          </div>
          <div class="playlist-item" onclick="loadTrack('Coding Flow', 'AI Generated', 240)">
            <span>Coding Flow</span><span style="color: #94a3b8;">4:00</span>
          </div>
          <div class="playlist-item" onclick="loadTrack('Deep Focus', 'AI Generated', 300)">
            <span>Deep Focus</span><span style="color: #94a3b8;">5:00</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Tab -->
    <div id="chat" class="tab-content">
      <div class="card">
        <h3>AI Assistant</h3>
        <p style="color: #94a3b8; margin-bottom: 16px; font-size: 14px;">Ask for song recommendations, playlist ideas, or anything else</p>
        <textarea id="prompt" rows="3" placeholder="Suggest a playlist for late night coding...">Suggest a song for coding</textarea>
        <button class="btn" onclick="askAI()">Send to AI</button>
        <div id="response">AI responses will appear here...</div>
      </div>
    </div>

    <!-- Settings Tab -->
    <div id="settings" class="tab-content">
      <div class="card">
        <h3>API Status</h3>
        <div style="font-size: 14px; color: #94a3b8;">
          <div>Endpoint: <span id="api-url"></span></div>
          <div style="margin-top: 8px;">OpenAI: <span id="openai-status">Checking...</span></div>
        </div>
      </div>
      <div class="card">
        <h3>About</h3>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
          Standalone Media Player v1.0<br>
          Powered by Cloudflare Workers + OpenAI<br>
          Deployed: ${new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>

  <script>
    const API_URL = window.location.origin;
    let isPlaying = false;
    let currentTrack = null;
    
    // Init
    document.getElementById('api-url').textContent = API_URL;
    checkAPI();
    
    function switchTab(tabName) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    }
    
    async function checkAPI() {
      try {
        const res = await fetch(API_URL + '/');
        const data = await res.json();
        document.getElementById('status').textContent = '● ' + data.message;
        document.getElementById('openai-status').textContent = 'Connected';
        document.getElementById('openai-status').style.color = '#22c55e';
      } catch (e) {
        document.getElementById('status').textContent = '● Offline';
        document.getElementById('status').classList.remove('online');
      }
    }
    
    async function askAI() {
      const prompt = document.getElementById('prompt').value;
      const resDiv = document.getElementById('response');
      resDiv.textContent = 'Thinking...';
      
      try {
        const res = await fetch(API_URL + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }]
          })
        });
        const data = await res.json();
        if (data.error) {
          resDiv.textContent = 'Error: ' + data.error;
        } else {
          resDiv.textContent = data.choices?.[0]?.message?.content || 'No response';
        }
      } catch (e) {
        resDiv.textContent = 'Error: ' + e.message;
      }
    }
    
    // Player functions
    function loadTrack(name, artist, duration) {
      currentTrack = { name, artist, duration };
      document.getElementById('track-name').textContent = name;
      document.getElementById('artist-name').textContent = artist;
      document.getElementById('duration').textContent = formatTime(duration);
      document.querySelectorAll('.playlist-item').forEach(item => item.classList.remove('active'));
      event.target.closest('.playlist-item').classList.add('active');
      isPlaying = false;
      document.getElementById('playBtn').textContent = '▶';
    }
    
    function togglePlay() {
      if (!currentTrack) {
        alert('Select a track first');
        return;
      }
      isPlaying = !isPlaying;
      document.getElementById('playBtn').textContent = isPlaying ? '⏸' : '▶';
    }
    
    function prevTrack() { alert('Previous track'); }
    function nextTrack() { alert('Next track'); }
    function formatTime(s) { return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); }
  </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Serve HTML frontend for browsers
    if (url.pathname === '/' && request.headers.get('accept')?.includes('text/html')) {
      return new Response(HTML, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }

    // JSON health check
    if (url.pathname === '/') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        message: 'Media Player API running',
        endpoints: ['/api/chat']
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // OpenAI Chat endpoint
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      if (!env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      try {
        const body = await request.json();
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: body.model || 'gpt-4o-mini',
            messages: body.messages || [],
            temperature: body.temperature || 0.7,
            max_tokens: body.max_tokens || 500
          })
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
};
