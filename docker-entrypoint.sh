#!/bin/sh
set -e

# The backend Express app will serve both API routes and static frontend files
# We need to copy the static frontend into the dist directory so Express can serve it
mkdir -p dist/frontend-out
cp -r frontend-out/* dist/frontend-out/

# Start the Node.js application
exec node dist/index.js
