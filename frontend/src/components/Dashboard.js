import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, Target, TrendingUp, Award, Activity, BarChart2, Upload, Zap, BookOpen, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { getModels } from '../services/api';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Dashboard = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [stats, setStats] = useState({
    totalModels: 0,
    avgAccuracy: 0,
    avgF1Score: 0,
    bestModel: null,
  });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await getModels();
      const modelsList = response.models || [];
      setModels(modelsList);

      if (modelsList.length > 0) {
        const totalAccuracy = modelsList.reduce((sum, m) => sum + (m.metrics?.accuracy || 0), 0);
        const totalF1 = modelsList.reduce((sum, m) => sum + (m.metrics?.f1_score || 0), 0);
        const best = modelsList.reduce((best, current) =>
          (current.metrics?.f1_score || 0) > (best?.metrics?.f1_score || 0) ? current : best
        );

        setStats({
          totalModels: modelsList.length,
          avgAccuracy: (totalAccuracy / modelsList.length * 100).toFixed(2),
          avgF1Score: (totalF1 / modelsList.length).toFixed(3),
          bestModel: best,
        });
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      // Don't block UI on error - just keep models empty
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, description, gradient }) => (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium transition-colors group-hover:text-primary">{title}</CardTitle>
        <div className={`rounded-full p-2 ${gradient} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold transition-all duration-300 group-hover:text-primary">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your defect prediction models and performance metrics
        </p>
      </div>

      {/* Getting Started Guide - Show when no models */}
      {models.length === 0 && (
        <Card className="border-2 border-dashed border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Welcome to DefPredAI!</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary" />
                )}
              </Button>
            </div>
            {isExpanded && (
              <CardDescription className="text-base">
                Get started with AI-powered software defect prediction in 3 easy steps
              </CardDescription>
            )}
          </CardHeader>
          {isExpanded && (
            <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/upload" className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
                  <CardHeader>
                    <div className="rounded-full w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">1. Upload Dataset</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload your CSV file with software metrics and defect labels
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Start Here <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/train" className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
                  <CardHeader>
                    <div className="rounded-full w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">2. Train Model</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose from ML algorithms (Random Forest, XGBoost, SVM) and train
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Train Now <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/predict" className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
                  <CardHeader>
                    <div className="rounded-full w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">3. Make Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use your trained model to predict defects in new code
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Predict <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-background/50 rounded-lg border">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Need Help?</h4>
                  <p className="text-sm text-muted-foreground">
                    The app uses machine learning to predict software defects. Upload a CSV with features like code complexity, lines of code, etc., and a target column indicating defects (0/1). 
                    You can also compare models and get explainability insights with SHAP and LIME.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          )}
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Brain}
          title="Total Models"
          value={stats.totalModels}
          description="Models trained successfully"
          gradient="bg-gradient-to-br from-red-500 to-red-600"
        />
        <StatCard
          icon={Target}
          title="Avg Accuracy"
          value={`${stats.avgAccuracy}%`}
          description="Average model accuracy"
          gradient="bg-gradient-to-br from-red-500 to-red-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg F1 Score"
          value={stats.avgF1Score}
          description="Average F1 performance"
          gradient="bg-gradient-to-br from-red-500 to-red-600"
        />
        <StatCard
          icon={Award}
          title="Best Model"
          value={stats.bestModel?.type || 'N/A'}
          description="Top performing model"
          gradient="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      <Card className="transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Models
          </CardTitle>
          <CardDescription>
            A list of your recently trained models and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {models.length === 0 ? (
            <div className="text-center py-12">
              <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No models yet</h3>
              <p className="text-muted-foreground mt-2">
                Start by uploading a dataset and training your first model
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => (
                <Card 
                  key={model.id} 
                  className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer group border-2 hover:border-primary/50"
                >
                  <CardHeader className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <CardTitle className="text-base group-hover:text-primary transition-colors duration-300">{model.type}</CardTitle>
                      <Badge 
                        variant={model.metrics?.accuracy > 0.8 ? "default" : "secondary"}
                        className="transition-all duration-300 group-hover:scale-110"
                      >
                        {model.metrics?.accuracy 
                          ? `${(model.metrics.accuracy * 100).toFixed(1)}%` 
                          : 'N/A'}
                      </Badge>
                    </div>
                    <CardDescription className="relative z-10">Model ID: {model.id ? model.id.substring(0, 8) : 'N/A'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm group-hover:translate-x-1 transition-transform duration-200">
                        <span className="text-muted-foreground">F1 Score:</span>
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {model.metrics?.f1_score?.toFixed(3) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm group-hover:translate-x-1 transition-transform duration-200 delay-50">
                        <span className="text-muted-foreground">Precision:</span>
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {model.metrics?.precision?.toFixed(3) || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm group-hover:translate-x-1 transition-transform duration-200 delay-100">
                        <span className="text-muted-foreground">Recall:</span>
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {model.metrics?.recall?.toFixed(3) || 'N/A'}
                        </span>
                      </div>
                      {model.created_at && (
                        <div className="flex justify-between text-sm pt-2 border-t group-hover:border-primary/30 transition-colors">
                          <span className="text-muted-foreground">Trained:</span>
                          <span className="text-xs">
                            {new Date(model.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
