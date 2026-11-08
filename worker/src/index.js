const HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Standalone Media Player</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      background: #0f172a; color: #e2e8f0; min-height: 100vh;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #334155; }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .status { font-size: 14px; color: #22c55e; }
    
    .tabs { display: flex; gap: 4px; margin: 20px 0; background: #1e293b; padding: 4px; border-radius: 12px; }
    .tab { 
      flex: 1; padding: 12px; background: transparent; border: none; 
      color: #94a3b8; cursor: pointer; border-radius: 8px; font-size: 15px; font-weight: 500;
    }
    .tab.active { background: #3b82f6; color: white; }
    
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    
    .card { background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #334155; }
    .card h3 { margin-bottom: 16px; font-size: 18px; }
    
    .player-controls { display: flex; justify-content: center; gap: 12px; margin: 20px 0; }
    .btn-circle { 
      width: 56px; height: 56px; border-radius: 50%; border: none; 
      background: #3b82f6; color: white; cursor: pointer; font-size: 20px;
      display: flex; align-items: center; justify-content: center;
    }
    .btn-circle:hover { background: #2563eb; }
    .btn-circle.play { width: 64px; height: 64px; font-size: 24px; }
    
    .progress-bar { width: 100%; height: 6px; background: #334155; border-radius: 3px; margin: 16px 0; cursor: pointer; }
    .progress { height: 100%; background: #3b82f6; border-radius: 3px; width: 0%; transition: width 0.1s; }
    .time { display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; }
    
    input, textarea { 
      width: 100%; padding: 12px; margin: 8px 0; border-radius: 8px; 
      border: 1px solid #334155; background: #0f172a; color: #e2e8f0; 
      font-family: inherit; font-size: 15px;
    }
    .btn { 
      background: #3b82f6; color: white; border: none; padding: 12px 24px; 
      border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 500; width: 100%;
    }
    .btn:hover { background: #2563eb; }
    
    #response { 
      margin-top: 16px; padding: 16px; background: #0f172a; border-radius: 8px; 
      white-space: pre-wrap; min-height: 60px; border: 1px solid #334155;
    }
    
    .playlist-item { 
      padding: 12px; background: #0f172a; border-radius: 8px; margin: 8px 0; 
      cursor: pointer; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;
    }
    .playlist-item:hover { border-color: #3b82f6; }
    .playlist-item.active { background: #1e3a8a; border-color: #3b82f6; }
    
    audio { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Standalone Media Player</h1>
      <div class="status" id="status">● API Online</div>
    </div>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('player', this)">Player</button>
      <button class="tab" onclick="switchTab('chat', this)">AI Chat</button>
      <button class="tab" onclick="switchTab('settings', this)">Settings</button>
    </div>

    <!-- Player Tab -->
    <div id="player" class="tab-content active">
      <audio id="audioPlayer"></audio>
      <div class="card">
        <h3>Now Playing</h3>
        <div style="text-align: center; padding: 20px 0;">
          <div style="font-size: 18px; margin-bottom: 4px;" id="track-name">No track selected</div>
          <div style="font-size: 14px; color: #94a3b8;" id="artist-name">Select from playlist</div>
        </div>
        <div class="progress-bar" onclick="seek(event)"><div class="progress" id="progress"></div></div>
        <div class="time"><span id="current-time">0:00</span><span id="duration">0:00</span></div>
        <div class="player-controls">
          <button class="btn-circle" onclick="prevTrack()">⏮</button>
          <button class="btn-circle play" id="playBtn" onclick="togglePlay()">▶</button>
          <button class="btn-circle" onclick="nextTrack()">⏭</button>
        </div>
      </div>
      
      <div class="card">
        <h3>Playlist</h3>
        <div id="playlist"></div>
      </div>
    </div>

    <!-- Chat Tab -->
    <div id="chat" class="tab-content">
      <div class="card">
        <h3>AI Assistant</h3>
        <p style="color: #94a3b8; margin-bottom: 16px; font-size: 14px;">Ask for song recommendations or playlist ideas</p>
        <textarea id="prompt" rows="3" placeholder="Suggest a playlist for late night coding...">Suggest a lo-fi song for coding</textarea>
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
          <div style="margin-top: 8px;">OpenAI: <span id="openai-status">Connected</span></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const API_URL = window.location.origin;
    const audio = document.getElementById('audioPlayer');
    let isPlaying = false;
    let currentTrackIndex = -1;
    
    // Free demo tracks from Pixabay - replace with your own
    const tracks = [
      { name: 'Lo-fi Study Beat', artist: 'Pixabay', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', duration: 140 },
      { name: 'Coding Flow', artist: 'Pixabay', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', duration: 150 },
      { name: 'Deep Focus', artist: 'Pixabay', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_884fe5b557.mp3', duration: 218 }
    ];
    
    // Init
    document.getElementById('api-url').textContent = API_URL;
    renderPlaylist();
    checkAPI();
    
    // Audio events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
      document.getElementById('duration').textContent = formatTime(audio.duration);
    });
    audio.addEventListener('ended', nextTrack);
    
    function switchTab(tabName, el) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    }
    
    function renderPlaylist() {
      const playlistDiv = document.getElementById('playlist');
      playlistDiv.innerHTML = tracks.map((track, i) => \`
        <div class="playlist-item" onclick="loadTrack(\${i})">
          <span>\${track.name}</span>
          <span style="color: #94a3b8;">\${formatTime(track.duration)}</span>
        </div>
      \`).join('');
    }
    
    function loadTrack(index) {
      currentTrackIndex = index;
      const track = tracks[index];
      audio.src = track.url;
      document.getElementById('track-name').textContent = track.name;
      document.getElementById('artist-name').textContent = track.artist;
      document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
      audio.play();
      isPlaying = true;
      document.getElementById('playBtn').textContent = '⏸';
    }
    
    function togglePlay() {
      if (currentTrackIndex === -1) {
        loadTrack(0);
        return;
      }
      if (isPlaying) {
        audio.pause();
        document.getElementById('playBtn').textContent = '▶';
      } else {
        audio.play();
        document.getElementById('playBtn').textContent = '⏸';
      }
      isPlaying = !isPlaying;
    }
    
    function prevTrack() {
      if (currentTrackIndex > 0) loadTrack(currentTrackIndex - 1);
      else loadTrack(tracks.length - 1);
    }
    
    function nextTrack() {
      if (currentTrackIndex < tracks.length - 1) loadTrack(currentTrackIndex + 1);
      else loadTrack(0);
    }
    
    function updateProgress() {
      const percent = (audio.currentTime / audio.duration) * 100;
      document.getElementById('progress').style.width = percent + '%';
      document.getElementById('current-time').textContent = formatTime(audio.currentTime);
    }
    
    function seek(e) {
      const bar = e.currentTarget;
      const percent = e.offsetX / bar.offsetWidth;
      audio.currentTime = percent * audio.duration;
    }
    
    function formatTime(s) {
      if (isNaN(s)) return '0:00';
      return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0');
    }
    
    async function checkAPI() {
      try {
        const res = await fetch(API_URL + '/');
        const data = await res.json();
        document.getElementById('status').textContent = '● ' + data.message;
      } catch (e) {
        document.getElementById('status').textContent = '● Offline';
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
        resDiv.textContent = data.choices?.[0]?.message?.content || data.error || 'No response';
      } catch (e) {
        resDiv.textContent = 'Error: ' + e.message;
      }
    }
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

    if (url.pathname === '/' && request.headers.get('accept')?.includes('text/html')) {
      return new Response(HTML, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (url.pathname === '/') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        message: 'Media Player API running' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

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
          body: JSON.stringify(body)
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
