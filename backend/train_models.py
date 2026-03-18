"""Training script for all models."""
import sys
import logging
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from preprocessing.data_loader import DataLoader
from preprocessing.preprocessor import DataPreprocessor
from preprocessing.feature_engineering import FeatureEngineer
from models.ml_models import MLModelFactory
from models.dl_models import DLModelFactory
from optimization.hyperparameter_tuning import HyperparameterOptimizer
from utils.metrics import ModelEvaluator
from utils.visualization import Visualizer
import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def train_all_models():
    """Train all models on sample dataset."""
    logger.info("Starting comprehensive model training...")
    
    # Load data
    data_loader = DataLoader()
    df = data_loader.get_sample_data(n_samples=2000, n_features=20)
    
    # Feature engineering
    engineer = FeatureEngineer()
    df_engineered = engineer.create_all_features(df)
    
    # Preprocess
    preprocessor = DataPreprocessor()
    X_train, X_test, y_train, y_test, scaler = preprocessor.prepare_data(df_engineered)
    
    logger.info(f"Training data shape: {X_train.shape}")
    logger.info(f"Test data shape: {X_test.shape}")
    
    # Train ML models
    ml_models = ['random_forest', 'xgboost', 'gradient_boosting']
    ml_results = {}
    
    for model_type in ml_models:
        logger.info(f"\n{'='*60}")
        logger.info(f"Training {model_type}...")
        logger.info(f"{'='*60}")
        
        factory = MLModelFactory()
        model = factory.create_model(model_type)
        model.fit(X_train, y_train)
        
        # Evaluate
        evaluator = ModelEvaluator()
        metrics = evaluator.evaluate(model, X_test, y_test)
        
        ml_results[model_type] = {
            'model': model,
            'metrics': metrics
        }
        
        logger.info(f"\n{model_type} Results:")
        logger.info(f"Accuracy: {metrics['accuracy']:.4f}")
        logger.info(f"Precision: {metrics['precision']:.4f}")
        logger.info(f"Recall: {metrics['recall']:.4f}")
        logger.info(f"F1 Score: {metrics['f1_score']:.4f}")
        logger.info(f"ROC AUC: {metrics['roc_auc']:.4f}")
        
        # Save model
        model_path = config.MODEL_DIR / f'{model_type}_model.pkl'
        model.save(str(model_path))
        logger.info(f"Model saved to {model_path}")
    
    # Train DL models (smaller sample for speed)
    logger.info("\n" + "="*60)
    logger.info("Training Deep Learning Models...")
    logger.info("="*60)
    
    dl_models = ['lstm', 'cnn']
    dl_results = {}
    
    for model_type in dl_models:
        logger.info(f"\nTraining {model_type}...")
        
        try:
            factory = DLModelFactory()
            model = factory.create_model(model_type, input_shape=X_train.shape[1])
            model.fit(X_train, y_train, validation_split=0.1, epochs=20, batch_size=32, verbose=1)
            
            # Evaluate
            evaluator = ModelEvaluator()
            metrics = evaluator.evaluate(model, X_test, y_test)
            
            dl_results[model_type] = {
                'model': model,
                'metrics': metrics
            }
            
            logger.info(f"\n{model_type} Results:")
            logger.info(f"Accuracy: {metrics['accuracy']:.4f}")
            logger.info(f"F1 Score: {metrics['f1_score']:.4f}")
            
            # Save model
            model_path = config.MODEL_DIR / f'{model_type}_model.h5'
            model.save(str(model_path))
            logger.info(f"Model saved to {model_path}")
        
        except Exception as e:
            logger.error(f"Error training {model_type}: {str(e)}")
    
    # Compare all models
    logger.info("\n" + "="*60)
    logger.info("Model Comparison Summary")
    logger.info("="*60)
    
    all_results = {**ml_results, **dl_results}
    
    print("\n{:<20} {:<10} {:<10} {:<10} {:<10}".format(
        "Model", "Accuracy", "Precision", "Recall", "F1 Score"
    ))
    print("-" * 60)
    
    for model_name, result in all_results.items():
        metrics = result['metrics']
        print("{:<20} {:<10.4f} {:<10.4f} {:<10.4f} {:<10.4f}".format(
            model_name,
            metrics.get('accuracy', 0),
            metrics.get('precision', 0),
            metrics.get('recall', 0),
            metrics.get('f1_score', 0)
        ))
    
    logger.info("\nTraining complete!")
    logger.info(f"Models saved in: {config.MODEL_DIR}")
    
    return all_results


def train_with_optimization(model_type='xgboost'):
    """Train a single model with hyperparameter optimization."""
    logger.info(f"Training {model_type} with optimization...")
    
    # Load data
    data_loader = DataLoader()
    df = data_loader.get_sample_data(n_samples=2000)
    
    # Preprocess
    preprocessor = DataPreprocessor()
    X_train, X_test, y_train, y_test, scaler = preprocessor.prepare_data(df)
    
    # Optimize
    optimizer = HyperparameterOptimizer(model_type, optimization_method='optuna', n_trials=30)
    best_model = optimizer.optimize(X_train, y_train)
    
    # Evaluate
    evaluator = ModelEvaluator()
    metrics = evaluator.evaluate(best_model, X_test, y_test)
    
    logger.info(f"\nOptimized {model_type} Results:")
    logger.info(f"Best Parameters: {optimizer.best_params}")
    logger.info(f"Accuracy: {metrics['accuracy']:.4f}")
    logger.info(f"F1 Score: {metrics['f1_score']:.4f}")
    
    # Save model
    model_path = config.MODEL_DIR / f'{model_type}_optimized_model.pkl'
    best_model.save(str(model_path))
    logger.info(f"Optimized model saved to {model_path}")
    
    return best_model, metrics


if __name__ == '__main__':
    # Train all models
    results = train_all_models()
    
    # Optionally train with optimization
    # train_with_optimization('xgboost')
