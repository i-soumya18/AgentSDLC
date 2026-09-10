#!/usr/bin/env bash
set -eo pipefail

echo "============================================================"
echo "          AGENTIC AI SDLC OS — VERIFICATION SUITE           "
echo "============================================================"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo ""
echo "[1/5] Checking Linter & Code Integrity..."
npm run lint

echo ""
echo "[2/5] Running Deterministic Tests (Unit & Contract)..."
npm test

echo ""
echo "[3/5] Auditing Machine-Enforced Quality Gates..."
node bin/engineering-os.js gate all 001-ai-task-copilot

echo ""
echo "[4/5] Checking Artifact Drift & Convergence..."
node bin/engineering-os.js drift 001-ai-task-copilot

echo ""
echo "[5/5] Running AI Evaluation Harness..."
node src/eval/eval-runner.js --dataset tests/evals/tool-use.jsonl --threshold 0.8
node src/eval/eval-runner.js --dataset tests/evals/adversarial.jsonl --threshold 0.8

echo ""
echo "============================================================"
echo "✨ ALL GATES PASSED: System is verified and release-ready! ✨"
echo "============================================================"
