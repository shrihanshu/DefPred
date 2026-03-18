"""SHAP (SHapley Additive exPlanations) explainer."""
import shap
import numpy as np
import logging

logger = logging.getLogger(__name__)


class SHAPExplainer:
    """SHAP-based model explainer."""
    
    def __init__(self, model, feature_names):
        """
        Initialize SHAP explainer.
        
        Args:
            model: Trained model
            feature_names: List of feature names
        """
        self.model = model
        self.feature_names = feature_names
        self.explainer = None
        self.shap_values = None
        self._initialize_explainer()
    
    def _initialize_explainer(self):
        """Initialize appropriate SHAP explainer based on model type."""
        try:
            # Try TreeExplainer first (for tree-based models)
            if hasattr(self.model, 'tree_') or hasattr(self.model, 'estimators_'):
                self.explainer = shap.TreeExplainer(self.model)
                logger.info("Initialized TreeExplainer")
            else:
                # Use KernelExplainer for other models
                self.explainer = None  # Will be initialized with background data
                logger.info("Will use KernelExplainer")
        except Exception as e:
            logger.warning(f"Could not initialize TreeExplainer: {str(e)}")
            self.explainer = None
    
    def explain_instance(self, X_instance, X_original=None):
        """
        Explain a single prediction.
        
        Args:
            X_instance: Preprocessed instance (scaled)
            X_original: Original instance (before scaling) for display
        
        Returns:
            Dictionary with explanation data
        """
        try:
            if self.explainer is None:
                logger.warning("Explainer not initialized, using basic explanation")
                return self._basic_explanation(X_instance, X_original)
            
            # Get SHAP values
            shap_values = self.explainer.shap_values(X_instance)
            
            # Handle different SHAP value formats
            if isinstance(shap_values, list):
                # Binary classification returns list of two arrays
                shap_values = shap_values[1] if len(shap_values) == 2 else shap_values[0]
            
            if len(shap_values.shape) > 1:
                shap_values = shap_values[0]
            
            # Create feature contribution dictionary
            contributions = []
            for i, (feat_name, shap_val) in enumerate(zip(self.feature_names, shap_values)):
                original_value = X_original[i] if X_original is not None else X_instance[0][i]
                contributions.append({
                    'feature': feat_name,
                    'value': float(original_value),
                    'shap_value': float(shap_val),
                    'abs_shap_value': float(abs(shap_val))
                })
            
            # Sort by absolute SHAP value
            contributions.sort(key=lambda x: x['abs_shap_value'], reverse=True)
            
            # Get base value
            if hasattr(self.explainer, 'expected_value'):
                base_value = self.explainer.expected_value
                if isinstance(base_value, (list, np.ndarray)):
                    base_value = base_value[1] if len(base_value) == 2 else base_value[0]
            else:
                base_value = 0.5
            
            explanation = {
                'method': 'shap',
                'base_value': float(base_value),
                'contributions': contributions[:10],  # Top 10 features
                'top_positive': [c for c in contributions if c['shap_value'] > 0][:5],
                'top_negative': [c for c in contributions if c['shap_value'] < 0][:5],
            }
            
            logger.info("SHAP explanation generated successfully")
            return explanation
        
        except Exception as e:
            logger.error(f"Error generating SHAP explanation: {str(e)}")
            return self._basic_explanation(X_instance, X_original)
    
    def _basic_explanation(self, X_instance, X_original):
        """Provide basic explanation when SHAP fails."""
        contributions = []
        for i, feat_name in enumerate(self.feature_names):
            original_value = X_original[i] if X_original is not None else X_instance[0][i]
            contributions.append({
                'feature': feat_name,
                'value': float(original_value),
                'shap_value': 0.0,
                'abs_shap_value': 0.0
            })
        
        return {
            'method': 'basic',
            'base_value': 0.5,
            'contributions': contributions[:10],
            'message': 'Advanced SHAP explanation not available for this model'
        }
    
    def explain_global(self, X_sample, max_samples=100):
        """
        Generate global feature importance using SHAP.
        
        Args:
            X_sample: Sample of data to explain
            max_samples: Maximum number of samples to use
        
        Returns:
            Dictionary with global importance
        """
        try:
            if self.explainer is None:
                return self._basic_global_importance()
            
            # Limit samples for performance
            if len(X_sample) > max_samples:
                indices = np.random.choice(len(X_sample), max_samples, replace=False)
                X_sample = X_sample[indices]
            
            # Calculate SHAP values
            shap_values = self.explainer.shap_values(X_sample)
            
            # Handle different formats
            if isinstance(shap_values, list):
                shap_values = shap_values[1] if len(shap_values) == 2 else shap_values[0]
            
            # Calculate mean absolute SHAP values
            mean_shap = np.abs(shap_values).mean(axis=0)
            
            # Create importance dictionary
            importance = []
            for feat_name, imp_value in zip(self.feature_names, mean_shap):
                importance.append({
                    'feature': feat_name,
                    'importance': float(imp_value)
                })
            
            importance.sort(key=lambda x: x['importance'], reverse=True)
            
            logger.info("Global SHAP explanation generated successfully")
            return {
                'method': 'shap_global',
                'importance': importance
            }
        
        except Exception as e:
            logger.error(f"Error generating global SHAP explanation: {str(e)}")
            return self._basic_global_importance()
    
    def _basic_global_importance(self):
        """Provide basic global importance when SHAP fails."""
        if hasattr(self.model, 'feature_importances_'):
            importance = []
            for feat_name, imp_value in zip(self.feature_names, self.model.feature_importances_):
                importance.append({
                    'feature': feat_name,
                    'importance': float(imp_value)
                })
            importance.sort(key=lambda x: x['importance'], reverse=True)
            return {
                'method': 'tree_importance',
                'importance': importance
            }
        else:
            return {
                'method': 'unavailable',
                'message': 'Feature importance not available for this model'
            }
