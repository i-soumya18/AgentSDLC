import { runGate } from './gate.js';
import { runDrift } from './drift.js';
import { runEval } from '../eval/eval-runner.js';

export async function runVerify(args) {
  console.log('\x1b[1m\x1b[36m============================================================\x1b[0m');
  console.log('\x1b[1m\x1b[36m          RUNNING FULL AGENTIC SDLC VERIFICATION           \x1b[0m');
  console.log('\x1b[1m\x1b[36m============================================================\x1b[0m\n');

  console.log('\x1b[1m[STEP 1/3] Quality Gates Audit\x1b[0m');
  await runGate(['all', args[0] || '001-ai-task-copilot']);

  console.log('\n\x1b[1m[STEP 2/3] Artifact Drift & Traceability Check\x1b[0m');
  await runDrift([args[0] || '001-ai-task-copilot']);

  console.log('\n\x1b[1m[STEP 3/3] AI Behavioral & Guardrail Evaluation\x1b[0m');
  await runEval(['--dataset', 'tests/evals/tool-use.jsonl', '--threshold', '0.8']);

  console.log('\n\x1b[32m\x1b[1m✓ Full SDLC Verification Completed Successfully!\x1b[0m\n');
}
