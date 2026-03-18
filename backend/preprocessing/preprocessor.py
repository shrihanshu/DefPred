"""Data preprocessing for defect prediction."""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, RobustScaler
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.combine import SMOTETomek
import logging

logger = logging.getLogger(__name__)


class DataPreprocessor:
    """Preprocess data for machine learning."""
    
    def __init__(self, test_size=0.2, random_state=42, balance_strategy='smote'):
        self.test_size = test_size
        self.random_state = random_state
        self.balance_strategy = balance_strategy
        self.scaler = None
        self.feature_names = None
    
    def handle_missing_values(self, df, strategy='median'):
        """Handle missing values."""
        df_clean = df.copy()
        
        if df_clean.isnull().sum().sum() > 0:
            logger.info(f"Missing values found: {df_clean.isnull().sum().sum()}")
            
            for col in df_clean.columns:
                if df_clean[col].isnull().any():
                    if df_clean[col].dtype in ['float64', 'int64']:
                        if strategy == 'median':
                            df_clean[col].fillna(df_clean[col].median(), inplace=True)
                        elif strategy == 'mean':
                            df_clean[col].fillna(df_clean[col].mean(), inplace=True)
                        else:
                            df_clean[col].fillna(0, inplace=True)
                    else:
                        df_clean[col].fillna(df_clean[col].mode()[0], inplace=True)
            
            logger.info("Missing values handled")
        
        return df_clean
    
    def handle_outliers(self, df, method='iqr', threshold=3):
        """Handle outliers using IQR or Z-score method."""
        df_clean = df.copy()
        numeric_cols = df_clean.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            if method == 'iqr':
                Q1 = df_clean[col].quantile(0.25)
                Q3 = df_clean[col].quantile(0.75)
                IQR = Q3 - Q1
                lower = Q1 - 1.5 * IQR
                upper = Q3 + 1.5 * IQR
                
                # Cap outliers
                df_clean[col] = df_clean[col].clip(lower=lower, upper=upper)
            
            elif method == 'zscore':
                mean = df_clean[col].mean()
                std = df_clean[col].std()
                
                if std > 0:
                    z_scores = np.abs((df_clean[col] - mean) / std)
                    df_clean.loc[z_scores > threshold, col] = mean
        
        logger.info("Outliers handled")
        return df_clean
    
    def balance_dataset(self, X, y):
        """Balance the dataset using various strategies."""
        logger.info(f"Original class distribution: {pd.Series(y).value_counts().to_dict()}")
        
        if self.balance_strategy == 'smote':
            sampler = SMOTE(random_state=self.random_state)
        elif self.balance_strategy == 'undersample':
            sampler = RandomUnderSampler(random_state=self.random_state)
        elif self.balance_strategy == 'smote_tomek':
            sampler = SMOTETomek(random_state=self.random_state)
        else:
            logger.info("No balancing applied")
            return X, y
        
        try:
            X_balanced, y_balanced = sampler.fit_resample(X, y)
            logger.info(f"Balanced class distribution: {pd.Series(y_balanced).value_counts().to_dict()}")
            return X_balanced, y_balanced
        except Exception as e:
            logger.warning(f"Could not balance dataset: {str(e)}. Using original data.")
            return X, y
    
    def scale_features(self, X_train, X_test, scaler_type='standard'):
        """Scale features."""
        if scaler_type == 'standard':
            self.scaler = StandardScaler()
        elif scaler_type == 'robust':
            self.scaler = RobustScaler()
        else:
            logger.info("No scaling applied")
            return X_train, X_test
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        logger.info(f"Features scaled using {scaler_type} scaler")
        return X_train_scaled, X_test_scaled
    
    def prepare_data(self, df, target_col='defect', feature_engineer=False):
        """Complete data preparation pipeline."""
        # Handle missing values
        df_clean = self.handle_missing_values(df)
        
        # Handle outliers
        df_clean = self.handle_outliers(df_clean)
        
        # Separate features and target
        if target_col not in df_clean.columns:
            # Assume last column is target
            target_col = df_clean.columns[-1]
        
        X = df_clean.drop(columns=[target_col])
        y = df_clean[target_col]
        
        self.feature_names = list(X.columns)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=self.test_size, random_state=self.random_state, stratify=y
        )
        
        # Balance training data
        X_train_balanced, y_train_balanced = self.balance_dataset(X_train, y_train)
        
        # Scale features
        X_train_scaled, X_test_scaled = self.scale_features(
            X_train_balanced, X_test, scaler_type='standard'
        )
        
        logger.info(f"Data preparation complete. Train shape: {X_train_scaled.shape}, Test shape: {X_test_scaled.shape}")
        
        return X_train_scaled, X_test_scaled, y_train_balanced, y_test, self.scaler
