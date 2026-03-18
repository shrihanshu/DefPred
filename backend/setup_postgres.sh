#!/bin/bash

# PostgreSQL Setup Script for DefPred Platform
# This script helps set up PostgreSQL database

echo "================================================"
echo "   PostgreSQL Setup for DefPred Platform"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo -e "${BLUE}Checking PostgreSQL installation...${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is installed${NC}"
    psql --version
else
    echo -e "${RED}✗ PostgreSQL is not installed${NC}"
    echo ""
    echo "Install PostgreSQL:"
    echo "  macOS:   brew install postgresql@15"
    echo "  Ubuntu:  sudo apt install postgresql"
    echo "  Windows: https://www.postgresql.org/download/"
    exit 1
fi

echo ""

# Default values
DB_NAME="defpred"
DB_USER="defpred_user"
DB_PASSWORD=""

# Get database credentials
echo -e "${BLUE}Enter database configuration:${NC}"
read -p "Database name [defpred]: " input_db_name
DB_NAME=${input_db_name:-$DB_NAME}

read -p "Database user [defpred_user]: " input_db_user
DB_USER=${input_db_user:-$DB_USER}

read -sp "Database password (will be hidden): " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}Password cannot be empty!${NC}"
    exit 1
fi

# Create database and user
echo ""
echo -e "${BLUE}Creating database and user...${NC}"

# Try to create database
if psql postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null; then
    echo -e "${GREEN}✓ Database '$DB_NAME' created${NC}"
else
    echo -e "${YELLOW}⚠ Database '$DB_NAME' already exists or permission denied${NC}"
fi

# Try to create user
if psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null; then
    echo -e "${GREEN}✓ User '$DB_USER' created${NC}"
else
    echo -e "${YELLOW}⚠ User '$DB_USER' already exists${NC}"
    psql postgres -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null
fi

# Grant privileges
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null
echo -e "${GREEN}✓ Privileges granted${NC}"

# Create .env file
echo ""
echo -e "${BLUE}Creating .env file...${NC}"

DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

cat > .env << EOF
# Database Configuration
DATABASE_URL=$DATABASE_URL

# Flask Configuration
DEBUG=True
SECRET_KEY=$(openssl rand -base64 32)

# API Keys
GROQ_API_KEY=your-groq-api-key-here
EOF

echo -e "${GREEN}✓ .env file created${NC}"

# Update .gitignore
if ! grep -q "^.env$" .gitignore 2>/dev/null; then
    echo ".env" >> .gitignore
    echo -e "${GREEN}✓ Added .env to .gitignore${NC}"
fi

# Install dependencies
echo ""
echo -e "${BLUE}Installing Python dependencies...${NC}"
if command -v pip &> /dev/null; then
    pip install -r requirements.txt
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ pip not found. Please install dependencies manually:${NC}"
    echo "  pip install -r requirements.txt"
fi

# Initialize database
echo ""
echo -e "${BLUE}Initializing database tables...${NC}"
python init_db.py

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   PostgreSQL Setup Complete! 🎉${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Database Details:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Connection: localhost:5432"
echo ""
echo "Environment variable:"
echo "  DATABASE_URL=$DATABASE_URL"
echo ""
echo "Next steps:"
echo "  1. Update GROQ_API_KEY in .env file"
echo "  2. Start the application:"
echo "     python app.py"
echo ""
echo "To use SQLite instead, remove/rename .env file"
echo ""
