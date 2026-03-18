import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Brain, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from './ui/button';

const AISummaryModal = ({ isOpen, onClose, modelId, modelType, metrics }) => {
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && modelId) {
      fetchAISummary();
    }
  }, [isOpen, modelId]);

  const fetchAISummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5001/api/models/${modelId}/ai-summary`);
      if (!response.ok) {
        throw new Error('Failed to fetch AI summary');
      }
      const data = await response.json();
      setAiSummary(data.ai_summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (quality) => {
    const colors = {
      'Excellent': 'bg-green-600',
      'Good': 'bg-blue-600',
      'Fair': 'bg-yellow-600',
      'Needs Improvement': 'bg-red-600',
    };
    return colors[quality] || 'bg-gray-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Brain className="h-6 w-6" />
            AI Analysis
          </DialogTitle>
          <DialogDescription>
            Powered by Groq AI - {modelType}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Analyzing your model...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-200">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && aiSummary && (
          <div className="space-y-4">
            {/* Quality Badge */}
            {aiSummary.quality_assessment && (
              <div className="flex justify-center">
                <Badge className={`${getQualityColor(aiSummary.quality_assessment)} text-white px-4 py-2 text-base`}>
                  {aiSummary.quality_assessment}
                </Badge>
              </div>
            )}

            {/* Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Summary
              </h3>
              <p className="text-sm leading-relaxed">{aiSummary.summary}</p>
            </div>

            {/* Key Insights */}
            {aiSummary.key_insights && aiSummary.key_insights.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Key Insights
                </h3>
                <ul className="space-y-2">
                  {aiSummary.key_insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conclusion */}
            {aiSummary.conclusive_evidence && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                <h3 className="font-semibold mb-2">Conclusion</h3>
                <p className="text-sm leading-relaxed">{aiSummary.conclusive_evidence}</p>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AISummaryModal;
