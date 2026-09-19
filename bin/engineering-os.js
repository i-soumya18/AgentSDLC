#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { runInit } from '../src/cli/init.js';
import { runStage } from '../src/cli/stage.js';
import { runGate } from '../src/cli/gate.js';
import { runDrift } from '../src/cli/drift.js';
import { runStatus } from '../src/cli/status.js';
import { runEval } from '../src/eval/eval-runner.js';
import { runVerify } from '../src/cli/verify.js';
import { runIdea } from '../src/cli/idea.js';
import { runDiscover } from '../src/cli/discover.js';
import { runClarify } from '../src/cli/clarify.js';
import { runContract } from '../src/cli/contract.js';
import { runApprove, runReject } from '../src/cli/approve.js';
import { runGraph } from '../src/cli/graph.js';
import { runContext } from '../src/cli/context.js';
import { runDesign } from '../src/cli/design.js';
import { STAGES } from '../src/lifecycle/stages.js';

const HELP_TEXT = `
\x1b[1m\x1b[36mAgentic AI SDLC OS (engineering-os / eos)\x1b[0m
\x1b[90mThe Reusable Engineering Operating System for AI-Native Software Factories\x1b[0m

\x1b[1mUSAGE:\x1b[0m
  eos <command> [options]
  engineering-os <command> [options]

\x1b[1mSOFTWARE FACTORY COMMANDS:\x1b[0m
  \x1b[32midea "<description>"\x1b[0m          Ingest raw idea and bootstrap adaptive product discovery
  \x1b[32mdiscover\x1b[0m                      View current discovery state, completeness, and pending questions
  \x1b[32mclarify "<answers>"\x1b[0m           Provide clarification answers, resolve unknowns and assumptions
  \x1b[32mcontract [--verify|change]\x1b[0m    Generate contract, audit integrity, or initiate scope change
  \x1b[32mapprove [--by <name>]\x1b[0m         Mutually approve product contract and cryptographically lock scope
  \x1b[32mreject [--reason <reason>]\x1b[0m    Record rejection of current product contract
  \x1b[32mgraph [lineage|impact|check]\x1b[0m  Generate and query product knowledge graph and traceability matrix
  \x1b[32mcontext [--task|role|explain]\x1b[0m Compile minimum sufficient context pack for agent execution
  \x1b[32mdesign [generate|check|tokens]\x1b[0m Generate & validate implementation-ready UX/UI specifications and contracts

\x1b[1mSDLC GOVERNANCE COMMANDS:\x1b[0m
  \x1b[32minit <project-dir>\x1b[0m            Bootstrap a complete project skeleton with full SDLC OS
  \x1b[32mstage <stage-name> [feature]\x1b[0m  Transition/scaffold one of 17 SDLC stages
  \x1b[32mgate <gate-name> [feature]\x1b[0m    Evaluate machine-verifiable gate evidence
  \x1b[32mstatus\x1b[0m                        Display visual SDLC pipeline dashboard
  \x1b[32mdrift [feature]\x1b[0m               Detect spec, contract, task, and code drift
  \x1b[32meval [options]\x1b[0m                Execute AI evaluation harness against test datasets
  \x1b[32mverify\x1b[0m                        Run full repository verification across all gates

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
  eos idea "Pharmacy POS for inventory and billing"
  eos discover
  eos clarify "Single store, offline billing needed, for pharmacists"
  eos contract
  eos approve --by "Lead Architect"
  eos contract --verify
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
      case 'idea':
        await runIdea(commandArgs);
        break;
      case 'discover':
        await runDiscover(commandArgs);
        break;
      case 'clarify':
        await runClarify(commandArgs);
        break;
      case 'contract':
        await runContract(commandArgs);
        break;
      case 'approve':
        await runApprove(commandArgs);
        break;
      case 'reject':
        await runReject(commandArgs);
        break;
      case 'graph':
        await runGraph(commandArgs);
        break;
      case 'context':
        await runContext(commandArgs);
        break;
      case 'design':
        await runDesign(commandArgs);
        break;
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
