const { execSync } = require('child_process');

const port = process.env.PORT || 3000;
console.log(`[ClearPort] Checking port ${port}...`);

try {
  if (process.platform === 'win32') {
    // Find active connection on the port using netstat
    const output = execSync(`netstat -ano`).toString();
    const lines = output.split('\n');
    const pids = new Set();
    
    // Look for lines containing local address with target port, e.g. "0.0.0.0:3000" or "[::]:3000" or "127.0.0.1:3000"
    const portRegex = new RegExp(`[:\\]]${port}\\s+`);
    
    for (const line of lines) {
      if (portRegex.test(line)) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && /^\d+$/.test(pid)) {
            pids.add(pid);
          }
        }
      }
    }
    
    if (pids.size > 0) {
      for (const pid of pids) {
        console.log(`[ClearPort] Killing zombie process ${pid} occupying port ${port}...`);
        try {
          execSync(`taskkill /F /PID ${pid}`);
          console.log(`[ClearPort] Successfully killed process ${pid}.`);
        } catch (e) {
          console.warn(`[ClearPort] Failed to kill process ${pid}: ${e.message}`);
        }
      }
    } else {
      console.log(`[ClearPort] No active process found on port ${port}.`);
    }
  } else {
    // macOS / Linux clear port command
    try {
      execSync(`lsof -t -i:${port} | xargs kill -9`);
      console.log(`[ClearPort] Cleared port ${port} on Unix system.`);
    } catch (e) {
      console.log(`[ClearPort] No active process on port ${port}.`);
    }
  }
} catch (err) {
  console.log(`[ClearPort] Port ${port} is already free.`);
}
