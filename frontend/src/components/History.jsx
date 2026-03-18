import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { getUserHistory } from '../services/api';

const History = () => {
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isSignedIn) {
      loadHistory();
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error loading history:', err);
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Please sign in to view your history.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your History</h1>
        <p className="text-muted-foreground">
          View your datasets, trained models, and predictions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{history?.summary?.total_datasets || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{history?.summary?.total_models || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{history?.summary?.total_predictions || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 border-b">
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'datasets'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('datasets')}
          >
            Datasets ({history?.datasets?.length || 0})
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'models'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('models')}
          >
            Models ({history?.models?.length || 0})
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'predictions'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('predictions')}
          >
            Predictions ({history?.predictions?.length || 0})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {history?.activities && history.activities.length > 0 ? (
                  <div className="space-y-3">
                    {history.activities.map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between border-b pb-3 last:border-b-0">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {activity.activity_type}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No activity yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Datasets Tab */}
        {activeTab === 'datasets' && (
          <div className="space-y-4">
            {history?.datasets && history.datasets.length > 0 ? (
              history.datasets.map((dataset) => (
                <Card key={dataset.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{dataset.filename}</CardTitle>
                    <CardDescription>Dataset ID: {dataset.dataset_id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Rows</p>
                        <p className="text-lg font-semibold">{dataset.rows}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Columns</p>
                        <p className="text-lg font-semibold">{dataset.columns}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Size</p>
                        <p className="text-lg font-semibold">
                          {(dataset.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Uploaded</p>
                        <p className="text-sm">{new Date(dataset.uploaded_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert>
                <AlertDescription>No datasets uploaded yet</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Models Tab */}
        {activeTab === 'models' && (
          <div className="space-y-4">
            {history?.models && history.models.length > 0 ? (
              history.models.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{model.model_type}</CardTitle>
                        <CardDescription>Model ID: {model.model_id}</CardDescription>
                      </div>
                      {model.optimized && (
                        <Badge variant="secondary">Optimized</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Accuracy</p>
                          <p className="text-lg font-semibold">
                            {model.metrics?.accuracy ? (model.metrics.accuracy * 100).toFixed(2) + '%' : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Precision</p>
                          <p className="text-lg font-semibold">
                            {model.metrics?.precision ? (model.metrics.precision * 100).toFixed(2) + '%' : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Recall</p>
                          <p className="text-lg font-semibold">
                            {model.metrics?.recall ? (model.metrics.recall * 100).toFixed(2) + '%' : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">F1 Score</p>
                          <p className="text-lg font-semibold">
                            {model.metrics?.f1_score ? (model.metrics.f1_score * 100).toFixed(2) + '%' : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Trained on {new Date(model.created_at).toLocaleString()}
                        {model.training_time && ` • Training time: ${model.training_time.toFixed(2)}s`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert>
                <AlertDescription>No models trained yet</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-4">
            {history?.predictions && history.predictions.length > 0 ? (
              history.predictions.map((prediction) => (
                <Card key={prediction.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Prediction: {prediction.prediction_class}
                        </CardTitle>
                        <CardDescription>
                          {new Date(prediction.created_at).toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={prediction.prediction === 1 ? 'destructive' : 'secondary'}
                      >
                        {prediction.prediction_class}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Model Used</p>
                        <p className="font-medium">{prediction.model_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(prediction.probability?.[prediction.prediction] || 0) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {((prediction.probability?.[prediction.prediction] || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      {prediction.explainer_type && (
                        <div>
                          <Badge variant="outline">
                            Explained with {prediction.explainer_type.toUpperCase()}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert>
                <AlertDescription>No predictions made yet</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
