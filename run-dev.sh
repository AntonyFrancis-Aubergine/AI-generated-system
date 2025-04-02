#!/bin/bash

# Run both frontend and backend
concurrently "cd Frontend && npm run dev" "cd backend && npm run dev" 