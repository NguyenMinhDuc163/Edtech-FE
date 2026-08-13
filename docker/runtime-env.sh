#!/bin/sh
set -eu

if [ -z "${VITE_API_URL:-}" ]; then
  echo "[ERROR] VITE_API_URL is required at container startup" >&2
  exit 1
fi

VITE_API_URL="${VITE_API_URL%/}"
export VITE_API_URL

envsubst '${VITE_API_URL}' \
  < /usr/share/nginx/html/env-config.template.js \
  > /usr/share/nginx/html/env-config.js
