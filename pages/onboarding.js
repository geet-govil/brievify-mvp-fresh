// pages/onboarding.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, CampaignContext } from '../App'; // Import contexts from App.js

function OnboardingPage({ navigateTo }) {
  const { userId, userEmail, setIsFirstTimeUser } = useContext(AuthContext);
  const { productBrief, setProductBrief, setValuePropFramework } = useContext(CampaignContext);
  const [companyName, setCompanyName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load existing onboarding data if available (e.g., if user navigated back)
  useEffect(() => {
    const storedOnboardingData = localStorage.getItem('brievify_onboarding_data');
    if (storedOnboardingData) {
      const data = JSON.parse(storedOnboardingData);
      setCompanyName(data.companyName || '');
      setProductDescription(data.productDescription || '');
      setTargetAudience(data.targetAudience || '');
      setKeyFeatures(data.keyFeatures || '');
      setUniqueSellingPoints(data.uniqueSellingPoints || '');
      setProductBrief(data.productBrief || ''); // Ensure productBrief is also loaded
    }
  }, [setProductBrief]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const currentProductBrief = `
      Company Name: ${companyName}
      Product Description: ${productDescription}
      Target Audience: ${targetAudience}
      Key Features: ${keyFeatures}
      Unique Selling Points: ${uniqueSellingPoints}
    `;
    setProductBrief(currentProductBrief); // Update context with full brief

    try {
      // Call AI to generate initial Value Prop Framework
      const aiPrompt = `
        You are an expert SaaS brand strategist with decades of experience in product marketing and launching successful brand marketing campaigns.
        Your task is to generate a comprehensive Value Proposition Framework based on the following product brief.
        The output should be a JSON object with the following structure:
        {
          "coreMessagingHierarchy": [
            "Headline/Hook",
            "Sub-headline/Problem Statement",
            "Solution/Product Offering",
            "Benefits/Outcomes",
            "Call to Action"
          ],
          "problemSolutionOutcomeNarrative": {
            "problem": "Describe the core problem your target audience faces.",
            "solution": "How your product uniquely solves this problem.",
            "outcome": "The tangible positive results your users will experience."
          }
        }

        Product Brief:
        ${currentProductBrief}
      `;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, schema: {
          type: "OBJECT",
          properties: {
            "coreMessagingHierarchy": { "type": "ARRAY", "items": { "type": "STRING" } },
            "problemSolutionOutcomeNarrative": {
              "type": "OBJECT",
              "properties": {
                "problem": { "type": "STRING" },
                "solution": { "type": "STRING" },
                "outcome": { "type": "STRING" }
              }
            },
            "competitiveDifferentiationPoints": { "type": "ARRAY", "items": { "type": "STRING" } }
          },
          "propertyOrdering": ["coreMessagingHierarchy", "problemSolutionOutcomeNarrative", "competitiveDifferentiationPoints"]
        } }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const parsedResult = JSON.parse(result.text); // AI returns stringified JSON

      setValuePropFramework(parsedResult); // Store the generated value prop

      // Update user's first-time status in local storage
      const storedUsers = JSON.parse(localStorage.getItem('brievify_users') || '{}');
      if (userEmail && storedUsers[userEmail]) {
        storedUsers[userEmail].isFirstTimeUser = false;
        localStorage.setItem('brievify_users', JSON.stringify(storedUsers));
        setIsFirstTimeUser(false); // Update context
      }

      setMessage('Value Proposition Framework generated successfully!');
      navigateTo('dashboard');
    } catch (error) {
      console.error('Error generating value prop:', error);
      setMessage(`Failed to generate value prop: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Onboarding: Tell us about your SaaS</h2>
        <p className="text-gray-400 text-center mb-6">This information will help Brievify understand your brand DNA.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
            <input
              type="text"
              id="companyName"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-300 mb-1">Product Description (What does your SaaS do?)</label>
            <textarea
              id="productDescription"
              rows="3"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-300 mb-1">Target Audience (Who are your ideal customers?)</label>
            <input
              type="text"
              id="targetAudience"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="keyFeatures" className="block text-sm font-medium text-gray-300 mb-1">Key Features (List 3-5 main features)</label>
            <textarea
              id="keyFeatures"
              rows="2"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="uniqueSellingPoints" className="block text-sm font-medium text-gray-300 mb-1">Unique Selling Points (What makes you different?)</label>
            <textarea
              id="uniqueSellingPoints"
              rows="2"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={uniqueSellingPoints}
              onChange={(e) => setUniqueSellingPoints(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Generating Brand DNA...' : 'Generate Brand DNA & Go to Dashboard'}
          </button>
          {message && <p className="mt-4 text-center text-blue-400">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default OnboardingPage;