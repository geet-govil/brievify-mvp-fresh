// pages/_app.js
import React, { createContext, useState, useEffect } from 'react';
import '../styles/globals.css'; // Import global styles

// --- Contexts for State Management ---
export const AuthContext = createContext(null);
export const CampaignContext = createContext(null);

// --- AuthProvider Component ---
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('brievify_auth');
    if (storedAuth) {
      const { isAuthenticated: storedIsAuth, userId: storedUserId, userEmail: storedUserEmail, isFirstTimeUser: storedIsFirstTime } = JSON.parse(storedAuth);
      setIsAuthenticated(storedIsAuth);
      setUserId(storedUserId);
      setUserEmail(storedUserEmail);
      setIsFirstTimeUser(storedIsFirstTime);
    }
  }, []);

  const login = (email, id, firstTime) => {
    setIsAuthenticated(true);
    setUserId(id);
    setUserEmail(email);
    setIsFirstTimeUser(firstTime);
    localStorage.setItem('brievify_auth', JSON.stringify({ isAuthenticated: true, userId: id, userEmail: email, isFirstTimeUser: firstTime }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserEmail(null);
    setIsFirstTimeUser(true);
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
function CampaignProvider({ children }) {
  const [productBrief, setProductBrief] = useState('');
  const [valuePropFramework, setValuePropFramework] = useState(null);
  const [campaignHistory, setCampaignHistory] = useState([]);

  useEffect(() => {
    const storedOnboardingData = localStorage.getItem('brievify_onboarding_data');
    if (storedOnboardingData) {
      const data = JSON.parse(storedOnboardingData);
      setProductBrief(data.productBrief || '');
    }
  }, [setProductBrief]);

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


// Main App component for Next.js to render all pages
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CampaignProvider>
        <Component {...pageProps} />
      </CampaignProvider>
    </AuthProvider>
  );
}

export default MyApp;