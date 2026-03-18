import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get user data from Clerk
const getUserData = () => {
  try {
    // Try to get user data from window (set by Clerk)
    if (window.Clerk && window.Clerk.user) {
      const user = window.Clerk.user;
      return {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };
    }
  } catch (error) {
    console.log('No user data available:', error);
  }
  return null;
};

// Dataset APIs
export const uploadDataset = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add user data if available
  const userData = getUserData();
  if (userData) {
    formData.append('user_data', JSON.stringify(userData));
  }
  
  const response = await api.post('/data/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) {
        onProgress(percentCompleted);
      }
    },
    timeout: 300000, // 5 minutes timeout for large files
  });
  return response.data;
};

export const getDatasetStats = async (datasetId) => {
  const response = await api.get(`/data/stats/${datasetId}`);
  return response.data;
};

// Model APIs
export const trainModel = async (payload) => {
  // Add user data if available
  const userData = getUserData();
  if (userData) {
    payload.user_data = userData;
  }
  
  const response = await api.post('/train', payload);
  return response.data;
};

export const getModels = async () => {
  const response = await api.get('/models', {
    timeout: 5000, // 5 second timeout
  });
  return response.data;
};

export const getModelMetrics = async (modelId) => {
  const response = await api.get(`/model/${modelId}/metrics`);
  return response.data;
};

export const compareModels = async (modelIds) => {
  const response = await api.post('/compare-models', { model_ids: modelIds });
  return response.data;
};

// Prediction APIs
export const makePrediction = async (payload) => {
  // Add user data if available
  const userData = getUserData();
  if (userData) {
    payload.user_data = userData;
  }
  
  const response = await api.post('/predict', payload);
  return response.data;
};

// Explainability APIs
export const getFeatureImportance = async (modelId) => {
  const response = await api.get(`/explain/feature-importance/${modelId}`);
  return response.data;
};

export const getSHAPExplanation = async (payload) => {
  const response = await api.post('/explain/shap', payload);
  return response.data;
};

export const getLIMEExplanation = async (payload) => {
  const response = await api.post('/explain/lime', payload);
  return response.data;
};

// AI Summary API
export const getAISummary = async (modelId) => {
  const response = await api.get(`/models/${modelId}/ai-summary`);
  return response.data;
};

// History APIs
export const getUserHistory = async () => {
  const userData = getUserData();
  if (!userData) {
    throw new Error('User not authenticated');
  }
  
  const response = await api.post('/user/history', { user_data: userData });
  return response.data;
};

export const getUserDatasets = async () => {
  const userData = getUserData();
  if (!userData) {
    throw new Error('User not authenticated');
  }
  
  const response = await api.post('/user/datasets', { user_data: userData });
  return response.data;
};

export const getUserModels = async () => {
  const userData = getUserData();
  if (!userData) {
    throw new Error('User not authenticated');
  }
  
  const response = await api.post('/user/models', { user_data: userData });
  return response.data;
};

export const getUserPredictions = async (limit = 50) => {
  const userData = getUserData();
  if (!userData) {
    throw new Error('User not authenticated');
  }
  
  const response = await api.post('/user/predictions', { user_data: userData, limit });
  return response.data;
};

export const getUserStats = async () => {
  const userData = getUserData();
  if (!userData) {
    throw new Error('User not authenticated');
  }
  
  const response = await api.post('/user/stats', { user_data: userData });
  return response.data;
};

export default api;
