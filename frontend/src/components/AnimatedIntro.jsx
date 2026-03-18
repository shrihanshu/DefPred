import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

const AnimatedIntro = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),  // Logo appears
      setTimeout(() => setStage(2), 1500), // Name appears
      setTimeout(() => setStage(3), 2200), // Motto appears
      setTimeout(() => setStage(4), 3500), // Fade out starts
      setTimeout(() => onComplete && onComplete(), 4000), // Complete
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (stage >= 4) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/95 via-purple-600/95 to-primary/95 animate-intro-fade">
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className={`transition-all duration-1000 ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative inline-block">
            <img 
              src="/defpred-logo.png" 
              alt="DefPred Logo" 
              className="h-32 w-32 mx-auto animate-pulse-slow"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden h-32 w-32 mx-auto items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm animate-pulse-slow">
              <Brain className="h-20 w-20 text-white" />
            </div>
            
            {/* Rotating ring around logo */}
            <div className="absolute inset-0 -m-4">
              <div className="w-full h-full border-4 border-white/30 rounded-full animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Animated App Name */}
        <div className={`transition-all duration-700 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight">
            DefPred
          </h1>
        </div>

        {/* Animated Motto */}
        <div className={`transition-all duration-700 delay-200 ${stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            <div className="text-center">
              <div className="text-white font-bold text-2xl mb-1">Securing</div>
              <div className="text-white/70">Softwares & Artificial Intelligence</div>
            </div>
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-12 bg-white/60 rounded-full animate-pulse" />
            <div className="h-1 w-12 bg-white/60 rounded-full animate-pulse delay-100" />
            <div className="h-1 w-12 bg-white/60 rounded-full animate-pulse delay-200" />
          </div>
        </div>

        {/* Particle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedIntro;
