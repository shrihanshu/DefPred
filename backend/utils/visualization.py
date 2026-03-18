"""Visualization utilities for model results."""
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.metrics import roc_curve, precision_recall_curve, confusion_matrix
import io
import base64
import logging

logger = logging.getLogger(__name__)


class Visualizer:
    """Create visualizations for model results."""
    
    def __init__(self):
        sns.set_style('whitegrid')
        self.figures = []
    
    def plot_confusion_matrix(self, cm, class_names=['No Defect', 'Defect']):
        """Plot confusion matrix."""
        try:
            fig, ax = plt.subplots(figsize=(8, 6))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                       xticklabels=class_names, yticklabels=class_names,
                       ax=ax)
            ax.set_ylabel('True Label')
            ax.set_xlabel('Predicted Label')
            ax.set_title('Confusion Matrix')
            plt.tight_layout()
            
            return self._fig_to_base64(fig)
        except Exception as e:
            logger.error(f"Error plotting confusion matrix: {str(e)}")
            return None
    
    def plot_roc_curve(self, y_test, y_proba):
        """Plot ROC curve."""
        try:
            fpr, tpr, _ = roc_curve(y_test, y_proba)
            
            from sklearn.metrics import auc
            roc_auc = auc(fpr, tpr)
            
            fig, ax = plt.subplots(figsize=(8, 6))
            ax.plot(fpr, tpr, color='darkorange', lw=2,
                   label=f'ROC curve (AUC = {roc_auc:.2f})')
            ax.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--',
                   label='Random Classifier')
            ax.set_xlim([0.0, 1.0])
            ax.set_ylim([0.0, 1.05])
            ax.set_xlabel('False Positive Rate')
            ax.set_ylabel('True Positive Rate')
            ax.set_title('Receiver Operating Characteristic (ROC) Curve')
            ax.legend(loc="lower right")
            ax.grid(True, alpha=0.3)
            plt.tight_layout()
            
            return self._fig_to_base64(fig)
        except Exception as e:
            logger.error(f"Error plotting ROC curve: {str(e)}")
            return None
    
    def plot_precision_recall_curve(self, y_test, y_proba):
        """Plot Precision-Recall curve."""
        try:
            precision, recall, _ = precision_recall_curve(y_test, y_proba)
            
            from sklearn.metrics import average_precision_score
            avg_precision = average_precision_score(y_test, y_proba)
            
            fig, ax = plt.subplots(figsize=(8, 6))
            ax.plot(recall, precision, color='darkorange', lw=2,
                   label=f'PR curve (AP = {avg_precision:.2f})')
            ax.set_xlim([0.0, 1.0])
            ax.set_ylim([0.0, 1.05])
            ax.set_xlabel('Recall')
            ax.set_ylabel('Precision')
            ax.set_title('Precision-Recall Curve')
            ax.legend(loc="lower left")
            ax.grid(True, alpha=0.3)
            plt.tight_layout()
            
            return self._fig_to_base64(fig)
        except Exception as e:
            logger.error(f"Error plotting precision-recall curve: {str(e)}")
            return None
    
    def plot_feature_importance(self, feature_names, importance_scores, top_k=15):
        """Plot feature importance."""
        try:
            # Sort features by importance
            indices = np.argsort(importance_scores)[-top_k:]
            
            fig, ax = plt.subplots(figsize=(10, 8))
            ax.barh(range(len(indices)), importance_scores[indices])
            ax.set_yticks(range(len(indices)))
            ax.set_yticklabels([feature_names[i] for i in indices])
            ax.set_xlabel('Importance')
            ax.set_title(f'Top {top_k} Feature Importances')
            ax.grid(True, alpha=0.3, axis='x')
            plt.tight_layout()
            
            return self._fig_to_base64(fig)
        except Exception as e:
            logger.error(f"Error plotting feature importance: {str(e)}")
            return None
    
    def plot_model_comparison(self, model_names, metrics_dict, metric='f1_score'):
        """Plot comparison of multiple models."""
        try:
            scores = [metrics_dict[name].get(metric, 0) for name in model_names]
            
            fig, ax = plt.subplots(figsize=(10, 6))
            bars = ax.bar(model_names, scores, color='steelblue', alpha=0.7)
            
            # Add value labels on bars
            for bar in bars:
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height,
                       f'{height:.3f}',
                       ha='center', va='bottom')
            
            ax.set_ylabel(metric.replace('_', ' ').title())
            ax.set_title(f'Model Comparison - {metric.replace("_", " ").title()}')
            ax.set_ylim(0, 1.0)
            ax.grid(True, alpha=0.3, axis='y')
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            
            return self._fig_to_base64(fig)
        except Exception as e:
            logger.error(f"Error plotting model comparison: {str(e)}")
            return None
    
    def plot_learning_curve(self, train_scores, val_scores):
        """Plot learning curve."""
        try:
            epochs = range(1, len(train_scores) + 1)
            
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.plot(epochs, train_scores, 'b-', label='Training')
            ax.plot(epochs, val_scores, 'r-', label='Validation')
            ax.set_xlabel('Epoch')
            ax.set_ylabel('Score')
            ax.set_title('Learning Curve')
            ax.legend()
            ax.grid(True, alpha=0.3)
            plt.tight_layout()
            
            return self._fig_to_base64(fig)
        except Exception as e:
            logger.error(f"Error plotting learning curve: {str(e)}")
            return None
    
    def plot_shap_summary(self, shap_values, feature_names, max_display=10):
        """Plot SHAP summary."""
        try:
            fig, ax = plt.subplots(figsize=(10, 8))
            
            # Calculate mean absolute SHAP values
            mean_abs_shap = np.abs(shap_values).mean(axis=0)
            indices = np.argsort(mean_abs_shap)[-max_display:]
            
            ax.barh(range(len(indices)), mean_abs_shap[indices])
            ax.set_yticks(range(len(indices)))
            ax.set_yticklabels([feature_names[i] for i in indices])
            ax.set_xlabel('Mean |SHAP value|')
            ax.set_title(f'Top {max_display} Features by SHAP Importance')
            ax.grid(True, alpha=0.3, axis='x')
            plt.tight_layout()
            
            return self._fig_to_base64(fig)
        except Exception as e:
            logger.error(f"Error plotting SHAP summary: {str(e)}")
            return None
    
    def _fig_to_base64(self, fig):
        """Convert matplotlib figure to base64 string."""
        try:
            buffer = io.BytesIO()
            fig.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
            plt.close(fig)
            return f"data:image/png;base64,{image_base64}"
        except Exception as e:
            logger.error(f"Error converting figure to base64: {str(e)}")
            plt.close(fig)
            return None
