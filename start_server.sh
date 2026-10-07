#!/bin/bash

# Start a local development server for the lecture slides.
#
#   ./start_server.sh          -> http://localhost:8080 with live reload
#   ./start_server.sh 9000     -> other port
#   NO_LIVE=1 ./start_server.sh -> plain python http.server (no node needed)
#
# Live reload: every saved change under the repo triggers a browser refresh,
# and files are served with no-cache headers, so no more stale 304 responses.
# Press Ctrl+C to stop the server.

PORT=${1:-8080}
cd "$(dirname "$0")"

if [ -z "$NO_LIVE" ] && command -v npx >/dev/null 2>&1; then
  echo "Starting live-reload server at http://localhost:$PORT"
  echo "Press Ctrl+C to stop"
  echo ""
  exec npx -y live-server \
    --port="$PORT" \
    --no-browser \
    --wait=200 \
    --ignore=slides/reveal.js,.git,animations
fi

echo "Starting plain development server at http://localhost:$PORT (no live reload)"
echo "Press Ctrl+C to stop"
echo ""
exec python3 - "$PORT" <<'PY'
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        # drop conditional headers so the server never answers 304
        self.headers.replace_header("If-Modified-Since", "") if "If-Modified-Since" in self.headers else None
        self.headers.replace_header("If-None-Match", "") if "If-None-Match" in self.headers else None
        return super().send_head()

ThreadingHTTPServer(("", int(sys.argv[1])), NoCacheHandler).serve_forever()
PY
