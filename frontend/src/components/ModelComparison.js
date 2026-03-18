import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getModels, compareModels } from '../services/api';

const ModelComparison = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    fetchAndCompare();
  }, []);

  const fetchAndCompare = async () => {
    try {
      const response = await getModels();
      const modelsList = response.models || [];
      setModels(modelsList);

      if (modelsList.length > 0) {
        // Prepare data for comparison
        const data = modelsList.map(model => ({
          name: model.type,
          Accuracy: (model.metrics?.accuracy || 0) * 100,
          Precision: (model.metrics?.precision || 0) * 100,
          Recall: (model.metrics?.recall || 0) * 100,
          'F1 Score': (model.metrics?.f1_score || 0) * 100,
          'ROC AUC': (model.metrics?.roc_auc || 0) * 100,
        }));
        setComparisonData(data);
      }
    } catch (err) {
      setError('Failed to load models for comparison');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (models.length === 0) {
    return (
      <Container>
        <Alert severity="info">
          No models available for comparison. Train some models first.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Model Comparison
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Compare performance of different models
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Metrics Comparison
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Accuracy" fill="#8884d8" />
            <Bar dataKey="Precision" fill="#82ca9d" />
            <Bar dataKey="Recall" fill="#ffc658" />
            <Bar dataKey="F1 Score" fill="#ff7c7c" />
            <Bar dataKey="ROC AUC" fill="#a28ce8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Detailed Comparison
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Model</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Accuracy</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Precision</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Recall</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>F1 Score</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>ROC AUC</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{model.type}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {((model.metrics?.accuracy || 0) * 100).toFixed(2)}%
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {((model.metrics?.precision || 0) * 100).toFixed(2)}%
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {((model.metrics?.recall || 0) * 100).toFixed(2)}%
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {(model.metrics?.f1_score || 0).toFixed(3)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {(model.metrics?.roc_auc || 0).toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    </Container>
  );
};

export default ModelComparison;
