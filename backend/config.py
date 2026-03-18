"""Configuration settings for the Defect Prediction Platform."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Data directories
DATA_DIR = BASE_DIR / 'data'
UPLOAD_DIR = DATA_DIR / 'uploads'
DATASET_DIR = DATA_DIR / 'sample_datasets'
MODEL_DIR = DATA_DIR / 'trained_models'
RESULTS_DIR = DATA_DIR / 'results'

# Create directories if they don't exist
for directory in [DATA_DIR, UPLOAD_DIR, DATASET_DIR, MODEL_DIR, RESULTS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Database configuration
# Supports both SQLite (development) and PostgreSQL (production)
# For PostgreSQL, set DATABASE_URL environment variable:
# postgresql://username:password@localhost:5432/dbname
DATABASE_URL = os.environ.get('DATABASE_URL', f'sqlite:///{BASE_DIR / "defect_prediction.db"}')

# Handle Heroku postgres:// URL (change to postgresql://)
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

SQLALCHEMY_DATABASE_URI = DATABASE_URL
SQLALCHEMY_TRACK_MODIFICATIONS = False
DEBUG = os.environ.get('DEBUG', 'True') == 'True'
SQLALCHEMY_ECHO = DEBUG

# PostgreSQL connection pool settings (only used when using PostgreSQL)
SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True,
    'max_overflow': 20
}

# Flask configuration
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 5001))  # Changed default from 5000 to 5001

# Model configuration
MAX_UPLOAD_SIZE = 500 * 1024 * 1024  # 500MB (increased for larger datasets)
ALLOWED_EXTENSIONS = {'csv', 'txt', 'json'}

# ML Model parameters
ML_MODELS = {
    'random_forest': {
        'n_estimators': 100,
        'max_depth': 10,
        'random_state': 42
    },
    'xgboost': {
        'n_estimators': 100,
        'max_depth': 6,
        'learning_rate': 0.1,
        'random_state': 42
    },
    'svm': {
        'kernel': 'rbf',
        'C': 1.0,
        'random_state': 42
    },
    'gradient_boosting': {
        'n_estimators': 100,
        'learning_rate': 0.1,
        'max_depth': 5,
        'random_state': 42
    }
}

# DL Model parameters
DL_MODELS = {
    'lstm': {
        'units': 128,
        'dropout': 0.3,
        'epochs': 50,
        'batch_size': 32
    },
    'cnn': {
        'filters': 64,
        'kernel_size': 3,
        'epochs': 50,
        'batch_size': 32
    },
    'transformer': {
        'num_heads': 4,
        'ff_dim': 128,
        'epochs': 50,
        'batch_size': 32
    }
}

# Optimization parameters
OPTIMIZATION_CONFIG = {
    'optuna': {
        'n_trials': 50,
        'timeout': 3600  # 1 hour
    },
    'grid_search': {
        'cv': 5,
        'n_jobs': -1
    }
}

# Explainability parameters
EXPLAINABILITY_CONFIG = {
    'shap': {
        'max_samples': 100,
        'nsamples': 1000
    },
    'lime': {
        'num_features': 10,
        'num_samples': 5000
    }
}

# Training parameters
TRAIN_TEST_SPLIT = 0.2
VALIDATION_SPLIT = 0.1
RANDOM_STATE = 42
CV_FOLDS = 5

# API Configuration
CORS_ORIGINS = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173']
API_PREFIX = '/api'
API_VERSION = 'v1'

# AI Summary Configuration (Groq API - Free Tier)
# Get your free API key from: https://console.groq.com/keys
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', 'your-groq-api-key-here')  # Replace with your key

