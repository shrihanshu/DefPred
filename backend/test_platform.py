"""
Comprehensive test script to verify platform functionality.
Run this after setup to ensure everything is working correctly.
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

import logging
import time

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def test_imports():
    """Test that all required packages can be imported."""
    logger.info("Testing package imports...")
    
    try:
        import pandas
        import numpy
        import sklearn
        import xgboost
        import tensorflow
        import torch
        import shap
        import lime
        import optuna
        import flask
        import matplotlib
        import seaborn
        logger.info("✓ All required packages imported successfully")
        return True
    except ImportError as e:
        logger.error(f"✗ Import error: {e}")
        return False


def test_data_loading():
    """Test data loading functionality."""
    logger.info("\nTesting data loading...")
    
    try:
        from preprocessing.data_loader import DataLoader
        
        loader = DataLoader()
        df = loader.get_sample_data(n_samples=100)
        
        assert len(df) == 100, "Sample data size mismatch"
        assert 'defect' in df.columns, "Target column missing"
        
        logger.info(f"✓ Generated sample data with shape {df.shape}")
        return True
    except Exception as e:
        logger.error(f"✗ Data loading error: {e}")
        return False


def test_preprocessing():
    """Test data preprocessing pipeline."""
    logger.info("\nTesting preprocessing...")
    
    try:
        from preprocessing.data_loader import DataLoader
        from preprocessing.preprocessor import DataPreprocessor
        
        loader = DataLoader()
        df = loader.get_sample_data(n_samples=100)
        
        preprocessor = DataPreprocessor()
        X_train, X_test, y_train, y_test, scaler = preprocessor.prepare_data(df)
        
        assert X_train.shape[0] > 0, "Training data empty"
        assert X_test.shape[0] > 0, "Test data empty"
        
        logger.info(f"✓ Preprocessing successful")
        logger.info(f"  Train shape: {X_train.shape}, Test shape: {X_test.shape}")
        return True
    except Exception as e:
        logger.error(f"✗ Preprocessing error: {e}")
        return False


def test_ml_models():
    """Test machine learning models."""
    logger.info("\nTesting ML models...")
    
    try:
        from preprocessing.data_loader import DataLoader
        from preprocessing.preprocessor import DataPreprocessor
        from models.ml_models import MLModelFactory
        
        loader = DataLoader()
        df = loader.get_sample_data(n_samples=200)
        
        preprocessor = DataPreprocessor()
        X_train, X_test, y_train, y_test, _ = preprocessor.prepare_data(df)
        
        models_to_test = ['random_forest', 'xgboost']
        
        for model_type in models_to_test:
            logger.info(f"  Testing {model_type}...")
            factory = MLModelFactory()
            model = factory.create_model(model_type)
            model.fit(X_train, y_train)
            predictions = model.predict(X_test)
            
            assert len(predictions) == len(X_test), f"{model_type} prediction size mismatch"
            logger.info(f"  ✓ {model_type} working")
        
        logger.info("✓ All ML models working")
        return True
    except Exception as e:
        logger.error(f"✗ ML models error: {e}")
        return False


def test_dl_models():
    """Test deep learning models."""
    logger.info("\nTesting DL models...")
    
    try:
        from preprocessing.data_loader import DataLoader
        from preprocessing.preprocessor import DataPreprocessor
        from models.dl_models import DLModelFactory
        
        loader = DataLoader()
        df = loader.get_sample_data(n_samples=200)
        
        preprocessor = DataPreprocessor()
        X_train, X_test, y_train, y_test, _ = preprocessor.prepare_data(df)
        
        logger.info("  Testing LSTM...")
        factory = DLModelFactory()
        model = factory.create_model('lstm', input_shape=X_train.shape[1])
        model.fit(X_train, y_train, epochs=2, verbose=0)
        predictions = model.predict(X_test)
        
        assert len(predictions) == len(X_test), "LSTM prediction size mismatch"
        logger.info("  ✓ LSTM working")
        
        logger.info("✓ DL models working")
        return True
    except Exception as e:
        logger.error(f"✗ DL models error: {e}")
        logger.warning("  DL tests failed - this may be due to TensorFlow/PyTorch setup")
        return False


def test_explainability():
    """Test explainability features."""
    logger.info("\nTesting explainability...")
    
    try:
        from preprocessing.data_loader import DataLoader
        from preprocessing.preprocessor import DataPreprocessor
        from models.ml_models import MLModelFactory
        from explainability.shap_explainer import SHAPExplainer
        from explainability.feature_importance import FeatureImportanceAnalyzer
        
        loader = DataLoader()
        df = loader.get_sample_data(n_samples=200)
        
        preprocessor = DataPreprocessor()
        X_train, X_test, y_train, y_test, _ = preprocessor.prepare_data(df)
        
        factory = MLModelFactory()
        model = factory.create_model('xgboost')
        model.fit(X_train, y_train)
        
        # Test feature importance
        feature_names = list(df.columns[:-1])
        analyzer = FeatureImportanceAnalyzer(model.model, feature_names)
        importance = analyzer.get_importance()
        assert 'features' in importance, "Feature importance missing"
        logger.info("  ✓ Feature importance working")
        
        # Test SHAP
        try:
            shap_explainer = SHAPExplainer(model.model, feature_names)
            explanation = shap_explainer.explain_instance(X_test[0:1], df.iloc[0, :-1].values)
            assert 'contributions' in explanation, "SHAP explanation missing"
            logger.info("  ✓ SHAP explainer working")
        except Exception as e:
            logger.warning(f"  SHAP test failed: {e}")
        
        logger.info("✓ Explainability working")
        return True
    except Exception as e:
        logger.error(f"✗ Explainability error: {e}")
        return False


def test_optimization():
    """Test optimization features."""
    logger.info("\nTesting optimization...")
    
    try:
        from preprocessing.data_loader import DataLoader
        from preprocessing.preprocessor import DataPreprocessor
        from optimization.hyperparameter_tuning import HyperparameterOptimizer
        
        loader = DataLoader()
        df = loader.get_sample_data(n_samples=200)
        
        preprocessor = DataPreprocessor()
        X_train, X_test, y_train, y_test, _ = preprocessor.prepare_data(df)
        
        logger.info("  Testing hyperparameter optimization (5 trials)...")
        optimizer = HyperparameterOptimizer('random_forest', n_trials=5)
        model = optimizer.optimize(X_train, y_train)
        
        assert optimizer.best_params is not None, "No best parameters found"
        logger.info("  ✓ Optimization working")
        
        logger.info("✓ Optimization working")
        return True
    except Exception as e:
        logger.error(f"✗ Optimization error: {e}")
        return False


def test_api_endpoints():
    """Test Flask API endpoints."""
    logger.info("\nTesting API endpoints...")
    
    try:
        from app import app
        
        with app.test_client() as client:
            # Test health endpoint
            response = client.get('/api/health')
            assert response.status_code == 200, "Health check failed"
            logger.info("  ✓ Health endpoint working")
            
            # Test models endpoint
            response = client.get('/api/models')
            assert response.status_code == 200, "Models endpoint failed"
            logger.info("  ✓ Models endpoint working")
        
        logger.info("✓ API endpoints working")
        return True
    except Exception as e:
        logger.error(f"✗ API endpoints error: {e}")
        return False


def run_all_tests():
    """Run all tests and generate report."""
    logger.info("="*60)
    logger.info("PLATFORM VERIFICATION TEST SUITE")
    logger.info("="*60)
    
    start_time = time.time()
    
    tests = [
        ("Package Imports", test_imports),
        ("Data Loading", test_data_loading),
        ("Preprocessing", test_preprocessing),
        ("ML Models", test_ml_models),
        ("DL Models", test_dl_models),
        ("Explainability", test_explainability),
        ("Optimization", test_optimization),
        ("API Endpoints", test_api_endpoints),
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            logger.error(f"Test '{test_name}' crashed: {e}")
            results[test_name] = False
    
    elapsed_time = time.time() - start_time
    
    # Generate report
    logger.info("\n" + "="*60)
    logger.info("TEST REPORT")
    logger.info("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "PASS" if result else "FAIL"
        symbol = "✓" if result else "✗"
        logger.info(f"{symbol} {test_name}: {status}")
    
    logger.info("="*60)
    logger.info(f"Results: {passed}/{total} tests passed")
    logger.info(f"Time: {elapsed_time:.2f} seconds")
    
    if passed == total:
        logger.info("🎉 ALL TESTS PASSED! Platform is ready to use.")
    else:
        logger.warning(f"⚠️  {total - passed} test(s) failed. Please review errors above.")
    
    logger.info("="*60)
    
    return passed == total


if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)
