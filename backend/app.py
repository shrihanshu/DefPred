"""Main Flask application for Explainable AI-Driven Software Defect Prediction Platform."""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
import traceback
import logging
from pathlib import Path
from datetime import datetime
import json
import time

from backend import config
from backend.database import db, User, Dataset, TrainedModel, ModelMetrics, Prediction, UserActivity
from backend.models.ml_models import MLModelFactory
# from backend.models.dl_models import DLModelFactory  # Temporarily disabled due to TensorFlow issues
from backend.models.ensemble import EnsembleModel
from backend.explainability.shap_explainer import SHAPExplainer
from backend.explainability.lime_explainer import LIMEExplainer
from backend.explainability.feature_importance import FeatureImportanceAnalyzer
from backend.optimization.hyperparameter_tuning import HyperparameterOptimizer
from backend.preprocessing.data_loader import DataLoader
from backend.preprocessing.preprocessor import DataPreprocessor
from backend.utils.metrics import ModelEvaluator
from backend.utils.visualization import Visualizer
from backend.utils.ai_summary import AISummaryGenerator


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['MAX_CONTENT_LENGTH'] = config.MAX_UPLOAD_SIZE
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SQLALCHEMY_ECHO'] = config.SQLALCHEMY_ECHO

# Add engine options for PostgreSQL connection pooling
if 'postgresql' in config.SQLALCHEMY_DATABASE_URI:
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = config.SQLALCHEMY_ENGINE_OPTIONS

CORS(app, origins=config.CORS_ORIGINS)

# Initialize database
db.init_app(app)
migrate = Migrate(app, db)

# Create tables
with app.app_context():
    db.create_all()
    logger.info("Database tables created successfully")

# Global storage for models and data (in-memory cache)
models_cache = {}
data_cache = {}

# Initialize AI Summary Generator
try:
    ai_summary_generator = AISummaryGenerator(config.GROQ_API_KEY)
    logger.info("AI Summary Generator initialized")
except Exception as e:
    logger.warning(f"AI Summary Generator not available: {str(e)}")
    ai_summary_generator = None


def get_or_create_user(user_data):
    """Get or create a user in the database."""
    try:
        user_id = user_data.get('userId') or user_data.get('user_id')
        if not user_id:
            return None
        
        user = User.query.filter_by(user_id=user_id).first()
        
        if not user:
            user = User(
                user_id=user_id,
                email=user_data.get('email', f'{user_id}@example.com'),
                username=user_data.get('username'),
                first_name=user_data.get('firstName') or user_data.get('first_name'),
                last_name=user_data.get('lastName') or user_data.get('last_name')
            )
            db.session.add(user)
            db.session.commit()
            logger.info(f"New user created: {user_id}")
        else:
            # Update last login
            user.last_login = datetime.utcnow()
            db.session.commit()
        
        return user
    except Exception as e:
        logger.error(f"Error in get_or_create_user: {str(e)}")
        db.session.rollback()
        return None


def log_activity(user_id, activity_type, details=None):
    """Log user activity."""
    try:
        activity = UserActivity(
            user_id=user_id,
            activity_type=activity_type,
            activity_details=json.dumps(details) if details else None,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent', '')[:255]
        )
        db.session.add(activity)
        db.session.commit()
    except Exception as e:
        logger.error(f"Error logging activity: {str(e)}")
        db.session.rollback()


@app.route('/')
def home():
    """Home endpoint."""
    return jsonify({
        'message': 'Explainable AI-Driven Software Defect Prediction Platform',
        'version': '1.0.0',
        'status': 'running'
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'timestamp': pd.Timestamp.now().isoformat()})


