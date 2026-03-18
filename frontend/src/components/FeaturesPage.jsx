import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Brain, Shield, Zap, TrendingUp, CheckCircle, ArrowRight, Cpu, Target, 
  BarChart3, Activity, GitBranch, Layers, Eye, Settings, FileText, 
  Database, LineChart, PieChart, Network, Lock, CloudUpload,
  Code, Award, Clock, Users
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      category: "Machine Learning Models",
      icon: Brain,
      color: "from-primary to-primary",
      items: [
        {
          title: "10+ ML Algorithms",
          description: "Random Forest, Gradient Boosting, XGBoost, Neural Networks, SVM, Logistic Regression, Decision Trees, and more",
          icon: GitBranch
        },
        {
          title: "Ensemble Methods",
          description: "Combine multiple models using voting, stacking, and bagging techniques for superior accuracy",
          icon: Layers
        },
        {
          title: "Deep Learning Support",
          description: "Advanced neural network architectures including CNNs and LSTMs for complex pattern recognition",
          icon: Network
        }
      ]
    },
    {
      category: "Automated Optimization",
      icon: Settings,
      color: "from-primary to-primary",
      items: [
        {
          title: "Hyperparameter Tuning",
          description: "Automated grid search and random search to find optimal model parameters automatically",
          icon: Target
        },
        {
          title: "Feature Selection",
          description: "Intelligent feature selection using correlation analysis, mutual information, and recursive elimination",
          icon: Activity
        },
        {
          title: "Auto Feature Engineering",
          description: "Automatically creates interaction features, polynomial features, and statistical aggregations",
          icon: Settings
        }
      ]
    },
    {
      category: "Explainable AI",
      icon: Eye,
      color: "from-primary to-primary",
      items: [
        {
          title: "SHAP Analysis",
          description: "SHapley Additive exPlanations provide game-theoretic approach to explain model predictions",
          icon: BarChart3
        },
        {
          title: "LIME Explanations",
          description: "Local Interpretable Model-agnostic Explanations for understanding individual predictions",
          icon: PieChart
        },
        {
          title: "Feature Importance",
          description: "Visualize which features contribute most to defect predictions with interactive charts",
          icon: TrendingUp
        }
      ]
    },
    {
      category: "Data Processing",
      icon: Database,
      color: "from-primary to-primary",
      items: [
        {
          title: "Smart Data Loading",
          description: "Handles CSV files with automatic type detection, missing value handling, and data validation",
          icon: CloudUpload
        },
        {
          title: "Preprocessing Pipeline",
          description: "Automated scaling, normalization, encoding categorical variables, and handling imbalanced datasets",
          icon: GitBranch
        },
        {
          title: "Data Validation",
          description: "Comprehensive validation checks for data quality, consistency, and format compliance",
          icon: CheckCircle
        }
      ]
    },
    {
      category: "Performance Metrics",
      icon: LineChart,
      color: "from-primary to-primary",
      items: [
        {
          title: "Comprehensive Evaluation",
          description: "Accuracy, Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix, and more",
          icon: BarChart3
        },
        {
          title: "Cross-Validation",
          description: "K-fold cross-validation ensures model generalization and prevents overfitting",
          icon: GitBranch
        },
        {
          title: "Model Comparison",
          description: "Side-by-side comparison of multiple models with visual performance metrics",
          icon: Activity
        }
      ]
    },
    {
      category: "Security & Compliance",
      icon: Shield,
      color: "from-primary to-primary",
      items: [
        {
          title: "Enterprise Security",
          description: "Bank-grade encryption for data at rest and in transit with secure authentication",
          icon: Lock
        },
        {
          title: "Role-Based Access",
          description: "Granular access control with user authentication and authorization",
          icon: Users
        },
        {
          title: "Audit Trails",
          description: "Complete logging of all model training, predictions, and system activities",
          icon: FileText
        }
      ]
    }
  ];

  const algorithms = [
    { name: "Random Forest", accuracy: 94.2, speed: "Fast", complexity: "Medium" },
    { name: "XGBoost", accuracy: 95.8, speed: "Medium", complexity: "High" },
    { name: "Neural Network", accuracy: 93.5, speed: "Slow", complexity: "High" },
    { name: "Logistic Regression", accuracy: 89.1, speed: "Very Fast", complexity: "Low" },
    { name: "Gradient Boosting", accuracy: 94.9, speed: "Medium", complexity: "High" },
    { name: "SVM", accuracy: 91.3, speed: "Medium", complexity: "Medium" }
  ];

  const workflow = [
    { step: 1, title: "Upload Dataset", desc: "CSV with defect metrics", icon: CloudUpload },
    { step: 2, title: "Preprocessing", desc: "Auto feature engineering", icon: Settings },
    { step: 3, title: "Train Models", desc: "Multiple ML algorithms", icon: Brain },
    { step: 4, title: "Optimize", desc: "Hyperparameter tuning", icon: Target },
    { step: 5, title: "Predict", desc: "Real-time detection", icon: Zap },
    { step: 6, title: "Explain", desc: "SHAP & LIME analysis", icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <section data-reveal className="container mx-auto px-4 pt-12 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium">Comprehensive Platform Features</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Features & <span className="font-defpred text-primary">Benefits</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Discover the powerful capabilities that make DefPred the most advanced 
            AI-powered defect prediction platform for enterprise software teams.
          </p>
        </div>

        {/* ML Workflow Diagram */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            End-to-End <span className="text-primary">ML Workflow</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {workflow.map((item, index) => (
              <div key={index} className="relative">
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                  <CardContent className="pt-6 pb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-6 h-6 text-black" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">{item.step}</div>
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Performance Comparison */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Algorithm <span className="text-primary">Performance</span>
          </h2>
          
          <Card className="overflow-hidden border-2">
            <CardContent className="p-8">
              <div className="space-y-6">
                {algorithms.map((algo, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-primary" />
                        <span className="font-bold">{algo.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Speed: <span className="font-medium text-foreground">{algo.speed}</span></span>
                        <span className="text-muted-foreground">Complexity: <span className="font-medium text-foreground">{algo.complexity}</span></span>
                        <span className="font-bold text-primary">{algo.accuracy}%</span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-secondary rounded-sm overflow-hidden border border-border">
                      <div 
                        className="absolute inset-y-0 left-0 bg-primary rounded-sm transition-all duration-1000"
                        style={{ width: `${algo.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Ensemble Voting</p>
                    <p className="text-sm text-muted-foreground">
                      Combine multiple algorithms to achieve up to <span className="font-bold text-primary">98.5% accuracy</span> through intelligent ensemble methods
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Categories */}
        <div className="max-w-7xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform <span className="text-primary">Capabilities</span>
          </h2>
          
          <div className="space-y-12">
            {features.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold">{category.category}</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <item.icon className="w-5 h-5 text-black" />
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainability Visualization */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explainable AI <span className="text-red-500">Visualizations</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-2">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  SHAP Feature Importance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {['Code Complexity', 'Lines of Code', 'Bug History', 'Developer Experience', 'Test Coverage'].map((feature, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{feature}</span>
                        <span className="text-primary font-bold">{(0.85 - index * 0.15).toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(0.85 - index * 0.15) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Model Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Accuracy', value: 95.8 },
                    { label: 'Precision', value: 94.2 },
                    { label: 'Recall', value: 96.1 },
                    { label: 'F1-Score', value: 95.1 },
                    { label: 'ROC-AUC', value: 97.3 },
                    { label: 'PR-AUC', value: 94.8 }
                  ].map((metric, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary mb-1">{metric.value}%</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key <span className="text-primary">Benefits</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: '80% Faster', desc: 'Defect detection vs manual review' },
              { icon: TrendingUp, title: '95%+ Accuracy', desc: 'Industry-leading precision' },
              { icon: Target, title: '60% Cost Reduction', desc: 'In post-release bug fixes' },
              { icon: Shield, title: 'Enterprise Ready', desc: 'Bank-grade security' }
            ].map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-primary/5 border-2 border-primary/20">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience <span className="font-defpred text-red-500">DefPred</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start predicting defects with AI-powered precision today
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/upload">
                  <Button size="lg" className="gap-2 text-lg px-8 py-6">
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                    View Dashboard
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
