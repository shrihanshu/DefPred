"""Demonstration of explainability features."""
import sys
import logging
from pathlib import Path
import numpy as np

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from preprocessing.data_loader import DataLoader
from preprocessing.preprocessor import DataPreprocessor
from models.ml_models import MLModelFactory
from explainability.shap_explainer import SHAPExplainer
from explainability.lime_explainer import LIMEExplainer
from explainability.feature_importance import FeatureImportanceAnalyzer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def demonstrate_explainability():
    """Demonstrate explainability features."""
    logger.info("Demonstrating Explainability Features...")
    
    # Load and prepare data
    data_loader = DataLoader()
    df = data_loader.get_sample_data(n_samples=1000)
    
    preprocessor = DataPreprocessor()
    X_train, X_test, y_train, y_test, scaler = preprocessor.prepare_data(df)
    
    feature_names = list(df.columns[:-1])
    
    # Train model
    logger.info("\nTraining XGBoost model...")
    factory = MLModelFactory()
    model = factory.create_model('xgboost')
    model.fit(X_train, y_train)
    
    # Feature Importance
    logger.info("\n" + "="*60)
    logger.info("1. Feature Importance")
    logger.info("="*60)
    
    analyzer = FeatureImportanceAnalyzer(model.model, feature_names)
    importance_result = analyzer.get_importance()
    
    logger.info("\nTop 10 Most Important Features:")
    for i, feat in enumerate(importance_result['top_10'], 1):
        logger.info(f"{i}. {feat['feature']}: {feat['importance']:.4f} ({feat['importance_pct']:.2f}%)")
    
    # SHAP Explanations
    logger.info("\n" + "="*60)
    logger.info("2. SHAP Explanations")
    logger.info("="*60)
    
    shap_explainer = SHAPExplainer(model.model, feature_names)
    
    # Global explanation
    logger.info("\nGenerating global SHAP explanation...")
    global_shap = shap_explainer.explain_global(X_test[:100])
    
    logger.info("\nGlobal Feature Importance (SHAP):")
    for i, feat in enumerate(global_shap['importance'][:10], 1):
        logger.info(f"{i}. {feat['feature']}: {feat['importance']:.4f}")
    
    # Instance explanation
    logger.info("\nExplaining a single prediction...")
    instance_idx = 0
    X_instance = X_test[instance_idx:instance_idx+1]
    X_original = df.iloc[instance_idx, :-1].values
    
    instance_explanation = shap_explainer.explain_instance(X_instance, X_original)
    
    logger.info(f"\nBase value: {instance_explanation['base_value']:.4f}")
    logger.info("\nTop 5 Positive Contributions:")
    for contrib in instance_explanation.get('top_positive', [])[:5]:
        logger.info(f"  {contrib['feature']}: {contrib['shap_value']:.4f} (value: {contrib['value']:.2f})")
    
    logger.info("\nTop 5 Negative Contributions:")
    for contrib in instance_explanation.get('top_negative', [])[:5]:
        logger.info(f"  {contrib['feature']}: {contrib['shap_value']:.4f} (value: {contrib['value']:.2f})")
    
    # LIME Explanations
    logger.info("\n" + "="*60)
    logger.info("3. LIME Explanations")
    logger.info("="*60)
    
    lime_explainer = LIMEExplainer(model.model, feature_names)
    lime_explainer.initialize_explainer(X_train)
    
    logger.info("\nGenerating LIME explanation for instance...")
    lime_explanation = lime_explainer.explain_instance(X_instance, X_original, num_features=10)
    
    logger.info(f"\nPredicted: {lime_explanation['predicted_class']}")
    logger.info(f"Probability: {lime_explanation['probability']:.4f}")
    logger.info("\nTop Contributing Features:")
    for contrib in lime_explanation['contributions'][:10]:
        logger.info(f"  {contrib['description']}: {contrib['weight']:.4f}")
    
    # Feature Interactions
    logger.info("\n" + "="*60)
    logger.info("4. Feature Interactions")
    logger.info("="*60)
    
    interactions = analyzer.get_feature_interactions(X_train, top_k=10)
    
    logger.info("\nTop 10 Feature Interactions:")
    for i, interaction in enumerate(interactions['interactions'], 1):
        logger.info(f"{i}. {interaction['feature1']} <-> {interaction['feature2']}: "
                   f"{interaction['correlation']:.4f}")
    
    # Distribution Analysis
    logger.info("\n" + "="*60)
    logger.info("5. Feature Distribution Analysis")
    logger.info("="*60)
    
    distribution = analyzer.analyze_feature_distribution(X_train, y_train)
    
    logger.info("\nFeatures with Largest Differences between Classes:")
    for i, dist in enumerate(distribution['distributions'][:5], 1):
        logger.info(f"{i}. {dist['feature']}:")
        logger.info(f"   No Defect: {dist['no_defect_mean']:.2f} ± {dist['no_defect_std']:.2f}")
        logger.info(f"   Defect: {dist['defect_mean']:.2f} ± {dist['defect_std']:.2f}")
        logger.info(f"   Difference: {dist['difference']:.2f}")
    
    logger.info("\n" + "="*60)
    logger.info("Explainability demonstration complete!")
    logger.info("="*60)


if __name__ == '__main__':
    demonstrate_explainability()
