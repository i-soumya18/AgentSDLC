import fs from 'node:fs/promises';
import path from 'node:path';
import { compileContext } from '../context/context-compiler.js';
import { findProjectRoot } from '../core/config.js';

export async function runContext(args = []) {
  const projectRoot = await findProjectRoot();

  let taskId = null;
  let role = 'BUILDER';
  let feature = '001-ai-task-copilot';
  let format = 'markdown';
  let outputFile = null;
  let showExplain = false;
  let showMetrics = false;

  // Argument parsing
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--task' || arg === '-t') {
      taskId = args[++i];
    } else if (arg === '--role' || arg === '-r') {
      role = args[++i];
    } else if (arg === '--feature' || arg === '-f') {
      feature = args[++i];
    } else if (arg === '--format') {
      format = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      outputFile = args[++i];
    } else if (arg === '--explain') {
      showExplain = true;
    } else if (arg === '--metrics') {
      showMetrics = true;
    } else if (arg === '--json') {
      format = 'json';
    } else if (!arg.startsWith('-') && !taskId) {
      // First positional argument can be taskId or role
      if (arg.toUpperCase().startsWith('TASK-')) {
        taskId = arg;
      } else {
        role = arg;
      }
    }
  }

  // If taskId wasn't provided, check if user supplied task as positional
  const output = await compileContext({
    task: taskId,
    role,
    feature,
    format,
    showExplain,
    showMetrics,
    projectRoot
  });

  if (outputFile) {
    const fullPath = path.resolve(projectRoot, outputFile);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, typeof output === 'string' ? output : JSON.stringify(output, null, 2), 'utf8');
    console.log(`\x1b[32m✓ Context pack written to:\x1b[0m ${outputFile}`);
  } else {
    console.log(output);
  }
}
