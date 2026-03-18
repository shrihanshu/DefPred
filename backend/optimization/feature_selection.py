"""Feature selection optimization."""
from sklearn.feature_selection import (
    SelectKBest, f_classif, mutual_info_classif,
    RFE, SelectFromModel, VarianceThreshold
)
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import pandas as pd
import logging

logger = logging.getLogger(__name__)


class FeatureSelector:
    """Feature selection for defect prediction."""
    
    def __init__(self, method='mutual_info', k=10):
        """
        Initialize feature selector.
        
        Args:
            method: Selection method ('mutual_info', 'f_test', 'rfe', 'model_based', 'variance')
            k: Number of features to select
        """
        self.method = method
        self.k = k
        self.selector = None
        self.selected_features = None
        self.feature_scores = None
    
    def fit_transform(self, X, y, feature_names=None):
        """Fit selector and transform data."""
        logger.info(f"Selecting {self.k} features using {self.method}...")
        
        if self.method == 'mutual_info':
            self.selector = SelectKBest(mutual_info_classif, k=self.k)
        
        elif self.method == 'f_test':
            self.selector = SelectKBest(f_classif, k=self.k)
        
        elif self.method == 'rfe':
            estimator = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
            self.selector = RFE(estimator, n_features_to_select=self.k)
        
        elif self.method == 'model_based':
            estimator = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
            estimator.fit(X, y)
            self.selector = SelectFromModel(estimator, prefit=True, max_features=self.k)
        
        elif self.method == 'variance':
            # Remove low variance features
            threshold = np.percentile(np.var(X, axis=0), 10)
            self.selector = VarianceThreshold(threshold=threshold)
        
        X_selected = self.selector.fit_transform(X, y)
        
        # Get selected feature indices
        if hasattr(self.selector, 'get_support'):
            mask = self.selector.get_support()
            if feature_names:
                self.selected_features = [feature_names[i] for i, selected in enumerate(mask) if selected]
            else:
                self.selected_features = [i for i, selected in enumerate(mask) if selected]
        
        # Get feature scores if available
        if hasattr(self.selector, 'scores_'):
            self.feature_scores = self.selector.scores_
        elif hasattr(self.selector, 'estimator_') and hasattr(self.selector.estimator_, 'feature_importances_'):
            self.feature_scores = self.selector.estimator_.feature_importances_
        
        logger.info(f"Selected features: {self.selected_features}")
        logger.info(f"Reduced feature space from {X.shape[1]} to {X_selected.shape[1]}")
        
        return X_selected
    
    def transform(self, X):
        """Transform data using fitted selector."""
        if self.selector is None:
            raise ValueError("Selector not fitted. Call fit_transform first.")
        return self.selector.transform(X)
    
    def get_feature_ranking(self, feature_names):
        """Get ranking of features."""
        if self.feature_scores is None:
            logger.warning("Feature scores not available for this selector")
            return None
        
        ranking = pd.DataFrame({
            'feature': feature_names,
            'score': self.feature_scores
        }).sort_values('score', ascending=False)
        
        return ranking


class AutoFeatureSelector:
    """Automatic feature selection with multiple methods."""
    
    def __init__(self, target_features=None, methods=None):
        """
        Initialize auto feature selector.
        
        Args:
            target_features: Target number of features (optional)
            methods: List of methods to try (optional)
        """
        self.target_features = target_features
        self.methods = methods or ['mutual_info', 'f_test', 'rfe', 'model_based']
        self.results = {}
        self.best_method = None
        self.best_features = None
    
    def select(self, X, y, feature_names=None, cv=5):
        """Try multiple methods and select best."""
        from sklearn.model_selection import cross_val_score
        from sklearn.ensemble import RandomForestClassifier
        
        logger.info("Testing multiple feature selection methods...")
        
        # Determine k values to try
        if self.target_features:
            k_values = [self.target_features]
        else:
            # Try different numbers of features
            k_values = [
                int(X.shape[1] * 0.3),  # 30% of features
                int(X.shape[1] * 0.5),  # 50% of features
                int(X.shape[1] * 0.7),  # 70% of features
            ]
        
        best_score = 0
        
        for method in self.methods:
            for k in k_values:
                if k < 1 or k > X.shape[1]:
                    continue
                
                try:
                    selector = FeatureSelector(method=method, k=k)
                    X_selected = selector.fit_transform(X, y, feature_names)
                    
                    # Evaluate with cross-validation
                    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
                    scores = cross_val_score(model, X_selected, y, cv=cv, scoring='f1')
                    mean_score = scores.mean()
                    
                    self.results[f"{method}_{k}"] = {
                        'method': method,
                        'k': k,
                        'score': mean_score,
                        'features': selector.selected_features
                    }
                    
                    logger.info(f"{method} with k={k}: F1={mean_score:.4f}")
                    
                    if mean_score > best_score:
                        best_score = mean_score
                        self.best_method = method
                        self.best_features = selector.selected_features
                
                except Exception as e:
                    logger.warning(f"Error with {method}, k={k}: {str(e)}")
        
        logger.info(f"Best method: {self.best_method} with F1={best_score:.4f}")
        logger.info(f"Best features: {self.best_features}")
        
        return self.best_features, self.results
