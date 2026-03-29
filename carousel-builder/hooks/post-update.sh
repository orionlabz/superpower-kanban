#!/usr/bin/env bash
set -euo pipefail

# Resolve plugin root from this script's location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Rebuilding server dependencies after update..."
npm install --production --prefix "$PLUGIN_ROOT/server"
echo "carousel-builder bridge updated."
