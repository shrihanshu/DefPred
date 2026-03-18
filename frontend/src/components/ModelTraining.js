import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Activity,
  Shield,
  Rocket
} from 'lucide-react';
import { trainModel } from '../services/api';
import AISummaryModal from './AISummaryModal';
import AnimatedMetrics from './AnimatedMetrics';

const ModelTraining = () => {
  const [formData, setFormData] = useState({
    model_type: '',
    dataset_id: '',
    optimize: false,
  });
  const [selectedCategory, setSelectedCategory] = useState('intermediate');
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showAISummary, setShowAISummary] = useState(false);

  const modelCategories = {
    basic: {
      label: 'Basic Models',
      description: 'Simple, fast models perfect for learning and quick prototyping',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      models: [
        { value: 'logistic_regression', label: 'Logistic Regression', desc: 'Simple linear classifier' },
        { value: 'naive_bayes', label: 'Naive Bayes', desc: 'Probabilistic classifier' },
        { value: 'knn', label: 'K-Nearest Neighbors', desc: 'Instance-based learning' },
        { value: 'decision_tree', label: 'Decision Tree', desc: 'Tree-based classifier' },
        { value: 'ridge_regression', label: 'Ridge Regression', desc: 'L2 regularized model' },
        { value: 'lasso_regression', label: 'Lasso Regression', desc: 'L1 regularized model' },
        { value: 'elastic_net', label: 'Elastic Net', desc: 'L1+L2 regularization' },
        { value: 'perceptron', label: 'Simple Perceptron', desc: 'Basic neural unit' },
      ]
    },
    intermediate: {
      label: 'Intermediate Models',
      description: 'Powerful ensemble methods for production use',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      models: [
        { value: 'random_forest', label: 'Random Forest', desc: 'Ensemble of decision trees' },
        { value: 'svm', label: 'Support Vector Machine', desc: 'Kernel-based classifier' },
        { value: 'gradient_boosting', label: 'Gradient Boosting', desc: 'Sequential boosting' },
        { value: 'xgboost', label: 'XGBoost', desc: 'Optimized gradient boosting ⭐' },
        { value: 'adaboost', label: 'AdaBoost', desc: 'Adaptive boosting' },
        { value: 'extra_trees', label: 'Extra Trees', desc: 'Extremely randomized trees' },
        { value: 'lightgbm', label: 'LightGBM', desc: 'Fast gradient boosting ⚡' },
        { value: 'catboost', label: 'CatBoost', desc: 'Categorical boosting' },
        { value: 'bagging', label: 'Bagging Classifier', desc: 'Bootstrap aggregating' },
        { value: 'voting', label: 'Voting Classifier', desc: 'Ensemble voting' },
      ]
    },
    advanced: {
      label: 'Advanced Models (Coming Soon)',
      description: 'Deep learning models for complex patterns',
      icon: Rocket,
      color: 'from-orange-500 to-orange-600',
      models: [
        { value: 'ann', label: 'Artificial Neural Network', desc: 'Deep learning', disabled: true },
        { value: 'dnn', label: 'Deep Neural Network', desc: 'Multi-layer network', disabled: true },
        { value: 'cnn', label: 'Convolutional Neural Network', desc: 'For spatial data', disabled: true },
        { value: 'rnn', label: 'Recurrent Neural Network', desc: 'For sequences', disabled: true },
        { value: 'lstm', label: 'LSTM', desc: 'Long short-term memory', disabled: true },
        { value: 'gru', label: 'GRU', desc: 'Gated recurrent unit', disabled: true },
        { value: 'autoencoder', label: 'Autoencoders', desc: 'Unsupervised learning', disabled: true },
        { value: 'vae', label: 'Variational Autoencoders', desc: 'Generative model', disabled: true },
        { value: 'transformer', label: 'Transformer Models', desc: 'Attention-based', disabled: true },
        { value: 'gnn', label: 'Graph Neural Networks', desc: 'For graph data', disabled: true },
      ]
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const selectModel = (modelValue) => {
    setFormData({
      ...formData,
      model_type: modelValue,
    });
  };

  const handleTrain = async () => {
    if (!formData.dataset_id) {
      setError('Please enter a dataset ID');
      return;
    }
    if (!formData.model_type) {
      setError('Please select a model type');
      return;
    }

    setTraining(true);
    setError(null);
    setResult(null);

    try {
      const response = await trainModel(formData);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to train model');
    } finally {
      setTraining(false);
    }
  };

  const CategoryIcon = modelCategories[selectedCategory].icon;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Train Model</h1>
        <p className="text-muted-foreground mt-2">
          Choose from basic, intermediate, or advanced machine learning models
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(modelCategories).map(([key, category]) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === key;
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isSelected ? 'border-2 border-primary shadow-lg' : 'border-2 border-transparent'
              }`}
              onClick={() => setSelectedCategory(key)}
            >
              <CardHeader>
                <div className={`rounded-full w-12 h-12 bg-gradient-to-br ${category.color} flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{category.label}</CardTitle>
                <CardDescription className="text-sm">{category.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CategoryIcon className="h-5 w-5 text-primary" />
            {modelCategories[selectedCategory].label}
          </CardTitle>
          <CardDescription>
            Select a model algorithm from the {selectedCategory} category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modelCategories[selectedCategory].models.map((model) => (
              <Card
                key={model.value}
                className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                  formData.model_type === model.value 
                    ? 'border-2 border-primary bg-primary/5' 
                    : 'border hover:border-primary/50'
                } ${model.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !model.disabled && selectModel(model.value)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold mb-1">
                        {model.label}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {model.desc}
                      </CardDescription>
                    </div>
                    {formData.model_type === model.value && (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                    {model.disabled && (
                      <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Training Configuration</CardTitle>
          <CardDescription>
            Enter your dataset ID and configure training options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataset_id">Dataset ID *</Label>
            <Input
              id="dataset_id"
              name="dataset_id"
              placeholder="Enter dataset ID from upload"
              value={formData.dataset_id}
              onChange={handleChange}
              disabled={training}
            />
            <p className="text-xs text-muted-foreground">
              The ID you received after uploading your dataset
            </p>
          </div>

          {formData.model_type && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Selected Model</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {modelCategories[selectedCategory].models.find(m => m.value === formData.model_type)?.label}
                    </span>
                    {' - '}
                    {modelCategories[selectedCategory].models.find(m => m.value === formData.model_type)?.desc}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleTrain}
            disabled={!formData.dataset_id || !formData.model_type || training}
            className="w-full"
            size="lg"
          >
            {training ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Training Model...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Train Model
              </>
            )}
          </Button>

          {/* Progress Bar */}
          {training && (
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full animate-pulse" style={{ width: '100%' }} />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Training in progress... This may take 1-2 minutes
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Training Failed</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {result && (
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Model Trained Successfully!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Model ID: {result.model_id}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training Results */}
      {result && result.metrics && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Training Results
                </CardTitle>
                <CardDescription>
                  Performance metrics of your trained model
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowAISummary(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Activity className="mr-2 h-4 w-4" />
                AI Analysis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatedMetrics metrics={result.metrics} />

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Training Time</span>
                <Badge variant="secondary">
                  {result.training_time ? `${result.training_time.toFixed(2)}s` : 'N/A'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Tips */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">💡 Model Selection Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span><strong>Basic Models:</strong> Start here if you're learning or need quick results</span>
            </li>
            <li className="flex items-start gap-2">
              <Brain className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <span><strong>Intermediate Models:</strong> Best for production use and high accuracy (try XGBoost or Random Forest)</span>
            </li>
            <li className="flex items-start gap-2">
              <Rocket className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span><strong>Advanced Models:</strong> Deep learning models (coming soon for complex patterns)</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span><strong>Recommended:</strong> XGBoost and LightGBM offer the best balance of speed and accuracy</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* AI Summary Modal */}
      {result && (
        <AISummaryModal
          isOpen={showAISummary}
          onClose={() => setShowAISummary(false)}
          modelId={result.model_id}
          modelType={formData.model_type}
          metrics={result.metrics}
        />
      )}
    </div>
  );
};

export default ModelTraining;
