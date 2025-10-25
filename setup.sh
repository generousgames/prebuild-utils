#!/bin/bash

# (1) Exit on error
# (2) Fail on unset variables
# (3) Fail on pipe failure
set -euo pipefail

# Load nvm (path may vary!)
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # Load nvm
  . "$NVM_DIR/nvm.sh"
else
  echo "❌ nvm not found. Please install nvm first."
  exit 1
fi

########################################################

EXPECTED_NODE_VERSION=$(cat .nvmrc)
NODE_VERSION=$(node --version)

echo "1. Checking Node.js version (${EXPECTED_NODE_VERSION}):"
if ! nvm ls 2>/dev/null | grep -q "${EXPECTED_NODE_VERSION}"; then
  echo "Installing missing Node.js version ${EXPECTED_NODE_VERSION} via nvm..."
  nvm install ${EXPECTED_NODE_VERSION}
fi
nvm use ${EXPECTED_NODE_VERSION}

########################################################

echo "2. Installing package dependencies:"
npm install --silent