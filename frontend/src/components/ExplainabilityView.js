import React, { useState } from 'react';
import { Lightbulb, TrendingUp, BarChart3, Sparkles, ChevronRight, Eye, Brain, Zap, Target, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getFeatureImportance } from '../services/api';
import { Button } from './ui/button';
import { Card } from './ui/card';

const ExplainabilityView = () => {
  const [modelId, setModelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeTab, setActiveTab] = useState('chart');

  const handleGetExplanation = async () => {
    if (!modelId) {
      setError('Please enter a model ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getFeatureImportance(modelId);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get explanation');
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!result || !result.feature_importance || !result.feature_importance.top_10) {
      return [];
    }

    return result.feature_importance.top_10.map(item => ({
      feature: item.feature,
      importance: item.importance * 100,
    }));
  };

  const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#ff6b6b', '#ff8787', '#ffa5a5', '#ffc1c1', '#ffd4d4'];

  return (
    <div className="min-h-screen bg-background page-transition">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">AI Explainability Dashboard</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Understand Your
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"> AI Models</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlock the black box of machine learning with powerful feature importance analysis and transparent model insights
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">10+</div>
                    <div className="text-sm text-muted-foreground">Features Analyzed</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-muted-foreground">Transparent Insights</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">Real-time</div>
                    <div className="text-sm text-muted-foreground">Analysis Results</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Input Section */}
        <Card className="p-8 mb-12 border-border/50 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Get Model Explanation</h2>
                <p className="text-sm text-muted-foreground">Enter your model ID to discover feature importance insights</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  placeholder="e.g., xgboost_defect_data_large"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleGetExplanation}
                disabled={loading}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Explain Model
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">⚠️</span>
                </div>
                <p>{error}</p>
              </div>
            )}
          </div>
        </Card>

        {result && (
          <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex items-center gap-4 border-b border-border">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-6 py-3 font-medium transition-all relative ${
                  activeTab === 'chart' 
                    ? 'text-red-500' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Visual Analysis
                {activeTab === 'chart' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 font-medium transition-all relative ${
                  activeTab === 'list' 
                    ? 'text-red-500' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Feature Rankings
                {activeTab === 'list' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-6 py-3 font-medium transition-all relative ${
                  activeTab === 'insights' 
                    ? 'text-red-500' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                AI Insights
                {activeTab === 'insights' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                )}
              </button>
            </div>

            {/* Chart View */}
            {activeTab === 'chart' && (
              <Card className="p-8 border-border/50 shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">Feature Importance Visualization</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Method: <span className="text-red-500 font-medium">{result.feature_importance.method}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
                      <BarChart3 className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium">Top 10 Features</span>
                    </div>
                  </div>

                  <div className="bg-card/50 rounded-lg p-6 border border-border/50">
                    <ResponsiveContainer width="100%" height={500}>
                      <BarChart data={prepareChartData()} layout="vertical" margin={{ left: 150 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          type="number" 
                          domain={[0, 'auto']} 
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="feature" 
                          width={140}
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="importance" name="Importance (%)" radius={[0, 8, 8, 0]}>
                          {prepareChartData().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            )}

            {/* List View */}
            {activeTab === 'list' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Top 10 Most Important Features</h3>
                    <p className="text-sm text-muted-foreground">Click on any feature to explore details</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {result.feature_importance.top_10.map((item, idx) => (
                    <Card
                      key={idx}
                      onClick={() => setSelectedFeature(selectedFeature === idx ? null : idx)}
                      className={`p-6 border-border/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-red-500/30 ${
                        selectedFeature === idx ? 'border-red-500 shadow-lg' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            idx < 3 
                              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                              : 'bg-card border-2 border-border'
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold">{item.feature}</h4>
                            {selectedFeature === idx && (
                              <p className="text-sm text-muted-foreground mt-2 animate-in slide-in-from-top-2 duration-300">
                                This feature contributes significantly to model predictions, ranking #{idx + 1} in importance.
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-500">
                              {(item.importance * 100).toFixed(2)}%
                            </div>
                            {item.importance_pct && (
                              <div className="text-xs text-muted-foreground">
                                {item.importance_pct.toFixed(2)}% of total
                              </div>
                            )}
                          </div>
                          
                          <div className="w-24 h-2 bg-card rounded-full overflow-hidden border border-border">
                            <div 
                              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                              style={{ width: `${(item.importance * 100)}%` }}
                            ></div>
                          </div>
                          
                          <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                            selectedFeature === idx ? 'rotate-90' : ''
                          }`} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Insights View */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">AI-Generated Insights</h3>
                    <p className="text-sm text-muted-foreground">Key takeaways from your model's feature analysis</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key Insight Cards */}
                  <Card className="p-6 border-border/50 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">Top Predictor</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          <span className="text-red-500 font-medium">{result.feature_importance.top_10[0].feature}</span> is the most influential feature with {(result.feature_importance.top_10[0].importance * 100).toFixed(2)}% importance
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Highest Impact Feature
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-border/50 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">Feature Distribution</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Top 3 features account for <span className="text-red-500 font-medium">
                          {(result.feature_importance.top_10.slice(0, 3).reduce((sum, f) => sum + f.importance, 0) * 100).toFixed(1)}%
                          </span> of total importance
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Concentrated Impact
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-border/50 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">Model Transparency</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          <span className="text-red-500 font-medium">{result.feature_importance.top_10.length} features</span> analyzed using {result.feature_importance.method} method
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Explainable AI
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-border/50 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">Feature Variance</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Importance ranges from <span className="text-red-500 font-medium">
                          {(Math.min(...result.feature_importance.top_10.map(f => f.importance)) * 100).toFixed(2)}%
                          </span> to <span className="text-red-500 font-medium">
                          {(Math.max(...result.feature_importance.top_10.map(f => f.importance)) * 100).toFixed(2)}%
                          </span>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Distribution Analysis
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recommendation Card */}
                <Card className="p-8 border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-3">💡 Recommendation</h4>
                      <p className="text-muted-foreground mb-4">
                        Focus on the top 3 features (<span className="text-red-500 font-medium">
                        {result.feature_importance.top_10.slice(0, 3).map(f => f.feature).join(', ')}
                        </span>) for maximum model optimization. These features have the highest predictive power.
                      </p>
                      <Button 
                        variant="outline"
                        className="rounded-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Learn More About Features
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplainabilityView;
