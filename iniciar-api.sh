#!/usr/bin/env bash
# Git Bash en Windows a veces no hereda el PATH donde está Node.

export PATH="/c/Program Files/nodejs:$PATH"
export PATH="/c/Program Files (x86)/nodejs:$PATH"
export PATH="$HOME/AppData/Local/Programs/nodejs:$PATH"

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/backend"

pick_npm() {
  if command -v npm >/dev/null 2>&1; then
    echo npm
    return 0
  fi
  if [ -f "/c/Program Files/nodejs/npm.cmd" ]; then
    echo "/c/Program Files/nodejs/npm.cmd"
    return 0
  fi
  if [ -f "/c/Program Files (x86)/nodejs/npm.cmd" ]; then
    echo "/c/Program Files (x86)/nodejs/npm.cmd"
    return 0
  fi
  if [ -f "$HOME/AppData/Local/Programs/nodejs/npm.cmd" ]; then
    echo "$HOME/AppData/Local/Programs/nodejs/npm.cmd"
    return 0
  fi
  return 1
}

if ! NPM_BIN="$(pick_npm)"; then
  echo ""
  echo "No se encontró npm. Node no está instalado o Git Bash no ve su carpeta."
  echo ""
  echo "1) Instalá Node LTS desde https://nodejs.org (marcá \"Add to PATH\")."
  echo "2) Cerrá Git Bash por completo y abrilo de nuevo."
  echo "3) Probar en el Explorador de archivos: doble clic en iniciar-api.bat"
  echo ""
  echo "Si Node ya está instalado, agregá al final de ~/.bashrc y abrí terminal nueva:"
  echo "  export PATH=\"/c/Program Files/nodejs:\$PATH\""
  echo ""
  exit 1
fi

set -e
if [ ! -d node_modules ]; then
  echo "Instalando dependencias del backend..."
  "$NPM_BIN" install
fi
echo "Iniciando API en http://localhost:3000"
"$NPM_BIN" run dev
