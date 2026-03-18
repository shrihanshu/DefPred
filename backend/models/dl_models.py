"""Deep Learning models for defect prediction."""
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, Model
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import logging

logger = logging.getLogger(__name__)


class DLModelFactory:
    """Factory class for creating DL models."""
    
    @staticmethod
    def create_model(model_type, input_shape, **kwargs):
        """Create and return a deep learning model."""
        if model_type == 'lstm':
            return LSTMModel(input_shape, **kwargs)
        elif model_type == 'cnn':
            return CNNModel(input_shape, **kwargs)
        elif model_type == 'transformer':
            return TransformerModel(input_shape, **kwargs)
        elif model_type == 'hybrid':
            return HybridModel(input_shape, **kwargs)
        else:
            raise ValueError(f"Unknown model type: {model_type}")


class BaseDLModel:
    """Base class for DL models."""
    
    def __init__(self, input_shape):
        self.model = None
        self.model_name = "Base DL Model"
        self.input_shape = input_shape
        self.history = None
    
    def compile_model(self, optimizer='adam', learning_rate=0.001):
        """Compile the model."""
        if optimizer == 'adam':
            opt = keras.optimizers.Adam(learning_rate=learning_rate)
        elif optimizer == 'sgd':
            opt = keras.optimizers.SGD(learning_rate=learning_rate)
        else:
            opt = optimizer
        
        self.model.compile(
            optimizer=opt,
            loss='binary_crossentropy',
            metrics=['accuracy', 'AUC', 'Precision', 'Recall']
        )
        logger.info(f"{self.model_name} compiled")
    
    def fit(self, X_train, y_train, validation_split=0.1, epochs=50, batch_size=32, verbose=1):
        """Train the model."""
        # Reshape input for sequence models if needed
        if len(X_train.shape) == 2:
            X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
        
        callbacks = [
            EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
            ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-7)
        ]
        
        logger.info(f"Training {self.model_name}...")
        self.history = self.model.fit(
            X_train, y_train,
            validation_split=validation_split,
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=verbose
        )
        logger.info(f"{self.model_name} training complete")
        return self
    
    def predict(self, X):
        """Make predictions."""
        if len(X.shape) == 2:
            X = X.reshape(X.shape[0], X.shape[1], 1)
        predictions = self.model.predict(X, verbose=0)
        return (predictions > 0.5).astype(int).flatten()
    
    def predict_proba(self, X):
        """Get prediction probabilities."""
        if len(X.shape) == 2:
            X = X.reshape(X.shape[0], X.shape[1], 1)
        predictions = self.model.predict(X, verbose=0).flatten()
        return np.vstack([1 - predictions, predictions]).T
    
    def save(self, filepath):
        """Save model to disk."""
        self.model.save(filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load(self, filepath):
        """Load model from disk."""
        self.model = keras.models.load_model(filepath)
        logger.info(f"Model loaded from {filepath}")
        return self


class LSTMModel(BaseDLModel):
    """LSTM-based model for defect prediction."""
    
    def __init__(self, input_shape, units=128, dropout=0.3, layers_count=2):
        super().__init__(input_shape)
        self.model_name = "LSTM"
        self.units = units
        self.dropout = dropout
        self.layers_count = layers_count
        self._build_model()
        self.compile_model()
    
    def _build_model(self):
        """Build LSTM architecture."""
        inputs = keras.Input(shape=(self.input_shape, 1))
        
        x = inputs
        for i in range(self.layers_count):
            return_sequences = (i < self.layers_count - 1)
            x = layers.LSTM(self.units, return_sequences=return_sequences)(x)
            x = layers.Dropout(self.dropout)(x)
        
        x = layers.Dense(64, activation='relu')(x)
        x = layers.Dropout(0.2)(x)
        outputs = layers.Dense(1, activation='sigmoid')(x)
        
        self.model = Model(inputs=inputs, outputs=outputs, name='LSTM_Defect_Predictor')
        logger.info(f"LSTM model built with {self.layers_count} layers")


class CNNModel(BaseDLModel):
    """CNN-based model for defect prediction."""
    
    def __init__(self, input_shape, filters=64, kernel_size=3, layers_count=3):
        super().__init__(input_shape)
        self.model_name = "CNN"
        self.filters = filters
        self.kernel_size = kernel_size
        self.layers_count = layers_count
        self._build_model()
        self.compile_model()
    
    def _build_model(self):
        """Build CNN architecture."""
        inputs = keras.Input(shape=(self.input_shape, 1))
        
        x = inputs
        for i in range(self.layers_count):
            x = layers.Conv1D(self.filters * (2 ** i), self.kernel_size, padding='same')(x)
            x = layers.BatchNormalization()(x)
            x = layers.Activation('relu')(x)
            x = layers.MaxPooling1D(2)(x)
            x = layers.Dropout(0.3)(x)
        
        x = layers.GlobalAveragePooling1D()(x)
        x = layers.Dense(128, activation='relu')(x)
        x = layers.Dropout(0.4)(x)
        x = layers.Dense(64, activation='relu')(x)
        x = layers.Dropout(0.3)(x)
        outputs = layers.Dense(1, activation='sigmoid')(x)
        
        self.model = Model(inputs=inputs, outputs=outputs, name='CNN_Defect_Predictor')
        logger.info(f"CNN model built with {self.layers_count} layers")


class TransformerModel(BaseDLModel):
    """Transformer-based model for defect prediction."""
    
    def __init__(self, input_shape, num_heads=4, ff_dim=128, num_blocks=2):
        super().__init__(input_shape)
        self.model_name = "Transformer"
        self.num_heads = num_heads
        self.ff_dim = ff_dim
        self.num_blocks = num_blocks
        self._build_model()
        self.compile_model()
    
    def _build_model(self):
        """Build Transformer architecture."""
        inputs = keras.Input(shape=(self.input_shape, 1))
        
        # Positional encoding
        x = inputs
        x = layers.Dense(64)(x)
        
        # Transformer blocks
        for _ in range(self.num_blocks):
            x = self._transformer_block(x, self.num_heads, self.ff_dim)
        
        # Global pooling and classification
        x = layers.GlobalAveragePooling1D()(x)
        x = layers.Dense(128, activation='relu')(x)
        x = layers.Dropout(0.3)(x)
        x = layers.Dense(64, activation='relu')(x)
        x = layers.Dropout(0.2)(x)
        outputs = layers.Dense(1, activation='sigmoid')(x)
        
        self.model = Model(inputs=inputs, outputs=outputs, name='Transformer_Defect_Predictor')
        logger.info(f"Transformer model built with {self.num_blocks} blocks")
    
    def _transformer_block(self, x, num_heads, ff_dim):
        """Create a transformer block."""
        # Multi-head attention
        attention_output = layers.MultiHeadAttention(
            num_heads=num_heads, key_dim=x.shape[-1]
        )(x, x)
        attention_output = layers.Dropout(0.1)(attention_output)
        x1 = layers.LayerNormalization(epsilon=1e-6)(x + attention_output)
        
        # Feed-forward network
        ff_output = layers.Dense(ff_dim, activation='relu')(x1)
        ff_output = layers.Dense(x.shape[-1])(ff_output)
        ff_output = layers.Dropout(0.1)(ff_output)
        x2 = layers.LayerNormalization(epsilon=1e-6)(x1 + ff_output)
        
        return x2


class HybridModel(BaseDLModel):
    """Hybrid CNN-LSTM model for defect prediction."""
    
    def __init__(self, input_shape, cnn_filters=64, lstm_units=64):
        super().__init__(input_shape)
        self.model_name = "Hybrid CNN-LSTM"
        self.cnn_filters = cnn_filters
        self.lstm_units = lstm_units
        self._build_model()
        self.compile_model()
    
    def _build_model(self):
        """Build hybrid CNN-LSTM architecture."""
        inputs = keras.Input(shape=(self.input_shape, 1))
        
        # CNN layers for feature extraction
        x = layers.Conv1D(self.cnn_filters, 3, padding='same')(inputs)
        x = layers.BatchNormalization()(x)
        x = layers.Activation('relu')(x)
        x = layers.MaxPooling1D(2)(x)
        x = layers.Dropout(0.3)(x)
        
        x = layers.Conv1D(self.cnn_filters * 2, 3, padding='same')(x)
        x = layers.BatchNormalization()(x)
        x = layers.Activation('relu')(x)
        x = layers.MaxPooling1D(2)(x)
        x = layers.Dropout(0.3)(x)
        
        # LSTM layers for sequence learning
        x = layers.LSTM(self.lstm_units, return_sequences=True)(x)
        x = layers.Dropout(0.3)(x)
        x = layers.LSTM(self.lstm_units // 2)(x)
        x = layers.Dropout(0.3)(x)
        
        # Dense layers
        x = layers.Dense(64, activation='relu')(x)
        x = layers.Dropout(0.2)(x)
        outputs = layers.Dense(1, activation='sigmoid')(x)
        
        self.model = Model(inputs=inputs, outputs=outputs, name='Hybrid_CNN_LSTM_Predictor')
        logger.info("Hybrid CNN-LSTM model built")
