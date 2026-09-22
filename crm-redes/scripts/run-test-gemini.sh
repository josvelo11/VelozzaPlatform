#!/bin/bash
set -e
cd "$(dirname "$0")/.."

ENV_FILE=".env.local"

# Si ya guardamos la key antes, la carga sola — no vuelve a pedirla.
if [ -f "$ENV_FILE" ] && grep -q "^GEMINI_API_KEY=" "$ENV_FILE" 2>/dev/null; then
  export GEMINI_API_KEY=$(grep "^GEMINI_API_KEY=" "$ENV_FILE" | cut -d '=' -f2-)
  echo "✅ Usando GEMINI_API_KEY ya guardada en crm-redes/$ENV_FILE"
else
  echo "Pega tu GEMINI_API_KEY y presiona Enter (no se mostrará en pantalla):"
  read -s GEMINI_API_KEY
  echo
  export GEMINI_API_KEY

  if [ -z "$GEMINI_API_KEY" ]; then
    echo "No ingresaste ninguna key. Abortando."
    exit 1
  fi

  # La guarda para que las próximas corridas no la vuelvan a pedir.
  if grep -q "^GEMINI_API_KEY=" "$ENV_FILE" 2>/dev/null; then
    sed -i '' "s/^GEMINI_API_KEY=.*/GEMINI_API_KEY=$GEMINI_API_KEY/" "$ENV_FILE"
  else
    echo "GEMINI_API_KEY=$GEMINI_API_KEY" >> "$ENV_FILE"
  fi
  echo "✅ Key guardada en crm-redes/$ENV_FILE (ignorado por git) — no se volverá a pedir."
fi

echo ""
node scripts/test-gemini-image.mjs
