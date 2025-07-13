// pages/dashboard.js
import React, { useContext } from 'react';
import { AuthContext, CampaignContext } from '../App'; // Import contexts from App.js

function DashboardPage({ navigateTo }) {
  const { userEmail, logout } = useContext(AuthContext);
  const { productBrief, valuePropFramework, campaignHistory } = useContext(CampaignContext);

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-white">Welcome, {userEmail}!</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Value Proposition Framework Display */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002 12c0 2.757 1.122 5.23 2.921 7.071C6.722 20.864 9.292 22 12 22s5.278-1.136 7.079-2.929C20.878 17.23 22 14.757 22 12c0-2.757-1.122-5.23-2.921-7.071z" />
            </svg>
            Your Brand DNA (Value Prop Framework)
          </h2>
          {valuePropFramework ? (
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-lg text-white mb-2">Core Messaging Hierarchy:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  {valuePropFramework.coreMessagingHierarchy.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white mb-2">Problem-Solution-Outcome Narrative:</h3>
                <p><span className="font-medium text-blue-300">Problem:</span> {valuePropFramework.problemSolutionOutcomeNarrative.problem}</p>
                <p><span className="font-medium text-blue-300">Solution:</span> {valuePropFramework.problemSolutionOutcomeNarrative.solution}</p>
                <p><span className="font-medium text-blue-300">Outcome:</span> {valuePropFramework.problemSolutionOutcomeNarrative.outcome}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white mb-2">Competitive Differentiation Points:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  {valuePropFramework.competitiveDifferentiationPoints.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No Brand DNA generated yet. Complete onboarding or update your product brief.</p>
          )}
          <button
            onClick={() => navigateTo('onboarding')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 w-full"
          >
            Update Product Brief
          </button>
        </div>

        {/* Campaign History Display */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Your Campaign History
          </h2>
          {campaignHistory.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {campaignHistory.map((campaign, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-semibold text-lg text-white mb-2">{campaign.campaignName}</h3>
                  <p className="text-gray-300 text-sm mb-2">Generated: {new Date(campaign.timestamp).toLocaleString()}</p>
                  <div className="space-y-1 text-gray-400 text-sm">
                    {campaign.assetsGenerated.map((asset, assetIndex) => (
                      <p key={assetIndex}>- {asset}</p>
                    ))}
                  </div>
                  <button
                    onClick={() => { /* Implement view campaign details */ }}
                    className="mt-3 text-blue-400 hover:text-blue-300 font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No campaigns generated yet. Click "Create New Campaign" to get started!</p>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigateTo('create-campaign')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Create New Campaign
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;