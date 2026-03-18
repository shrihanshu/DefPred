"""Generate sample software defect prediction datasets."""
import pandas as pd
import numpy as np
from pathlib import Path
import sys
import logging

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))
from config import DATASET_DIR

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def generate_sample_dataset(n_samples=1000, defect_ratio=0.3, random_state=42):
    """
    Generate a realistic software defect prediction dataset.
    
    Args:
        n_samples: Number of samples to generate
        defect_ratio: Ratio of defective samples
        random_state: Random seed for reproducibility
    
    Returns:
        DataFrame with generated data
    """
    np.random.seed(random_state)
    
    logger.info(f"Generating dataset with {n_samples} samples...")
    
    # Software Metrics Features
    data = {
        # Size metrics
        'loc': np.random.lognormal(5, 1, n_samples).astype(int),
        'comment_lines': np.random.lognormal(3, 1, n_samples).astype(int),
        'blank_lines': np.random.lognormal(2, 0.8, n_samples).astype(int),
        
        # Complexity metrics
        'cyclomatic_complexity': np.random.lognormal(2, 0.8, n_samples).astype(int),
        'halstead_volume': np.random.lognormal(7, 1, n_samples),
        'halstead_difficulty': np.random.lognormal(2, 0.5, n_samples),
        'maintainability_index': np.random.normal(65, 20, n_samples),
        
        # Object-oriented metrics
        'num_methods': np.random.poisson(10, n_samples),
        'num_classes': np.random.poisson(3, n_samples) + 1,
        'coupling': np.random.poisson(5, n_samples),
        'cohesion': np.random.beta(5, 2, n_samples),
        'inheritance_depth': np.random.poisson(2, n_samples),
        'num_children': np.random.poisson(1, n_samples),
        'weighted_methods_per_class': np.random.poisson(15, n_samples),
        'response_for_class': np.random.poisson(12, n_samples),
        'lack_of_cohesion': np.random.beta(2, 5, n_samples),
        
        # Code change metrics
        'code_churn': np.random.poisson(50, n_samples),
        'num_commits': np.random.poisson(20, n_samples) + 1,
        'num_authors': np.random.poisson(2, n_samples) + 1,
        'file_age_days': np.random.exponential(200, n_samples).astype(int) + 1,
        'num_revisions': np.random.poisson(15, n_samples) + 1,
        
        # Historical defect metrics
        'num_bugs_historical': np.random.poisson(2, n_samples),
        'num_bug_fixes': np.random.poisson(1.5, n_samples),
        
        # Quality metrics
        'test_coverage': np.random.beta(5, 3, n_samples) * 100,
        'comment_ratio': np.random.beta(2, 5, n_samples),
        'duplicate_code_ratio': np.random.beta(1, 10, n_samples),
        
        # Dependency metrics
        'fan_in': np.random.poisson(3, n_samples),
        'fan_out': np.random.poisson(4, n_samples),
        'num_dependencies': np.random.poisson(5, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Clip values to realistic ranges
    df['loc'] = df['loc'].clip(10, 5000)
    df['cyclomatic_complexity'] = df['cyclomatic_complexity'].clip(1, 100)
    df['maintainability_index'] = df['maintainability_index'].clip(0, 100)
    df['cohesion'] = df['cohesion'].clip(0, 1)
    df['lack_of_cohesion'] = df['lack_of_cohesion'].clip(0, 1)
    df['test_coverage'] = df['test_coverage'].clip(0, 100)
    df['comment_ratio'] = df['comment_ratio'].clip(0, 1)
    df['duplicate_code_ratio'] = df['duplicate_code_ratio'].clip(0, 1)
    
    # Generate target variable based on features (realistic relationship)
    # High complexity, low test coverage, and historical bugs increase defect probability
    defect_score = (
        df['cyclomatic_complexity'] / 20 * 0.25 +
        df['coupling'] / 10 * 0.15 +
        df['loc'] / 500 * 0.1 +
        (1 - df['cohesion']) * 0.15 +
        df['num_bugs_historical'] / 5 * 0.2 +
        (100 - df['test_coverage']) / 100 * 0.15 +
        df['code_churn'] / 100 * 0.1 +
        df['lack_of_cohesion'] * 0.1 +
        np.random.normal(0, 0.2, n_samples)
    )
    
    # Convert score to binary defect label
    threshold = np.percentile(defect_score, (1 - defect_ratio) * 100)
    df['defect'] = (defect_score > threshold).astype(int)
    
    # Verify distribution
    actual_ratio = df['defect'].mean()
    logger.info(f"Actual defect ratio: {actual_ratio:.2%}")
    
    # Add some noise and correlations
    df['complexity_per_loc'] = df['cyclomatic_complexity'] / (df['loc'] + 1)
    df['bug_density'] = df['num_bugs_historical'] / (df['loc'] + 1) * 1000
    df['churn_per_commit'] = df['code_churn'] / (df['num_commits'] + 1)
    
    return df


def generate_multiple_datasets():
    """Generate multiple datasets with different characteristics."""
    
    # Small balanced dataset
    df_small = generate_sample_dataset(n_samples=500, defect_ratio=0.5, random_state=42)
    filepath_small = DATASET_DIR / 'defect_data_small_balanced.csv'
    df_small.to_csv(filepath_small, index=False)
    logger.info(f"Saved: {filepath_small}")
    
    # Medium imbalanced dataset (realistic)
    df_medium = generate_sample_dataset(n_samples=2000, defect_ratio=0.2, random_state=43)
    filepath_medium = DATASET_DIR / 'defect_data_medium_imbalanced.csv'
    df_medium.to_csv(filepath_medium, index=False)
    logger.info(f"Saved: {filepath_medium}")
    
    # Large dataset
    df_large = generate_sample_dataset(n_samples=5000, defect_ratio=0.25, random_state=44)
    filepath_large = DATASET_DIR / 'defect_data_large.csv'
    df_large.to_csv(filepath_large, index=False)
    logger.info(f"Saved: {filepath_large}")
    
    logger.info("All datasets generated successfully!")
    
    # Print statistics
    for name, df in [('Small', df_small), ('Medium', df_medium), ('Large', df_large)]:
        print(f"\n{name} Dataset Statistics:")
        print(f"Shape: {df.shape}")
        print(f"Defect ratio: {df['defect'].mean():.2%}")
        print(f"Feature statistics:")
        print(df.describe().loc[['mean', 'std', 'min', 'max']].T.head(10))


if __name__ == '__main__':
    generate_multiple_datasets()
