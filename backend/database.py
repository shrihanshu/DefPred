"""Database models for the Defect Prediction Platform."""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()


class User(db.Model):
    """User model to track authenticated users."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), unique=True, nullable=False, index=True)  # From Clerk
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(100))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    datasets = db.relationship('Dataset', backref='user', lazy=True, cascade='all, delete-orphan')
    models = db.relationship('TrainedModel', backref='user', lazy=True, cascade='all, delete-orphan')
    predictions = db.relationship('Prediction', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email': self.email,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }


class Dataset(db.Model):
    """Dataset model to track uploaded datasets."""
    __tablename__ = 'datasets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey('users.user_id'), nullable=False, index=True)
    dataset_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer)  # in bytes
    rows = db.Column(db.Integer)
    columns = db.Column(db.Integer)
    features = db.Column(db.Text)  # JSON string of feature names
    target_column = db.Column(db.String(100))
    class_distribution = db.Column(db.Text)  # JSON string of class distribution
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    models = db.relationship('TrainedModel', backref='dataset', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'dataset_id': self.dataset_id,
            'filename': self.filename,
            'file_size': self.file_size,
            'rows': self.rows,
            'columns': self.columns,
            'features': json.loads(self.features) if self.features else [],
            'target_column': self.target_column,
            'class_distribution': json.loads(self.class_distribution) if self.class_distribution else {},
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }


class TrainedModel(db.Model):
    """TrainedModel to track all trained models."""
    __tablename__ = 'trained_models'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey('users.user_id'), nullable=False, index=True)
    dataset_id = db.Column(db.String(255), db.ForeignKey('datasets.dataset_id'), nullable=False, index=True)
    model_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    model_type = db.Column(db.String(100), nullable=False)
    model_path = db.Column(db.String(500))  # Path to saved model file
    optimized = db.Column(db.Boolean, default=False)
    feature_names = db.Column(db.Text)  # JSON string
    training_time = db.Column(db.Float)  # in seconds
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    metrics = db.relationship('ModelMetrics', backref='model', lazy=True, uselist=False, cascade='all, delete-orphan')
    predictions = db.relationship('Prediction', backref='model', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        result = {
            'id': self.id,
            'model_id': self.model_id,
            'model_type': self.model_type,
            'dataset_id': self.dataset_id,
            'optimized': self.optimized,
            'feature_names': json.loads(self.feature_names) if self.feature_names else [],
            'training_time': self.training_time,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if self.metrics:
            result['metrics'] = self.metrics.to_dict()
        return result


class ModelMetrics(db.Model):
    """Model metrics to store evaluation results."""
    __tablename__ = 'model_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    model_id = db.Column(db.String(255), db.ForeignKey('trained_models.model_id'), nullable=False, unique=True, index=True)
    accuracy = db.Column(db.Float)
    precision = db.Column(db.Float)
    recall = db.Column(db.Float)
    f1_score = db.Column(db.Float)
    roc_auc = db.Column(db.Float)
    confusion_matrix = db.Column(db.Text)  # JSON string
    classification_report = db.Column(db.Text)  # JSON string
    additional_metrics = db.Column(db.Text)  # JSON string for any extra metrics
    
    def to_dict(self):
        return {
            'accuracy': self.accuracy,
            'precision': self.precision,
            'recall': self.recall,
            'f1_score': self.f1_score,
            'roc_auc': self.roc_auc,
            'confusion_matrix': json.loads(self.confusion_matrix) if self.confusion_matrix else None,
            'classification_report': json.loads(self.classification_report) if self.classification_report else None,
            'additional_metrics': json.loads(self.additional_metrics) if self.additional_metrics else {}
        }


class Prediction(db.Model):
    """Prediction model to track all predictions made."""
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey('users.user_id'), nullable=False, index=True)
    model_id = db.Column(db.String(255), db.ForeignKey('trained_models.model_id'), nullable=False, index=True)
    input_features = db.Column(db.Text, nullable=False)  # JSON string
    prediction = db.Column(db.Integer, nullable=False)
    prediction_class = db.Column(db.String(50))  # 'Defect' or 'No Defect'
    probability = db.Column(db.Text)  # JSON string [prob_no_defect, prob_defect]
    explanation = db.Column(db.Text)  # JSON string of explanation if requested
    explainer_type = db.Column(db.String(50))  # 'shap', 'lime', or None
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'model_id': self.model_id,
            'input_features': json.loads(self.input_features) if self.input_features else [],
            'prediction': self.prediction,
            'prediction_class': self.prediction_class,
            'probability': json.loads(self.probability) if self.probability else [],
            'explanation': json.loads(self.explanation) if self.explanation else None,
            'explainer_type': self.explainer_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class UserActivity(db.Model):
    """Track user activity and sessions."""
    __tablename__ = 'user_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), db.ForeignKey('users.user_id'), nullable=False, index=True)
    activity_type = db.Column(db.String(50), nullable=False)  # 'login', 'upload', 'train', 'predict', etc.
    activity_details = db.Column(db.Text)  # JSON string with additional details
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'activity_type': self.activity_type,
            'activity_details': json.loads(self.activity_details) if self.activity_details else {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
