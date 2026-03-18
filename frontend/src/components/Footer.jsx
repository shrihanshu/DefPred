import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/defpred-logo.png" 
              alt="DefPred Logo" 
              className="h-12 w-12 object-contain rounded-full"
            />
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                DefPred
              </h3>
              <p className="text-sm text-muted-foreground italic">AI-Powered Defect Prediction</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Securing Softwares . Securing AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} DefPred</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
