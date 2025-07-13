// pages/create-campaign.js
import React, { useState, useContext, useEffect } from 'react';
import { CampaignContext, AuthContext } from '../App'; // Import contexts from App.js

function CreateCampaignPage({ navigateTo }) {
  const { productBrief, valuePropFramework, addCampaignToHistory } = useContext(CampaignContext);
  const [campaignGoal, setCampaignGoal] = useState('');
  const [campaignTone, setCampaignTone] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  const [message, setMessage] = useState('');

  const assetOptions = [
    'Value Proposition Framework', // Can be regenerated/refined
    'Website Copy Suite',
    'Video Scripts',
    'Social Media Copy Templates',
  ];

  const handleAssetChange = (asset) => {
    setSelectedAssets(prev =>
      prev.includes(asset) ? prev.filter(a => a !== asset) : [...prev, asset]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedCampaign(null);
    setMessage('');

    if (!productBrief) {
      setMessage('Please complete your onboarding to set up your product brief first.');
      setLoading(false);
      return;
    }

    const aiPrompt = `
      You are an expert SaaS brand strategist with decades of experience in product marketing and launching successful brand marketing campaigns.
      Your goal is to generate multi-channel brand campaign assets based on the provided product brief, value proposition framework, campaign goal, and tone.

      Product Brief:
      ${productBrief}

      Current Value Proposition Framework:
      ${JSON.stringify(valuePropFramework, null, 2)}

      Campaign Goal: ${campaignGoal}
      Campaign Tone: ${campaignTone}
      Assets to Generate: ${selectedAssets.join(', ')}

      Generate the requested assets. For each asset, provide comprehensive and actionable content.
      The output should be a JSON object with keys corresponding to the selected assets.
      Example structure for Website Copy Suite:
      {
        "websiteCopySuite": {
          "heroSection": {
            "headline": "...",
            "subHeadline": "...",
            ""callToAction": "..."
          },
          "featureToBenefitDescriptions": [
            {"feature": "...", "benefit": "...", "description": "..."},
            // ...
          ],
          "socialProofTemplates": [
            "Template 1: ...",
            "Template 2: ..."
          ]
        },
        "videoScripts": {
          "productDemo": { "script": "...", "duration": "..." },
          // ...
        }
        // ... and so on for other selected assets
      }
      Ensure all generated content is tailored for a SaaS audience and aligns with the brand's core messaging.
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }), // No specific schema for varied output
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const parsedResult = JSON.parse(result.text); // AI returns stringified JSON

      setGeneratedCampaign(parsedResult);
      addCampaignToHistory({
        campaignName: `Campaign - ${new Date().toLocaleString()}`,
        timestamp: Date.now(),
        assetsGenerated: selectedAssets,
        details: parsedResult,
      });
      setMessage('Campaign assets generated successfully!');
    } catch (error) {
      console.error('Error generating campaign:', error);
      setMessage(`Failed to generate campaign: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Create New Campaign</h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-4xl mx-auto">
        <p className="text-gray-400 mb-6">
          Your existing product brief and Brand DNA will be used to generate this campaign.
          <button onClick={() => navigateTo('dashboard')} className="text-blue-400 hover:text-blue-300 ml-2 font-medium">
            View Brand DNA
          </button>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="campaignGoal" className="block text-sm font-medium text-gray-300 mb-1">Campaign Goal</label>
            <input
              type="text"
              id="campaignGoal"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              placeholder="e.g., Drive sign-ups, Announce new feature, Increase engagement"
              required
            />
          </div>
          <div>
            <label htmlFor="campaignTone" className="block text-sm font-medium text-gray-300 mb-1">Campaign Tone</label>
            <input
              type="text"
              id="campaignTone"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={campaignTone}
              onChange={(e) => setCampaignTone(e.target.value)}
              placeholder="e.g., Professional, Playful, Authoritative, Urgent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Campaign Assets to Generate:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assetOptions.map(asset => (
                <label key={asset} className="flex items-center bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition duration-200">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset)}
                    onChange={() => handleAssetChange(asset)}
                    className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-500 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-white text-base">{asset}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading || selectedAssets.length === 0}
          >
            {loading ? 'Generating Campaign...' : 'Generate Campaign Assets'}
          </button>
          {message && <p className="mt-4 text-center text-red-400">{message}</p>}
        </form>

        {generatedCampaign && (
          <div className="mt-8 bg-gray-700 p-6 rounded-xl shadow-inner max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Generated Campaign Assets:</h2>
            {Object.entries(generatedCampaign).map(([assetType, content], index) => (
              <div key={index} className="mb-6 pb-4 border-b border-gray-600 last:border-b-0">
                <h3 className="text-xl font-semibold text-blue-400 mb-2">{assetType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                <pre className="whitespace-pre-wrap break-words text-gray-200 bg-gray-800 p-4 rounded-lg text-sm">
                  {JSON.stringify(content, null, 2)}
                </pre>
              </div>
            ))}
            <button
              onClick={() => { /* Implement export/share functionality */ }}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Export/Share
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => navigateTo('dashboard')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CreateCampaignPage;