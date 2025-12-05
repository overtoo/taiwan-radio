#!/bin/bash
# Start script for Taiwan Radio on port 3023

echo "Starting Taiwan Radio on port 3023..."

# Check if already running
if lsof -Pi :3023 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 3023 is already in use. Stopping existing process..."
    lsof -ti:3023 | xargs kill -9
fi

# Start the server
yarn dev

