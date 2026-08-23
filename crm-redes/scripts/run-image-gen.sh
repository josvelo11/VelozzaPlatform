#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "Pega tu GEMINI_API_KEY y presiona Enter (no se mostrará en pantalla):"
read -s GEMINI_API_KEY
echo
export GEMINI_API_KEY

if [ -z "$GEMINI_API_KEY" ]; then
  echo "No ingresaste ninguna key. Abortando."
  exit 1
fi

echo ""
echo "=== Corriendo dry-run (no gasta nada) ==="
node scripts/generate-course-images.mjs --dry-run

echo ""
read -p "¿Continuar con la generación real? (s/n): " confirm
if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
  echo ""
  echo "=== Generando imágenes ==="
  node scripts/generate-course-images.mjs
else
  echo "Cancelado, no se generó nada."
fi
