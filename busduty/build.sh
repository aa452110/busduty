#!/bin/bash

# Build the web app
cd web
npm install
npm run build
cd ..

# Copy functions to the root for Cloudflare Pages to detect
cp -r functions ../functions

echo "Build complete!"