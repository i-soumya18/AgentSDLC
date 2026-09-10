#!/usr/bin/env bash
set -eo pipefail

FEATURE="${1:-001-ai-task-copilot}"

node bin/engineering-os.js drift "$FEATURE"
