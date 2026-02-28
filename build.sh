#!/usr/bin/env bash
# exit on error
set -o errexit

# Install backend dependencies
pip install -r EmergencyAgentic/requirements.txt

# Install and build frontend
cd app
npm install
npm run build -- --emptyOutDir
cd ..

# Done
