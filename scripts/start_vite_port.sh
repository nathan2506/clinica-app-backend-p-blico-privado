#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "Killing existing vite processes for this project..."
pkill -f "$PROJECT_ROOT/frontend" || true
sleep 0.3

echo "Starting vite on 127.0.0.1:5173 (logs -> frontend/vite.log)"
cd "$FRONTEND_DIR"
nohup npx vite --host 127.0.0.1 --port 5173 > vite.log 2>&1 &
echo "Started."
