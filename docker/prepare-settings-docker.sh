#!/usr/bin/env bash
echo "window.apiBasePath='${API_BASE_PATH:-http://localhost:3000}'" > /usr/share/nginx/html/updateSettings.js