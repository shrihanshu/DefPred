#!/bin/bash

# Quick Start Script for AI Defect Prediction Platform
# This script starts both backend and frontend servers

echo "🚀 Starting Explainable AI-Driven Software Defect Prediction Platform..."
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped. Goodbye!"
    exit 0
}

# Set up cleanup trap
trap cleanup SIGINT SIGTERM

# Use Python 3.11 if available (better compatibility with pinned ML dependencies)
if command -v python3.11 >/dev/null 2>&1; then
    PYTHON_BIN="python3.11"
else
    PYTHON_BIN="python3"
fi

# Check if backend virtual environment exists
if [ ! -d "$SCRIPT_DIR/backend/venv" ]; then
    echo "❌ Backend virtual environment not found!"
    echo "Please run: cd backend && $PYTHON_BIN -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Check if frontend node_modules exists
if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not installed!"
    echo "Please run: cd frontend && npm install"
    exit 1
fi

echo "📦 Checking backend..."
cd "$SCRIPT_DIR"
source backend/venv/bin/activate

# Check if backend can import required modules
python -c "import flask, pandas, numpy, sklearn, tensorflow, torch, shap, lime, optuna" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Backend dependencies missing!"
    echo "Please run: cd backend && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

echo "✅ Backend dependencies OK"
echo ""

echo "🔧 Starting Backend Server (Flask)..."
echo "📍 Backend URL: http://localhost:5001"
python -m backend.app > backend/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "❌ Backend failed to start. Check backend.log for errors."
    cat backend/backend.log
    exit 1
fi

echo "✅ Backend server started (PID: $BACKEND_PID)"
echo ""

cd "$SCRIPT_DIR/frontend"
echo "🔧 Starting Frontend Server (React)..."
echo "📍 Frontend URL: http://localhost:3000"
echo ""
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

echo ""
echo "✨ Platform is running!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐 Frontend:  http://localhost:3000"
echo "  🔌 Backend:   http://localhost:5001"
echo "  📊 Health:    http://localhost:5001/api/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Logs:"
echo "  Backend:  $SCRIPT_DIR/backend/backend.log"
echo "  Frontend: $SCRIPT_DIR/frontend/frontend.log"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running
wait
