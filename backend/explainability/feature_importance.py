"""Feature importance analyzer."""
import numpy as np
import pandas as pd
import logging

logger = logging.getLogger(__name__)


class FeatureImportanceAnalyzer:
    """Analyze feature importance from trained models."""
    
    def __init__(self, model, feature_names):
        """
        Initialize feature importance analyzer.
        
        Args:
            model: Trained model
            feature_names: List of feature names
        """
        self.model = model
        self.feature_names = feature_names
        self.importance_scores = None
    
    def get_importance(self):
        """Get feature importance from model."""
        try:
            if hasattr(self.model, 'feature_importances_'):
                # Tree-based models
                self.importance_scores = self.model.feature_importances_
                method = 'tree_importance'
            
            elif hasattr(self.model, 'coef_'):
                # Linear models
                self.importance_scores = np.abs(self.model.coef_[0])
                method = 'coefficient_magnitude'
            
            else:
                logger.warning("Model does not have built-in feature importance")
                return self._permutation_importance()
            
            # Create importance dictionary
            importance_dict = []
            for feat_name, importance in zip(self.feature_names, self.importance_scores):
                importance_dict.append({
                    'feature': feat_name,
                    'importance': float(importance),
                    'importance_pct': float(importance / self.importance_scores.sum() * 100)
                })
            
            # Sort by importance
            importance_dict.sort(key=lambda x: x['importance'], reverse=True)
            
            result = {
                'method': method,
                'features': importance_dict,
                'top_10': importance_dict[:10]
            }
            
            logger.info("Feature importance calculated successfully")
            return result
        
        except Exception as e:
            logger.error(f"Error calculating feature importance: {str(e)}")
            return {'method': 'unavailable', 'error': str(e)}
    
    def _permutation_importance(self, X=None, y=None, n_repeats=10):
        """Calculate permutation importance."""
        if X is None or y is None:
            return {
                'method': 'permutation',
                'features': [],
                'message': 'Permutation importance requires test data'
            }
        
        from sklearn.inspection import permutation_importance
        
        try:
            result = permutation_importance(
                self.model, X, y, n_repeats=n_repeats,
                random_state=42, n_jobs=-1
            )
            
            importance_dict = []
            for feat_name, importance in zip(self.feature_names, result.importances_mean):
                importance_dict.append({
                    'feature': feat_name,
                    'importance': float(importance),
                    'std': float(result.importances_std[len(importance_dict)])
                })
            
            importance_dict.sort(key=lambda x: x['importance'], reverse=True)
            
            return {
                'method': 'permutation',
                'features': importance_dict,
                'top_10': importance_dict[:10]
            }
        
        except Exception as e:
            logger.error(f"Error calculating permutation importance: {str(e)}")
            return {'method': 'unavailable', 'error': str(e)}
    
    def get_feature_interactions(self, X, top_k=10):
        """
        Analyze feature interactions.
        
        Args:
            X: Feature data
            top_k: Number of top interactions to return
        
        Returns:
            Dictionary with feature interaction data
        """
        try:
            # Calculate correlation matrix
            df = pd.DataFrame(X, columns=self.feature_names)
            corr_matrix = df.corr().abs()
            
            # Get top interactions (excluding diagonal)
            interactions = []
            for i in range(len(self.feature_names)):
                for j in range(i + 1, len(self.feature_names)):
                    interactions.append({
                        'feature1': self.feature_names[i],
                        'feature2': self.feature_names[j],
                        'correlation': float(corr_matrix.iloc[i, j])
                    })
            
            # Sort by correlation
            interactions.sort(key=lambda x: x['correlation'], reverse=True)
            
            return {
                'method': 'correlation',
                'interactions': interactions[:top_k]
            }
        
        except Exception as e:
            logger.error(f"Error analyzing feature interactions: {str(e)}")
            return {'method': 'unavailable', 'error': str(e)}
    
    def analyze_feature_distribution(self, X, y):
        """
        Analyze feature distributions by class.
        
        Args:
            X: Feature data
            y: Target labels
        
        Returns:
            Dictionary with distribution analysis
        """
        try:
            df = pd.DataFrame(X, columns=self.feature_names)
            df['target'] = y
            
            distributions = []
            for feat in self.feature_names:
                class_0_mean = df[df['target'] == 0][feat].mean()
                class_1_mean = df[df['target'] == 1][feat].mean()
                class_0_std = df[df['target'] == 0][feat].std()
                class_1_std = df[df['target'] == 1][feat].std()
                
                distributions.append({
                    'feature': feat,
                    'no_defect_mean': float(class_0_mean),
                    'no_defect_std': float(class_0_std),
                    'defect_mean': float(class_1_mean),
                    'defect_std': float(class_1_std),
                    'difference': float(abs(class_1_mean - class_0_mean))
                })
            
            # Sort by difference
            distributions.sort(key=lambda x: x['difference'], reverse=True)
            
            return {
                'method': 'distribution_analysis',
                'distributions': distributions[:10]
            }
        
        except Exception as e:
            logger.error(f"Error analyzing feature distributions: {str(e)}")
            return {'method': 'unavailable', 'error': str(e)}
