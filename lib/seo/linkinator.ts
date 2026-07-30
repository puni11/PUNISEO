import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runLinkAudit(url: string) {
  try {
    const { stdout } = await execAsync(
      `npx linkinator "${url}" --recurse --format json`,
      {
        maxBuffer: 100 * 1024 * 1024,
      }
    );

    return JSON.parse(stdout);
  } catch (err: any) {
    // Linkinator may exit with code 1 even though stdout contains valid JSON.
    if (err.stdout) {
      try {
        return JSON.parse(err.stdout);
      } catch {}
    }

    throw new Error(err.stderr || err.message);
  }
}