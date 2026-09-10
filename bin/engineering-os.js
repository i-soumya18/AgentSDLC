#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { runInit } from '../src/cli/init.js';
import { runStage } from '../src/cli/stage.js';
import { runGate } from '../src/cli/gate.js';
import { runDrift } from '../src/cli/drift.js';
import { runStatus } from '../src/cli/status.js';
import { runEval } from '../src/eval/eval-runner.js';
import { runVerify } from '../src/cli/verify.js';

const HELP_TEXT = `
\x1b[1m\x1b[36mAgentic AI SDLC OS (engineering-os / eos)\x1b[0m
\x1b[90mThe Reusable Engineering Operating System for AI-Native Software Factories\x1b[0m

\x1b[1mUSAGE:\x1b[0m
  eos <command> [options]
  engineering-os <command> [options]

\x1b[1mCOMMANDS:\x1b[0m
  \x1b[32minit <project-dir>\x1b[0m           Bootstrap a complete project skeleton with full SDLC OS
  \x1b[32mstage <stage-name> [feature]\x1b[0m Transition/scaffold one of 15 SDLC stages
  \x1b[32mgate <gate-name> [feature]\x1b[0m   Evaluate machine-verifiable gate evidence
  \x1b[32mstatus\x1b[0m                       Display visual SDLC pipeline dashboard
  \x1b[32mdrift [feature]\x1b[0m              Detect spec, contract, task, and code drift
  \x1b[32meval [options]\x1b[0m               Execute AI evaluation harness against test datasets
  \x1b[32mverify\x1b[0m                       Run full repository verification across all gates

\x1b[1mSDLC STAGES:\x1b[0m
  assess -> constitution -> specify -> clarify -> design -> architect ->
  contract -> plan -> tasks -> implement -> verify -> review -> security ->
  eval -> release -> observe -> converge

\x1b[1mOPTIONS:\x1b[0m
  -h, --help       Show help
  -v, --version    Show version
  -p, --preset     Init preset: standard (default), strict, minimal
  -t, --template   Tech stack: fullstack, node-ts, python-fastapi, library
  --threshold      Evaluation score threshold (0.0 - 1.0, default 0.8)
  --json           Output result in JSON format

\x1b[1mEXAMPLES:\x1b[0m
  eos init my-awesome-app --template fullstack --preset strict
  eos stage specify 001-user-auth
  eos gate contract 001-user-auth
  eos eval --dataset tests/evals/tool-use.jsonl
  eos drift 001-user-auth
  eos verify
`;

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (args.includes('-v') || args.includes('--version')) {
    console.log('engineering-os v1.0.0');
    process.exit(0);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    switch (command) {
      case 'init':
        await runInit(commandArgs);
        break;
      case 'stage':
        await runStage(commandArgs);
        break;
      case 'gate':
        await runGate(commandArgs);
        break;
      case 'drift':
        await runDrift(commandArgs);
        break;
      case 'status':
        await runStatus(commandArgs);
        break;
      case 'eval':
        await runEval(commandArgs);
        break;
      case 'verify':
        await runVerify(commandArgs);
        break;
      default:
        console.error(`\x1b[31mUnknown command: ${command}\x1b[0m\nUse --help to view available commands.`);
        process.exit(1);
    }
  } catch (err) {
    console.error(`\x1b[31mError:\x1b[0m ${err.message}`);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(1);
  }
}

main();
