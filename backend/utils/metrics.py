"""Model evaluation metrics."""
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
    matthews_corrcoef, cohen_kappa_score
)
import numpy as np
import logging

logger = logging.getLogger(__name__)


class ModelEvaluator:
    """Evaluate model performance with comprehensive metrics."""
    
    def __init__(self):
        self.metrics = {}
    
    def evaluate(self, model, X_test, y_test):
        """
        Evaluate model performance.
        
        Args:
            model: Trained model
            X_test: Test features
            y_test: Test labels
        
        Returns:
            Dictionary with all metrics
        """
        try:
            # Get predictions
            y_pred = model.predict(X_test)
            
            # Determine the positive label (handle both numeric and string labels)
            unique_labels = np.unique(y_test)
            if len(unique_labels) == 2:
                # For binary classification, use the second label as positive
                # This handles both [0, 1] and ['N', 'Y'] cases
                pos_label = unique_labels[1]
            else:
                pos_label = 1  # Default for multi-class
            
            # Get probabilities if available
            if hasattr(model, 'predict_proba'):
                y_proba = model.predict_proba(X_test)
                if y_proba.shape[1] == 2:  # Binary classification
                    y_proba = y_proba[:, 1]
                else:
                    # For multi-class, use max probability
                    y_proba = np.max(y_proba, axis=1)
            else:
                # Convert predictions to numeric for ROC AUC
                if isinstance(y_pred[0], str):
                    y_proba = (y_pred == pos_label).astype(int)
                else:
                    y_proba = y_pred
            
            # Calculate metrics with appropriate pos_label
            self.metrics = {
                'accuracy': float(accuracy_score(y_test, y_pred)),
                'precision': float(precision_score(y_test, y_pred, pos_label=pos_label, zero_division=0)),
                'recall': float(recall_score(y_test, y_pred, pos_label=pos_label, zero_division=0)),
                'f1_score': float(f1_score(y_test, y_pred, pos_label=pos_label, zero_division=0)),
                'roc_auc': float(roc_auc_score((y_test == pos_label).astype(int), (y_proba if not isinstance(y_proba[0], str) else (y_proba == pos_label).astype(int)))),
                'matthews_corrcoef': float(matthews_corrcoef(y_test, y_pred)),
                'cohen_kappa': float(cohen_kappa_score(y_test, y_pred)),
            }
            
            # Confusion matrix (ensure labels are ordered correctly)
            labels = sorted(unique_labels)
            cm = confusion_matrix(y_test, y_pred, labels=labels)
            self.metrics['confusion_matrix'] = {
                'tn': int(cm[0][0]),
                'fp': int(cm[0][1]),
                'fn': int(cm[1][0]),
                'tp': int(cm[1][1])
            }
            
            # Specificity and other derived metrics
            tn, fp, fn, tp = cm.ravel()
            self.metrics['specificity'] = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0
            self.metrics['false_positive_rate'] = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0
            self.metrics['false_negative_rate'] = float(fn / (fn + tp)) if (fn + tp) > 0 else 0.0
            
            # Balanced accuracy
            self.metrics['balanced_accuracy'] = float(
                (self.metrics['recall'] + self.metrics['specificity']) / 2
            )
            
            # G-Mean
            self.metrics['g_mean'] = float(
                np.sqrt(self.metrics['recall'] * self.metrics['specificity'])
            )
            
            logger.info(f"Model evaluation complete. F1 Score: {self.metrics['f1_score']:.4f}")
            return self.metrics
        
        except Exception as e:
            logger.error(f"Error evaluating model: {str(e)}")
            return {'error': str(e)}
    
    def get_classification_report(self, model, X_test, y_test):
        """Get detailed classification report."""
        try:
            y_pred = model.predict(X_test)
            report = classification_report(y_test, y_pred, output_dict=True)
            return report
        except Exception as e:
            logger.error(f"Error generating classification report: {str(e)}")
            return {'error': str(e)}
    
    def compare_models(self, evaluations):
        """
        Compare multiple model evaluations.
        
        Args:
            evaluations: List of dictionaries with model evaluations
        
        Returns:
            Comparison summary
        """
        comparison = {
            'best_accuracy': None,
            'best_f1': None,
            'best_roc_auc': None,
            'best_balanced': None
        }
        
        best_acc = 0
        best_f1 = 0
        best_auc = 0
        best_bal = 0
        
        for eval_data in evaluations:
            model_name = eval_data.get('model_name', 'Unknown')
            metrics = eval_data.get('metrics', {})
            
            if metrics.get('accuracy', 0) > best_acc:
                best_acc = metrics['accuracy']
                comparison['best_accuracy'] = model_name
            
            if metrics.get('f1_score', 0) > best_f1:
                best_f1 = metrics['f1_score']
                comparison['best_f1'] = model_name
            
            if metrics.get('roc_auc', 0) > best_auc:
                best_auc = metrics['roc_auc']
                comparison['best_roc_auc'] = model_name
            
            if metrics.get('balanced_accuracy', 0) > best_bal:
                best_bal = metrics['balanced_accuracy']
                comparison['best_balanced'] = model_name
        
        return comparison
    
    def calculate_cost_sensitive_metrics(self, y_test, y_pred, cost_fp=1, cost_fn=5):
        """
        Calculate cost-sensitive metrics.
        
        Args:
            y_test: True labels
            y_pred: Predicted labels
            cost_fp: Cost of false positive
            cost_fn: Cost of false negative
        
        Returns:
            Cost-based metrics
        """
        cm = confusion_matrix(y_test, y_pred)
        tn, fp, fn, tp = cm.ravel()
        
        total_cost = (fp * cost_fp) + (fn * cost_fn)
        
        # Cost savings compared to predicting all positive
        all_positive_cost = len(y_test) * cost_fp
        cost_savings = all_positive_cost - total_cost
        
        return {
            'total_cost': int(total_cost),
            'cost_savings': int(cost_savings),
            'cost_per_instance': float(total_cost / len(y_test)),
            'false_positive_cost': int(fp * cost_fp),
            'false_negative_cost': int(fn * cost_fn)
        }
