#!/bin/bash

# Go to the library directory
cd youtube-transcript-plus-main

# Install dependencies
npm install

# Build the library
npm run build

# Return to the root directory
cd ..

echo "Library built successfully!"
