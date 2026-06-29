import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const ports = [3000, 3001, 3002, 3003, 3004, 3010, 3099];

for (const port of ports) {
  try {
    if (process.platform === 'win32') {
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const pids = [
        ...new Set(
          out
            .split('\n')
            .map((line) => line.trim().split(/\s+/).pop())
            .filter((pid) => pid && /^\d+$/.test(pid))
        ),
      ];
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        } catch {
          /* already dead */
        }
      }
    } else {
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
    }
  } catch {
    /* port free */
  }
}

rmSync(join(root, '.next'), { recursive: true, force: true });
console.log('Clean. Run: npm run dev');
