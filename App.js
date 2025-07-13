import React, { useState, useEffect, createContext, useContext } from 'react';

// --- Contexts for State Management ---

// AuthContext: Manages user authentication state (logged in/out, user ID)
export const AuthContext = createContext(null);

// CampaignContext: Manages product brief, value proposition, and generated campaign data
export const CampaignContext = createContext(null);

// --- AuthProvider Component ---
// Provides authentication state and functions to its children.
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true); // Default to true for demo

  // Effect to check local storage for persisted auth state on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('brievify_auth');
    if (storedAuth) {
      const { isAuthenticated: storedIsAuth, userId: storedUserId, userEmail: storedUserEmail, isFirstTimeUser: storedIsFirstTime } = JSON.parse(storedAuth);
      setIsAuthenticated(storedIsAuth);
      setUserId(storedUserId);
      setUserEmail(storedUserEmail);
      setIsFirstTimeUser(storedIsIsFirstTime);
    }
  }, []);

  // Function to handle user login
  const login = (email, id, firstTime) => {
    setIsAuthenticated(true);
    setUserId(id);
    setUserEmail(email);
    setIsFirstTimeUser(firstTime);
    localStorage.setItem('brievify_auth', JSON.stringify({ isAuthenticated: true, userId: id, userEmail: email, isFirstTimeUser: firstTime }));
  };

  // Function to handle user logout
  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserEmail(null);
    setIsFirstTimeUser(true); // Reset to first time for next login demo
    localStorage.removeItem('brievify_auth');
    localStorage.removeItem('brievify_onboarding_data');
    localStorage.removeItem('brievify_campaign_history');
  };

  const value = {
    isAuthenticated,
    userId,
    userEmail,
    isFirstTimeUser,
    setIsFirstTimeUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- CampaignProvider Component ---
// Provides campaign-related state and functions to its children.
function CampaignProvider({ children }) {
  const [productBrief, setProductBrief] = useState('');
  const [valuePropFramework, setValuePropFramework] = useState(null);
  const [campaignHistory, setCampaignHistory] = useState([]);

  // Effect to load onboarding data and campaign history from local storage
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

  // Effect to save onboarding data and campaign history to local storage
  useEffect(() => {
    localStorage.setItem('brievify_onboarding_data', JSON.stringify({ productBrief, valuePropFramework }));
    localStorage.setItem('brievify_campaign_history', JSON.stringify(campaignHistory));
  }, [productBrief, valuePropFramework, campaignHistory]);

  const addCampaignToHistory = (campaign) => {
    setCampaignHistory(prev => [...prev, campaign]);
  };

  const value = {
    productBrief,
    setProductBrief,
    valuePropFramework,
    setValuePropFramework,
    campaignHistory,
    addCampaignToHistory,
  };

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
}

// --- Main App Component ---
// This component acts as the router and orchestrator for the entire application.
// It uses a simple switch-case based routing for demonstration purposes.
function App() {
  const { isAuthenticated, isFirstTimeUser, userId } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState('login'); // Initial page

  // Effect to determine the initial page based on auth and first-time user status
  useEffect(() => {
    if (isAuthenticated) {
      if (isFirstTimeUser) {
        setCurrentPage('onboarding');
      } else {
        setCurrentPage('dashboard');
      }
    } else {
      setCurrentPage('login');
    }
  }, [isAuthenticated, isFirstTimeUser]);

  // Simple navigation function
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Render the current page based on the state
  const renderPage = () => {
    if (!isAuthenticated) {
      return <LoginPage navigateTo={navigateTo} />;
    }

    switch (currentPage) {
      case 'onboarding':
        return <OnboardingPage navigateTo={navigateTo} />;
      case 'dashboard':
        return <DashboardPage navigateTo={navigateTo} />;
      case 'create-campaign':
        return <CreateCampaignPage navigateTo={navigateTo} />;
      default:
        return <LoginPage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter">
      {renderPage()}
    </div>
  );
}

export default App; // Export the main App component as default

// --- Pages Components (Simplified for direct inclusion) ---
// In a real Next.js app, these would be separate files in the 'pages' directory.
// For this self-contained immersive, they are defined here.

// LoginPage.js
function LoginPage({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { login } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    // Simple demo login/signup logic
    const storedUsers = JSON.parse(localStorage.getItem('brievify_users') || '{}');
    if (isSigningUp) {
      if (storedUsers[email]) {
        setMessage('User already exists. Please log in.');
      } else {
        const newUserId = `user_${Date.now()}`;
        storedUsers[email] = { password, id: newUserId, isFirstTimeUser: true };
        localStorage.setItem('brievify_users', JSON.stringify(storedUsers));
        login(email, newUserId, true);
        navigateTo('onboarding');
      }
    } else {
      if (storedUsers[email] && storedUsers[email].password === password) {
        login(email, storedUsers[email].id, storedUsers[email].isFirstTimeUser);
        if (storedUsers[email].isFirstTimeUser) {
          navigateTo('onboarding');
        } else {
          navigateTo('dashboard');
        }
      } else {
        setMessage('Invalid email or password.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isSigningUp ? 'Sign Up for Brievify' : 'Welcome Back to Brievify'}
        </h2>
        {message && <p className="text-red-400 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isSigningUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          {isSigningUp ? 'Already have an account?' : 'New here?'}
          <button
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
          >
            {isSigningUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

// OnboardingPage.js
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

// DashboardPage.js
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

// CreateCampaignPage.js
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