@app.route('/api/data/upload', methods=['POST'])
def upload_dataset():
    """Upload and process a dataset."""
    try:
        # Get user data from request
        user_data = request.form.get('user_data')
        if user_data:
            user_data = json.loads(user_data)
            user = get_or_create_user(user_data)
            user_id = user.user_id if user else 'anonymous'
        else:
            user_id = 'anonymous'
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        
        filename = Path(file.filename).name
        filepath = config.UPLOAD_DIR / filename
        
        # Save file (this is fast, no processing)
        file.save(str(filepath))
        file_size = filepath.stat().st_size
        logger.info(f"File saved: {filename} ({file_size} bytes)")
        
        # Load data based on file extension
        data_loader = DataLoader()
        file_ext = Path(filename).suffix.lower()
        
        if file_ext == '.arff':
            df = data_loader.load_arff(str(filepath))
        elif file_ext in ['.csv', '.txt']:
            df = data_loader.load_csv(str(filepath))
        else:
            return jsonify({'error': f'Unsupported file format: {file_ext}'}), 400
        
        logger.info(f"Dataset loaded: {filename} with shape {df.shape}")
        
        # Compute basic stats quickly (defer expensive operations)
        class_distribution = {str(k): int(v) for k, v in df.iloc[:, -1].value_counts().to_dict().items()}
        stats = {
            'rows': int(len(df)),
            'columns': int(len(df.columns)),
            'features': list(df.columns[:-1]),
            'target': str(df.columns[-1]),
            'class_distribution': class_distribution
        }
        
        # Cache data
        dataset_id = filename.replace('.csv', '').replace('.arff', '').replace('.txt', '')
        data_cache[dataset_id] = {
            'data': df,
            'filepath': str(filepath),
            'stats': stats
        }
        
        # Save to database
        if user_id != 'anonymous':
            try:
                dataset = Dataset(
                    user_id=user_id,
                    dataset_id=dataset_id,
                    filename=filename,
                    filepath=str(filepath),
                    file_size=file_size,
                    rows=stats['rows'],
                    columns=stats['columns'],
                    features=json.dumps(stats['features']),
                    target_column=stats['target'],
                    class_distribution=json.dumps(class_distribution)
                )
                db.session.add(dataset)
                db.session.commit()
                log_activity(user_id, 'upload', {'dataset_id': dataset_id, 'filename': filename})
            except Exception as db_error:
                logger.error(f"Error saving dataset to database: {str(db_error)}")
                db.session.rollback()
        
        logger.info(f"Dataset cached: {dataset_id}")
        return jsonify({
            'dataset_id': dataset_id,
            'stats': stats,
            'message': 'Dataset uploaded successfully'
        })
    
    except Exception as e:
        logger.error(f"Error uploading dataset: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/data/stats/<dataset_id>', methods=['GET'])
def get_dataset_stats(dataset_id):
    """Get statistics for a dataset."""
    try:
        if dataset_id not in data_cache:
            return jsonify({'error': 'Dataset not found'}), 404
        
        return jsonify(data_cache[dataset_id]['stats'])
    
    except Exception as e:
        logger.error(f"Error getting dataset stats: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/train', methods=['POST'])
def train_model():
    """Train a model."""
    try:
        data = request.json
        model_type = data.get('model_type', 'xgboost')
        dataset_id = data.get('dataset_id')
        optimize = data.get('optimize', False)
        user_data = data.get('user_data')
        
        # Get or create user
        user = get_or_create_user(user_data) if user_data else None
        user_id = user.user_id if user else 'anonymous'
        
        if dataset_id not in data_cache:
            return jsonify({'error': 'Dataset not found'}), 404
        
        # Load data
        df = data_cache[dataset_id]['data']
        
        # Track training time
        start_time = time.time()
        
        # Preprocess
        preprocessor = DataPreprocessor()
        X_train, X_test, y_train, y_test, scaler = preprocessor.prepare_data(df)
        
        # Train model
        # List of all available ML models
        ml_models = [
            'logistic_regression', 'naive_bayes', 'knn', 'decision_tree',
            'ridge_regression', 'lasso_regression', 'elastic_net', 'perceptron',
            'random_forest', 'xgboost', 'svm', 'gradient_boosting',
            'lightgbm', 'catboost', 'adaboost', 'extra_trees', 'bagging', 'voting'
        ]
        
        if model_type in ml_models:
            if optimize:
                optimizer = HyperparameterOptimizer(model_type)
                model = optimizer.optimize(X_train, y_train)
            else:
                factory = MLModelFactory()
                model = factory.create_model(model_type)
                model.fit(X_train, y_train)
        else:
            # Deep learning models - currently disabled
            return jsonify({'error': f'Model type {model_type} is not currently supported. Deep learning models are temporarily disabled.'}), 400
        
        # Evaluate
        evaluator = ModelEvaluator()
        metrics = evaluator.evaluate(model, X_test, y_test)
        
        training_time = time.time() - start_time
        
        # Save model
        model_id = f"{model_type}_{dataset_id}"
        models_cache[model_id] = {
            'model': model,
            'type': model_type,
            'preprocessor': preprocessor,
            'scaler': scaler,
            'metrics': metrics,
            'feature_names': list(df.columns[:-1]),
            'created_at': datetime.now().isoformat()
        }
        
        # Save to database
        if user_id != 'anonymous':
            try:
                trained_model = TrainedModel(
                    user_id=user_id,
                    dataset_id=dataset_id,
                    model_id=model_id,
                    model_type=model_type,
                    optimized=optimize,
                    feature_names=json.dumps(list(df.columns[:-1])),
                    training_time=training_time
                )
                db.session.add(trained_model)
                db.session.flush()
                
                # Save metrics
                model_metrics = ModelMetrics(
                    model_id=model_id,
                    accuracy=metrics.get('accuracy'),
                    precision=metrics.get('precision'),
                    recall=metrics.get('recall'),
                    f1_score=metrics.get('f1_score'),
                    roc_auc=metrics.get('roc_auc'),
                    confusion_matrix=json.dumps(metrics.get('confusion_matrix', [])),
                    classification_report=json.dumps(metrics.get('classification_report', {})),
                    additional_metrics=json.dumps({k: v for k, v in metrics.items() if k not in ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc', 'confusion_matrix', 'classification_report']})
                )
                db.session.add(model_metrics)
                db.session.commit()
                log_activity(user_id, 'train', {'model_id': model_id, 'model_type': model_type, 'optimized': optimize})
            except Exception as db_error:
                logger.error(f"Error saving model to database: {str(db_error)}")
                db.session.rollback()
        
        logger.info(f"Model trained: {model_id} in {training_time:.2f}s")
        return jsonify({
            'model_id': model_id,
            'metrics': metrics,
            'training_time': training_time,
            'message': 'Model trained successfully'
        })
    
    except Exception as e:
        logger.error(f"Error training model: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        logger.error(f"Error training model: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/models/<model_id>/ai-summary', methods=['GET'])
def get_ai_summary(model_id):
    """Generate AI-powered summary of model performance."""
    try:
        if model_id not in models_cache:
            return jsonify({'error': 'Model not found'}), 404
        
        if ai_summary_generator is None:
            return jsonify({'error': 'AI Summary service not available. Please configure GEMINI_API_KEY'}), 503
        
        model_data = models_cache[model_id]
        metrics = model_data['metrics']
        model_type = model_data['type']
        
        # Generate AI summary
        summary = ai_summary_generator.generate_training_summary(metrics, model_type)
        
        return jsonify({
            'model_id': model_id,
            'model_type': model_type,
            'metrics': metrics,
            'ai_summary': summary
        })
    
    except Exception as e:
        logger.error(f"Error generating AI summary: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/predict', methods=['POST'])
def predict():
    """Make predictions."""
    try:
        data = request.json
        model_id = data.get('model_id')
        features = data.get('features')
        explain = data.get('explain', False)
        explainer_type = data.get('explainer', 'shap')
        user_data = data.get('user_data')
        
        # Get or create user
        user = get_or_create_user(user_data) if user_data else None
        user_id = user.user_id if user else 'anonymous'
        
        if model_id not in models_cache:
            return jsonify({'error': 'Model not found'}), 404
        
        model_data = models_cache[model_id]
        model = model_data['model']
        scaler = model_data['scaler']
        
        # Preprocess features
        import numpy as np
        features_array = np.array(features).reshape(1, -1)
        features_scaled = scaler.transform(features_array)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        if hasattr(model, 'predict_proba'):
            probability = model.predict_proba(features_scaled)[0].tolist()
        else:
            probability = [1 - prediction, prediction]
        
        result = {
            'prediction': int(prediction),
            'probability': probability,
            'class': 'Defect' if prediction == 1 else 'No Defect'
        }
        
        # Add explanations
        explanation_data = None
        if explain:
            if explainer_type == 'shap':
                explainer = SHAPExplainer(model, model_data['feature_names'])
                explanation = explainer.explain_instance(features_scaled, features_array[0])
                result['explanation'] = explanation
                explanation_data = explanation
            elif explainer_type == 'lime':
                explainer = LIMEExplainer(model, model_data['feature_names'])
                explanation = explainer.explain_instance(features_scaled[0], features_array[0])
                result['explanation'] = explanation
                explanation_data = explanation
        
        # Save to database
        if user_id != 'anonymous':
            try:
                prediction_record = Prediction(
                    user_id=user_id,
                    model_id=model_id,
                    input_features=json.dumps(features),
                    prediction=int(prediction),
                    prediction_class=result['class'],
                    probability=json.dumps(probability),
                    explanation=json.dumps(explanation_data) if explanation_data else None,
                    explainer_type=explainer_type if explain else None
                )
                db.session.add(prediction_record)
                db.session.commit()
                log_activity(user_id, 'predict', {'model_id': model_id, 'prediction': result['class']})
            except Exception as db_error:
                logger.error(f"Error saving prediction to database: {str(db_error)}")
                db.session.rollback()
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/models', methods=['GET'])
def list_models():
    """List all trained models."""
    try:
        models_list = []
        for model_id, model_data in models_cache.items():
            models_list.append({
                'id': model_id,
                'model_id': model_id,
                'type': model_data['type'],
                'metrics': model_data['metrics'],
                'created_at': model_data.get('created_at')
            })
        
        return jsonify({'models': models_list})
    
    except Exception as e:
        logger.error(f"Error listing models: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/model/<model_id>/metrics', methods=['GET'])
def get_model_metrics(model_id):
    """Get metrics for a specific model."""
    try:
        if model_id not in models_cache:
            return jsonify({'error': 'Model not found'}), 404
        
        return jsonify(models_cache[model_id]['metrics'])
    
    except Exception as e:
        logger.error(f"Error getting model metrics: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/explain/feature-importance/<model_id>', methods=['GET'])
def get_feature_importance(model_id):
    """Get feature importance for a model."""
    try:
        if model_id not in models_cache:
            return jsonify({'error': 'Model not found'}), 404
        
        model_data = models_cache[model_id]
        analyzer = FeatureImportanceAnalyzer(model_data['model'], model_data['feature_names'])
        importance = analyzer.get_importance()
        
        return jsonify({'feature_importance': importance})
    
    except Exception as e:
        logger.error(f"Error getting feature importance: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/compare-models', methods=['POST'])
def compare_models():
    """Compare multiple models."""
    try:
        data = request.json
        model_ids = data.get('model_ids', [])
        
        comparison = []
        for model_id in model_ids:
            if model_id in models_cache:
                comparison.append({
                    'model_id': model_id,
                    'type': models_cache[model_id]['type'],
                    'metrics': models_cache[model_id]['metrics']
                })
        
        return jsonify({'comparison': comparison})
    
    except Exception as e:
        logger.error(f"Error comparing models: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ==================== HISTORY & USER DATA ENDPOINTS ====================

@app.route('/api/user/history', methods=['POST'])
def get_user_history():
    """Get complete user history."""
    try:
        data = request.json
        user_data = data.get('user_data')
        
        if not user_data:
            return jsonify({'error': 'User data required'}), 400
        
        user = get_or_create_user(user_data)
        if not user:
            return jsonify({'error': 'Invalid user data'}), 400
        
        # Get all user datasets
        datasets = Dataset.query.filter_by(user_id=user.user_id).order_by(Dataset.uploaded_at.desc()).all()
        
        # Get all user models
        models = TrainedModel.query.filter_by(user_id=user.user_id).order_by(TrainedModel.created_at.desc()).all()
        
        # Get all user predictions
        predictions = Prediction.query.filter_by(user_id=user.user_id).order_by(Prediction.created_at.desc()).limit(50).all()
        
        # Get user activities
        activities = UserActivity.query.filter_by(user_id=user.user_id).order_by(UserActivity.created_at.desc()).limit(20).all()
        
        return jsonify({
            'user': user.to_dict(),
            'datasets': [d.to_dict() for d in datasets],
            'models': [m.to_dict() for m in models],
            'predictions': [p.to_dict() for p in predictions],
            'activities': [a.to_dict() for a in activities],
            'summary': {
                'total_datasets': len(datasets),
                'total_models': len(models),
                'total_predictions': Prediction.query.filter_by(user_id=user.user_id).count()
            }
        })
    
    except Exception as e:
        logger.error(f"Error getting user history: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/user/datasets', methods=['POST'])
def get_user_datasets():
    """Get user's datasets."""
    try:
        data = request.json
        user_data = data.get('user_data')
        
        if not user_data:
            return jsonify({'error': 'User data required'}), 400
        
        user = get_or_create_user(user_data)
        if not user:
            return jsonify({'error': 'Invalid user data'}), 400
        
        datasets = Dataset.query.filter_by(user_id=user.user_id).order_by(Dataset.uploaded_at.desc()).all()
        
        return jsonify({
            'datasets': [d.to_dict() for d in datasets]
        })
    
    except Exception as e:
        logger.error(f"Error getting user datasets: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/user/models', methods=['POST'])
def get_user_models():
    """Get user's trained models."""
    try:
        data = request.json
        user_data = data.get('user_data')
        
        if not user_data:
            return jsonify({'error': 'User data required'}), 400
        
        user = get_or_create_user(user_data)
        if not user:
            return jsonify({'error': 'Invalid user data'}), 400
        
        models = TrainedModel.query.filter_by(user_id=user.user_id).order_by(TrainedModel.created_at.desc()).all()
        
        return jsonify({
            'models': [m.to_dict() for m in models]
        })
    
    except Exception as e:
        logger.error(f"Error getting user models: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/user/predictions', methods=['POST'])
def get_user_predictions():
    """Get user's prediction history."""
    try:
        data = request.json
        user_data = data.get('user_data')
        limit = data.get('limit', 50)
        
        if not user_data:
            return jsonify({'error': 'User data required'}), 400
        
        user = get_or_create_user(user_data)
        if not user:
            return jsonify({'error': 'Invalid user data'}), 400
        
        predictions = Prediction.query.filter_by(user_id=user.user_id).order_by(Prediction.created_at.desc()).limit(limit).all()
        
        return jsonify({
            'predictions': [p.to_dict() for p in predictions],
            'total': Prediction.query.filter_by(user_id=user.user_id).count()
        })
    
    except Exception as e:
        logger.error(f"Error getting user predictions: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/user/stats', methods=['POST'])
def get_user_stats():
    """Get user statistics."""
    try:
        data = request.json
        user_data = data.get('user_data')
        
        if not user_data:
            return jsonify({'error': 'User data required'}), 400
        
        user = get_or_create_user(user_data)
        if not user:
            return jsonify({'error': 'Invalid user data'}), 400
        
        # Compute statistics
        total_datasets = Dataset.query.filter_by(user_id=user.user_id).count()
        total_models = TrainedModel.query.filter_by(user_id=user.user_id).count()
        total_predictions = Prediction.query.filter_by(user_id=user.user_id).count()
        
        # Get most used model type
        from sqlalchemy import func
        most_used_model = db.session.query(
            TrainedModel.model_type, 
            func.count(TrainedModel.model_type).label('count')
        ).filter_by(user_id=user.user_id).group_by(TrainedModel.model_type).order_by(func.count(TrainedModel.model_type).desc()).first()
        
        # Get prediction accuracy summary
        defect_predictions = Prediction.query.filter_by(user_id=user.user_id, prediction=1).count()
        no_defect_predictions = Prediction.query.filter_by(user_id=user.user_id, prediction=0).count()
        
        return jsonify({
            'user': user.to_dict(),
            'stats': {
                'total_datasets': total_datasets,
                'total_models': total_models,
                'total_predictions': total_predictions,
                'most_used_model': most_used_model[0] if most_used_model else None,
                'most_used_model_count': most_used_model[1] if most_used_model else 0,
                'defect_predictions': defect_predictions,
                'no_defect_predictions': no_defect_predictions
            }
        })
    
    except Exception as e:
        logger.error(f"Error getting user stats: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    import pandas as pd
    logger.info("Starting Explainable AI-Driven Software Defect Prediction Platform")
    logger.info(f"Server running on http://{config.HOST}:{config.PORT}")
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
