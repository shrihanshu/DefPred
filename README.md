# Explainable AI-Driven Software Defect Prediction Platform

A comprehensive platform combining Machine Learning, Deep Learning, and Optimization techniques with Explainable AI for software defect prediction.

## Features

### Machine Learning Models
- Random Forest Classifier
- XGBoost
- Support Vector Machine (SVM)
- Gradient Boosting

### Deep Learning Models
- LSTM (Long Short-Term Memory)
- CNN (Convolutional Neural Network)
- Transformer-based Architecture

### Explainability Tools
- SHAP (SHapley Additive exPlanations)
- LIME (Local Interpretable Model-agnostic Explanations)
- Feature Importance Visualization
- Attention Visualization

### Optimization
- Hyperparameter Tuning (Optuna, GridSearch, RandomSearch)
- Model Ensemble Optimization
- Feature Selection

### Platform Features
- Interactive Web Interface
- Real-time Predictions
- Model Comparison Dashboard
- Explainability Visualizations
- Dataset Upload & Management

## Tech Stack

### Backend
- Python 3.9+
- Flask
- TensorFlow/Keras
- PyTorch
- Scikit-learn
- XGBoost
- SHAP
- LIME
- Optuna

### Frontend
- React 18
- Material-UI
- Plotly.js
- Recharts
- Axios

## Installation

### Prerequisites
```bash
# Python 3.9+
# Node.js 16+
# pip
# npm or yarn
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend
```bash
cd backend
source venv/bin/activate
cd ..
python -m backend.app
```



### Start Frontend
```bash
cd frontend
npm start
```


## Project Structure

```
.
├── backend/
│   ├── app.py                      # Flask application
│   ├── config.py                   # Configuration
│   ├── requirements.txt            # Python dependencies
│   ├── models/
│   │   ├── ml_models.py           # ML models (RF, XGB, SVM)
│   │   ├── dl_models.py           # DL models (LSTM, CNN, Transformer)
│   │   └── ensemble.py            # Ensemble models
│   ├── explainability/
│   │   ├── shap_explainer.py      # SHAP implementation
│   │   ├── lime_explainer.py      # LIME implementation
│   │   └── feature_importance.py  # Feature importance
│   ├── optimization/
│   │   ├── hyperparameter_tuning.py  # Hyperparameter optimization
│   │   └── feature_selection.py      # Feature selection
│   ├── preprocessing/
│   │   ├── data_loader.py         # Data loading
│   │   ├── feature_engineering.py # Feature engineering
│   │   └── preprocessor.py        # Data preprocessing
│   ├── utils/
│   │   ├── metrics.py             # Evaluation metrics
│   │   └── visualization.py       # Visualization utilities
│   └── data/
│       ├── sample_datasets/       # Sample datasets
│       └── trained_models/        # Saved models
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── components/
│       │   ├── Dashboard.js
│       │   ├── ModelComparison.js
│       │   ├── PredictionForm.js
│       │   ├── ExplainabilityView.js
│       │   └── DatasetUpload.js
│       ├── services/
│       │   └── api.js
│       └── styles/
├── notebooks/
│   ├── data_exploration.ipynb
│   ├── model_training.ipynb
│   └── explainability_demo.ipynb
└── README.md
```

## API Endpoints

### Models
- `POST /api/train` - Train models
- `POST /api/predict` - Make predictions
- `GET /api/models` - List available models
- `GET /api/model/{id}/metrics` - Get model metrics

### Explainability
- `POST /api/explain/shap` - Get SHAP explanations
- `POST /api/explain/lime` - Get LIME explanations
- `GET /api/explain/feature-importance/{model_id}` - Get feature importance

### Data
- `POST /api/data/upload` - Upload dataset
- `GET /api/data/stats` - Get dataset statistics

## Usage Example

```python

import requests

response = requests.post('http://localhost:5001/api/train', json={
    'model_type': 'xgboost',
    'dataset': 'uploaded_dataset.csv',
    'optimize': True
})

# Get predictions with explanations
response = requests.post('http://localhost:5001/api/predict', json={
    'model_id': 'xgboost_model',
    'features': [...],
    'explain': True,
    'explainer': 'shap'
})
```

## Dataset Format

The platform expects CSV files with the following structure:
- Features: Software metrics (LOC, complexity, coupling, etc.)
- Target: Binary label (0: no defect, 1: defect)

Example columns:
```
loc, cyclomatic_complexity, coupling, cohesion, inheritance_depth, defect
100, 5, 3, 0.8, 2, 0
250, 12, 7, 0.5, 4, 1
```

## Model Performance

The platform provides comprehensive metrics:
- Accuracy
- Precision
- Recall
- F1-Score
- ROC-AUC
- Confusion Matrix

## Explainability Features

### SHAP
- Global feature importance
- Individual prediction explanations
- Force plots
- Summary plots

### LIME
- Local explanations
- Feature contribution visualization
- Counterfactual explanations

## Contributing

Contributions are welcome! Please submit pull requests or open issues.

## License

MIT License

## Authors

Software Defect Prediction Platform Team

## Citation

If you use this platform in your research, please cite:
```
@software{defect_prediction_platform,
  title={Explainable AI-Driven Software Defect Prediction Platform},
  year={2026},
  author={Your Name}
}
```
