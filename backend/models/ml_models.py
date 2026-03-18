"""Machine Learning models for defect prediction."""
from sklearn.ensemble import (
    RandomForestClassifier, 
    GradientBoostingClassifier,
    AdaBoostClassifier,
    BaggingClassifier,
    ExtraTreesClassifier,
    VotingClassifier
)
from sklearn.svm import SVC
from sklearn.linear_model import (
    LogisticRegression,
    Ridge,
    Lasso,
    ElasticNet,
    Perceptron,
    LinearRegression
)
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
try:
    from catboost import CatBoostClassifier
except ImportError:
    CatBoostClassifier = None
import joblib
import logging

logger = logging.getLogger(__name__)


class MLModelFactory:
    """Factory class for creating ML models."""
    
    @staticmethod
    def create_model(model_type, **kwargs):
        """Create and return a machine learning model."""
        # Basic Models
        if model_type == 'logistic_regression':
            return LogisticRegressionModel(**kwargs)
        elif model_type == 'naive_bayes':
            return NaiveBayesModel(**kwargs)
        elif model_type == 'knn':
            return KNNModel(**kwargs)
        elif model_type == 'decision_tree':
            return DecisionTreeModel(**kwargs)
        elif model_type == 'ridge_regression':
            return RidgeModel(**kwargs)
        elif model_type == 'lasso_regression':
            return LassoModel(**kwargs)
        elif model_type == 'elastic_net':
            return ElasticNetModel(**kwargs)
        elif model_type == 'perceptron':
            return PerceptronModel(**kwargs)
        # Intermediate Models
        elif model_type == 'random_forest':
            return RandomForestModel(**kwargs)
        elif model_type == 'xgboost':
            return XGBoostModel(**kwargs)
        elif model_type == 'svm':
            return SVMModel(**kwargs)
        elif model_type == 'gradient_boosting':
            return GradientBoostingModel(**kwargs)
        elif model_type == 'lightgbm':
            return LightGBMModel(**kwargs)
        elif model_type == 'catboost':
            return CatBoostModel(**kwargs)
        elif model_type == 'adaboost':
            return AdaBoostModel(**kwargs)
        elif model_type == 'extra_trees':
            return ExtraTreesModel(**kwargs)
        elif model_type == 'bagging':
            return BaggingModel(**kwargs)
        elif model_type == 'voting':
            return VotingModel(**kwargs)
        else:
            raise ValueError(f"Unknown model type: {model_type}")


