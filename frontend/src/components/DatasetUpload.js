import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, FileText, CheckCircle2, AlertCircle, Database, TrendingUp } from 'lucide-react';
import { uploadDataset } from '../services/api';

const DatasetUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    // Validate file size (500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      setError(`File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds the 500MB limit`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const response = await uploadDataset(file, (progress) => {
        setUploadProgress(progress);
      });
      setResult(response);
      setFile(null);
      setUploadProgress(0);
      document.getElementById('file-input').value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload dataset');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Dataset</h1>
        <p className="text-muted-foreground mt-2">
          Upload your software metrics dataset for defect prediction
        </p>
      </div>

      {/* Upload Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Choose Your Dataset
          </CardTitle>
          <CardDescription>
            Select a CSV or ARFF file containing software metrics and defect labels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              accept=".csv,.txt,.arff"
              style={{ display: 'none' }}
              id="file-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    CSV, TXT, or ARFF files (Max 500MB)
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Selected File Info */}
          {file && (
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Badge variant="secondary">Ready</Badge>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Dataset
              </>
            )}
          </Button>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }} 
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Upload Failed</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {result && (
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Dataset Uploaded Successfully!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Dataset ID: {result.dataset_id}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dataset Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dataset Requirements</CardTitle>
          <CardDescription>
            Your CSV or ARFF file should meet these requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
              <span>CSV or ARFF format</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
              <span>Include feature columns (e.g., lines_of_code, complexity, coupling)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
              <span>Include a target column with binary values (0 = no defect, 1 = defect)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
              <span>No missing values in critical columns</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
              <span>At least 100 rows recommended for good model performance</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Dataset Statistics */}
      {result && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Dataset Statistics
            </CardTitle>
            <CardDescription>
              Overview of your uploaded dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs">Total Rows</CardDescription>
                  <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.stats.rows}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs">Features</CardDescription>
                  <CardTitle className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {result.stats.columns - 1}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs">Total Columns</CardDescription>
                  <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {result.stats.columns}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Class Distribution */}
            {result.stats.class_distribution && (
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Class Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(result.stats.class_distribution).map(([key, value]) => {
                    const percentage = ((value / result.stats.rows) * 100).toFixed(1);
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Class {key} {key === '0' ? '(No Defect)' : '(Defect)'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{value}</span>
                          <Badge variant="secondary">{percentage}%</Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Example Dataset */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Example Dataset Format</CardTitle>
          <CardDescription>
            Your CSV should look something like this
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background rounded-lg p-4 font-mono text-xs overflow-x-auto">
            <pre className="text-muted-foreground">
{`lines_of_code,cyclomatic_complexity,coupling,cohesion,defect
150,12,5,0.8,0
300,25,15,0.4,1
200,15,8,0.7,0
400,30,20,0.3,1`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatasetUpload;
