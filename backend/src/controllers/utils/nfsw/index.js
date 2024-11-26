import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class NSFWDetector {
  constructor() {
    this.pythonScript = join(__dirname, 'video_nsfw_detector.py');
  }

  async detectNSFW(videoPath) {
    const outputPath = join(__dirname, `nsfw_result_${Date.now()}.json`);
    
    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('NSFW detection timed out'));
      }, 60000); // 60 seconds timeout

      const pythonProcess = spawn('python', [
        this.pythonScript,
        videoPath,
        outputPath
      ], {
        // Improve process isolation
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
      });

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data;
        console.log(`Python Output: ${data}`);
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data;
        console.error(`Python Error: ${data}`);
      });

      pythonProcess.on('close', async (code) => {
        // Clear timeout
        clearTimeout(timeout);

        try {
          // Ensure process completed successfully
          if (code !== 0) {
            throw new Error(`Python process failed with code ${code}. 
              Stderr: ${stderrData}`);
          }

          // Read and parse result
          const resultJson = await this.safeReadFile(outputPath);
          const result = JSON.parse(resultJson);

          // Validate result structure
          if (!this.validateResult(result)) {
            throw new Error('Invalid NSFW detection result');
          }

          // Cleanup output file
          await this.safeDeleteFile(outputPath);

          resolve({
            is_nsfw: result.is_nsfw || false,
            confidence: result.confidence || 0,
            details: result.details || [],
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          // Cleanup file in case of error
          await this.safeDeleteFile(outputPath);

          console.error('NSFW Detection Error:', {
            message: error.message,
            stdout: stdoutData,
            stderr: stderrData
          });

          reject(error);
        }
      });

      // Handle any unexpected errors
      pythonProcess.on('error', async (error) => {
        // Clear timeout
        clearTimeout(timeout);

        // Cleanup file
        await this.safeDeleteFile(outputPath);

        console.error('Python Process Error:', error);
        reject(error);
      });
    });
  }

  // Safe file reading with error handling
  async safeReadFile(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      throw new Error(`Could not read NSFW detection result file: ${error.message}`);
    }
  }

  // Safe file deletion with error handling
  async safeDeleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`Failed to delete file ${filePath}:`, error);
      }
    }
  }

  // Validate the structure of the result
  validateResult(result) {
    return (
      result && 
      typeof result.is_nsfw === 'boolean' &&
      typeof result.confidence === 'number' &&
      Array.isArray(result.details)
    );
  }
}

export default new NSFWDetector();