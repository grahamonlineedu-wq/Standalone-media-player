const VideoSyncEngine = {
    // Sync boundary threshold in milliseconds
    SYNC_THRESHOLD_MS: 30,

    /**
     * Inspects frame timelines against the master hardware audio clock
     * @param {number} audioTimestamp - Current time of the master audio clock (ms)
     * @param {number} videoTimestamp - Timestamp of the current video frame (ms)
     * @returns {string} - Execution command for the player hardware layer
     */
    processFrameTiming(audioTimestamp, videoTimestamp) {
        const drift = videoTimestamp - audioTimestamp;

        if (drift < -this.SYNC_THRESHOLD_MS) {
            // Video is lagging behind the master audio clock
            console.log(` -> [Sync Warning] Video lagging by ${Math.abs(drift)}ms. DIRECTIVE: DROP FRAME.`);
            return "DROP_FRAME";
        } else if (drift > this.SYNC_THRESHOLD_MS) {
            // Video frame arrived faster than the audio queue
            console.log(` -> [Sync Warning] Video ahead by ${drift}ms. DIRECTIVE: HOLD FRAME.`);
            return "HOLD_FRAME";
        } else {
            // Video frame matches the master audio timestamp perfectly
            return "RENDER_FRAME";
        }
    }
};

module.exports = VideoSyncEngine;
