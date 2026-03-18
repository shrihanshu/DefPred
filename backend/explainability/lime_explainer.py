"""LIME (Local Interpretable Model-agnostic Explanations) explainer."""
from lime import lime_tabular
import numpy as np
import logging

logger = logging.getLogger(__name__)


class LIMEExplainer:
    """LIME-based model explainer."""
    
    def __init__(self, model, feature_names, class_names=None):
        """
        Initialize LIME explainer.
        
        Args:
            model: Trained model
            feature_names: List of feature names
            class_names: List of class names (optional)
        """
        self.model = model
        self.feature_names = feature_names
        self.class_names = class_names or ['No Defect', 'Defect']
        self.explainer = None
    
    def initialize_explainer(self, X_train, mode='classification'):
        """
        Initialize LIME explainer with training data.
        
        Args:
            X_train: Training data for building the explainer
            mode: 'classification' or 'regression'
        """
        try:
            self.explainer = lime_tabular.LimeTabularExplainer(
                X_train,
                feature_names=self.feature_names,
                class_names=self.class_names,
                mode=mode,
                random_state=42
            )
            logger.info("LIME explainer initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing LIME explainer: {str(e)}")
            raise
    
    def explain_instance(self, X_instance, X_original=None, num_features=10):
        """
        Explain a single prediction.
        
        Args:
            X_instance: Preprocessed instance (scaled)
            X_original: Original instance (before scaling) for display
            num_features: Number of top features to include
        
        Returns:
            Dictionary with explanation data
        """
        try:
            if self.explainer is None:
                logger.error("LIME explainer not initialized. Call initialize_explainer first.")
                return self._basic_explanation(X_instance, X_original)
            
            # Get prediction function
            if hasattr(self.model, 'predict_proba'):
                predict_fn = self.model.predict_proba
            else:
                # For models without predict_proba, create wrapper
                def predict_fn(X):
                    preds = self.model.predict(X)
                    return np.vstack([1 - preds, preds]).T
            
            # Explain instance
            explanation = self.explainer.explain_instance(
                X_instance[0] if len(X_instance.shape) > 1 else X_instance,
                predict_fn,
                num_features=num_features
            )
            
            # Extract explanation data
            exp_list = explanation.as_list()
            contributions = []
            
            for feat_desc, weight in exp_list:
                # Parse feature description (e.g., "feature_name > 0.5")
                feat_name = feat_desc.split()[0]
                
                # Find original value
                try:
                    feat_idx = self.feature_names.index(feat_name)
                    original_value = X_original[feat_idx] if X_original is not None else X_instance[0][feat_idx]
                except (ValueError, IndexError):
                    original_value = 0.0
                
                contributions.append({
                    'feature': feat_name,
                    'description': feat_desc,
                    'value': float(original_value),
                    'weight': float(weight),
                    'abs_weight': float(abs(weight))
                })
            
            # Sort by absolute weight
            contributions.sort(key=lambda x: x['abs_weight'], reverse=True)
            
            # Get prediction probability
            predicted_class = explanation.predict_proba[1]
            
            result = {
                'method': 'lime',
                'predicted_class': self.class_names[1],
                'probability': float(predicted_class),
                'contributions': contributions,
                'top_positive': [c for c in contributions if c['weight'] > 0][:5],
                'top_negative': [c for c in contributions if c['weight'] < 0][:5],
                'intercept': float(explanation.intercept[1]) if hasattr(explanation, 'intercept') else 0.0
            }
            
            logger.info("LIME explanation generated successfully")
            return result
        
        except Exception as e:
            logger.error(f"Error generating LIME explanation: {str(e)}")
            return self._basic_explanation(X_instance, X_original)
    
    def _basic_explanation(self, X_instance, X_original):
        """Provide basic explanation when LIME fails."""
        contributions = []
        for i, feat_name in enumerate(self.feature_names):
            original_value = X_original[i] if X_original is not None else X_instance[0][i]
            contributions.append({
                'feature': feat_name,
                'description': f'{feat_name}',
                'value': float(original_value),
                'weight': 0.0,
                'abs_weight': 0.0
            })
        
        return {
            'method': 'basic',
            'predicted_class': 'Unknown',
            'probability': 0.5,
            'contributions': contributions[:10],
            'message': 'Advanced LIME explanation not available'
        }
    
    def explain_prediction_with_counterfactuals(self, X_instance, desired_class=0, num_samples=1000):
        """
        Generate counterfactual explanations.
        
        Args:
            X_instance: Instance to explain
            desired_class: Desired class for counterfactual
            num_samples: Number of samples to generate
        
        Returns:
            Counterfactual explanations
        """
        try:
            if self.explainer is None:
                logger.error("LIME explainer not initialized")
                return None
            
            # Generate neighbors
            neighbors = self.explainer.data_generator.generate_neighborhood(
                X_instance[0] if len(X_instance.shape) > 1 else X_instance,
                num_samples=num_samples
            )
            
            # Get predictions for neighbors
            if hasattr(self.model, 'predict_proba'):
                predictions = self.model.predict_proba(neighbors)[:, desired_class]
            else:
                predictions = self.model.predict(neighbors)
                predictions = 1 - predictions if desired_class == 0 else predictions
            
            # Find best counterfactuals (highest probability for desired class)
            top_indices = np.argsort(predictions)[-5:]  # Top 5
            
            counterfactuals = []
            for idx in top_indices:
                cf = neighbors[idx]
                differences = []
                
                for i, (original, cf_val) in enumerate(zip(X_instance[0], cf)):
                    if abs(original - cf_val) > 0.01:  # Significant difference
                        differences.append({
                            'feature': self.feature_names[i],
                            'original': float(original),
                            'counterfactual': float(cf_val),
                            'change': float(cf_val - original)
                        })
                
                counterfactuals.append({
                    'probability': float(predictions[idx]),
                    'changes': differences[:5]  # Top 5 changes
                })
            
            return {
                'method': 'counterfactual',
                'desired_class': self.class_names[desired_class],
                'counterfactuals': counterfactuals
            }
        
        except Exception as e:
            logger.error(f"Error generating counterfactuals: {str(e)}")
            return None
