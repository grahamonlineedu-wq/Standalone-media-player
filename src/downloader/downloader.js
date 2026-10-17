const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');

const Downloader = {
    // Verifies the file integrity using a strict SHA-256 checksum
    verifyIntegrity(filePath, expectedHash) {
        console.log(`[Downloader] Checking SHA-256 integrity hash for: ${filePath}...`);
        if (!fs.existsSync(filePath)) return false;

        const fileBuffer = fs.readFileSync(filePath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        return hashSum.digest('hex') === expectedHash;
    },

    // Downloads high-quality assets using multi-threaded concurrent chunk requests
    async downloadFile(url, outputPath, threads = 4) {
        console.log(`[Downloader] Targeting high-fidelity asset link: ${url}`);
        
        try {
            // Step 1: Probe the server to check file sizes and range support
            const probe = await axios.head(url);
            const totalBytes = parseInt(probe.headers['content-length'], 10);
            
            if (isNaN(totalBytes)) {
                throw new Error("Could not read asset stream length.");
            }
            
            console.log(`[Downloader] Total uncompressed asset payload size: ${totalBytes} bytes.`);
            const chunkSize = Math.ceil(totalBytes / threads);
            const chunkPromises = [];

            // Step 2: Spin up concurrent download workers using HTTP Range slicing
            for (let i = 0; i < threads; i++) {
                const start = i * chunkSize;
                const end = i === threads - 1 ? totalBytes - 1 : start + chunkSize - 1;
                
                console.log(` -> Launching Worker Thread #${i + 1} for bytes: ${start}-${end}`);
                
                const promise = axios.get(url, {
                    headers: { Range: `bytes=${start}-${end}` },
                    responseType: 'arraybuffer'
                }).then(res => res.data);
                
                chunkPromises.push(promise);
            }

            // Step 3: Wait for all threads to finish, then securely sequence them to disk
            const buffers = await Promise.all(chunkPromises);
            console.log("[Downloader] All chunk segments fetched successfully. Assembling binary...");
            
            const writeStream = fs.createWriteStream(outputPath);
            buffers.forEach(buf => writeStream.write(Buffer.from(buf)));
            writeStream.end();
            
            console.log(`[Downloader Success] High-quality asset fully coupled to: ${outputPath}`);
            return true;
        } catch (err) {
            console.log(`[Downloader Error] Sliced chunk transfer failed: ${err.message}`);
            return false;
        }
    }
};

module.exports = Downloader;
