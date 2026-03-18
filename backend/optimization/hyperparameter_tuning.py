"""Hyperparameter optimization using Optuna and GridSearch."""
import optuna
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
import numpy as np
import logging

logger = logging.getLogger(__name__)


class HyperparameterOptimizer:
    """Hyperparameter optimization for ML models."""
    
    def __init__(self, model_type, optimization_method='optuna', n_trials=50, cv=5):
        """
        Initialize optimizer.
        
        Args:
            model_type: Type of model to optimize
            optimization_method: 'optuna', 'grid_search', or 'random_search'
            n_trials: Number of trials for Optuna
            cv: Number of cross-validation folds
        """
        self.model_type = model_type
        self.optimization_method = optimization_method
        self.n_trials = n_trials
        self.cv = cv
        self.best_params = None
        self.best_score = None
        self.study = None
    
    def optimize(self, X_train, y_train):
        """Optimize hyperparameters."""
        if self.optimization_method == 'optuna':
            return self._optuna_optimize(X_train, y_train)
        elif self.optimization_method == 'grid_search':
            return self._grid_search_optimize(X_train, y_train)
        elif self.optimization_method == 'random_search':
            return self._random_search_optimize(X_train, y_train)
        else:
            raise ValueError(f"Unknown optimization method: {self.optimization_method}")
    
    def _optuna_optimize(self, X_train, y_train):
        """Optimize using Optuna."""
        logger.info(f"Starting Optuna optimization for {self.model_type}...")
        
        def objective(trial):
            params = self._get_optuna_params(trial)
            model = self._create_model(params)
            
            # Cross-validation score
            scores = cross_val_score(model, X_train, y_train, cv=self.cv, scoring='f1')
            return scores.mean()
        
        self.study = optuna.create_study(direction='maximize', study_name=f'{self.model_type}_optimization')
        self.study.optimize(objective, n_trials=self.n_trials, show_progress_bar=True)
        
        self.best_params = self.study.best_params
        self.best_score = self.study.best_value
        
        logger.info(f"Best parameters: {self.best_params}")
        logger.info(f"Best F1 score: {self.best_score:.4f}")
        
        # Train final model with best parameters
        best_model = self._create_model(self.best_params)
        best_model.fit(X_train, y_train)
        
        return best_model
    
    def _get_optuna_params(self, trial):
        """Get parameter suggestions from Optuna trial."""
        if self.model_type == 'random_forest':
            return {
                'n_estimators': trial.suggest_int('n_estimators', 50, 300),
                'max_depth': trial.suggest_int('max_depth', 5, 30),
                'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
                'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
                'max_features': trial.suggest_categorical('max_features', ['sqrt', 'log2', None]),
            }
        
        elif self.model_type == 'xgboost':
            return {
                'n_estimators': trial.suggest_int('n_estimators', 50, 300),
                'max_depth': trial.suggest_int('max_depth', 3, 12),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
                'gamma': trial.suggest_float('gamma', 0, 5),
                'reg_alpha': trial.suggest_float('reg_alpha', 0, 1),
                'reg_lambda': trial.suggest_float('reg_lambda', 0, 1),
            }
        
        elif self.model_type == 'svm':
            return {
                'C': trial.suggest_float('C', 0.1, 100, log=True),
                'kernel': trial.suggest_categorical('kernel', ['rbf', 'poly', 'sigmoid']),
                'gamma': trial.suggest_categorical('gamma', ['scale', 'auto']),
            }
        
        elif self.model_type == 'gradient_boosting':
            return {
                'n_estimators': trial.suggest_int('n_estimators', 50, 300),
                'max_depth': trial.suggest_int('max_depth', 3, 10),
                'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
                'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
                'subsample': trial.suggest_float('subsample', 0.6, 1.0),
            }
    
    def _create_model(self, params):
        """Create model with given parameters."""
        if self.model_type == 'random_forest':
            return RandomForestClassifier(**params, random_state=42, n_jobs=-1)
        elif self.model_type == 'xgboost':
            return XGBClassifier(**params, random_state=42, n_jobs=-1, eval_metric='logloss')
        elif self.model_type == 'svm':
            return SVC(**params, random_state=42, probability=True)
        elif self.model_type == 'gradient_boosting':
            return GradientBoostingClassifier(**params, random_state=42)
    
    def _grid_search_optimize(self, X_train, y_train):
        """Optimize using GridSearchCV."""
        logger.info(f"Starting Grid Search optimization for {self.model_type}...")
        
        param_grid = self._get_param_grid()
        base_model = self._create_base_model()
        
        grid_search = GridSearchCV(
            base_model, param_grid, cv=self.cv, scoring='f1',
            n_jobs=-1, verbose=1
        )
        
        grid_search.fit(X_train, y_train)
        
        self.best_params = grid_search.best_params_
        self.best_score = grid_search.best_score_
        
        logger.info(f"Best parameters: {self.best_params}")
        logger.info(f"Best F1 score: {self.best_score:.4f}")
        
        return grid_search.best_estimator_
    
    def _random_search_optimize(self, X_train, y_train):
        """Optimize using RandomizedSearchCV."""
        logger.info(f"Starting Random Search optimization for {self.model_type}...")
        
        param_distributions = self._get_param_distributions()
        base_model = self._create_base_model()
        
        random_search = RandomizedSearchCV(
            base_model, param_distributions, n_iter=self.n_trials,
            cv=self.cv, scoring='f1', n_jobs=-1, verbose=1, random_state=42
        )
        
        random_search.fit(X_train, y_train)
        
        self.best_params = random_search.best_params_
        self.best_score = random_search.best_score_
        
        logger.info(f"Best parameters: {self.best_params}")
        logger.info(f"Best F1 score: {self.best_score:.4f}")
        
        return random_search.best_estimator_
    
    def _get_param_grid(self):
        """Get parameter grid for GridSearchCV."""
        if self.model_type == 'random_forest':
            return {
                'n_estimators': [50, 100, 200],
                'max_depth': [5, 10, 15, 20],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4],
            }
        elif self.model_type == 'xgboost':
            return {
                'n_estimators': [50, 100, 200],
                'max_depth': [3, 6, 9],
                'learning_rate': [0.01, 0.1, 0.2],
                'subsample': [0.7, 0.8, 0.9],
            }
    
    def _get_param_distributions(self):
        """Get parameter distributions for RandomizedSearchCV."""
        if self.model_type == 'random_forest':
            return {
                'n_estimators': [50, 100, 150, 200, 250, 300],
                'max_depth': [5, 10, 15, 20, 25, 30],
                'min_samples_split': [2, 5, 10, 15, 20],
                'min_samples_leaf': [1, 2, 4, 6, 8, 10],
                'max_features': ['sqrt', 'log2', None],
            }
        elif self.model_type == 'xgboost':
            return {
                'n_estimators': [50, 100, 150, 200, 250, 300],
                'max_depth': [3, 6, 9, 12],
                'learning_rate': [0.01, 0.05, 0.1, 0.15, 0.2, 0.3],
                'subsample': [0.6, 0.7, 0.8, 0.9, 1.0],
                'colsample_bytree': [0.6, 0.7, 0.8, 0.9, 1.0],
            }
    
    def _create_base_model(self):
        """Create base model for GridSearchCV/RandomizedSearchCV."""
        if self.model_type == 'random_forest':
            return RandomForestClassifier(random_state=42, n_jobs=-1)
        elif self.model_type == 'xgboost':
            return XGBClassifier(random_state=42, n_jobs=-1, eval_metric='logloss')
        elif self.model_type == 'svm':
            return SVC(random_state=42, probability=True)
        elif self.model_type == 'gradient_boosting':
            return GradientBoostingClassifier(random_state=42)
