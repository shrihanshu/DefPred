import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
  Info,
  TrendingUp,
  Activity,
  Brain,
  FileText,
  Play,
  Sparkles,
  ArrowRight,
  Eye,
  Shield,
  BarChart3
} from 'lucide-react';
import { makePrediction } from '../services/api';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    model_id: '',
    features: '',
    explain: false,
    explainer: 'shap',
  });
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData({
      ...formData,
      [name]: name === 'explain' ? checked : value,
    });
  };

  const handlePredict = async () => {
    if (!formData.model_id || !formData.features) {
      setError('Please fill in all required fields');
      return;
    }

    setPredicting(true);
    setError(null);
    setResult(null);

    try {
      // Parse features string to array of numbers
      const featuresArray = formData.features.split(',').map(f => parseFloat(f.trim()));
      
      const payload = {
        model_id: formData.model_id,
        features: featuresArray,
        explain: formData.explain,
        explainer: formData.explainer,
      };

      const response = await makePrediction(payload);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to make prediction');
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background page-transition">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
              <Target className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">AI-Powered Predictions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Real-Time
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"> Defect Prediction</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leverage advanced machine learning to predict software defects instantly with explainable AI insights
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">Instant</div>
                    <div className="text-sm text-muted-foreground">Real-time Results</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">AI-Driven</div>
                    <div className="text-sm text-muted-foreground">ML Predictions</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">Explainable</div>
                    <div className="text-sm text-muted-foreground">Transparent AI</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-border/50 hover:shadow-lg transition-all group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">How It Works</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your model ID and feature values. The AI will analyze patterns and predict if there's a defect.
                </p>
              </div>
            </Card>

            <Card className="p-6 border-border/50 hover:shadow-lg transition-all group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Explainability</h3>
                <p className="text-sm text-muted-foreground">
                  Enable SHAP/LIME to see which features contributed most to the prediction decision.
                </p>
              </div>
            </Card>

            <Card className="p-6 border-border/50 hover:shadow-lg transition-all group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Real-Time</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant predictions in seconds. Perfect for integrating into CI/CD pipelines.
                </p>
              </div>
            </Card>
          </div>

          {/* Main Prediction Form */}
          <Card className="p-8 border-border/50 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Prediction Input</h2>
                  <p className="text-sm text-muted-foreground">Enter the details below to get your defect prediction</p>
                </div>
              </div>

              {/* Model ID Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="model_id" className="text-base font-medium">
                    Model ID
                  </Label>
                  <Badge variant="outline" className="border-red-500/30 text-red-500">Required</Badge>
                </div>
                <Input
                  id="model_id"
                  name="model_id"
                  value={formData.model_id}
                  onChange={handleChange}
                  placeholder="e.g., xgboost_sample_dataset"
                  className="font-mono h-12 border-border focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Info className="h-3 w-3" />
                  Enter the model ID from your training results
                </p>
              </div>

              {/* Features Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="features" className="text-base font-medium">
                    Feature Values
                  </Label>
                  <Badge variant="outline" className="border-red-500/30 text-red-500">Required</Badge>
                </div>
                <textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="Enter comma-separated values (e.g., 150, 12, 5, 0.7, 3, 1, 45, 2.5, 0.3, 8)"
                  className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-border bg-background text-sm resize-y font-mono focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Info className="h-3 w-3" />
                  Enter all feature values in the same order as your training data
                </p>
              </div>

              {/* Explainability Toggle */}
              <Card className="bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        id="explain"
                        name="explain"
                        checked={formData.explain}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-border text-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="explain" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                        <Eye className="h-5 w-5 text-red-500" />
                        Generate Explanation (SHAP/LIME)
                      </label>
                      <p className="text-sm text-muted-foreground mt-2">
                        Enable AI explainability to understand which features influenced the prediction most. Get transparent insights into model decision-making.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Predict Button */}
              <Button
                onClick={handlePredict}
                disabled={!formData.model_id || !formData.features || predicting}
                className="w-full py-6 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                size="lg"
              >
                {predicting ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing Patterns...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    PREDICT WITH AI
                  </>
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Prediction Failed</div>
                    <div className="text-sm">{error}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Prediction Results */}
          {result && (
            <Card className="p-8 border-2 border-red-500/30 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Prediction Result</h2>
                    <p className="text-sm text-muted-foreground">Analysis complete - here's what the model found</p>
                  </div>
                </div>

                {/* Main Result */}
                <div className={`p-8 rounded-xl border-2 transition-all ${
                  result.prediction === 1 
                    ? 'bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30' 
                    : 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30'
                }`}>
                  <div className="flex items-center gap-6">
                    {result.prediction === 1 ? (
                      <div className="p-4 rounded-full bg-red-500/20">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                      </div>
                    ) : (
                      <div className="p-4 rounded-full bg-green-500/20">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2">
                        {result.class}
                      </h3>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                          Confidence: <span className="font-semibold text-foreground text-lg">{(Math.max(...result.probability) * 100).toFixed(2)}%</span>
                        </p>
                        <Badge 
                          className={`${result.prediction === 1 ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} px-4 py-1 text-sm`}
                        >
                          {result.prediction === 1 ? 'Defect Detected' : 'No Defect'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explanation Section */}
                {result.explanation && result.explanation.contributions && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Top Contributing Features</h3>
                        <p className="text-sm text-muted-foreground">
                          These features had the most impact on the prediction decision
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      {result.explanation.contributions.slice(0, 5).map((contrib, idx) => (
                        <Card 
                          key={idx} 
                          className="p-6 border-border/50 hover:shadow-lg hover:border-red-500/30 transition-all cursor-pointer group"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                  idx < 3 
                                    ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                                    : 'bg-card border-2 border-border'
                                }`}>
                                  {idx + 1}
                                </div>
                                <span className="font-semibold text-lg">{contrib.feature}</span>
                              </div>
                              <Badge 
                                className={`px-3 py-1 ${
                                  (contrib.shap_value || contrib.weight) > 0 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                              >
                                {contrib.shap_value 
                                  ? contrib.shap_value.toFixed(3) 
                                  : contrib.weight.toFixed(3)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 pl-11">
                              <span className="text-sm text-muted-foreground">Value:</span>
                              <code className="px-3 py-1.5 rounded-lg bg-card border border-border font-mono text-sm">
                                {contrib.value.toFixed(2)}
                              </code>
                              <div className="flex-1 h-2 bg-card rounded-full overflow-hidden border border-border ml-auto max-w-xs">
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    (contrib.shap_value || contrib.weight) > 0 
                                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                      : 'bg-gradient-to-r from-green-500 to-green-600'
                                  }`}
                                  style={{ 
                                    width: `${Math.min(Math.abs((contrib.shap_value || contrib.weight) * 100), 100)}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Insight Card */}
                    <Card className="p-6 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">💡 AI Insight</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            The model focused on <span className="text-red-500 font-medium">
                            {result.explanation.contributions[0].feature}
                            </span> as the primary indicator. 
                            {result.prediction === 1 
                              ? ' This suggests potential code quality issues that may require attention.' 
                              : ' The metrics indicate healthy code patterns with low defect probability.'}
                          </p>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="rounded-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            Explore More Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Help Section */}
          <Card className="p-8 bg-card/50 border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Info className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold">Quick Start Guide</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium">Train Your Model</p>
                    <p className="text-sm text-muted-foreground">Visit the "Train Model" page and note your model ID</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium">Gather Features</p>
                    <p className="text-sm text-muted-foreground">Collect software metrics like lines of code, complexity, etc.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium">Enter Values</p>
                    <p className="text-sm text-muted-foreground">Input features in the same order as your training data</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <p className="font-medium">Enable Explanations</p>
                    <p className="text-sm text-muted-foreground">Toggle SHAP/LIME to understand feature contributions</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
                  <div>
                    <p className="font-medium">Get Predictions</p>
                    <p className="text-sm text-muted-foreground">Click "PREDICT WITH AI" and review the detailed results</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
