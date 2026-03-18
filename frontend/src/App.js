import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './components/theme-provider';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HeroPage from './components/HeroPage';
import FeaturesPage from './components/FeaturesPage';
import Dashboard from './components/Dashboard';
import DatasetUpload from './components/DatasetUpload';
import ModelTraining from './components/ModelTraining';
import PredictionForm from './components/PredictionForm';
import ModelComparison from './components/ModelComparison';
import ExplainabilityView from './components/ExplainabilityView';
import History from './components/History';
import ProtectedRoute from './components/ProtectedRoute';

function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top immediately (not smooth to avoid conflicts with animations)
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    // Small delay to ensure DOM is fully updated after route change
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('[data-reveal]');

      if (!revealElements.length) return;

      // Clear any existing reveal-visible classes on new page
      revealElements.forEach((el) => el.classList.remove('reveal-visible'));

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-visible');
            } else {
              entry.target.classList.remove('reveal-visible');
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      );

      revealElements.forEach((element) => observer.observe(element));

      return () => observer.disconnect();
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col theme-transition">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16 flex-grow overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<HeroPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <DatasetUpload />
                </ProtectedRoute>
              } />
              <Route path="/train" element={
                <ProtectedRoute>
                  <ModelTraining />
                </ProtectedRoute>
              } />
              <Route path="/predict" element={
                <ProtectedRoute>
                  <PredictionForm />
                </ProtectedRoute>
              } />
              <Route path="/compare" element={
                <ProtectedRoute>
                  <ModelComparison />
                </ProtectedRoute>
              } />
              <Route path="/explain" element={
                <ProtectedRoute>
                  <ExplainabilityView />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
