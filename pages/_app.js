// pages/_app.js
import React from 'react';
import '../styles/globals.css'; // Import global styles

// This is the main App component that Next.js uses to initialize pages.
// It receives Component (the page being rendered) and pageProps (initial props for that page).
function MyApp({ Component, pageProps }) {
  // MyApp now only wraps the Component with global providers if needed.
  // The actual routing logic (LoginPage, DashboardPage, etc.) will be handled by the App component
  // that is rendered by pages/index.js.

  // If you had global providers like AuthProvider or CampaignProvider, they would wrap Component here:
  // return (
  //   <AuthProvider>
  //     <CampaignProvider>
  //       <Component {...pageProps} />
  //     </CampaignProvider>
  //   </AuthProvider>
  // );

  // For now, let's keep it simple to ensure the base rendering works.
  // We will re-add AuthProvider and CampaignProvider in the main App.js component.
  return <Component {...pageProps} />;
}

export default MyApp;