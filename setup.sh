#!/bin/bash

# Setup script for Explainable AI-Driven Software Defect Prediction Platform

echo "=========================================="
echo "Setting up Defect Prediction Platform"
echo "=========================================="

# Create Python virtual environment
echo "\n1. Creating Python virtual environment..."
cd backend
python3 -m venv venv

# Activate virtual environment
echo "\n2. Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "\n3. Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Generate sample datasets
echo "\n4. Generating sample datasets..."
python data/generate_sample_data.py

# Train initial models
echo "\n5. Training initial models (this may take a few minutes)..."
python train_models.py

# Deactivate virtual environment
deactivate

# Setup frontend
echo "\n6. Setting up frontend..."
cd ../frontend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 16+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Install frontend dependencies
echo "\n7. Installing frontend dependencies..."
npm install

echo "\n=========================================="
echo "Setup complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "The backend will run on http://localhost:5000"
echo "The frontend will run on http://localhost:3000"
echo "=========================================="
