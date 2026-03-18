"""Feature engineering for software defect prediction."""
import pandas as pd
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
import logging

logger = logging.getLogger(__name__)


class FeatureEngineer:
    """Create and transform features for defect prediction."""
    
    def __init__(self):
        self.polynomial_features = None
        self.created_features = []
    
    def create_complexity_features(self, df):
        """Create complexity-based features."""
        df_new = df.copy()
        
        # Complexity per LOC
        if 'cyclomatic_complexity' in df.columns and 'loc' in df.columns:
            df_new['complexity_per_loc'] = df['cyclomatic_complexity'] / (df['loc'] + 1)
        
        # Methods per class
        if 'num_methods' in df.columns and 'num_classes' in df.columns:
            df_new['methods_per_class'] = df['num_methods'] / (df['num_classes'] + 1)
        
        # Weighted complexity
        if 'cyclomatic_complexity' in df.columns and 'coupling' in df.columns:
            df_new['weighted_complexity'] = df['cyclomatic_complexity'] * df['coupling']
        
        logger.info("Created complexity features")
        return df_new
    
    def create_churn_features(self, df):
        """Create code churn features."""
        df_new = df.copy()
        
        # Churn per LOC
        if 'code_churn' in df.columns and 'loc' in df.columns:
            df_new['churn_per_loc'] = df['code_churn'] / (df['loc'] + 1)
        
        # Commits per author
        if 'num_commits' in df.columns and 'num_authors' in df.columns:
            df_new['commits_per_author'] = df['num_commits'] / (df['num_authors'] + 1)
        
        # Activity rate (commits per day)
        if 'num_commits' in df.columns and 'file_age_days' in df.columns:
            df_new['activity_rate'] = df['num_commits'] / (df['file_age_days'] + 1)
        
        logger.info("Created churn features")
        return df_new
    
    def create_quality_features(self, df):
        """Create code quality features."""
        df_new = df.copy()
        
        # Test coverage adequacy
        if 'test_coverage' in df.columns and 'cyclomatic_complexity' in df.columns:
            df_new['test_adequacy'] = df['test_coverage'] / (df['cyclomatic_complexity'] + 1)
        
        # Documentation ratio
        if 'comment_ratio' in df.columns and 'loc' in df.columns:
            df_new['documentation_quality'] = df['comment_ratio'] * np.log1p(df['loc'])
        
        # Code maintainability index (simplified)
        if all(col in df.columns for col in ['loc', 'cyclomatic_complexity', 'comment_ratio']):
            df_new['maintainability_index'] = (
                171 - 5.2 * np.log(df['loc'] + 1) -
                0.23 * df['cyclomatic_complexity'] -
                16.2 * np.log(df['comment_ratio'] + 0.01)
            )
        
        logger.info("Created quality features")
        return df_new
    
    def create_oo_features(self, df):
        """Create object-oriented design features."""
        df_new = df.copy()
        
        # Inheritance complexity
        if 'inheritance_depth' in df.columns and 'num_children' in df.columns:
            df_new['inheritance_complexity'] = df['inheritance_depth'] * df['num_children']
        
        # Coupling to cohesion ratio
        if 'coupling' in df.columns and 'cohesion' in df.columns:
            df_new['coupling_cohesion_ratio'] = df['coupling'] / (df['cohesion'] + 0.01)
        
        # Design complexity
        if all(col in df.columns for col in ['coupling', 'cohesion', 'inheritance_depth']):
            df_new['design_complexity'] = (
                df['coupling'] * (1 - df['cohesion']) * (df['inheritance_depth'] + 1)
            )
        
        logger.info("Created OO design features")
        return df_new
    
    def create_historical_features(self, df):
        """Create historical defect features."""
        df_new = df.copy()
        
        # Bug density
        if 'num_bugs_historical' in df.columns and 'loc' in df.columns:
            df_new['bug_density'] = df['num_bugs_historical'] / (df['loc'] + 1) * 1000
        
        # Bug rate (bugs per commit)
        if 'num_bugs_historical' in df.columns and 'num_commits' in df.columns:
            df_new['bug_rate'] = df['num_bugs_historical'] / (df['num_commits'] + 1)
        
        logger.info("Created historical features")
        return df_new
    
    def create_interaction_features(self, df, degree=2):
        """Create polynomial interaction features."""
        # Select numeric columns only
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        # Limit to important features to avoid explosion
        important_features = ['cyclomatic_complexity', 'coupling', 'loc', 'cohesion', 
                             'num_bugs_historical', 'test_coverage']
        
        selected_cols = [col for col in important_features if col in numeric_cols]
        
        if len(selected_cols) > 0:
            self.polynomial_features = PolynomialFeatures(degree=degree, include_bias=False)
            poly_data = self.polynomial_features.fit_transform(df[selected_cols])
            
            # Get feature names
            poly_feature_names = self.polynomial_features.get_feature_names_out(selected_cols)
            
            # Add only interaction terms (skip original features)
            for i, name in enumerate(poly_feature_names):
                if ' ' in name:  # Interaction term
                    df[name] = poly_data[:, i]
            
            logger.info(f"Created {len(poly_feature_names)} polynomial features")
        
        return df
    
    def create_all_features(self, df):
        """Create all engineered features."""
        df_engineered = df.copy()
        
        df_engineered = self.create_complexity_features(df_engineered)
        df_engineered = self.create_churn_features(df_engineered)
        df_engineered = self.create_quality_features(df_engineered)
        df_engineered = self.create_oo_features(df_engineered)
        df_engineered = self.create_historical_features(df_engineered)
        # Skip polynomial features to avoid too many features
        # df_engineered = self.create_interaction_features(df_engineered)
        
        # Fill any NaN values created during feature engineering
        df_engineered = df_engineered.fillna(0)
        
        logger.info(f"Feature engineering complete. Shape: {df_engineered.shape}")
        return df_engineered
