import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Brain, Zap, CheckCircle, ArrowRight, Target, BarChart3, Eye, ChevronDown, ChevronUp, Users, Database, Cpu, Code, GitBranch, Layers } from 'lucide-react';

const HeroPage = () => {
  const navigate = useNavigate();
  const [isAutoTrainingModalOpen, setIsAutoTrainingModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      number: '01',
      title: 'Actionable Insights from Data',
      description: 'Transforming raw data into meaningful, actionable knowledge. Delivering cutting-edge AI solutions tailored for diverse industries.',
      points: [
        'Delivering cutting-edge AI solutions tailored for diverse industries. Transforming raw data into meaningful, actionable knowledge.',
        'Delivering cutting-edge AI solutions tailored for diverse industries. Transforming raw data into meaningful, actionable knowledge.',
        'Delivering cutting-edge AI solutions tailored for diverse industries. Transforming raw data into meaningful, actionable knowledge.'
      ]
    },
    {
      number: '02',
      title: 'Advanced ML Model Training',
      description: 'Train multiple machine learning models with automated hyperparameter optimization and feature selection for optimal performance.',
      points: [
        'Automated selection of best ML algorithms including Random Forest, XGBoost, Neural Networks, and ensemble methods.',
        'Intelligent hyperparameter tuning using grid search and Bayesian optimization for maximum accuracy.',
        'Real-time model performance tracking with comprehensive metrics including accuracy, precision, recall, and F1-score.'
      ]
    },
    {
      number: '03',
      title: 'Explainable AI & Transparency',
      description: 'Understand every prediction with SHAP and LIME analysis. Complete transparency into model decisions and feature importance.',
      points: [
        'SHAP analysis provides game-theoretic approach to explain individual predictions with feature contribution scores.',
        'LIME explanations offer local interpretable insights for understanding why specific defects were predicted.',
        'Interactive visualizations show feature importance rankings and decision paths for complete model transparency.'
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const faqs = [
    {
      question: "What is DefPred AI?",
      answer: "DefPred AI is an advanced machine learning platform that predicts software defects before they reach production. It uses 10+ ML algorithms to analyze code metrics and identify potential bugs with 95%+ accuracy."
    },
    {
      question: "How does the Auto-Training feature work?",
      answer: "Auto-Training automatically selects the best ML models for your dataset, performs hyperparameter optimization, and trains multiple algorithms in parallel. It eliminates the need for manual model selection and configuration."
    },
    {
      question: "What explainability tools are available?",
      answer: "DefPred provides SHAP and LIME analysis to explain why each prediction is made. You can understand feature importance, view decision paths, and gain complete transparency into model behavior."
    },
    {
      question: "Is my data secure on DefPred?",
      answer: "Yes, DefPred uses enterprise-grade encryption and follows strict data security protocols. Your code metrics and predictions are encrypted at rest and in transit."
    },
    {
      question: "Can I integrate DefPred with my CI/CD pipeline?",
      answer: "Absolutely! DefPred provides REST APIs and webhooks that integrate seamlessly with popular CI/CD tools like Jenkins, GitHub Actions, and GitLab CI."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Hero Section */}
      <section data-reveal className="relative py-20 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-background to-background"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Left Side - Phone Mockup */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-[340px] h-[700px] bg-card rounded-[3rem] border-[14px] border-foreground shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-foreground rounded-b-3xl z-10"></div>
                  
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 pt-2 px-8 flex justify-between items-center text-xs z-20">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-foreground rounded-full"></div>
                        <div className="w-1 h-3 bg-foreground rounded-full opacity-70"></div>
                        <div className="w-1 h-3 bg-foreground rounded-full opacity-40"></div>
                        <div className="w-1 h-3 bg-foreground rounded-full opacity-20"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone Content */}
                  <div className="pt-12 px-8 h-full overflow-hidden">
                    {/* Top Icons */}
                    <div className="flex justify-between items-center mb-12">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                          <Target className="w-5 h-5 text-black" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-black" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-muted"></div>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold leading-tight mb-4">
                      Advanced Technology
                      <br />
                      Empowering <span className="text-muted-foreground">Smarter</span>
                      <br />
                      <span className="text-muted-foreground">AI Methodologies</span>
                    </h2>
                  </div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-red-500/20 blur-3xl -z-10 scale-90"></div>
              </div>
            </div>

            {/* Right Side - Content & Accordion */}
            <div className="space-y-8">
              <div>
                <div className="inline-block px-4 py-2 rounded-full border border-red-500 mb-6">
                  <span className="text-red-500 text-sm font-medium">Technology & Methodology</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Advanced Technology Empowering
                  <br />
                  Smarter <span className="text-red-500">AI Methodologies</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                  We combine state-of-the-art technologies with proven methodologies to deliver reliable, scalable, and intelligent AI solutions
                </p>
              </div>

              {/* Accordion */}
              <div className="space-y-4">
                {/* Predictive Analytics */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <button
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                  >
                    <span className="text-lg font-semibold">Predictive Analytics</span>
                    {openFaq === 0 ? (
                      <ChevronUp className="h-6 w-6 text-red-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === 0 && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        Anticipate future trends and make smarter business decisions. Discover tailored Artificial Intelligence and Machine Learning solutions designed to streamline operations, boost efficiency, and predict software defects with 95%+ accuracy.
                      </p>
                    </div>
                  )}
                </div>

                {/* Natural Language Processing */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <button
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                  >
                    <span className="text-lg font-semibold">Natural Language Processing</span>
                    {openFaq === 1 ? (
                      <ChevronUp className="h-6 w-6 text-red-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === 1 && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        Understand commit messages, code comments, and documentation to enhance prediction accuracy. Extract meaningful insights from text data to identify patterns and improve defect detection capabilities.
                      </p>
                    </div>
                  )}
                </div>

                {/* Computer Vision */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <button
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                  >
                    <span className="text-lg font-semibold">Computer Vision</span>
                    {openFaq === 2 ? (
                      <ChevronUp className="h-6 w-6 text-red-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === 2 && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        Visualize code complexity, dependency graphs, and structural patterns. Identify architectural issues and code smells through visual analysis and pattern recognition techniques.
                      </p>
                    </div>
                  )}
                </div>

                {/* Recommendation Systems */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <button
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                  >
                    <span className="text-lg font-semibold">Recommendation Systems</span>
                    {openFaq === 3 ? (
                      <ChevronUp className="h-6 w-6 text-red-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === 3 && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        Get intelligent suggestions for code improvements, testing priorities, and refactoring opportunities. AI-powered recommendations help your team focus on high-impact areas.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg flex items-center gap-2"
                  onClick={() => navigate('/upload')}
                >
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg flex items-center gap-2"
                  onClick={() => navigate('/features')}
                >
                  View Features <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section data-reveal className="py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code className="h-6 w-6" />
              <span className="font-semibold">TechCorp</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitBranch className="h-6 w-6" />
              <span className="font-semibold">DevStack</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="h-6 w-6" />
              <span className="font-semibold">CloudBase</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Database className="h-6 w-6" />
              <span className="font-semibold">DataFlow</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cpu className="h-6 w-6" />
              <span className="font-semibold">AILabs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section data-reveal className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 rounded-full border border-red-500 mb-6">
              <span className="text-red-500 text-sm font-medium">About Neuromind</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Proven <span className="text-red-500">AI Success</span> Shaping
              <br />
              Tomorrow's <span className="text-muted-foreground">Innovations</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our achievements highlight the power of Artificial Intelligence and Machine Learning in delivering measurable results, driving growth
            </p>
          </div>

          <div className="max-w-6xl mx-auto bg-card border border-border rounded-3xl p-12">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-6 border border-border">
                  <Database className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-5xl font-bold mb-3">50,000+</div>
                <p className="text-muted-foreground">
                  Trusted globally across multiple industries and communities.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-6 border border-border">
                  <Users className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-5xl font-bold mb-3">48,000+</div>
                <p className="text-muted-foreground">
                  Delivering reliable AI-powered solutions that exceed expectations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-6 border border-border">
                  <Brain className="h-7 w-7 text-red-500" />
                </div>
                <div className="text-5xl font-bold mb-3">10+</div>
                <p className="text-muted-foreground">
                  Proven expertise in Artificial Intelligence and Machine Learning innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovative AI Solutions */}
      <section data-reveal className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full border border-red-500 mb-6">
              <span className="text-red-500 text-sm font-medium">Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Innovative <span className="text-red-500">AI Solutions</span>
              <br />
              for Every Business <span className="text-muted-foreground">Need</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover tailored Artificial Intelligence and Machine Learning solutions designed to streamline operations, boost efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 border border-border hover:border-red-500/50 transition-all hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-red-500 font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-muted-foreground mb-6">
                Advanced ML algorithms analyze code metrics to predict potential defects with exceptional accuracy.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[85, 72, 91, 68, 94, 78].map((value, i) => (
                  <div key={i} className="bg-secondary rounded-lg h-16 relative overflow-hidden flex flex-col items-center justify-end p-2">
                    <div className="absolute top-1 right-1 text-[8px] text-red-500 font-bold">{value}%</div>
                    <div className="w-full bg-red-500/30 rounded-t" style={{height: `${value}%`}}></div>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-500 mt-6 p-0 flex items-center gap-2"
                onClick={() => navigate('/train')}
              >
                Explore Feature <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:border-red-500/50 transition-all hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-red-500 font-semibold mb-2">Natural Language Processing</h3>
              <p className="text-muted-foreground mb-6">
                Understand commit messages and code comments to enhance prediction accuracy.
              </p>
              <div className="space-y-2">
                {['Analyzing commit message...', 'Extracting code patterns...', 'Processing comments...', 'Generating insights...'].map((text, i) => (
                  <div key={i} className="bg-secondary rounded-lg h-8 relative overflow-hidden flex items-center px-3 gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <span className="text-xs text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-500 mt-6 p-0 flex items-center gap-2"
                onClick={() => navigate('/features')}
              >
                Explore Feature <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:border-red-500/50 transition-colors">
              <h3 className="text-red-500 font-semibold mb-2">Computer Vision</h3>
              <p className="text-muted-foreground mb-6">
                Visualize code complexity and dependency graphs to identify structural issues.
              </p>
              <div className="flex gap-2">
                <div className="bg-secondary rounded-lg h-24 flex-1 relative overflow-hidden p-2">
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="absolute bottom-2 left-3 w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-red-300"></div>
                  <svg className="absolute inset-0" style={{opacity: 0.3}}>
                    <line x1="15%" y1="20%" x2="85%" y2="20%" stroke="#ef4444" strokeWidth="1"/>
                    <line x1="15%" y1="20%" x2="20%" y2="80%" stroke="#ef4444" strokeWidth="1"/>
                    <line x1="85%" y1="20%" x2="80%" y2="75%" stroke="#ef4444" strokeWidth="1"/>
                  </svg>
                </div>
                <div className="bg-secondary rounded-lg h-24 flex-1 relative overflow-hidden flex items-end p-2 gap-1">
                  <div className="w-full h-3/4 bg-red-500/30 rounded-t"></div>
                  <div className="w-full h-1/2 bg-red-500/30 rounded-t"></div>
                  <div className="w-full h-5/6 bg-red-500/30 rounded-t"></div>
                  <div className="w-full h-2/3 bg-red-500/30 rounded-t"></div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-500 mt-6 p-0 flex items-center gap-2"
                onClick={() => navigate('/explainability')}
              >
                Explore Feature <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border hover:border-red-500/50 transition-colors">
              <h3 className="text-red-500 font-semibold mb-2">Recommendation Systems</h3>
              <p className="text-muted-foreground mb-6">
                Get intelligent suggestions for code improvements and testing priorities.
              </p>
              <div className="space-y-2">
                {[
                  { text: 'Refactor payment.js', icon: Code },
                  { text: 'Add unit tests for auth', icon: CheckCircle },
                  { text: 'Review API endpoints', icon: Target }
                ].map((item, i) => (
                  <div key={i} className="bg-secondary rounded-lg h-10 relative overflow-hidden flex items-center px-4 gap-3">
                    <item.icon className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-muted-foreground flex-1">{item.text}</span>
                    <span className="text-[10px] text-red-500 font-semibold">HIGH</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-500 mt-6 p-0 flex items-center gap-2"
                onClick={() => navigate('/dashboard')}
              >
                Explore Feature <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Redefining Possibilities Section */}
      <section data-reveal className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-full border border-red-500 mb-6">
              <span className="text-red-500 text-sm font-medium">Overview</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Redefining <span className="text-red-500">Possibilities</span> <span className="text-muted-foreground">Through</span>
              <br />
              <span className="text-muted-foreground">Smarter AI</span> Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI and Machine Learning overview highlights how intelligent technologies transform industries, optimize performance, and create sustainable
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Left Side - Content with Navigation */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-border flex items-center justify-center">
                  <span className="text-2xl font-bold">{slides[currentSlide].number}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full border border-border hover:bg-secondary transition-colors flex items-center justify-center"
                  >
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full border border-border hover:bg-secondary transition-colors flex items-center justify-center"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 transition-all duration-500">
                <div className="h-1 bg-red-500 rounded-full transition-all duration-500" style={{width: `${((currentSlide + 1) / slides.length) * 100}%`}}></div>
                
                <h3 className="text-3xl font-bold transition-opacity duration-300">{slides[currentSlide].title}</h3>
                <p className="text-muted-foreground text-lg transition-opacity duration-300">
                  {slides[currentSlide].description}
                </p>
                
                <div className="space-y-4 pl-4 border-l-2 border-border transition-opacity duration-300">
                  {slides[currentSlide].points.map((point, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-muted-foreground">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  size="lg"
                  className="rounded-full px-8 mt-6"
                  onClick={() => navigate('/features')}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Side - Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red rounded-2xl p-6 border border-border hover:border-red-500/50 transition-colors">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">Model Training</h4>
                <p className="text-sm text-muted-foreground">
                  Use AI to continuously learn and predict potential defects before they become real problems
                </p>
              </div>

              <div className="bg-red rounded-2xl p-6 border border-border hover:border-red-500/50 transition-colors">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">Real-time Prediction</h4>
                <p className="text-sm text-muted-foreground">
                 Make smarter decisions in real time with AI that helps answer your questions as they arise

                </p>
              </div>

              <div className="bg-red rounded-2xl p-6 border border-border hover:border-red-500/50 transition-colors">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">Data Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Turn your data into clear, real-time insights with AI that helps you find the answers you need
                </p>
              </div>

              <div className="bg-red rounded-2xl p-6 border border-border hover:border-red-500/50 transition-colors">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3">Explainability</h4>
                <p className="text-sm text-muted-foreground">
                  Understand how your models work with AI-driven explanations that make complex decisions easier to interpret
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Technology Section */}
      <section data-reveal className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Advanced <span className="text-red-500">Technology</span>
              </h3>
              <p className="text-muted-foreground mb-6">Empowering Smarter AI Methodologies</p>
              
              <div className="bg-background rounded-lg p-4">
                <div className="flex gap-2 mb-4">
                  <div className="w-8 h-8 rounded bg-secondary"></div>
                  <div className="w-8 h-8 rounded bg-secondary"></div>
                  <div className="w-8 h-8 rounded bg-red-600/30"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-secondary rounded w-3/4"></div>
                  <div className="h-2 bg-secondary rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">
                Advanced <span className="text-red-500">Technology</span> Empowering
              </h3>
              <p className="text-muted-foreground mb-8">Smarter AI Methodologies</p>

              <div className="space-y-4">
                {['Predictive Analytics', 'Natural Language Processing', 'Ensemble Models', 'Recommendation Systems'].map((item, idx) => (
                  <div key={idx} className="border border-border rounded-xl p-4 hover:border-red-500/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span>{item}</span>
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section data-reveal className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Real Success Stories <span className="text-red-500">Powered</span>
                <br />
                by Artificial Intelligence
              </h2>
            </div>
            <Button 
              variant="outline" 
              className="border-border text-foreground hover:bg-card mt-4 lg:mt-0"
              onClick={() => navigate('/features')}
            >
              View More
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Automated Model Training', desc: 'Train multiple ML models automatically with zero configuration' },
              { num: '02', title: 'Real-time Predictions', desc: 'Get instant defect predictions in under 100ms' },
              { num: '03', title: 'Explainable AI', desc: 'Understand why predictions are made with SHAP & LIME' },
              { num: '04', title: 'Enterprise Integration', desc: 'Seamlessly integrate with your CI/CD pipeline' }
            ].map((item, idx) => (
              <div key={idx} className="bg-card rounded-2xl p-6 border border-border">
                <div className="text-red-500 text-sm font-mono mb-4">{item.num}</div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section data-reveal className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Trusted by <span className="text-red-500">Innovators</span>, Driven
              <br />
              by AI Excellence
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { text: "AI solutions transformed our process. We predict defects accurately and ship quality code faster.", role: "Engineering Lead" },
              { text: "Implementing DefPred transformed our decision-making. We can predict issues before they happen.", role: "Product Manager" },
              { text: "The explainability tools give us complete confidence in the predictions. Game changer!", role: "CTO, TechStartup" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-red-500 text-5xl mb-6">"</div>
                <p className="text-muted-foreground mb-6">"{item.text}"</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary"></div>
                  <span className="text-sm text-muted-foreground">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section data-reveal className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Your AI Questions <span className="text-red-500">Answered</span>
                <br />
                with Clear Insights
              </h2>
              <p className="text-muted-foreground mb-8">
                Everything you need to know about DefPred AI and how it can transform your software quality.
              </p>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-foreground flex items-center gap-2"
                onClick={() => navigate('/features')}
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-xl overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-card transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-red-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-reveal className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-background to-card rounded-3xl p-12 text-center border border-border">
            <h2 className="text-4xl font-bold mb-4">
              Flexible <span className="text-red-500">AI Plans</span> for
              <br />
              Every Business
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start predicting software defects today. Choose the plan that fits your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-foreground px-8 flex items-center gap-2"
                onClick={() => navigate('/upload')}
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border text-foreground hover:bg-secondary px-8 flex items-center gap-2"
                onClick={() => navigate('/train')}
              >
                Start Training <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Training Modal */}
      <Dialog open={isAutoTrainingModalOpen} onOpenChange={setIsAutoTrainingModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-red-500">Auto-Training Feature</DialogTitle>
            <DialogDescription className="text-lg pt-2 text-muted-foreground">
              Automated machine learning model training and optimization
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Brain className="h-6 w-6 text-red-500" />
                What is Auto-Training?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Auto-Training automatically selects, trains, and optimizes ML models for your defect prediction needs.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Zap className="h-6 w-6 text-red-500" />
                Key Features
              </h3>
              <div className="grid gap-3">
                {[
                  { title: 'Automated Model Selection', desc: 'Evaluates 10+ ML algorithms automatically' },
                  { title: 'Hyperparameter Optimization', desc: 'Uses Grid Search and Bayesian Optimization' },
                  { title: 'Feature Engineering', desc: 'Automatically creates important features' },
                  { title: 'Ensemble Methods', desc: 'Combines models for improved accuracy' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary border border-border">
                    <CheckCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button 
                onClick={() => {
                  setIsAutoTrainingModalOpen(false);
                  navigate('/upload');
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-foreground flex items-center justify-center gap-2"
                size="lg"
              >
                Start Auto-Training Now <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroPage;
