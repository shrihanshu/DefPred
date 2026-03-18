"""Initialize the database for the Defect Prediction Platform."""
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from app import app, db
from database import User, Dataset, TrainedModel, ModelMetrics, Prediction, UserActivity


def init_database():
    """Initialize the database."""
    print("Initializing database...")
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✓ Database tables created successfully")
        
        # Print table information
        tables = [User, Dataset, TrainedModel, ModelMetrics, Prediction, UserActivity]
        print("\n📊 Database Tables Created:")
        for table in tables:
            print(f"  - {table.__tablename__}")
        
        print(f"\n✓ Database initialized at: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print("\n✅ Setup complete! You can now start the application.")


if __name__ == '__main__':
    init_database()
