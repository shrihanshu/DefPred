"""Data loading utilities."""
import pandas as pd
import numpy as np
from pathlib import Path
import logging
from scipy.io import arff

logger = logging.getLogger(__name__)


class DataLoader:
    """Load and validate datasets."""
    
    def __init__(self):
        self.supported_formats = ['.csv', '.txt', '.json', '.arff']
    
    def load_csv(self, filepath, **kwargs):
        """Load CSV file with optimizations for large files."""
        try:
            # Use efficient dtypes and only load what we need
            df = pd.read_csv(
                filepath, 
                low_memory=False,  # Avoid mixed type warnings
                **kwargs
            )
            logger.info(f"Loaded CSV: {filepath} with shape {df.shape}")
            return df
        except Exception as e:
            logger.error(f"Error loading CSV {filepath}: {str(e)}")
            raise
    
    def load_json(self, filepath, **kwargs):
        """Load JSON file."""
        try:
            df = pd.read_json(filepath, **kwargs)
            logger.info(f"Loaded JSON: {filepath} with shape {df.shape}")
            return df
        except Exception as e:
            logger.error(f"Error loading JSON {filepath}: {str(e)}")
            raise
    
    def load_arff(self, filepath):
        """Load ARFF file."""
        try:
            data, meta = arff.loadarff(filepath)
            df = pd.DataFrame(data)
            
            # Convert byte strings to regular strings
            for col in df.columns:
                if df[col].dtype == object:
                    try:
                        df[col] = df[col].str.decode('utf-8')
                    except AttributeError:
                        pass
            
            logger.info(f"Loaded ARFF: {filepath} with shape {df.shape}")
            return df
        except Exception as e:
            logger.error(f"Error loading ARFF {filepath}: {str(e)}")
            raise
    
    def validate_dataset(self, df, target_column=None):
        """Validate dataset format."""
        if df.empty:
            raise ValueError("Dataset is empty")
        
        if target_column and target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found")
        
        # Check for missing values
        missing_pct = (df.isnull().sum() / len(df) * 100).round(2)
        if missing_pct.max() > 50:
            logger.warning(f"High missing values detected: {missing_pct[missing_pct > 50]}")
        
        return True
    
    def get_sample_data(self, n_samples=1000, n_features=20):
        """Generate sample software metrics data."""
        np.random.seed(42)
        
        # Generate realistic software metrics
        data = {
            'loc': np.random.randint(10, 1000, n_samples),
            'cyclomatic_complexity': np.random.randint(1, 50, n_samples),
            'num_methods': np.random.randint(1, 100, n_samples),
            'num_classes': np.random.randint(1, 20, n_samples),
            'coupling': np.random.randint(0, 30, n_samples),
            'cohesion': np.random.uniform(0, 1, n_samples),
            'inheritance_depth': np.random.randint(0, 10, n_samples),
            'num_children': np.random.randint(0, 15, n_samples),
            'response_for_class': np.random.randint(1, 50, n_samples),
            'weighted_methods': np.random.randint(1, 100, n_samples),
            'code_churn': np.random.randint(0, 500, n_samples),
            'num_commits': np.random.randint(1, 100, n_samples),
            'num_authors': np.random.randint(1, 10, n_samples),
            'file_age_days': np.random.randint(1, 1000, n_samples),
            'num_bugs_historical': np.random.randint(0, 20, n_samples),
            'test_coverage': np.random.uniform(0, 100, n_samples),
            'comment_ratio': np.random.uniform(0, 0.5, n_samples),
            'duplicate_code_ratio': np.random.uniform(0, 0.3, n_samples),
            'fan_in': np.random.randint(0, 20, n_samples),
            'fan_out': np.random.randint(0, 20, n_samples),
        }
        
        df = pd.DataFrame(data)
        
        # Generate target based on features (defect-prone if complexity is high)
        defect_score = (
            df['cyclomatic_complexity'] * 0.3 +
            df['coupling'] * 0.2 +
            df['loc'] / 100 * 0.2 +
            (1 - df['cohesion']) * 10 +
            df['num_bugs_historical'] * 0.3 +
            np.random.normal(0, 5, n_samples)
        )
        
        df['defect'] = (defect_score > defect_score.median()).astype(int)
        
        logger.info(f"Generated sample data with shape {df.shape}")
        logger.info(f"Defect distribution: {df['defect'].value_counts().to_dict()}")
        
        return df
