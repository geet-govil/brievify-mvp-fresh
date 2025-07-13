// pages/_app.js
import '../styles/globals.css'; // Import global styles

// This is the main App component that Next.js uses to initialize pages.
// It receives Component (the page being rendered) and pageProps (initial props for that page).
function MyApp({ Component, pageProps }) {
  // If you have a CampaignProvider, it should wrap the Component here.
  // For example:
  // return (
  //   <CampaignProvider>
  //     <Component {...pageProps} />
  //   </CampaignProvider>
  // );

  // For now, let's ensure the basic structure is correct without a potentially problematic CampaignProvider
  // if it's not fully defined or exported elsewhere.
  // If CampaignProvider is a component you created, ensure it's correctly exported from its file.
  // For instance, if CampaignProvider is in a file like 'components/CampaignProvider.js',
  // make sure that file has 'export default CampaignProvider;'

  // If you intend to use CampaignProvider, ensure it's imported correctly.
  // Example: import CampaignProvider from '../components/CampaignProvider';
  // (Assuming it's in a 'components' folder, adjust path as needed)

  // For the immediate fix, let's ensure the basic app rendering works.
  // If CampaignProvider is causing issues, we can temporarily remove it or ensure its correct definition.
  // Assuming 'Component' itself is the page, and it's a valid React component.
  return <Component {...pageProps} />;
}

export default MyApp; // Export the main App component as default