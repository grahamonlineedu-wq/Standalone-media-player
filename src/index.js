const VideoSync = require('./video/video_sync');
const Database = require('./database/db');
const fs = require('fs');

// FIXED PATH: Moving up one level out of src/ to successfully hook the compiled C++ addon
const hifiBridge = require(require('path').resolve(__dirname, '../build/Release/hifi_player_bridge.node'));

console.log("=========================================");
console.log("⚡ NATIVE NAPI C++ HARDWARE AUDIO ENGINE LIVE ⚡");
console.log("=========================================");

const PlayerEngine = {
    videoActive: true,

    async runNativePlaybackEngine() {
        console.log("[Master Controller] Initializing hardware synced session...");
        
        try {
            await Database.initializeTables();
        } catch (dbErr) {
            console.log("[Database Warning] Running session in isolated Offline Mode.");
        }

        console.log("\n=========================================");
        console.log("▶️ HARDWARE PLAYBACK MATRIX ACTIVE");
        console.log("=========================================");
        console.log("[Sync Core] Reading timelines directly from C++ Audio Driver Buffer...");
        console.log("-----------------------------------------");

        // Execute 4 successive frame ticks driven by the native C++ hardware clock
        for (let frameIndex = 0; frameIndex < 4; frameIndex++) {
            
            // Call our native C++ binary module directly!
            const nativeAudioMasterClock = hifiBridge.getHardwareTimestamp();
            
            let videoFrameTime = nativeAudioMasterClock;
            if (frameIndex === 1) videoFrameTime = 5;    // Forces frame drop logic evaluation
            if (frameIndex === 2) videoFrameTime = 250;  // Forces frame stall hold evaluation

            console.log(`[Frame #${frameIndex + 1}] C++ Master Audio Clock: ${nativeAudioMasterClock}ms | Video Canvas: ${videoFrameTime}ms`);
            
            const directive = VideoSync.processFrameTiming(nativeAudioMasterClock, videoFrameTime);
            
            if (directive === "RENDER_FRAME") {
                console.log(" 🟩 [Canvas Output] Drawing frame in absolute hardware synchronization.");
            } else if (directive === "DROP_FRAME") {
                console.log(" 🟥 [Canvas Output] Frame dropped! Flushing buffer to prevent lip-sync lag.");
            } else if (directive === "HOLD_FRAME") {
                console.log(" 🟨 [Canvas Output] Stall signal. Holding frame execution thread.");
            }
            console.log("-----------------------------------------");
        }
        
        console.log("[Engine Clean] Hardware synced evaluation completed successfully.");
    }
};

PlayerEngine.runNativePlaybackEngine();
