"""AI-powered summary generator using Groq API."""
import requests
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class AISummaryGenerator:
    """Generate AI-powered summaries of model training results."""
    
    def __init__(self, api_key: str):
        """Initialize the AI summary generator.
        
        Args:
            api_key: Groq API key
        """
        try:
            self.api_key = api_key
            self.api_url = "https://api.groq.com/openai/v1/chat/completions"
            self.model = "llama-3.3-70b-versatile"
            logger.info("AI Summary Generator initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AI Summary Generator: {str(e)}")
            raise
    
    def generate_training_summary(self, metrics: Dict[str, Any], model_name: str = "Model") -> Dict[str, str]:
        """Generate a comprehensive summary of training results.
        
        Args:
            metrics: Dictionary containing model performance metrics
            model_name: Name of the model being evaluated
            
        Returns:
            Dictionary with summary and conclusive_evidence fields
        """
        try:
            # Prepare the prompt with metrics
            prompt = self._create_prompt(metrics, model_name)
            
            # Generate response using Groq API
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            }
            
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            response_data = response.json()
            response_text = response_data['choices'][0]['message']['content']
            
            # Parse and structure the response
            result = self._parse_response(response_text, metrics)
            
            return result
            
        except Exception as e:
            logger.error(f"Error generating AI summary: {str(e)}")
            return {
                'summary': f"Model {model_name} achieved {metrics.get('accuracy', 'N/A')} accuracy. See detailed metrics for more information.",
                'conclusive_evidence': "Unable to generate AI summary at this time.",
                'key_insights': []
            }
    
    def _create_prompt(self, metrics: Dict[str, Any], model_name: str) -> str:
        """Create a detailed prompt for the AI model.
        
        Args:
            metrics: Performance metrics dictionary
            model_name: Name of the model
            
        Returns:
            Formatted prompt string
        """
        metrics_str = "\n".join([f"- {key}: {value}" for key, value in metrics.items()])
        
        prompt = f"""Analyze this software defect prediction model:

Model: {model_name}
Metrics:
{metrics_str}

Provide a brief analysis in this format:

SUMMARY: [2-3 sentences about performance]

KEY INSIGHTS:
- [Insight 1]
- [Insight 2]
- [Insight 3]

CONCLUSION: [Brief recommendation]"""
        return prompt
    
    def _parse_response(self, response_text: str, metrics: Dict[str, Any]) -> Dict[str, str]:
        """Parse and structure the AI response.
        
        Args:
            response_text: Raw response from AI
            metrics: Original metrics for fallback
            
        Returns:
            Structured dictionary with summary components
        """
        try:
            # Split response into sections
            sections = {
                'summary': '',
                'key_insights': [],
                'conclusive_evidence': ''
            }
            
            lines = response_text.strip().split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                if line.startswith('SUMMARY:'):
                    current_section = 'summary'
                    sections['summary'] = line.replace('SUMMARY:', '').strip()
                elif line.startswith('KEY INSIGHTS:'):
                    current_section = 'insights'
                elif line.startswith('CONCLUSION:'):
                    current_section = 'evidence'
                    sections['conclusive_evidence'] = line.replace('CONCLUSION:', '').strip()
                elif current_section == 'summary' and not sections['summary']:
                    sections['summary'] += ' ' + line
                elif current_section == 'insights' and line.startswith('-'):
                    sections['key_insights'].append(line[1:].strip())
                elif current_section == 'evidence':
                    sections['conclusive_evidence'] += ' ' + line
            
            # Clean up
            sections['summary'] = sections['summary'].strip()
            sections['conclusive_evidence'] = sections['conclusive_evidence'].strip()
            
            # Add quality assessment
            accuracy = metrics.get('accuracy', 0)
            if accuracy >= 0.9:
                quality = "Excellent"
            elif accuracy >= 0.8:
                quality = "Good"
            elif accuracy >= 0.7:
                quality = "Fair"
            else:
                quality = "Needs Improvement"
            
            sections['quality_assessment'] = quality
            
            return sections
            
        except Exception as e:
            logger.error(f"Error parsing AI response: {str(e)}")
            return {
                'summary': response_text[:200] + "..." if len(response_text) > 200 else response_text,
                'key_insights': [],
                'conclusive_evidence': "See summary for details.",
                'quality_assessment': 'Unknown'
            }