class BaseMLModel:
    """Base class for ML models."""
    
    def __init__(self):
        self.model = None
        self.model_name = "Base Model"
    
    def fit(self, X_train, y_train):
        """Train the model."""
        logger.info(f"Training {self.model_name}...")
        self.model.fit(X_train, y_train)
        logger.info(f"{self.model_name} training complete")
        return self
    
    def predict(self, X):
        """Make predictions."""
        return self.model.predict(X)
    
    def predict_proba(self, X):
        """Get prediction probabilities."""
        if hasattr(self.model, 'predict_proba'):
            return self.model.predict_proba(X)
        else:
            # For models without predict_proba, use decision function
            decisions = self.model.decision_function(X)
            # Convert to probabilities using sigmoid
            import numpy as np
            proba = 1 / (1 + np.exp(-decisions))
            return np.vstack([1 - proba, proba]).T
    
    def save(self, filepath):
        """Save model to disk."""
        joblib.dump(self.model, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load(self, filepath):
        """Load model from disk."""
        self.model = joblib.load(filepath)
        logger.info(f"Model loaded from {filepath}")
        return self


class RandomForestModel(BaseMLModel):
    """Random Forest Classifier."""
    
    def __init__(self, n_estimators=100, max_depth=10, min_samples_split=5,
                 min_samples_leaf=2, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Random Forest"
        self.model = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            min_samples_leaf=min_samples_leaf,
            random_state=random_state,
            n_jobs=-1,
            **kwargs
        )
    
    def get_feature_importance(self):
        """Get feature importance."""
        return self.model.feature_importances_


class XGBoostModel(BaseMLModel):
    """XGBoost Classifier."""
    
    def __init__(self, n_estimators=100, max_depth=6, learning_rate=0.1,
                 subsample=0.8, colsample_bytree=0.8, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "XGBoost"
        self.model = XGBClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            learning_rate=learning_rate,
            subsample=subsample,
            colsample_bytree=colsample_bytree,
            random_state=random_state,
            n_jobs=-1,
            eval_metric='logloss',
            **kwargs
        )
    
    def get_feature_importance(self):
        """Get feature importance."""
        return self.model.feature_importances_


class SVMModel(BaseMLModel):
    """Support Vector Machine Classifier."""
    
    def __init__(self, kernel='rbf', C=1.0, gamma='scale', random_state=42, **kwargs):
        super().__init__()
        self.model_name = "SVM"
        self.model = SVC(
            kernel=kernel,
            C=C,
            gamma=gamma,
            random_state=random_state,
            probability=True,  # Enable probability estimates
            **kwargs
        )


class GradientBoostingModel(BaseMLModel):
    """Gradient Boosting Classifier."""
    
    def __init__(self, n_estimators=100, learning_rate=0.1, max_depth=5,
                 min_samples_split=5, min_samples_leaf=2, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Gradient Boosting"
        self.model = GradientBoostingClassifier(
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            min_samples_leaf=min_samples_leaf,
            random_state=random_state,
            **kwargs
        )
    
    def get_feature_importance(self):
        """Get feature importance."""
        return self.model.feature_importances_


class LightGBMModel(BaseMLModel):
    """LightGBM Classifier."""
    
    def __init__(self, n_estimators=100, max_depth=6, learning_rate=0.1,
                 num_leaves=31, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "LightGBM"
        self.model = LGBMClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            learning_rate=learning_rate,
            num_leaves=num_leaves,
            random_state=random_state,
            n_jobs=-1,
            verbose=-1,
            **kwargs
        )
    
    def get_feature_importance(self):
        """Get feature importance."""
        return self.model.feature_importances_


# ===== BASIC MODELS =====

class LogisticRegressionModel(BaseMLModel):
    """Logistic Regression Classifier."""
    
    def __init__(self, C=1.0, max_iter=1000, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Logistic Regression"
        self.model = LogisticRegression(
            C=C,
            max_iter=max_iter,
            random_state=random_state,
            n_jobs=-1,
            **kwargs
        )


class NaiveBayesModel(BaseMLModel):
    """Naive Bayes Classifier."""
    
    def __init__(self, **kwargs):
        super().__init__()
        self.model_name = "Naive Bayes"
        self.model = GaussianNB(**kwargs)


class KNNModel(BaseMLModel):
    """K-Nearest Neighbors Classifier."""
    
    def __init__(self, n_neighbors=5, weights='uniform', **kwargs):
        super().__init__()
        self.model_name = "K-Nearest Neighbors"
        self.model = KNeighborsClassifier(
            n_neighbors=n_neighbors,
            weights=weights,
            n_jobs=-1,
            **kwargs
        )


class DecisionTreeModel(BaseMLModel):
    """Decision Tree Classifier."""
    
    def __init__(self, max_depth=10, min_samples_split=2, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Decision Tree"
        self.model = DecisionTreeClassifier(
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            random_state=random_state,
            **kwargs
        )
    
    def get_feature_importance(self):
        """Get feature importance."""
        return self.model.feature_importances_


class RidgeModel(BaseMLModel):
    """Ridge Regression Classifier."""
    
    def __init__(self, alpha=1.0, max_iter=1000, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Ridge Regression"
        from sklearn.linear_model import RidgeClassifier
        self.model = RidgeClassifier(
            alpha=alpha,
            max_iter=max_iter,
            random_state=random_state,
            **kwargs
        )


class LassoModel(BaseMLModel):
    """Lasso Regression Classifier."""
    
    def __init__(self, alpha=1.0, max_iter=1000, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Lasso Regression"
        from sklearn.linear_model import LogisticRegression
        self.model = LogisticRegression(
            penalty='l1',
            C=1/alpha,
            solver='saga',
            max_iter=max_iter,
            random_state=random_state,
            **kwargs
        )


class ElasticNetModel(BaseMLModel):
    """Elastic Net Classifier."""
    
    def __init__(self, alpha=1.0, l1_ratio=0.5, max_iter=1000, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Elastic Net"
        from sklearn.linear_model import LogisticRegression
        self.model = LogisticRegression(
            penalty='elasticnet',
            C=1/alpha,
            l1_ratio=l1_ratio,
            solver='saga',
            max_iter=max_iter,
            random_state=random_state,
            **kwargs
        )


class PerceptronModel(BaseMLModel):
    """Simple Perceptron Classifier."""
    
    def __init__(self, max_iter=1000, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Perceptron"
        self.model = Perceptron(
            max_iter=max_iter,
            random_state=random_state,
            n_jobs=-1,
            **kwargs
        )


# ===== INTERMEDIATE MODELS =====

class AdaBoostModel(BaseMLModel):
    """AdaBoost Classifier."""
    
    def __init__(self, n_estimators=50, learning_rate=1.0, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "AdaBoost"
        self.model = AdaBoostClassifier(
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            random_state=random_state,
            **kwargs
        )
    
    def get_feature_importance(self):
        """Get feature importance."""
        return self.model.feature_importances_


class ExtraTreesModel(BaseMLModel):
    """Extra Trees (Extremely Randomized Trees) Classifier."""
    
    def __init__(self, n_estimators=100, max_depth=10, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Extra Trees"
        self.model = ExtraTreesClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            random_state=random_state,
            n_jobs=-1,
            **kwargs
        )
    
    def get_feature_importance(self):
        """Get feature importance."""
        return self.model.feature_importances_


class BaggingModel(BaseMLModel):
    """Bagging Classifier."""
    
    def __init__(self, n_estimators=10, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "Bagging Classifier"
        self.model = BaggingClassifier(
            n_estimators=n_estimators,
            random_state=random_state,
            n_jobs=-1,
            **kwargs
        )


class VotingModel(BaseMLModel):
    """Voting Classifier (Ensemble of multiple models)."""
    
    def __init__(self, voting='hard', **kwargs):
        super().__init__()
        self.model_name = "Voting Classifier"
        estimators = [
            ('rf', RandomForestClassifier(n_estimators=50, random_state=42)),
            ('dt', DecisionTreeClassifier(max_depth=10, random_state=42)),
            ('nb', GaussianNB())
        ]
        self.model = VotingClassifier(
            estimators=estimators,
            voting=voting,
            n_jobs=-1,
            **kwargs
        )


class CatBoostModel(BaseMLModel):
    """CatBoost Classifier."""
    
    def __init__(self, iterations=100, depth=6, learning_rate=0.1, random_state=42, **kwargs):
        super().__init__()
        self.model_name = "CatBoost"
        if CatBoostClassifier is None:
            raise ImportError("CatBoost is not installed")
        self.model = CatBoostClassifier(
            iterations=iterations,
            depth=depth,
            learning_rate=learning_rate,
            random_state=random_state,
            verbose=False,
            **kwargs
        )
    
    def get_feature_importance(self):
        """Get feature importance."""
        return self.model.feature_importances_
