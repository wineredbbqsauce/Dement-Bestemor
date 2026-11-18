#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# ─── Farger ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ─── OS-deteksjon ────────────────────────────────────────────────────────────
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
case "$OS" in
  linux*)               OS="linux" ;;
  darwin*)              OS="mac" ;;
  mingw*|msys*|cygwin*) OS="windows" ;;
  *)                    echo -e "${RED}Ukjent OS: $OS${NC}"; exit 1 ;;
esac

echo ""
echo -e "${CYAN}🎫 Dement-Bestemor — setup${NC}"
echo ""

# ─── Node.js ─────────────────────────────────────────────────────────────────
echo "Sjekker om Node.js er installert"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js er ikke installert.${NC}"
    echo -e "${CYAN}Installerer Node.js 20 LTS${NC}"

    if [ "$OS" == "linux" ]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs
    elif [ "$OS" == "mac" ]; then
        if ! command -v brew &> /dev/null; then
            echo "Installerer Homebrew"
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install node@20
    elif [ "$OS" == "windows" ]; then
        echo -e "${RED}Installer Node.js fra https://nodejs.org${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓  Node.js installert${NC}"
else
    echo -e "${GREEN}✓  Node.js allerede installert: $(node --version)${NC}"
fi

# ─── Versjonssjekk (discord.js v14 krever 18+) ───────────────────────────────
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo -e "${RED}Node $(node --version) er for gammel — trenger 18+.${NC}"
    echo "Oppgrader med nvm:  nvm install 20 && nvm use 20"
    exit 1
fi

echo ""

# ─── Avhengigheter ───────────────────────────────────────────────────────────
echo -e "${CYAN}Installerer npm-pakker${NC}"
npm install
echo -e "${GREEN}✓  Avhengigheter installert${NC}"

echo ""

# ─── .env-sjekk (lager den IKKE, bare minner deg) ────────────────────────────
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠  Ingen .env-fil funnet.${NC}"
    echo -e "   Lag en med:  ${CYAN}echo 'TOKEN=ditt-token' > .env${NC}"
    echo -e "   eller kopier malen:  ${CYAN}cp .env.example .env${NC}"
    echo ""
fi

# ─── Ferdig ──────────────────────────────────────────────────────────────────
echo -e "${GREEN}✓  Setup ferdig!${NC}"
echo ""
echo "Starter boten med:"
echo -e "   ${CYAN}node index.js${NC}"
node index.js
echo ""