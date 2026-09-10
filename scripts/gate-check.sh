#!/usr/bin/env bash
set -eo pipefail

GATE="${1:-all}"
FEATURE="${2:-001-ai-task-copilot}"

node bin/engineering-os.js gate "$GATE" "$FEATURE"
