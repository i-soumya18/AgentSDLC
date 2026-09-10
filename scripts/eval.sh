#!/usr/bin/env bash
set -eo pipefail

DATASET="${1:-tests/evals/tool-use.jsonl}"
THRESHOLD="${2:-0.8}"

node src/eval/eval-runner.js --dataset "$DATASET" --threshold "$THRESHOLD"
