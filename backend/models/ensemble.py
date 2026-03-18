"""Ensemble models combining multiple predictors."""
import numpy as np
from sklearn.ensemble import VotingClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
import logging

logger = logging.getLogger(__name__)


class EnsembleModel:
    """Ensemble model combining ML and DL models."""
    
    def __init__(self, models, method='voting', voting='soft'):
        """
        Initialize ensemble model.
        
        Args:
            models: List of tuples (name, model)
            method: 'voting' or 'stacking'
            voting: 'hard' or 'soft' (for voting method)
        """
        self.models = models
        self.method = method
        self.voting = voting
        self.ensemble = None
        self._build_ensemble()
    
    def _build_ensemble(self):
        """Build the ensemble model."""
        if self.method == 'voting':
            self.ensemble = VotingClassifier(
                estimators=self.models,
                voting=self.voting,
                n_jobs=-1
            )
            logger.info(f"Voting ensemble created with {len(self.models)} models")
        
        elif self.method == 'stacking':
            self.ensemble = StackingClassifier(
                estimators=self.models,
                final_estimator=LogisticRegression(),
                n_jobs=-1
            )
            logger.info(f"Stacking ensemble created with {len(self.models)} models")
    
    def fit(self, X_train, y_train):
        """Train the ensemble."""
        logger.info("Training ensemble model...")
        self.ensemble.fit(X_train, y_train)
        logger.info("Ensemble training complete")
        return self
    
    def predict(self, X):
        """Make predictions."""
        return self.ensemble.predict(X)
    
    def predict_proba(self, X):
        """Get prediction probabilities."""
        return self.ensemble.predict_proba(X)


class WeightedEnsemble:
    """Weighted ensemble based on model performance."""
    
    def __init__(self, models, weights=None):
        """
        Initialize weighted ensemble.
        
        Args:
            models: List of trained models
            weights: List of weights for each model (optional)
        """
        self.models = models
        self.weights = weights if weights else [1.0] * len(models)
        self.weights = np.array(self.weights) / sum(self.weights)  # Normalize
        logger.info(f"Weighted ensemble created with weights: {self.weights}")
    
    def predict(self, X):
        """Make predictions."""
        predictions = []
        for model in self.models:
            pred = model.predict(X)
            predictions.append(pred)
        
        # Weighted voting
        predictions = np.array(predictions)
        weighted_pred = np.average(predictions, axis=0, weights=self.weights)
        return (weighted_pred > 0.5).astype(int)
    
    def predict_proba(self, X):
        """Get prediction probabilities."""
        probas = []
        for model in self.models:
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(X)
            else:
                # For DL models or models without predict_proba
                pred = model.predict(X)
                proba = np.vstack([1 - pred, pred]).T
            probas.append(proba)
        
        # Weighted average of probabilities
        probas = np.array(probas)
        weighted_proba = np.average(probas, axis=0, weights=self.weights)
        return weighted_proba


class AdaptiveEnsemble:
    """Adaptive ensemble that selects best model per instance."""
    
    def __init__(self, models, selection_strategy='confidence'):
        """
        Initialize adaptive ensemble.
        
        Args:
            models: List of trained models
            selection_strategy: 'confidence' or 'diversity'
        """
        self.models = models
        self.selection_strategy = selection_strategy
        logger.info(f"Adaptive ensemble created with {len(models)} models")
    
    def predict(self, X):
        """Make predictions."""
        predictions = []
        confidences = []
        
        for model in self.models:
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(X)
                pred = (proba[:, 1] > 0.5).astype(int)
                conf = np.max(proba, axis=1)
            else:
                pred = model.predict(X)
                conf = np.abs(pred - 0.5) + 0.5  # Simple confidence measure
            
            predictions.append(pred)
            confidences.append(conf)
        
        predictions = np.array(predictions)
        confidences = np.array(confidences)
        
        if self.selection_strategy == 'confidence':
            # Select prediction from most confident model
            best_model_idx = np.argmax(confidences, axis=0)
            final_pred = predictions[best_model_idx, np.arange(len(X))]
        else:
            # Majority voting
            final_pred = np.round(np.mean(predictions, axis=0)).astype(int)
        
        return final_pred
    
    def predict_proba(self, X):
        """Get prediction probabilities."""
        probas = []
        confidences = []
        
        for model in self.models:
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(X)
                conf = np.max(proba, axis=1)
            else:
                pred = model.predict(X)
                proba = np.vstack([1 - pred, pred]).T
                conf = np.abs(pred - 0.5) + 0.5
            
            probas.append(proba)
            confidences.append(conf)
        
        probas = np.array(probas)
        confidences = np.array(confidences)
        
        # Weight by confidence
        weights = confidences / confidences.sum(axis=0, keepdims=True)
        weighted_proba = np.sum(probas * weights[:, :, np.newaxis], axis=0)
        
        return weighted_proba
