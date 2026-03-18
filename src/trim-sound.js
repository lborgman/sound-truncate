//// From Claude AI

// @ts-check

const { execFile } = require("child_process");
const path = require("path");

/**
 * Copies the first `duration` seconds of an MP3 to a new file.
 * @param {string} inputPath  - Path to the source MP3 file
 * @param {string} outputPath - Path for the trimmed MP3 file
 * @param {number} start      - Seconds to start (default: 0)
 * @param {number} duration   - Seconds to keep (default: 10)
 */
function trimSound(inputPath, outputPath, start = 0, duration = 10) {
    const ext = (f) => path.extname(f).toLowerCase();
    const sameFormat = ext(inputPath) === ext(outputPath);
    return new Promise((resolve, reject) => {
        const args = [
            "-y",                        // Overwrite output if it exists
            "-i", inputPath,             // Input file
            "-ss", String(start),
            "-t", String(duration),      // Duration to copy
            // "-acodec", "copy",           // Copy audio stream (no re-encoding)
            ...(sameFormat ? ["-acodec", "copy"] : []),
            outputPath,                  // Output file
        ];

        execFile("ffmpeg", args, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`ffmpeg error: ${stderr || error.message}`));
            } else {
                resolve(outputPath);
            }
        });
    });
}

// --- Example usage ---
const [inputFile, outputFile] = process.argv.slice(2);

if (!inputFile || !outputFile) {
    console.error("Usage: node trim-mp3.js <input.mp3> <output.mp3>");
    process.exit(1);
}

trimSound(
    path.resolve(inputFile),
    path.resolve(outputFile),
    10
)
    .then((out) => console.log(`Done! Trimmed file saved to: ${out}`))
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });