#!/usr/bin/env bash
set -euo pipefail

GITHUB_REPO="orionlabz/orionlabz"
BRANCH="main"
PLUGIN_SUBDIR="carousel-builder"
INSTALL_DIR="$HOME/.local/share/carousel-builder"
LINK_DIR="$HOME/.local/bin"
LINK_PATH="$LINK_DIR/carousel"

echo "Carousel Builder CLI installer"
echo ""

# Check if already installed via Claude Code plugin
CLAUDE_PLUGIN_PATH="$HOME/.claude/plugins/marketplaces/orionlabz/$PLUGIN_SUBDIR"
if [ -d "$CLAUDE_PLUGIN_PATH" ]; then
  echo "Found Claude Code plugin at $CLAUDE_PLUGIN_PATH"
  PLUGIN_ROOT="$CLAUDE_PLUGIN_PATH"
else
  echo "Fetching carousel-builder from GitHub..."
  mkdir -p "$INSTALL_DIR"
  # Sparse checkout — only the carousel-builder directory
  git -C "$INSTALL_DIR" init -q 2>/dev/null || true
  git -C "$INSTALL_DIR" remote get-url origin &>/dev/null || \
    git -C "$INSTALL_DIR" remote add origin "https://github.com/$GITHUB_REPO.git"
  git -C "$INSTALL_DIR" sparse-checkout init --cone
  git -C "$INSTALL_DIR" sparse-checkout set "$PLUGIN_SUBDIR"
  git -C "$INSTALL_DIR" fetch --depth=1 origin "$BRANCH" -q
  git -C "$INSTALL_DIR" checkout "$BRANCH" -q
  PLUGIN_ROOT="$INSTALL_DIR/$PLUGIN_SUBDIR"
fi

echo "Installing server dependencies..."
npm install --production --prefix "$PLUGIN_ROOT/server"
echo "Dependencies installed."

CLI_SRC="$PLUGIN_ROOT/bin/carousel.js"
chmod +x "$CLI_SRC"
mkdir -p "$LINK_DIR"

if [ -L "$LINK_PATH" ]; then rm "$LINK_PATH"; fi
ln -s "$CLI_SRC" "$LINK_PATH"
echo "carousel CLI installed → $LINK_PATH"

if ! echo "$PATH" | tr ':' '\n' | grep -qx "$LINK_DIR"; then
  echo ""
  echo "WARNING: $LINK_DIR is not in your PATH."
  echo "Add this to your shell profile (~/.zshrc or ~/.bashrc):"
  echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
fi
