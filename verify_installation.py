#!/usr/bin/env python3
"""
Installation Verification Script
Tests all dependencies and components to ensure proper installation
"""

import sys
import os

def print_header(text):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def test_python_version():
    """Test Python version"""
    print_header("Testing Python Version")
    version = sys.version_info
    print(f"Python Version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major >= 3 and version.minor >= 8:
        print("✅ Python version is compatible (3.8+)")
        return True
    else:
        print("❌ Python version must be 3.8 or higher")
        return False

def test_core_imports():
    """Test core Python package imports"""
    print_header("Testing Core Package Imports")
    
    packages = {
        'flask': 'Flask',
        'pandas': 'Pandas',
        'numpy': 'NumPy',
        'sklearn': 'Scikit-learn',
        'tensorflow': 'TensorFlow',
        'torch': 'PyTorch',
        'xgboost': 'XGBoost',
        'lightgbm': 'LightGBM',
        'shap': 'SHAP',
        'lime': 'LIME',
        'optuna': 'Optuna',
        'matplotlib': 'Matplotlib',
        'seaborn': 'Seaborn',
        'plotly': 'Plotly'
    }
    
    all_passed = True
    for package, name in packages.items():
        try:
            __import__(package)
            print(f"✅ {name:15} - OK")
        except ImportError as e:
            print(f"❌ {name:15} - FAILED: {e}")
            all_passed = False
    
    return all_passed

def test_custom_modules():
    """Test custom project modules"""
    print_header("Testing Custom Modules")
    
    # Add backend to path
    backend_path = os.path.join(os.path.dirname(__file__), 'backend')
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)
    
    modules = [
        'config',
        'preprocessing.data_loader',
        'preprocessing.preprocessor',
        'preprocessing.feature_engineering',
        'models.ml_models',
        'models.dl_models',
        'explainability.shap_explainer',
        'explainability.lime_explainer',
        'optimization.hyperparameter_tuning',
        'utils.metrics',
        'utils.visualization'
    ]
    
    all_passed = True
    for module in modules:
        try:
            __import__(module)
            print(f"✅ {module:40} - OK")
        except ImportError as e:
            print(f"❌ {module:40} - FAILED: {e}")
            all_passed = False
    
    return all_passed

def test_data_directories():
    """Test required data directories"""
    print_header("Testing Data Directories")
    
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    
    directories = [
        'data',
        'data/sample_datasets',
        'models',
        'preprocessing',
        'explainability',
        'optimization',
        'utils'
    ]
    
    all_passed = True
    for directory in directories:
        dir_path = os.path.join(backend_dir, directory)
        if os.path.exists(dir_path):
            print(f"✅ {directory:30} - EXISTS")
        else:
            print(f"❌ {directory:30} - NOT FOUND")
            all_passed = False
    
    return all_passed

def test_sample_data():
    """Test sample datasets"""
    print_header("Testing Sample Datasets")
    
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    sample_dir = os.path.join(backend_dir, 'data', 'sample_datasets')
    
    datasets = [
        'defect_data_small_balanced.csv',
        'defect_data_medium_imbalanced.csv',
        'defect_data_large.csv'
    ]
    
    all_passed = True
    for dataset in datasets:
        dataset_path = os.path.join(sample_dir, dataset)
        if os.path.exists(dataset_path):
            size = os.path.getsize(dataset_path) / 1024  # KB
            print(f"✅ {dataset:40} - {size:.1f} KB")
        else:
            print(f"❌ {dataset:40} - NOT FOUND")
            all_passed = False
    
    return all_passed

def test_frontend():
    """Test frontend installation"""
    print_header("Testing Frontend Installation")
    
    frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend')
    
    # Check node_modules
    node_modules = os.path.join(frontend_dir, 'node_modules')
    if os.path.exists(node_modules):
        print(f"✅ node_modules directory exists")
    else:
        print(f"❌ node_modules directory not found")
        return False
    
    # Check package.json
    package_json = os.path.join(frontend_dir, 'package.json')
    if os.path.exists(package_json):
        print(f"✅ package.json exists")
    else:
        print(f"❌ package.json not found")
        return False
    
    # Check src directory
    src_dir = os.path.join(frontend_dir, 'src')
    if os.path.exists(src_dir):
        print(f"✅ src directory exists")
        
        # Check components
        components_dir = os.path.join(src_dir, 'components')
        if os.path.exists(components_dir):
            component_count = len([f for f in os.listdir(components_dir) if f.endswith('.js')])
            print(f"✅ {component_count} React components found")
        else:
            print(f"❌ components directory not found")
            return False
    else:
        print(f"❌ src directory not found")
        return False
    
    return True

def run_all_tests():
    """Run all verification tests"""
    print("\n")
    print("╔" + "═"*58 + "╗")
    print("║" + " "*15 + "INSTALLATION VERIFICATION" + " "*18 + "║")
    print("║" + " "*5 + "AI-Driven Software Defect Prediction Platform" + " "*7 + "║")
    print("╚" + "═"*58 + "╝")
    
    results = {
        "Python Version": test_python_version(),
        "Core Packages": test_core_imports(),
        "Custom Modules": test_custom_modules(),
        "Data Directories": test_data_directories(),
        "Sample Datasets": test_sample_data(),
        "Frontend Installation": test_frontend()
    }
    
    # Summary
    print_header("Verification Summary")
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:25} : {status}")
    
    print("\n" + "─"*60)
    print(f"Total: {passed}/{total} tests passed")
    print("─"*60)
    
    if passed == total:
        print("\n🎉 All verifications passed! Installation is complete.")
        print("\n📚 Next Steps:")
        print("   1. Start backend: cd backend && source venv/bin/activate && python app.py")
        print("   2. Start frontend: cd frontend && npm start")
        print("   3. Access platform: http://localhost:3000")
        print("\n   Or simply run: ./start.sh")
        return 0
    else:
        print("\n❌ Some verifications failed. Please check the errors above.")
        print("\n💡 Troubleshooting:")
        print("   - Ensure all dependencies are installed")
        print("   - Run: cd backend && pip install -r requirements.txt")
        print("   - Run: cd frontend && npm install")
        print("   - Generate sample data: cd backend && python data/generate_sample_data.py")
        return 1

if __name__ == "__main__":
    exit_code = run_all_tests()
    sys.exit(exit_code)
