"""Simple script to view database contents."""
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from app import app, db
from database import User, Dataset, TrainedModel, ModelMetrics, Prediction, UserActivity
from sqlalchemy import func


def view_database():
    """Display database contents in a readable format."""
    print("\n" + "="*80)
    print("📊 DEFECT PREDICTION DATABASE VIEWER")
    print("="*80 + "\n")
    
    with app.app_context():
        # Users
        users = User.query.all()
        print(f"👤 USERS: {len(users)} total")
        print("-" * 80)
        for user in users:
            print(f"  ID: {user.user_id}")
            print(f"  Email: {user.email}")
            print(f"  Name: {user.first_name} {user.last_name}")
            print(f"  Last Login: {user.last_login}")
            print()
        
        # Datasets
        datasets = Dataset.query.all()
        print(f"\n📁 DATASETS: {len(datasets)} total")
        print("-" * 80)
        for dataset in datasets:
            print(f"  ID: {dataset.dataset_id}")
            print(f"  Filename: {dataset.filename}")
            print(f"  Size: {dataset.rows} rows × {dataset.columns} cols")
            print(f"  Uploaded: {dataset.uploaded_at}")
            print(f"  User: {dataset.user_id}")
            print()
        
        # Models
        models = TrainedModel.query.all()
        print(f"\n🤖 TRAINED MODELS: {len(models)} total")
        print("-" * 80)
        for model in models:
            print(f"  ID: {model.model_id}")
            print(f"  Type: {model.model_type}")
            print(f"  Dataset: {model.dataset_id}")
            print(f"  Optimized: {model.optimized}")
            print(f"  Training Time: {model.training_time:.2f}s" if model.training_time else "  Training Time: N/A")
            print(f"  Created: {model.created_at}")
            if model.metrics:
                print(f"  Accuracy: {model.metrics.accuracy:.2%}" if model.metrics.accuracy else "  Accuracy: N/A")
                print(f"  F1 Score: {model.metrics.f1_score:.2%}" if model.metrics.f1_score else "  F1 Score: N/A")
            print()
        
        # Predictions
        predictions = Prediction.query.order_by(Prediction.created_at.desc()).limit(10).all()
        total_predictions = Prediction.query.count()
        print(f"\n🔮 PREDICTIONS: {total_predictions} total (showing last 10)")
        print("-" * 80)
        for pred in predictions:
            print(f"  ID: {pred.id}")
            print(f"  Model: {pred.model_id}")
            print(f"  Result: {pred.prediction_class}")
            print(f"  Confidence: {max(pred.probability) if pred.probability else 'N/A'}")
            print(f"  Time: {pred.created_at}")
            print()
        
        # Activities
        activities = UserActivity.query.order_by(UserActivity.created_at.desc()).limit(10).all()
        total_activities = UserActivity.query.count()
        print(f"\n📝 ACTIVITIES: {total_activities} total (showing last 10)")
        print("-" * 80)
        for activity in activities:
            print(f"  Type: {activity.activity_type}")
            print(f"  User: {activity.user_id}")
            print(f"  Time: {activity.created_at}")
            print(f"  IP: {activity.ip_address}")
            print()
        
        # Statistics
        print("\n📈 STATISTICS")
        print("-" * 80)
        print(f"  Total Users: {len(users)}")
        print(f"  Total Datasets: {len(datasets)}")
        print(f"  Total Models: {len(models)}")
        print(f"  Total Predictions: {total_predictions}")
        print(f"  Total Activities: {total_activities}")
        
        # Most used model type
        if models:
            model_counts = db.session.query(
                TrainedModel.model_type, 
                func.count(TrainedModel.model_type).label('count')
            ).group_by(TrainedModel.model_type).order_by(func.count(TrainedModel.model_type).desc()).all()
            
            print(f"\n  Most Used Models:")
            for model_type, count in model_counts:
                print(f"    - {model_type}: {count}")
        
        print("\n" + "="*80 + "\n")


if __name__ == '__main__':
    view_database()
